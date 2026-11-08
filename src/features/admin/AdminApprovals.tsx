import { useTable } from '@/lib/useTable';
import { updateRows } from '@/lib/localDb';
import { useToast } from '@/contexts/ToastContext';
import { APROBARE_LABELS, APROBARE_STYLES, type Aprobare } from '@/lib/moderation';
import { timeAgo } from '@/lib/format';
import type { Listing } from '@/features/bazar/types';
import type { Sesizare } from '@/features/sesizari/types';
import type { HelpRequest } from '@/features/ajutor/types';
import type { ArchivePhoto } from '@/features/arhiva/types';
import { SESIZARE_TYPES } from '@/lib/constants';

export type ApprovalTab = 'bazar' | 'sesizari' | 'ajutor' | 'arhiva';

interface ApprovalsProps {
  tab: ApprovalTab;
}

interface ApprovalRowProps {
  title: string;
  meta: string;
  aprobare: Aprobare;
  createdAt: string;
  onSet: (aprobare: Aprobare) => void;
}

function ApprovalRow({ title, meta, aprobare, createdAt, onSet }: ApprovalRowProps) {
  return (
    <article className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-semibold text-primary-800">{title}</p>
          <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${APROBARE_STYLES[aprobare]}`}>{APROBARE_LABELS[aprobare]}</span>
        </div>
        <p className="text-xs text-neutral-500">{meta} · {timeAgo(createdAt)}</p>
      </div>
      <div className="flex gap-2">
        <button type="button" disabled={aprobare === 'aprobat'} onClick={() => onSet('aprobat')} className="btn-primary px-3 py-2 text-sm disabled:opacity-40">Aprobă</button>
        <button type="button" disabled={aprobare === 'respins'} onClick={() => onSet('respins')} className="btn-ghost px-3 py-2 text-sm text-danger-600 disabled:opacity-40">Respinge</button>
      </div>
    </article>
  );
}

export default function AdminApprovals({ tab }: ApprovalsProps) {
  const { showToast } = useToast();
  const listings = useTable<Listing>('listings');
  const sesizari = useTable<Sesizare>('sesizari');
  const requests = useTable<HelpRequest>('help_requests');
  const photos = useTable<ArchivePhoto>('archive_photos');

  const setListing = (id: string, aprobare: Aprobare) => {
    updateRows<Listing>('listings', (item) => item.id === id, { aprobare });
    showToast(`Anunț ${APROBARE_LABELS[aprobare].toLowerCase()}.`);
  };
  const setSesizare = (id: string, aprobare: Aprobare) => {
    updateRows<Sesizare>('sesizari', (item) => item.id === id, { aprobare });
    showToast(`Sesizare ${APROBARE_LABELS[aprobare].toLowerCase()}.`);
  };
  const setRequest = (id: string, aprobare: Aprobare) => {
    updateRows<HelpRequest>('help_requests', (item) => item.id === id, { aprobare });
    showToast(`Cerere ${APROBARE_LABELS[aprobare].toLowerCase()}.`);
  };
  const setPhoto = (id: string, aprobare: Aprobare) => {
    updateRows<ArchivePhoto>('archive_photos', (item) => item.id === id, { aprobare });
    showToast(`Fotografie ${APROBARE_LABELS[aprobare].toLowerCase()}.`);
  };

  if (tab === 'bazar') {
    return (
      <div className="space-y-3">
        {listings.length === 0 && <p className="text-sm text-neutral-500">Nu există anunțuri.</p>}
        {[...listings].sort((a, b) => b.created_at.localeCompare(a.created_at)).map((item) => (
          <ApprovalRow key={item.id} title={item.title} meta={`${item.author_name} · ${item.phone}`} aprobare={item.aprobare} createdAt={item.created_at} onSet={(value) => setListing(item.id, value)} />
        ))}
      </div>
    );
  }
  if (tab === 'sesizari') {
    return (
      <div className="space-y-3">
        {sesizari.length === 0 && <p className="text-sm text-neutral-500">Nu există sesizări.</p>}
        {[...sesizari].sort((a, b) => b.created_at.localeCompare(a.created_at)).map((item) => (
          <ApprovalRow key={item.id} title={`#${item.number} ${SESIZARE_TYPES[item.type]}`} meta={item.address} aprobare={item.aprobare} createdAt={item.created_at} onSet={(value) => setSesizare(item.id, value)} />
        ))}
      </div>
    );
  }
  if (tab === 'ajutor') {
    return (
      <div className="space-y-3">
        {requests.length === 0 && <p className="text-sm text-neutral-500">Nu există cereri de ajutor.</p>}
        {[...requests].sort((a, b) => b.created_at.localeCompare(a.created_at)).map((item) => (
          <ApprovalRow key={item.id} title={item.need} meta={`${item.author_name} · ${item.location}`} aprobare={item.aprobare} createdAt={item.created_at} onSet={(value) => setRequest(item.id, value)} />
        ))}
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {photos.length === 0 && <p className="text-sm text-neutral-500">Nu există fotografii.</p>}
      {[...photos].sort((a, b) => b.created_at.localeCompare(a.created_at)).map((item) => (
        <ApprovalRow key={item.id} title={`${item.place}, ${item.year}`} meta={item.author_name} aprobare={item.aprobare} createdAt={item.created_at} onSet={(value) => setPhoto(item.id, value)} />
      ))}
    </div>
  );
}

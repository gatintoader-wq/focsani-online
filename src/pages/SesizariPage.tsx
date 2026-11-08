import { Landmark, Plus, Zap } from 'lucide-react';
import { useTable } from '@/lib/useTable';
import { useAutoOpen } from '@/lib/useAutoOpen';
import { SESIZARE_STATUSES, SESIZARE_TYPES, type SesizareStatus } from '@/lib/constants';
import { formatDate, timeAgo } from '@/lib/format';
import type { Sesizare } from '@/features/sesizari/types';
import SesizareForm from '@/features/sesizari/SesizareForm';
import PageHeader from '@/components/PageHeader';
import EmptyState from '@/components/EmptyState';

function isPriority(item: Sesizare): boolean {
  return !!item.prioritar_pana_la && new Date(item.prioritar_pana_la).getTime() > Date.now();
}

export default function SesizariPage() {
  const sesizari = useTable<Sesizare>('sesizari');
  const [formOpen, setFormOpen] = useAutoOpen();

  const published = sesizari
    .filter((item) => item.aprobare === 'aprobat')
    .sort((a, b) => {
      if (isPriority(a) !== isPriority(b)) return isPriority(a) ? -1 : 1;
      return b.created_at.localeCompare(a.created_at);
    });

  return (
    <div className="space-y-5 px-5 pb-6 pt-5">
      <PageHeader
        title="Sesizări"
        subtitle="Problemele din oraș, semnalate de vecini"
        action={
          <button type="button" onClick={() => setFormOpen(true)} className="btn-accent px-4 py-2 text-sm">
            <Plus className="h-4 w-4" strokeWidth={2.6} />
            Sesizează
          </button>
        }
      />

      {published.length === 0 && (
        <EmptyState
          icon={Landmark}
          title="Nicio sesizare publicată"
          description="Sesizările apar aici după ce sunt aprobate. Poți trimite una din butonul de mai sus."
        />
      )}

      <div className="space-y-4">
        {published.map((item) => {
          const status = SESIZARE_STATUSES[item.status as SesizareStatus];
          return (
            <article
              key={item.id}
              className={`card space-y-3 p-4 ${isPriority(item) ? 'ring-2 ring-danger-500' : ''}`}
            >
              {isPriority(item) && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-danger-600 px-2.5 py-1 text-[11px] font-bold tracking-wide text-white">
                  <Zap className="h-3.5 w-3.5" />
                  PRIORITAR / URGENT
                </span>
              )}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-neutral-500">#{item.number}</span>
                <span className="text-sm font-bold text-primary-800">{SESIZARE_TYPES[item.type]}</span>
                <span className={`ml-auto rounded-full px-2 py-0.5 text-[11px] font-semibold ${status.badge}`}>{status.label}</span>
              </div>
              <p className="text-sm font-semibold text-neutral-800">{item.address}</p>
              <p className="whitespace-pre-line text-sm text-neutral-600">{item.description}</p>
              {item.photo_url && (
                <img src={item.photo_url} alt={`Sesizarea ${item.number}`} loading="lazy" className="aspect-[4/3] w-full rounded-2xl object-cover" />
              )}
              <p className="text-xs text-neutral-400">{timeAgo(item.created_at)} · {formatDate(item.created_at)}</p>
            </article>
          );
        })}
      </div>

      <SesizareForm open={formOpen} onClose={() => setFormOpen(false)} />
    </div>
  );
}

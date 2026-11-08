import { useState } from 'react';
import { CheckCircle2, HandHeart, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { useTable } from '@/lib/useTable';
import { insertRow, updateRows } from '@/lib/localDb';
import { useAutoOpen } from '@/lib/useAutoOpen';
import { timeAgo } from '@/lib/format';
import type { HelpRequest, HelpResponse } from '@/features/ajutor/types';
import RequestForm from '@/features/ajutor/RequestForm';
import Avatar from '@/components/Avatar';
import PageHeader from '@/components/PageHeader';
import EmptyState from '@/components/EmptyState';

export default function AjutorPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const requests = useTable<HelpRequest>('help_requests');
  const responses = useTable<HelpResponse>('help_responses');
  const [formOpen, setFormOpen] = useAutoOpen();
  const [showResolved, setShowResolved] = useState(false);

  const published = requests
    .filter((item) => item.aprobare === 'aprobat' && (showResolved || item.status === 'activa'))
    .sort((a, b) => b.created_at.localeCompare(a.created_at));

  const offerHelp = (request: HelpRequest) => {
    if (!user) return showToast('Conectează-te pentru a oferi ajutor.', 'error');
    if (responses.some((item) => item.request_id === request.id && item.user_id === user.id)) {
      return showToast('Ai anunțat deja că ajuți.', 'error');
    }
    insertRow<HelpResponse>('help_responses', { id: crypto.randomUUID(), request_id: request.id, user_id: user.id });
    showToast('Mulțumim! Autorul cererii va vedea că vrei să ajuți.');
  };

  const markResolved = (request: HelpRequest) => {
    updateRows<HelpRequest>('help_requests', (item) => item.id === request.id, { status: 'rezolvata' });
    showToast('Cererea a fost marcată ca rezolvată.');
  };

  return (
    <div className="space-y-5 px-5 pb-6 pt-5">
      <PageHeader
        title="Ajutor ACUM"
        subtitle="Cereri de ajutor între vecini"
        action={
          <button type="button" onClick={() => setFormOpen(true)} className="btn-accent px-4 py-2 text-sm">
            <Plus className="h-4 w-4" strokeWidth={2.6} />
            Cer ajutor
          </button>
        }
      />

      <div className="flex gap-2">
        <button type="button" aria-pressed={!showResolved} onClick={() => setShowResolved(false)} className={`chip ${!showResolved ? 'chip-active' : 'chip-idle'}`}>Active</button>
        <button type="button" aria-pressed={showResolved} onClick={() => setShowResolved(true)} className={`chip ${showResolved ? 'chip-active' : 'chip-idle'}`}>Toate</button>
      </div>

      {published.length === 0 && (
        <EmptyState icon={HandHeart} title="Nicio cerere activă" description="Cererile aprobate apar aici. Dacă ai nevoie de ajutor, trimite una." />
      )}

      <div className="space-y-4">
        {published.map((item) => {
          const helpers = responses.filter((response) => response.request_id === item.id).length;
          const isOwner = user?.id === item.user_id;
          const resolved = item.status === 'rezolvata';
          return (
            <article key={item.id} className={`card space-y-3 p-4 ${resolved ? 'opacity-70' : ''}`}>
              <div className="flex items-center gap-3">
                <Avatar name={item.author_name} size="md" tone="accent" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-primary-800">{item.author_name}</p>
                  <p className="text-xs text-neutral-500">{item.location} · {timeAgo(item.created_at)}</p>
                </div>
                {resolved && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-success-100 px-2.5 py-1 text-[11px] font-semibold text-success-700">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Rezolvată
                  </span>
                )}
              </div>
              <p className="whitespace-pre-line text-sm text-neutral-800">{item.need}</p>
              <div className="flex items-center justify-between gap-3 border-t border-neutral-100 pt-3">
                <p className="text-xs text-neutral-500">{helpers} {helpers === 1 ? 'vecin care poate ajuta' : 'vecini care pot ajuta'}</p>
                {isOwner && !resolved && (
                  <button type="button" onClick={() => markResolved(item)} className="btn-ghost px-3 py-2 text-sm">Marchează rezolvată</button>
                )}
                {!isOwner && !resolved && (
                  <button type="button" onClick={() => offerHelp(item)} className="btn-primary px-4 py-2 text-sm">Pot ajuta</button>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <RequestForm open={formOpen} onClose={() => setFormOpen(false)} />
    </div>
  );
}

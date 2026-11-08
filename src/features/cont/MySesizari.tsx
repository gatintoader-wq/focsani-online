import { Landmark } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTable } from '@/lib/useTable';
import { SESIZARE_STATUSES, SESIZARE_TYPES, type SesizareStatus } from '@/lib/constants';
import { APROBARE_LABELS, APROBARE_STYLES } from '@/lib/moderation';
import { timeAgo, formatDate } from '@/lib/format';
import type { Sesizare } from '@/features/sesizari/types';
import EmptyState from '@/components/EmptyState';

export default function MySesizari() {
  const { user } = useAuth();
  const sesizari = useTable<Sesizare>('sesizari');
  const mine = sesizari
    .filter((item) => item.user_id === user?.id)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));

  return (
    <section aria-labelledby="sesizari-titlu" className="space-y-4">
      <div>
        <h2 id="sesizari-titlu" className="text-lg font-bold text-primary-800">Sesizările mele</h2>
        <p className="text-sm text-neutral-500">Urmărești aici stadiul fiecărei sesizări.</p>
      </div>
      {mine.length === 0 && (
        <EmptyState icon={Landmark} title="Nu ai trimis nicio sesizare" description="Când semnalezi o problemă din oraș, o vezi aici." />
      )}
      {mine.map((item) => {
        const status = SESIZARE_STATUSES[item.status as SesizareStatus];
        const priority = item.prioritar_pana_la && new Date(item.prioritar_pana_la).getTime() > Date.now();
        return (
          <article key={item.id} className="card space-y-3 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-neutral-500">#{item.number}</span>
              <span className="text-sm font-bold text-primary-800">{SESIZARE_TYPES[item.type]}</span>
              <span className={`ml-auto rounded-full px-2 py-0.5 text-[11px] font-semibold ${APROBARE_STYLES[item.aprobare]}`}>
                {APROBARE_LABELS[item.aprobare]}
              </span>
            </div>
            {priority && (
              <span className="inline-block rounded-full bg-danger-600 px-2.5 py-0.5 text-[11px] font-bold text-white">PRIORITAR / URGENT</span>
            )}
            <p className="text-sm text-neutral-700">{item.address}</p>
            <p className="text-sm text-neutral-600 whitespace-pre-line">{item.description}</p>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-neutral-600">
                <span className={status.badge + ' rounded-full px-2 py-0.5'}>{status.label}</span>
                <span className="text-neutral-400">{timeAgo(item.created_at)} · {formatDate(item.created_at)}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-neutral-100">
                <div className={`h-full rounded-full transition-all duration-700 ${status.bar}`} style={{ width: `${status.progress}%` }} />
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}

import { useState } from 'react';
import { Sparkles, Trophy, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { useTable } from '@/lib/useTable';
import { getPointsSettings } from '@/features/puncte/pointsSettings';
import { highlightListing } from '@/features/puncte/purchases';
import type { Listing } from '@/features/bazar/types';
import { APROBARE_LABELS, APROBARE_STYLES } from '@/lib/moderation';
import { daysUntil } from '@/lib/format';
import EmptyState from '@/components/EmptyState';

export default function PointsShop() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const listings = useTable<Listing>('listings');
  const settings = getPointsSettings();
  const [busy, setBusy] = useState<string | null>(null);
  const mine = listings
    .filter((item) => item.user_id === user?.id && item.aprobare === 'aprobat' && new Date(item.expires_at).getTime() > Date.now())
    .sort((a, b) => b.created_at.localeCompare(a.created_at));

  const buy = (listing: Listing, days: 3 | 7) => {
    if (!user) return;
    setBusy(`${listing.id}-${days}`);
    try {
      highlightListing(user.id, listing.id, days);
      showToast(`Anunțul „${listing.title}” este evidențiat ${days} zile.`);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Nu am putut evidenția anunțul.', 'error');
    } finally {
      setBusy(null);
    }
  };

  return (
    <section aria-labelledby="magazin-titlu" className="space-y-4">
      <div>
        <h2 id="magazin-titlu" className="text-lg font-bold text-primary-800">Magazin cu puncte</h2>
        <p className="text-sm text-neutral-500">Folosește punctele pentru a ieși în față.</p>
      </div>

      <div className="card space-y-3 p-4">
        <div className="flex items-start gap-3">
          <span className="rounded-2xl bg-accent-100 p-2.5 text-accent-700"><Sparkles className="h-5 w-5" /></span>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-primary-800">Anunț evidențiat în Bazar</p>
            <p className="text-sm text-neutral-500">Fundal galben și eticheta „Evidențiat” în lista Bazarului.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-center text-sm">
          <div className="rounded-2xl bg-neutral-50 p-3">
            <p className="font-bold text-primary-800">3 zile</p>
            <p className="text-accent-700 font-semibold">{settings.evidentiere3Zile} puncte</p>
          </div>
          <div className="rounded-2xl bg-neutral-50 p-3">
            <p className="font-bold text-primary-800">7 zile</p>
            <p className="text-accent-700 font-semibold">{settings.evidentiere7Zile} puncte</p>
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-2xl bg-danger-50 p-3">
          <Zap className="mt-0.5 h-5 w-5 shrink-0 text-danger-600" />
          <p className="text-sm text-neutral-700">
            <span className="font-semibold text-danger-700">Sesizare prioritară</span> ({settings.sesizarePrioritara} puncte): apare sus, cu eticheta roșie „PRIORITAR / URGENT”, timp de 24 de ore. Se alege la trimiterea sesizării.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-semibold text-neutral-700">Anunțurile tale aprobate</p>
        {mine.length === 0 && (
          <EmptyState icon={Trophy} title="Nu ai anunțuri aprobate" description="După ce un anunț din Bazar este aprobat, îl poți evidenția de aici." />
        )}
        {mine.map((listing) => {
          const highlighted = listing.evidentiat_pana_la && new Date(listing.evidentiat_pana_la).getTime() > Date.now();
          return (
            <div key={listing.id} className="card space-y-3 p-4">
              <div className="flex items-center gap-2">
                <p className="min-w-0 flex-1 truncate font-semibold text-primary-800">{listing.title}</p>
                {highlighted && (
                  <span className="rounded-full bg-accent-100 px-2 py-0.5 text-[11px] font-semibold text-accent-700">
                    Evidențiat încă {daysUntil(listing.evidentiat_pana_la!)} zile
                  </span>
                )}
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${APROBARE_STYLES[listing.aprobare]}`}>
                  {APROBARE_LABELS[listing.aprobare]}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" disabled={busy !== null} onClick={() => buy(listing, 3)} className="btn-accent text-sm">
                  3 zile · {settings.evidentiere3Zile}
                </button>
                <button type="button" disabled={busy !== null} onClick={() => buy(listing, 7)} className="btn-primary text-sm">
                  7 zile · {settings.evidentiere7Zile}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

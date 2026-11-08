import { useMemo, useState } from 'react';
import { Gift, Trophy } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { useTable } from '@/lib/useTable';
import { insertRow } from '@/lib/localDb';
import { NEIGHBORHOODS } from '@/lib/constants';
import { spendPoints, type LocalAccount } from '@/features/cont/localAccount';
import { getPointsSettings } from '@/features/puncte/pointsSettings';
import type { NeighborhoodStanding, Redemption, Reward } from '@/features/premii/types';
import PageHeader from '@/components/PageHeader';
import EmptyState from '@/components/EmptyState';

function generateCode(): string {
  return crypto.randomUUID().replace(/-/g, '').slice(0, 8).toUpperCase();
}

export default function PremiiPage() {
  const { user, profile } = useAuth();
  const { showToast } = useToast();
  const rewards = useTable<Reward>('rewards').filter((item) => item.active).sort((a, b) => a.cost - b.cost);
  const accounts = useTable<LocalAccount>('conturi');
  const redemptions = useTable<Redemption>('redemptions');
  const [busy, setBusy] = useState(false);
  const settings = getPointsSettings();

  const standings = useMemo<NeighborhoodStanding[]>(
    () =>
      NEIGHBORHOODS.map((neighborhood) => {
        const members = accounts.filter((item) => item.neighborhood === neighborhood);
        return {
          neighborhood,
          members: members.length,
          total_points: members.reduce((sum, item) => sum + item.points, 0),
        };
      }).sort((a, b) => b.total_points - a.total_points),
    [accounts],
  );

  const myRedemptions = redemptions.filter((item) => item.user_id === user?.id);

  const redeem = (reward: Reward) => {
    if (!user || !profile) return;
    setBusy(true);
    try {
      spendPoints(user.id, reward.cost);
      const redemption = insertRow<Redemption>('redemptions', {
        id: crypto.randomUUID(),
        user_id: user.id,
        reward_id: reward.id,
        code: generateCode(),
        created_at: new Date().toISOString(),
      });
      showToast(`Ai răscumpărat „${reward.name}”. Cod: ${redemption.code}`);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Premiul nu a putut fi răscumpărat.', 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-8 px-5 pb-6 pt-5">
      <PageHeader title="Premii" subtitle="Răscumpără punctele strânse în oraș" />

      <section className="card space-y-3 p-4">
        <p className="text-sm font-semibold text-primary-800">Cum câștigi puncte</p>
        <div className="grid grid-cols-2 gap-2 text-center text-sm">
          <div className="rounded-2xl bg-neutral-50 p-3"><p className="font-bold text-primary-800">+{settings.sesizare}</p>sesizare</div>
          <div className="rounded-2xl bg-neutral-50 p-3"><p className="font-bold text-primary-800">+{settings.anuntBazar}</p>anunț Bazar</div>
          <div className="rounded-2xl bg-neutral-50 p-3"><p className="font-bold text-primary-800">+{settings.ajutor}</p>cerere de ajutor</div>
          <div className="rounded-2xl bg-neutral-50 p-3"><p className="font-bold text-primary-800">+{settings.comentariu}</p>comentariu</div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-primary-800">Premii disponibile</h2>
        {rewards.length === 0 && <EmptyState icon={Gift} title="Niciun premiu activ" description="Premiile noi apar aici." />}
        {rewards.map((reward) => {
          const canAfford = !!profile && profile.points >= reward.cost;
          return (
            <div key={reward.id} className="card flex items-center gap-4 p-4">
              <span className="rounded-2xl bg-accent-100 p-3 text-accent-700"><Gift className="h-5 w-5" /></span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-primary-800">{reward.name}</p>
                <p className="text-xs text-neutral-500">{reward.description}</p>
                <p className="mt-1 text-xs font-semibold text-accent-700">{reward.cost} puncte</p>
              </div>
              {user ? (
                <button type="button" disabled={!canAfford || busy} onClick={() => redeem(reward)} className="btn-primary px-3 py-2 text-sm disabled:opacity-40">
                  Răscumpără
                </button>
              ) : (
                <span className="text-xs text-neutral-500">Intră în cont</span>
              )}
            </div>
          );
        })}
        {myRedemptions.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-neutral-700">Premiile tale</p>
            {myRedemptions.map((item) => {
              const reward = rewards.find((entry) => entry.id === item.reward_id);
              return (
                <div key={item.id} className="flex items-center justify-between rounded-2xl bg-neutral-50 px-4 py-3 text-sm">
                  <span className="font-semibold text-primary-800">{reward?.name ?? 'Premiu'}</span>
                  <span className="font-mono font-bold tracking-widest text-accent-700">{item.code}</span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-lg font-bold text-primary-800"><Trophy className="h-5 w-5 text-accent-600" /> Clasament pe cartiere</h2>
        {standings.map((row, index) => (
          <div key={row.neighborhood} className={`card flex items-center gap-3 p-4 ${profile?.neighborhood === row.neighborhood ? 'ring-2 ring-accent-400' : ''}`}>
            <span className="w-6 text-center text-sm font-bold text-neutral-400">{index + 1}</span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-primary-800">{row.neighborhood}</p>
              <p className="text-xs text-neutral-500">{row.members} {row.members === 1 ? 'vecin' : 'vecini'}</p>
            </div>
            <p className="font-bold text-accent-700">{row.total_points} p</p>
          </div>
        ))}
      </section>
    </div>
  );
}

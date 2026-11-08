import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTable } from '@/lib/useTable';
import { getPointsLevel } from '@/features/puncte/pointsSettings';
import { formatLocation, isAdminAccount, type LocalAccount } from '@/features/cont/localAccount';
import { SignInForm, SignUpForm } from '@/features/cont/AuthForms';
import PointsShop from '@/features/cont/PointsShop';
import MySesizari from '@/features/cont/MySesizari';
import PageHeader from '@/components/PageHeader';
import Avatar from '@/components/Avatar';

export default function ContPage() {
  const { user, profile, signOut } = useAuth();
  const accounts = useTable<LocalAccount>('conturi');
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const switchMode = () => setMode((current) => (current === 'signin' ? 'signup' : 'signin'));

  if (!user || !profile) {
    return (
      <div className="space-y-6 px-5 pt-5">
        <PageHeader title="Contul tău" subtitle="Intră în cont sau creează un cont nou" />
        <div className="card p-5">
          {mode === 'signin' ? <SignInForm onSwitch={switchMode} /> : <SignUpForm onSwitch={switchMode} />}
        </div>
      </div>
    );
  }

  const account = accounts.find((item) => item.id === user.id);
  const current = getPointsLevel(profile.points);
  const span = current.max === null ? 1 : current.max - current.min + 1;
  const progress = current.max === null ? 100 : Math.min(100, Math.round(((profile.points - current.min) / span) * 100));

  return (
    <div className="space-y-8 px-5 pb-6 pt-5">
      <PageHeader title="Contul tău" subtitle={account ? formatLocation(account) : undefined} />

      <section className="card space-y-5 p-5">
        <div className="flex items-center gap-4">
          <Avatar name={profile.name} size="lg" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-lg font-bold text-primary-800">{profile.name}</p>
            <p className="truncate text-sm text-neutral-500">{user.email}</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">{current.name}</p>
              <p className="text-3xl font-extrabold text-primary-800">{profile.points} <span className="text-base font-semibold text-neutral-500">puncte</span></p>
            </div>
            <p className="text-xs text-neutral-500">
              {current.max === null ? 'Nivel maxim' : `Următorul nivel la ${current.max + 1}`}
            </p>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-neutral-100">
            <div className="h-full rounded-full bg-accent-500 transition-all duration-700" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-xs text-neutral-500">
            Nivele: Vecin Nou (0-50), Vecin Activ (51-150), Super Vecin (151+)
          </p>
        </div>
        {isAdminAccount(account) && (
          <Link to="/admin" className="btn-accent w-full">
            <ShieldCheck className="h-4 w-4" />
            Panou Admin
          </Link>
        )}
        <button type="button" onClick={signOut} className="btn-ghost w-full">
          <LogOut className="h-4 w-4" />
          Ieși din cont
        </button>
      </section>

      <PointsShop />
      <MySesizari />
    </div>
  );
}

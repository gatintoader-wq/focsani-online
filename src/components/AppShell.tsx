import { Outlet, Link } from 'react-router-dom';
import { MapPin, UserRound } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import Avatar from '@/components/Avatar';
import { useAuth } from '@/contexts/AuthContext';

function AppHeader() {
  const { profile } = useAuth();
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between bg-primary-800 px-5 text-white shadow-md shadow-primary-900/20">
      <Link to="/" className="flex items-center gap-2 font-bold tracking-tight">
        <span className="rounded-lg bg-accent-500 p-1 text-primary-800">
          <MapPin className="h-4 w-4" />
        </span>
        <span className="text-lg">
          Focșani<span className="text-accent-500">.online</span>
        </span>
      </Link>
      <Link to="/cont" aria-label="Contul meu" className="rounded-full transition hover:scale-105">
        {profile ? <Avatar name={profile.name} size="sm" tone="accent" /> : <UserRound className="h-6 w-6 text-accent-500" />}
      </Link>
    </header>
  );
}

export default function AppShell() {
  return (
    <div className="min-h-dvh bg-neutral-100">
      <div className="relative mx-auto flex min-h-dvh max-w-md flex-col bg-neutral-50 shadow-2xl shadow-primary-900/10">
        <AppHeader />
        <main className="flex flex-1 flex-col pb-28">
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </div>
  );
}

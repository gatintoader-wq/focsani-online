import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { House, MapPinned, Plus, ShoppingBag, UserRound } from 'lucide-react';
import CreateSheet from '@/components/CreateSheet';

const ITEM_BASE = 'flex flex-col items-center gap-1 text-[11px] font-semibold transition';

function NavItem({ to, end, label, icon: Icon }: { to: string; end?: boolean; label: string; icon: typeof House }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) => `${ITEM_BASE} ${isActive ? 'text-primary-800' : 'text-neutral-500 hover:text-neutral-800'}`}
    >
      {({ isActive }) => (
        <>
          <span className={`rounded-2xl px-4 py-1 transition ${isActive ? 'bg-accent-100' : ''}`}>
            <Icon className="h-5 w-5" strokeWidth={isActive ? 2.4 : 2} />
          </span>
          {label}
        </>
      )}
    </NavLink>
  );
}

export default function BottomNav() {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <>
      <nav
        aria-label="Navigare principală"
        className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-md border-t border-neutral-200 bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_-12px_rgba(10,37,64,0.25)] backdrop-blur"
      >
        <div className="grid h-16 grid-cols-5 items-center px-2">
          <NavItem to="/" end label="Acasă" icon={House} />
          <NavItem to="/harta" label="Hartă" icon={MapPinned} />
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => setSheetOpen(true)}
              aria-label="Adaugă conținut nou"
              className="-mt-7 flex h-14 w-14 items-center justify-center rounded-full bg-accent-500 text-primary-800 shadow-lg shadow-accent-600/40 ring-4 ring-white transition hover:bg-accent-400 active:scale-95"
            >
              <Plus className="h-7 w-7" strokeWidth={2.6} />
            </button>
          </div>
          <NavItem to="/bazar" label="Bazar" icon={ShoppingBag} />
          <NavItem to="/cont" label="Cont" icon={UserRound} />
        </div>
      </nav>
      <CreateSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </>
  );
}

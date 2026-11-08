import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Archive, LifeBuoy, Megaphone, MessageSquare, ShieldAlert, ShoppingBag, TriangleAlert, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTable } from '@/lib/useTable';
import AdminApprovals, { type ApprovalTab } from '@/features/admin/AdminApprovals';
import AdminPosts from '@/features/admin/AdminPosts';
import AdminUsers from '@/features/admin/AdminUsers';
import AdminAds from '@/features/admin/AdminAds';
import { isAdminAccount, type LocalAccount } from '@/features/cont/localAccount';

type Section = ApprovalTab | 'postari' | 'utilizatori' | 'reclame';

const SECTIONS: { id: Section; label: string; icon: typeof ShoppingBag }[] = [
  { id: 'bazar', label: 'Bazar', icon: ShoppingBag },
  { id: 'postari', label: 'Postări', icon: MessageSquare },
  { id: 'sesizari', label: 'Sesizări', icon: TriangleAlert },
  { id: 'ajutor', label: 'Ajutor', icon: LifeBuoy },
  { id: 'arhiva', label: 'Arhivă', icon: Archive },
  { id: 'utilizatori', label: 'Utilizatori', icon: Users },
  { id: 'reclame', label: 'Reclame', icon: Megaphone },
];

export default function AdminPage() {
  const { user } = useAuth();
  const accounts = useTable<LocalAccount>('conturi');
  const [section, setSection] = useState<Section>('bazar');

  const account = user ? accounts.find((item) => item.id === user.id) : undefined;
  if (!isAdminAccount(account)) {
    return (
      <div className="card mx-5 mt-5 flex flex-col items-center gap-4 p-8 text-center">
        <span className="rounded-full bg-danger-50 p-4 text-danger-600">
          <ShieldAlert className="h-7 w-7" />
        </span>
        <h1 className="text-xl font-extrabold text-primary-800">Nu ai acces</h1>
        <p className="max-w-xs text-sm text-neutral-600">Această pagină este rezervată administratorilor.</p>
        <Link to="/cont" className="btn-primary">
          Mergi la contul tău
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-800 transition hover:text-primary-600">
        <ArrowLeft className="h-4 w-4" />
        Înapoi la site
      </Link>
      <div className="flex flex-col gap-6 md:flex-row md:gap-8">
      <aside className="md:w-56 md:shrink-0">
        <nav aria-label="Meniu administrare" className="flex gap-2 overflow-x-auto rounded-2xl bg-white p-2 shadow-sm ring-1 ring-neutral-200 md:flex-col md:overflow-visible">
          {SECTIONS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setSection(id)}
              aria-current={section === id ? 'page' : undefined}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                section === id ? 'bg-primary-800 text-white' : 'text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </nav>
      </aside>

      <div className="min-w-0 flex-1 space-y-5">
        {section === 'bazar' || section === 'sesizari' || section === 'ajutor' || section === 'arhiva' ? (
          <>
            <h2 className="text-xl font-extrabold text-primary-800">{SECTIONS.find((item) => item.id === section)?.label}</h2>
            <AdminApprovals tab={section} />
          </>
        ) : null}
        {section === 'postari' && <AdminPosts />}
        {section === 'utilizatori' && <AdminUsers />}
        {section === 'reclame' && <AdminAds />}
      </div>
      </div>
    </div>
  );
}

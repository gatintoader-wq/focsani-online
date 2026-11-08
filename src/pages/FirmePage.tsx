import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Clock, Plus, Search, Tag } from 'lucide-react';
import { useTable } from '@/lib/useTable';
import { useAutoOpen } from '@/lib/useAutoOpen';
import { BUSINESS_CATEGORIES, type BusinessCategory } from '@/lib/constants';
import { isOpenNow } from '@/lib/format';
import type { Business, BusinessOffer } from '@/features/firme/types';
import BusinessRegistrationForm from '@/features/firme/BusinessRegistrationForm';
import PageHeader from '@/components/PageHeader';
import EmptyState from '@/components/EmptyState';

type CategoryFilter = 'toate' | BusinessCategory;

export default function FirmePage() {
  const businesses = useTable<Business>('businesses');
  const offers = useTable<BusinessOffer>('business_offers');
  const [formOpen, setFormOpen] = useAutoOpen();
  const [category, setCategory] = useState<CategoryFilter>('toate');
  const [search, setSearch] = useState('');

  const query = search.trim().toLowerCase();
  const visible = businesses
    .filter((item) => category === 'toate' || item.category === category)
    .filter((item) => !query || item.name.toLowerCase().includes(query))
    .sort((a, b) => a.name.localeCompare(b.name, 'ro'));

  return (
    <div className="space-y-5 px-5 pb-6 pt-5">
      <PageHeader
        title="Firme din Focșani"
        subtitle="Directorul firmelor locale"
        action={
          <button type="button" onClick={() => setFormOpen(true)} className="btn-accent px-4 py-2 text-sm">
            <Plus className="h-4 w-4" strokeWidth={2.6} />
            Înscrie firma
          </button>
        }
      />

      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <input type="search" aria-label="Caută firmă" className="input pl-11" placeholder="Caută după nume" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {(['toate', ...BUSINESS_CATEGORIES] as CategoryFilter[]).map((item) => (
          <button key={item} type="button" aria-pressed={category === item} onClick={() => setCategory(item)} className={`chip ${category === item ? 'chip-active' : 'chip-idle'}`}>
            {item === 'toate' ? 'Toate' : item}
          </button>
        ))}
      </div>

      {visible.length === 0 && <EmptyState icon={Briefcase} title="Nicio firmă găsită" description="Schimbă filtrul sau căutarea." />}

      <div className="grid gap-4 sm:grid-cols-2">
        {visible.map((item) => {
          const open = isOpenNow(item.hours);
          const offer = offers.find((entry) => entry.business_id === item.id && new Date(entry.valid_until).getTime() > Date.now());
          return (
            <Link key={item.id} to={`/firme/${item.id}`} className="card group overflow-hidden transition hover:-translate-y-0.5 hover:shadow-md">
              {item.photos[0] && <img src={item.photos[0]} alt={item.name} loading="lazy" className="aspect-[16/9] w-full object-cover transition duration-500 group-hover:scale-105" />}
              <div className="space-y-2 p-4">
                <div className="flex items-center gap-2">
                  <h2 className="min-w-0 flex-1 truncate text-base font-bold text-primary-800">{item.name}</h2>
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${open ? 'bg-success-100 text-success-700' : 'bg-neutral-100 text-neutral-500'}`}>
                    {open ? 'Deschis' : 'Închis'}
                  </span>
                </div>
                <p className="text-xs font-semibold uppercase tracking-wide text-accent-700">{item.category}</p>
                {offer && (
                  <p className="flex items-center gap-1.5 text-sm font-semibold text-primary-700">
                    <Tag className="h-3.5 w-3.5" /> {offer.title}
                  </p>
                )}
                <p className="flex items-center gap-1.5 text-xs text-neutral-500">
                  <Clock className="h-3.5 w-3.5" /> {item.address}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      <BusinessRegistrationForm open={formOpen} onClose={() => setFormOpen(false)} />
    </div>
  );
}

import { useState } from 'react';
import { Plus, ShoppingBag, Sparkles, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { useTable } from '@/lib/useTable';
import { removeRows } from '@/lib/localDb';
import { useAutoOpen } from '@/lib/useAutoOpen';
import { LISTING_KINDS, type ListingKind } from '@/lib/constants';
import { formatPrice, timeAgo } from '@/lib/format';
import type { Listing } from '@/features/bazar/types';
import ListingForm from '@/features/bazar/ListingForm';
import AdSlot from '@/components/AdSlot';
import PageHeader from '@/components/PageHeader';
import EmptyState from '@/components/EmptyState';

const AD_EVERY = 3;
type KindFilter = 'toate' | ListingKind;

function isHighlighted(item: Listing): boolean {
  return !!item.evidentiat_pana_la && new Date(item.evidentiat_pana_la).getTime() > Date.now();
}

export default function BazarPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const listings = useTable<Listing>('listings');
  const [formOpen, setFormOpen] = useAutoOpen();
  const [kind, setKind] = useState<KindFilter>('toate');

  const now = Date.now();
  const visible = listings
    .filter((item) => item.aprobare === 'aprobat' && new Date(item.expires_at).getTime() > now)
    .filter((item) => kind === 'toate' || item.kind === kind)
    .sort((a, b) => {
      if (isHighlighted(a) !== isHighlighted(b)) return isHighlighted(a) ? -1 : 1;
      return b.created_at.localeCompare(a.created_at);
    });

  const deleteListing = (item: Listing) => {
    if (!window.confirm('Ștergi acest anunț?')) return;
    removeRows<Listing>('listings', (row) => row.id === item.id);
    showToast('Anunțul a fost șters.');
  };

  return (
    <div className="space-y-5 px-5 pb-6 pt-5">
      <PageHeader
        title="Bazar"
        subtitle="Vânzări, cumpărări și lucruri gratis între vecini"
        action={
          <button type="button" onClick={() => setFormOpen(true)} className="btn-accent px-4 py-2 text-sm">
            <Plus className="h-4 w-4" strokeWidth={2.6} />
            Anunț
          </button>
        }
      />

      <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {(['toate', ...Object.keys(LISTING_KINDS)] as KindFilter[]).map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={kind === item}
            onClick={() => setKind(item)}
            className={`chip ${kind === item ? 'chip-active' : 'chip-idle'}`}
          >
            {item === 'toate' ? 'Toate' : LISTING_KINDS[item]}
          </button>
        ))}
      </div>

      {visible.length === 0 && (
        <EmptyState
          icon={ShoppingBag}
          title="Niciun anunț publicat"
          description="Anunțurile apar aici după ce sunt aprobate."
        />
      )}

      <div className="space-y-4">
        {visible.map((item, index) => (
          <div key={item.id} className="contents">
            {index > 0 && index % AD_EVERY === 0 && <AdSlot position="bazar" />}
            <article className={`card overflow-hidden ${isHighlighted(item) ? 'bg-accent-50 ring-2 ring-accent-400' : ''}`}>
              {item.image_url && (
                <img src={item.image_url} alt={item.title} loading="lazy" className="aspect-[4/3] w-full object-cover" />
              )}
              <div className="space-y-2 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  {isHighlighted(item) && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-accent-500 px-2.5 py-0.5 text-[11px] font-bold text-primary-900">
                      <Sparkles className="h-3 w-3" />
                      Evidențiat
                    </span>
                  )}
                  <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[11px] font-semibold text-neutral-600">{LISTING_KINDS[item.kind]}</span>
                  <span className="text-[11px] text-neutral-400">{item.category} · {timeAgo(item.created_at)}</span>
                </div>
                <div className="flex items-start gap-3">
                  <h3 className="min-w-0 flex-1 text-base font-bold text-primary-800">{item.title}</h3>
                  <p className="shrink-0 font-bold text-accent-700">{formatPrice(item.price, item.kind)}</p>
                </div>
                {item.description && <p className="whitespace-pre-line text-sm text-neutral-600">{item.description}</p>}
                <div className="flex items-center justify-between gap-3 border-t border-neutral-100 pt-3">
                  <a href={`tel:${item.phone}`} className="text-sm font-semibold text-primary-700 hover:underline">
                    Sună: {item.phone}
                  </a>
                  <span className="text-xs text-neutral-500">{item.author_name}</span>
                  {user?.id === item.user_id && (
                    <button type="button" onClick={() => deleteListing(item)} aria-label="Șterge anunțul" className="rounded-full p-2 text-neutral-400 hover:bg-danger-50 hover:text-danger-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </article>
          </div>
        ))}
      </div>

      <ListingForm open={formOpen} onClose={() => setFormOpen(false)} />
    </div>
  );
}

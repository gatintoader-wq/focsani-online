import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, MessageCircle, Tag } from 'lucide-react';
import { useTable } from '@/lib/useTable';
import { DAY_KEYS, DAY_LABELS } from '@/lib/constants';
import { isOpenNow } from '@/lib/format';
import type { Business, BusinessOffer } from '@/features/firme/types';
import ReviewSection from '@/features/firme/ReviewSection';
import EmptyState from '@/components/EmptyState';
import { Briefcase } from 'lucide-react';

export default function FirmaPage() {
  const { id } = useParams<{ id: string }>();
  const businesses = useTable<Business>('businesses');
  const offers = useTable<BusinessOffer>('business_offers');
  const business = businesses.find((item) => item.id === id);

  if (!business) {
    return (
      <div className="px-5 pt-5">
        <EmptyState icon={Briefcase} title="Firma nu a fost găsită" description="Poate a fost eliminată din director." />
      </div>
    );
  }

  const open = isOpenNow(business.hours);
  const currentOffers = offers.filter((item) => item.business_id === business.id && new Date(item.valid_until).getTime() > Date.now());
  const whatsappNumber = business.whatsapp?.replace(/\D/g, '');

  return (
    <div className="space-y-6 pb-8">
      {business.photos[0] ? (
        <img src={business.photos[0]} alt={business.name} className="aspect-[16/10] w-full object-cover" />
      ) : (
        <div className="aspect-[16/10] w-full bg-primary-800" />
      )}

      <div className="space-y-6 px-5">
        <Link to="/firme" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Toate firmele
        </Link>

        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-accent-700">{business.category}</p>
          <h1 className="text-2xl font-bold text-primary-800">{business.name}</h1>
          <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${open ? 'bg-success-100 text-success-700' : 'bg-neutral-100 text-neutral-500'}`}>
            {open ? 'Deschis acum' : 'Închis acum'}
          </span>
          <p className="text-sm leading-relaxed text-neutral-700">{business.description}</p>
        </header>

        <div className="flex flex-wrap gap-2">
          <a href={`tel:${business.phone}`} className="btn-primary px-4 py-2 text-sm"><Phone className="h-4 w-4" /> Sună</a>
          {whatsappNumber && (
            <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="btn-ghost px-4 py-2 text-sm">
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
          )}
          <span className="inline-flex items-center gap-1.5 self-center text-sm text-neutral-600"><MapPin className="h-4 w-4" /> {business.address}</span>
        </div>

        {currentOffers.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-primary-800">Oferte de azi</h2>
            {currentOffers.map((offer) => (
              <div key={offer.id} className="card flex items-start gap-3 p-4">
                <Tag className="mt-0.5 h-5 w-5 shrink-0 text-accent-600" />
                <div>
                  <p className="font-semibold text-primary-800">{offer.title}</p>
                  {offer.description && <p className="text-sm text-neutral-600">{offer.description}</p>}
                </div>
              </div>
            ))}
          </section>
        )}

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-primary-800">Program</h2>
          <dl className="card divide-y divide-neutral-100">
            {DAY_KEYS.map((day) => (
              <div key={day} className="flex justify-between px-4 py-2.5 text-sm">
                <dt className="font-semibold text-neutral-700">{DAY_LABELS[day]}</dt>
                <dd className="text-neutral-600">{business.hours[day] ?? 'Închis'}</dd>
              </div>
            ))}
          </dl>
        </section>

        <ReviewSection businessId={business.id} />
      </div>
    </div>
  );
}

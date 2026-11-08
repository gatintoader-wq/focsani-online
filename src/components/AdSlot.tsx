import { useTable } from '@/lib/useTable';
import type { Ad, AdPosition } from '@/features/admin/adsStore';

export default function AdSlot({ position }: { position: AdPosition }) {
  const ads = useTable<Ad>('reclame');
  const ad = ads.find((item) => item.active && item.position === position);
  if (!ad) return null;

  return (
    <a
      href={ad.link}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="card group block overflow-hidden transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <img src={ad.imageUrl} alt={ad.title} loading="lazy" className="aspect-[16/7] w-full object-cover" />
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <p className="truncate text-sm font-semibold text-primary-800">{ad.title}</p>
        <span className="shrink-0 rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-neutral-500">
          Reclamă
        </span>
      </div>
    </a>
  );
}

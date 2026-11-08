import { useState } from 'react';
import { Images, Plus } from 'lucide-react';
import { useTable } from '@/lib/useTable';
import { useAutoOpen } from '@/lib/useAutoOpen';
import type { ArchivePhoto } from '@/features/arhiva/types';
import ArchiveForm from '@/features/arhiva/ArchiveForm';
import PageHeader from '@/components/PageHeader';
import EmptyState from '@/components/EmptyState';

export default function ArhivaPage() {
  const photos = useTable<ArchivePhoto>('archive_photos');
  const [formOpen, setFormOpen] = useAutoOpen();
  const [openId, setOpenId] = useState<string | null>(null);

  const published = photos
    .filter((item) => item.aprobare === 'aprobat')
    .sort((a, b) => a.year - b.year);
  const opened = published.find((item) => item.id === openId) ?? null;

  return (
    <div className="space-y-5 px-5 pb-6 pt-5">
      <PageHeader
        title="Arhiva Focșaniului"
        subtitle="Fotografii vechi, adunate de vecini"
        action={
          <button type="button" onClick={() => setFormOpen(true)} className="btn-accent px-4 py-2 text-sm">
            <Plus className="h-4 w-4" strokeWidth={2.6} />
            Adaugă
          </button>
        }
      />

      {published.length === 0 && (
        <EmptyState icon={Images} title="Arhiva este goală" description="Fotografiile aprobate apar aici." />
      )}

      <div className="grid grid-cols-2 gap-3">
        {published.map((item) => (
          <button key={item.id} type="button" onClick={() => setOpenId(item.id)} className="card group overflow-hidden text-left transition hover:-translate-y-0.5 hover:shadow-md">
            <img src={item.image_url} alt={item.place} loading="lazy" className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105" />
            <div className="p-3">
              <p className="text-xs font-bold text-accent-700">{item.year}</p>
              <p className="truncate text-sm font-semibold text-primary-800">{item.place}</p>
            </div>
          </button>
        ))}
      </div>

      {opened && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary-900/80 p-5" role="dialog" aria-modal="true" onClick={() => setOpenId(null)}>
          <div className="max-w-md space-y-3 rounded-3xl bg-white p-4" onClick={(e) => e.stopPropagation()}>
            <img src={opened.image_url} alt={opened.place} className="max-h-[70vh] w-full rounded-2xl object-contain" />
            <p className="font-bold text-primary-800">{opened.place}, {opened.year}</p>
            {opened.caption && <p className="text-sm text-neutral-600">{opened.caption}</p>}
            <p className="text-xs text-neutral-500">Încărcată de {opened.author_name}</p>
            <button type="button" onClick={() => setOpenId(null)} className="btn-ghost w-full">Închide</button>
          </div>
        </div>
      )}

      <ArchiveForm open={formOpen} onClose={() => setFormOpen(false)} />
    </div>
  );
}

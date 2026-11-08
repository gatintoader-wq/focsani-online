import { useState, type FormEvent } from 'react';
import { Eye, EyeOff, Trash2 } from 'lucide-react';
import FormField from '@/components/FormField';
import ImagePicker from '@/components/ImagePicker';
import { AD_POSITIONS, addAd, listAds, removeAd, updateAd, type Ad, type AdPosition } from '@/features/admin/adsStore';

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function isValidLink(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export default function AdminAds() {
  const [ads, setAds] = useState<Ad[]>(() => listAds());
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [position, setPosition] = useState<AdPosition>('sus');
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const refresh = () => setAds(listAds());

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (title.trim().length < 3) next.title = 'Titlul trebuie să aibă cel puțin 3 caractere.';
    if (!isValidLink(link.trim())) next.link = 'Introdu un link valid, care începe cu https://';
    if (!file) next.file = 'Adaugă o poză pentru reclamă.';
    setErrors(next);
    setSuccess(null);
    if (Object.keys(next).length > 0 || !file) return;
    setSubmitting(true);
    try {
      const imageUrl = await readAsDataUrl(file);
      addAd({ title: title.trim(), link: link.trim(), position, imageUrl });
      setTitle('');
      setLink('');
      setFile(null);
      setSuccess('Reclama a fost adăugată și este activă.');
      refresh();
    } catch {
      setErrors({ form: 'Reclama nu a putut fi salvată. Poza este prea mare sau spațiul local este plin.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-extrabold text-primary-800">Reclame</h2>

      <form onSubmit={handleSubmit} noValidate className="card space-y-5 p-5">
        <h3 className="font-bold text-primary-800">Adaugă reclamă</h3>
        <ImagePicker id="ad-image" file={file} onChange={setFile} label="Adaugă poza reclamei" />
        {errors.file && <p role="alert" className="text-xs font-semibold text-danger-600">{errors.file}</p>}
        <FormField label="Titlu" htmlFor="ad-title" error={errors.title}>
          <input id="ad-title" className="input" maxLength={80} value={title} onChange={(e) => setTitle(e.target.value)} />
        </FormField>
        <FormField label="Link" htmlFor="ad-link" error={errors.link}>
          <input id="ad-link" type="url" className="input" placeholder="https://" value={link} onChange={(e) => setLink(e.target.value)} />
        </FormField>
        <FormField label="Poziție" htmlFor="ad-position">
          <select id="ad-position" className="input" value={position} onChange={(e) => setPosition(e.target.value as AdPosition)}>
            {(Object.keys(AD_POSITIONS) as AdPosition[]).map((key) => (
              <option key={key} value={key}>{AD_POSITIONS[key]}</option>
            ))}
          </select>
        </FormField>
        {errors.form && <p role="alert" className="text-xs font-semibold text-danger-600">{errors.form}</p>}
        {success && <p role="status" className="text-xs font-semibold text-success-700">{success}</p>}
        <button type="submit" disabled={submitting} className="btn-primary w-full">
          Adaugă reclama
        </button>
      </form>

      <section className="space-y-3">
        <h3 className="font-bold text-primary-800">Reclame existente</h3>
        {ads.length === 0 ? (
          <p className="card p-5 text-sm text-neutral-600">Nu există reclame încă.</p>
        ) : (
          <ul className="space-y-3">
            {ads.map((ad) => (
              <li key={ad.id} className="card flex gap-4 p-4">
                <img src={ad.imageUrl} alt="" className="h-20 w-24 shrink-0 rounded-xl object-cover" />
                <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-bold text-primary-800">{ad.title}</p>
                    <p className="text-xs text-neutral-500">{AD_POSITIONS[ad.position]}</p>
                    <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${ad.active ? 'bg-success-100 text-success-700' : 'bg-neutral-200 text-neutral-600'}`}>
                      {ad.active ? 'Activă' : 'Dezactivată'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        updateAd(ad.id, { active: !ad.active });
                        refresh();
                      }}
                      className="btn-ghost px-3 py-1.5 text-xs"
                    >
                      {ad.active ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      {ad.active ? 'Dezactivează' : 'Activează'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        removeAd(ad.id);
                        refresh();
                      }}
                      className="btn-ghost px-3 py-1.5 text-xs text-danger-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Șterge
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

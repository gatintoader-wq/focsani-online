import { useState, type FormEvent } from 'react';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { insertRow } from '@/lib/localDb';
import { imageToDataUrl, validateImageFile } from '@/lib/storage';
import { authorNameOf, adjustPoints } from '@/features/cont/localAccount';
import type { ArchivePhoto } from '@/features/arhiva/types';
import Modal from '@/components/Modal';
import FormField from '@/components/FormField';
import ImagePicker from '@/components/ImagePicker';
import SignInPrompt from '@/components/SignInPrompt';

interface ArchiveFormProps {
  open: boolean;
  onClose: () => void;
}

const CURRENT_YEAR = new Date().getFullYear();

export default function ArchiveForm({ open, onClose }: ArchiveFormProps) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [photo, setPhoto] = useState<File | null>(null);
  const [year, setYear] = useState('');
  const [place, setPlace] = useState('');
  const [caption, setCaption] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!user) return;
    if (!photo) return setError('Alege o fotografie.');
    const problem = validateImageFile(photo);
    if (problem) return setError(problem);
    const yearNumber = Number(year);
    if (!Number.isInteger(yearNumber) || yearNumber < 1800 || yearNumber > CURRENT_YEAR) {
      return setError(`Scrie un an între 1800 și ${CURRENT_YEAR}.`);
    }
    if (place.trim().length < 3) return setError('Scrie locul din fotografie.');

    setSubmitting(true);
    setError(null);
    try {
      const imageUrl = await imageToDataUrl(photo);
      insertRow<ArchivePhoto>('archive_photos', {
        id: crypto.randomUUID(),
        user_id: user.id,
        author_name: authorNameOf(user.id),
        image_url: imageUrl,
        year: yearNumber,
        place: place.trim(),
        caption: caption.trim() || null,
        created_at: new Date().toISOString(),
        aprobare: 'asteptare',
      });
      showToast('Fotografia a fost trimisă spre aprobare.');
      setPhoto(null);
      setYear('');
      setPlace('');
      setCaption('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fotografia nu a putut fi salvată. Încearcă din nou.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Adaugă în Arhivă" description="Fotografii vechi din Focșani">
      {!user ? (
        <SignInPrompt message="Trebuie să ai un cont ca să adaugi o fotografie." />
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <ImagePicker id="arhiva-foto" file={photo} onChange={setPhoto} />
          <FormField label="An" htmlFor="arhiva-an">
            <input id="arhiva-an" inputMode="numeric" className="input" value={year} onChange={(e) => setYear(e.target.value)} placeholder="Ex: 1978" />
          </FormField>
          <FormField label="Loc" htmlFor="arhiva-loc" error={error ?? undefined}>
            <input id="arhiva-loc" className="input" maxLength={120} value={place} onChange={(e) => setPlace(e.target.value)} placeholder="Ex: Piața Unirii" />
          </FormField>
          <FormField label="Descriere (opțional)" htmlFor="arhiva-descriere">
            <textarea id="arhiva-descriere" rows={3} maxLength={300} className="input resize-none" value={caption} onChange={(e) => setCaption(e.target.value)} />
          </FormField>
          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Trimite fotografia
          </button>
        </form>
      )}
    </Modal>
  );
}

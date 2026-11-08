import { useState, type FormEvent } from 'react';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { insertRow } from '@/lib/localDb';
import { LISTING_CATEGORIES, LISTING_KINDS, type ListingCategory, type ListingKind } from '@/lib/constants';
import { imageToDataUrl, validateImageFile } from '@/lib/storage';
import { adjustPoints, authorNameOf } from '@/features/cont/localAccount';
import { getPointsSettings } from '@/features/puncte/pointsSettings';
import type { Listing } from '@/features/bazar/types';
import Modal from '@/components/Modal';
import FormField from '@/components/FormField';
import ImagePicker from '@/components/ImagePicker';
import SignInPrompt from '@/components/SignInPrompt';

const LISTING_DAYS = 30;
const DAY = 24 * 60 * 60 * 1000;

interface ListingFormProps {
  open: boolean;
  onClose: () => void;
}

export default function ListingForm({ open, onClose }: ListingFormProps) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [kind, setKind] = useState<ListingKind>('vanzare');
  const [category, setCategory] = useState<ListingCategory>('Altele');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setKind('vanzare');
    setCategory('Altele');
    setTitle('');
    setPrice('');
    setDescription('');
    setPhone('');
    setImage(null);
    setError(null);
  };

  const handleClose = () => {
    if (submitting) return;
    reset();
    onClose();
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!user) return;
    const trimmedTitle = title.trim();
    if (trimmedTitle.length < 3) return setError('Titlul trebuie să aibă cel puțin 3 caractere.');
    const parsedPrice = price.trim() === '' ? null : Number(price.replace(',', '.'));
    if (kind === 'vanzare' && (parsedPrice === null || Number.isNaN(parsedPrice) || parsedPrice <= 0)) {
      return setError('Scrie prețul pentru un anunț de vânzare.');
    }
    if (phone.trim().length < 6) return setError('Scrie un număr de telefon valid.');
    if (image) {
      const problem = validateImageFile(image);
      if (problem) return setError(problem);
    }

    setSubmitting(true);
    setError(null);
    try {
      const imageUrl = image ? await imageToDataUrl(image) : null;
      const now = Date.now();
      insertRow<Listing>('listings', {
        id: crypto.randomUUID(),
        user_id: user.id,
        author_name: authorNameOf(user.id),
        kind,
        category,
        title: trimmedTitle,
        price: kind === 'gratis' ? null : parsedPrice,
        description: description.trim() || null,
        phone: phone.trim(),
        image_url: imageUrl,
        created_at: new Date(now).toISOString(),
        expires_at: new Date(now + LISTING_DAYS * DAY).toISOString(),
        aprobare: 'asteptare',
        evidentiat_pana_la: null,
      });
      const reward = getPointsSettings().anuntBazar;
      adjustPoints(user.id, reward);
      showToast(`Anunțul a fost trimis spre aprobare. Ai primit ${reward} puncte.`);
      reset();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Anunțul nu a putut fi salvat. Încearcă din nou.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} title="Adaugă un anunț" description="Anunțul apare după ce este aprobat">
      {!user ? (
        <SignInPrompt message="Trebuie să ai un cont ca să publici un anunț." />
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <FormField label="Tip anunț" htmlFor="anunt-tip">
            <select id="anunt-tip" className="input" value={kind} onChange={(e) => setKind(e.target.value as ListingKind)}>
              {Object.entries(LISTING_KINDS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Categorie" htmlFor="anunt-categorie">
            <select id="anunt-categorie" className="input" value={category} onChange={(e) => setCategory(e.target.value as ListingCategory)}>
              {LISTING_CATEGORIES.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Titlu" htmlFor="anunt-titlu" error={error ?? undefined}>
            <input id="anunt-titlu" className="input" maxLength={120} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Bicicletă de oraș, ca nouă" />
          </FormField>
          {kind !== 'gratis' && (
            <FormField label="Preț (lei)" htmlFor="anunt-pret">
              <input id="anunt-pret" inputMode="decimal" className="input" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Ex: 350" />
            </FormField>
          )}
          <FormField label="Descriere (opțional)" htmlFor="anunt-descriere">
            <textarea id="anunt-descriere" rows={3} maxLength={600} className="input resize-none" value={description} onChange={(e) => setDescription(e.target.value)} />
          </FormField>
          <FormField label="Telefon de contact" htmlFor="anunt-telefon">
            <input id="anunt-telefon" type="tel" className="input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="07xx xxx xxx" />
          </FormField>
          <ImagePicker id="anunt-foto" file={image} onChange={setImage} label="Adaugă o poză (opțional)" />
          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Trimite anunțul
          </button>
        </form>
      )}
    </Modal>
  );
}

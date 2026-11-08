import { useState, type FormEvent } from 'react';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { useTable } from '@/lib/useTable';
import { insertRow } from '@/lib/localDb';
import { SESIZARE_TYPES, type SesizareType } from '@/lib/constants';
import { imageToDataUrl, validateImageFile } from '@/lib/storage';
import { adjustPoints } from '@/features/cont/localAccount';
import { getPointsSettings } from '@/features/puncte/pointsSettings';
import { prioritizeSesizare } from '@/features/puncte/purchases';
import type { Sesizare } from '@/features/sesizari/types';
import type { LocalAccount } from '@/features/cont/localAccount';
import Modal from '@/components/Modal';
import FormField from '@/components/FormField';
import ImagePicker from '@/components/ImagePicker';
import SignInPrompt from '@/components/SignInPrompt';

interface SesizareFormProps {
  open: boolean;
  onClose: () => void;
}

export default function SesizareForm({ open, onClose }: SesizareFormProps) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const accounts = useTable<LocalAccount>('conturi');
  const sesizari = useTable<Sesizare>('sesizari');
  const settings = getPointsSettings();
  const points = accounts.find((item) => item.id === user?.id)?.points ?? 0;

  const [type, setType] = useState<SesizareType>('groapa');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [priority, setPriority] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setType('groapa');
    setAddress('');
    setDescription('');
    setPhoto(null);
    setPriority(false);
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
    if (address.trim().length < 5) return setError('Scrie adresa sau reperul, cel puțin 5 caractere.');
    if (description.trim().length < 10) return setError('Descrierea trebuie să aibă cel puțin 10 caractere.');
    if (priority && points < settings.sesizarePrioritara) {
      return setError(`Ai nevoie de ${settings.sesizarePrioritara} puncte pentru sesizare prioritară.`);
    }
    if (photo) {
      const problem = validateImageFile(photo);
      if (problem) return setError(problem);
    }

    setSubmitting(true);
    setError(null);
    try {
      const photoUrl = photo ? await imageToDataUrl(photo) : null;
      const number = sesizari.reduce((max, item) => Math.max(max, item.number), 0) + 1;
      const created = insertRow<Sesizare>('sesizari', {
        id: crypto.randomUUID(),
        number,
        user_id: user.id,
        type,
        address: address.trim(),
        description: description.trim(),
        photo_url: photoUrl,
        status: 'primita',
        aprobare: 'asteptare',
        prioritar_pana_la: null,
        created_at: new Date().toISOString(),
      });
      adjustPoints(user.id, settings.sesizare);
      if (priority) prioritizeSesizare(user.id, created.id);
      showToast(
        priority
          ? `Sesizarea #${number} a fost trimisă ca prioritară. Ai primit ${settings.sesizare} puncte.`
          : `Sesizarea #${number} a fost trimisă. Ai primit ${settings.sesizare} puncte.`,
      );
      reset();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sesizarea nu a putut fi trimisă. Încearcă din nou.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} title="Trimite o sesizare" description="Semnalează o problemă din oraș">
      {!user ? (
        <SignInPrompt message="Trebuie să ai un cont ca să trimiți o sesizare." />
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <FormField label="Tipul problemei" htmlFor="sesizare-tip">
            <select id="sesizare-tip" className="input" value={type} onChange={(e) => setType(e.target.value as SesizareType)}>
              {Object.entries(SESIZARE_TYPES).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Adresa sau reperul" htmlFor="sesizare-adresa">
            <input id="sesizare-adresa" className="input" maxLength={200} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Ex: Str. Unirii, lângă nr. 12" />
          </FormField>
          <FormField label="Descriere" htmlFor="sesizare-descriere" error={error ?? undefined}>
            <textarea id="sesizare-descriere" rows={4} maxLength={500} className="input resize-none" value={description} onChange={(e) => setDescription(e.target.value)} />
          </FormField>
          <ImagePicker id="sesizare-foto" file={photo} onChange={setPhoto} label="Adaugă o poză (opțional)" />

          <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-danger-100 bg-danger-50 p-4">
            <input type="checkbox" className="mt-1 h-4 w-4 accent-danger-600" checked={priority} onChange={(e) => setPriority(e.target.checked)} />
            <span className="text-sm text-neutral-700">
              <span className="font-semibold text-danger-700">Sesizare prioritară · {settings.sesizarePrioritara} puncte</span>
              <br />
              Apare sus, cu eticheta „PRIORITAR / URGENT”, timp de 24 de ore.
            </span>
          </label>

          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Trimite sesizarea
          </button>
        </form>
      )}
    </Modal>
  );
}

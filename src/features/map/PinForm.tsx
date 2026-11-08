import { useState, type FormEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { insertRow } from '@/lib/localDb';
import { PIN_TYPES, type PinType } from '@/lib/constants';
import { authorNameOf } from '@/features/cont/localAccount';
import type { MapPin, PickedPoint } from '@/features/map/types';
import Modal from '@/components/Modal';
import FormField from '@/components/FormField';
import SignInPrompt from '@/components/SignInPrompt';

interface PinFormProps {
  open: boolean;
  point: PickedPoint | null;
  onClose: () => void;
}

export default function PinForm({ open, point, onClose }: PinFormProps) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [type, setType] = useState<PinType>('groapa');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!user || !point) return;
    if (title.trim().length < 3) return setError('Titlul trebuie să aibă cel puțin 3 caractere.');
    const pin: MapPin = {
      id: crypto.randomUUID(),
      user_id: user.id,
      author_name: authorNameOf(user.id),
      type,
      title: title.trim(),
      description: description.trim() || null,
      lat: point.lat,
      lng: point.lng,
      created_at: new Date().toISOString(),
    };
    insertRow<MapPin>('map_pins', pin);
    showToast('Pinul a fost adăugat pe hartă.');
    setTitle('');
    setDescription('');
    setError(null);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Marchează pe hartă" description="Pinul rămâne vizibil pentru vecini">
      {!user ? (
        <SignInPrompt message="Trebuie să ai un cont ca să marchezi ceva pe hartă." />
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <FormField label="Tip" htmlFor="pin-tip">
            <select id="pin-tip" className="input" value={type} onChange={(e) => setType(e.target.value as PinType)}>
              {Object.entries(PIN_TYPES).map(([key, item]) => (
                <option key={key} value={key}>{item.label}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Titlu" htmlFor="pin-titlu" error={error ?? undefined}>
            <input id="pin-titlu" className="input" maxLength={120} value={title} onChange={(e) => setTitle(e.target.value)} />
          </FormField>
          <FormField label="Detalii (opțional)" htmlFor="pin-detalii">
            <textarea id="pin-detalii" rows={3} maxLength={400} className="input resize-none" value={description} onChange={(e) => setDescription(e.target.value)} />
          </FormField>
          <button type="submit" className="btn-primary w-full">Salvează pinul</button>
        </form>
      )}
    </Modal>
  );
}

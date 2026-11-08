import { useState, type FormEvent } from 'react';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { insertRow } from '@/lib/localDb';
import { BUSINESS_CATEGORIES, type BusinessCategory } from '@/lib/constants';
import type { BusinessRegistration } from '@/features/firme/types';
import Modal from '@/components/Modal';
import FormField from '@/components/FormField';
import SignInPrompt from '@/components/SignInPrompt';

interface BusinessRegistrationFormProps {
  open: boolean;
  onClose: () => void;
}

export default function BusinessRegistrationForm({ open, onClose }: BusinessRegistrationFormProps) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [category, setCategory] = useState<BusinessCategory>('Altele');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!user) return;
    if (name.trim().length < 2) return setError('Scrie numele firmei.');
    if (phone.trim().length < 6) return setError('Scrie un număr de telefon valid.');
    if (address.trim().length < 5) return setError('Scrie adresa firmei.');
    if (description.trim().length < 10) return setError('Descrierea trebuie să aibă cel puțin 10 caractere.');

    setSubmitting(true);
    try {
      insertRow<BusinessRegistration>('business_registrations', {
        id: crypto.randomUUID(),
        user_id: user.id,
        name: name.trim(),
        category,
        phone: phone.trim(),
        address: address.trim(),
        description: description.trim(),
        created_at: new Date().toISOString(),
      });
      showToast('Cererea ta a fost trimisă. Vei fi contactat după verificare.');
      setName('');
      setPhone('');
      setAddress('');
      setDescription('');
      setError(null);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Înregistrează o firmă" description="Firma ta apare în director după verificare">
      {!user ? (
        <SignInPrompt message="Trebuie să ai un cont ca să înregistrezi o firmă." />
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <FormField label="Numele firmei" htmlFor="firma-nume">
            <input id="firma-nume" className="input" maxLength={120} value={name} onChange={(e) => setName(e.target.value)} />
          </FormField>
          <FormField label="Categorie" htmlFor="firma-categorie">
            <select id="firma-categorie" className="input" value={category} onChange={(e) => setCategory(e.target.value as BusinessCategory)}>
              {BUSINESS_CATEGORIES.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Telefon" htmlFor="firma-telefon">
            <input id="firma-telefon" type="tel" className="input" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </FormField>
          <FormField label="Adresă" htmlFor="firma-adresa">
            <input id="firma-adresa" className="input" maxLength={200} value={address} onChange={(e) => setAddress(e.target.value)} />
          </FormField>
          <FormField label="Descriere" htmlFor="firma-descriere" error={error ?? undefined}>
            <textarea id="firma-descriere" rows={4} maxLength={1000} className="input resize-none" value={description} onChange={(e) => setDescription(e.target.value)} />
          </FormField>
          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Trimite cererea
          </button>
        </form>
      )}
    </Modal>
  );
}

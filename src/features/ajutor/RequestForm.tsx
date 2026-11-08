import { useState, type FormEvent } from 'react';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { insertRow } from '@/lib/localDb';
import { adjustPoints, authorNameOf } from '@/features/cont/localAccount';
import { getPointsSettings } from '@/features/puncte/pointsSettings';
import type { HelpRequest } from '@/features/ajutor/types';
import Modal from '@/components/Modal';
import FormField from '@/components/FormField';
import SignInPrompt from '@/components/SignInPrompt';

interface RequestFormProps {
  open: boolean;
  onClose: () => void;
}

export default function RequestForm({ open, onClose }: RequestFormProps) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [need, setNeed] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleClose = () => {
    if (submitting) return;
    setNeed('');
    setLocation('');
    setError(null);
    onClose();
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!user) return;
    if (need.trim().length < 10) return setError('Descrie nevoia în cel puțin 10 caractere.');
    if (location.trim().length < 3) return setError('Scrie locația unde ai nevoie de ajutor.');

    setSubmitting(true);
    setError(null);
    try {
      insertRow<HelpRequest>('help_requests', {
        id: crypto.randomUUID(),
        user_id: user.id,
        author_name: authorNameOf(user.id),
        need: need.trim(),
        location: location.trim(),
        status: 'activa',
        aprobare: 'asteptare',
        created_at: new Date().toISOString(),
      });
      const reward = getPointsSettings().ajutor;
      adjustPoints(user.id, reward);
      showToast(`Cererea a fost trimisă spre aprobare. Ai primit ${reward} puncte.`);
      setNeed('');
      setLocation('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Cererea nu a putut fi trimisă. Încearcă din nou.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} title="Cer ajutor" description="Vecinii care pot ajuta te vor contacta">
      {!user ? (
        <SignInPrompt message="Trebuie să ai un cont ca să ceri ajutor." />
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <FormField label="De ce ai nevoie?" htmlFor="ajutor-nevoie">
            <textarea id="ajutor-nevoie" rows={4} maxLength={300} className="input resize-none" value={need} onChange={(e) => setNeed(e.target.value)} placeholder="Ex: Am nevoie de cineva care să facă cumpărături pentru bunica" />
          </FormField>
          <FormField label="Locație" htmlFor="ajutor-locatie" error={error ?? undefined}>
            <input id="ajutor-locatie" className="input" maxLength={120} value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Ex: Bahne, strada Lalelelor" />
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

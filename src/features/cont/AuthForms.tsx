import { useState, type FormEvent } from 'react';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { NEIGHBORHOODS, type Neighborhood } from '@/lib/constants';
import { isValidRomanianPhone, normalizePhone } from '@/lib/validation';
import FormField from '@/components/FormField';

interface Errors {
  name?: string;
  phone?: string;
  village?: string;
  email?: string;
  password?: string;
  form?: string;
}

const VILLAGE = 'Sat din Vrancea';

function validateEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function errorText(err: unknown): string {
  return err instanceof Error ? err.message : 'Ceva nu a mers. Încearcă din nou.';
}

export function SignInForm({ onSwitch }: { onSwitch: () => void }) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Errors>({});

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const next: Errors = {};
    if (!validateEmail(email)) next.email = 'Introdu o adresă de email validă.';
    if (password.length < 6) next.password = 'Parola trebuie să aibă cel puțin 6 caractere.';
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    try {
      signIn(email, password);
    } catch (err) {
      setErrors({ form: errorText(err) });
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <FormField label="Email" htmlFor="signin-email" error={errors.email}>
        <input id="signin-email" type="email" autoComplete="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
      </FormField>
      <FormField label="Parolă" htmlFor="signin-password" error={errors.password}>
        <input id="signin-password" type="password" autoComplete="current-password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
      </FormField>
      {errors.form && <p role="alert" className="text-xs font-semibold text-danger-600">{errors.form}</p>}
      <button type="submit" className="btn-primary w-full">
        Intră în cont
      </button>
      <p className="text-center text-sm text-neutral-600">
        Nu ai cont?{' '}
        <button type="button" onClick={onSwitch} className="font-semibold text-primary-800 underline">Creează unul</button>
      </p>
    </form>
  );
}

export function SignUpForm({ onSwitch }: { onSwitch: () => void }) {
  const { signUp } = useAuth();
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [neighborhood, setNeighborhood] = useState<Neighborhood>('Centru');
  const [village, setVillage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const next: Errors = {};
    if (name.trim().length < 2) next.name = 'Introdu numele tău (minim 2 caractere).';
    if (!isValidRomanianPhone(phone)) next.phone = 'Introdu un număr de telefon românesc valid.';
    if (neighborhood === VILLAGE && village.trim().length < 2) next.village = 'Scrie numele satului tău.';
    if (!validateEmail(email)) next.email = 'Introdu o adresă de email validă.';
    if (password.length < 6) next.password = 'Parola trebuie să aibă cel puțin 6 caractere.';
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setSubmitting(true);
    try {
      signUp({
        name,
        phone: normalizePhone(phone),
        neighborhood,
        village,
        email,
        password,
      });
      showToast('Contul tău a fost creat. Bun venit în Focșani.online!');
    } catch (err) {
      setErrors({ form: errorText(err) });
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <FormField label="Nume" htmlFor="signup-name" error={errors.name}>
        <input id="signup-name" autoComplete="name" className="input" maxLength={60} value={name} onChange={(e) => setName(e.target.value)} />
      </FormField>
      <FormField label="Telefon" htmlFor="signup-phone" error={errors.phone} hint="Nu va fi afișat public">
        <input id="signup-phone" type="tel" autoComplete="tel" className="input" placeholder="0712 345 678" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </FormField>
      <FormField label="Cartier" htmlFor="signup-neighborhood">
        <select id="signup-neighborhood" className="input" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value as Neighborhood)}>
          {NEIGHBORHOODS.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      </FormField>
      {neighborhood === VILLAGE && (
        <FormField label="Numele satului" htmlFor="signup-village" error={errors.village}>
          <input id="signup-village" className="input" maxLength={60} placeholder="Ex: Câmpineanca" value={village} onChange={(e) => setVillage(e.target.value)} />
        </FormField>
      )}
      <FormField label="Email" htmlFor="signup-email" error={errors.email}>
        <input id="signup-email" type="email" autoComplete="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
      </FormField>
      <FormField label="Parolă" htmlFor="signup-password" error={errors.password} hint="Minim 6 caractere">
        <input id="signup-password" type="password" autoComplete="new-password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
      </FormField>
      {errors.form && <p role="alert" className="text-xs font-semibold text-danger-600">{errors.form}</p>}
      <button type="submit" disabled={submitting} className="btn-accent w-full">
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        Creează contul
      </button>
      <p className="text-center text-sm text-neutral-600">
        Ai deja cont?{' '}
        <button type="button" onClick={onSwitch} className="font-semibold text-primary-800 underline">Intră în cont</button>
      </p>
    </form>
  );
}

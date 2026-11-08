import { useNavigate } from 'react-router-dom';
import { Archive, Briefcase, Hammer, HandHeart, Megaphone, MapPin, MessageSquarePlus, TriangleAlert, type LucideIcon } from 'lucide-react';
import Modal from '@/components/Modal';

interface CreateOption {
  label: string;
  description: string;
  to: string;
  icon: LucideIcon;
}

const OPTIONS: CreateOption[] = [
  { label: 'Postare în Focșani Live', description: 'Trafic, evenimente, recomandări', to: '/?nou=1', icon: MessageSquarePlus },
  { label: 'Pin pe hartă', description: 'Groapă, accident, câine pierdut, ajutor', to: '/harta?nou=1', icon: MapPin },
  { label: 'Anunț în Bazar', description: 'Vinzi, cumperi sau dai gratis', to: '/bazar?nou=1', icon: Megaphone },
  { label: 'Cere ajutor ACUM', description: 'Trimite o cerere urgentă', to: '/ajutor', icon: HandHeart },
  { label: 'Sesizare către Primărie', description: 'Groapă, bec ars, gunoi', to: '/sesizari?nou=1', icon: TriangleAlert },
  { label: 'Poză veche pentru Arhivă', description: 'Adaugă un moment din trecut', to: '/arhiva?nou=1', icon: Archive },
  { label: 'Înregistrează-ți firma', description: 'Apari în lista firmelor', to: '/firme?nou=1', icon: Briefcase },
];

interface CreateSheetProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateSheet({ open, onClose }: CreateSheetProps) {
  const navigate = useNavigate();

  const go = (to: string) => {
    onClose();
    navigate(to);
  };

  return (
    <Modal open={open} onClose={onClose} title="Ce vrei să adaugi?" description="Alege o acțiune pentru Focșani">
      <ul className="space-y-2">
        {OPTIONS.map(({ label, description, to, icon: Icon }) => (
          <li key={label}>
            <button
              type="button"
              onClick={() => go(to)}
              className="flex w-full items-center gap-4 rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-left transition hover:border-primary-300 hover:bg-primary-50 active:scale-[0.99]"
            >
              <span className="rounded-xl bg-accent-100 p-2.5 text-primary-800">
                <Icon className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-primary-800">{label}</span>
                <span className="block text-xs text-neutral-500">{description}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </Modal>
  );
}

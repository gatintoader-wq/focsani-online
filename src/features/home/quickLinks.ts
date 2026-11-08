import { Briefcase, HandHeart, Images, Landmark, Megaphone, MapPin, Trophy, type LucideIcon } from 'lucide-react';

export interface QuickLink {
  to: string;
  label: string;
  icon: LucideIcon;
  tone: string;
}

export const QUICK_LINKS: QuickLink[] = [
  { to: '/harta', label: 'Harta Live', icon: MapPin, tone: 'bg-accent-100 text-accent-700' },
  { to: '/bazar', label: 'Bazar', icon: Megaphone, tone: 'bg-secondary-100 text-secondary-700' },
  { to: '/firme', label: 'Firme', icon: Briefcase, tone: 'bg-primary-100 text-primary-800' },
  { to: '/ajutor', label: 'Ajutor ACUM', icon: HandHeart, tone: 'bg-danger-100 text-danger-600' },
  { to: '/sesizari', label: 'Sesizări', icon: Landmark, tone: 'bg-warning-100 text-warning-700' },
  { to: '/arhiva', label: 'Arhiva', icon: Images, tone: 'bg-success-100 text-success-700' },
  { to: '/premii', label: 'Premii', icon: Trophy, tone: 'bg-accent-100 text-accent-700' },
];

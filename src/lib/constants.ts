export const NEIGHBORHOODS = ['Centru', 'Sud', 'Gara', 'Obor', 'Bahne', 'Sat din Vrancea'] as const;
export type Neighborhood = (typeof NEIGHBORHOODS)[number];

export const POST_CATEGORIES = ['Trafic', 'Eveniment', 'Siguranță', 'Utilitate', 'Recomandare', 'General'] as const;
export type PostCategory = (typeof POST_CATEGORIES)[number];

export const POST_CATEGORY_STYLES: Record<PostCategory, string> = {
  Trafic: 'bg-warning-100 text-warning-700',
  Eveniment: 'bg-accent-100 text-accent-700',
  Siguranță: 'bg-danger-100 text-danger-700',
  Utilitate: 'bg-secondary-100 text-secondary-700',
  Recomandare: 'bg-success-100 text-success-700',
  General: 'bg-neutral-100 text-neutral-700',
};

export const PIN_TYPES = {
  groapa: { label: 'Groapă', color: '#B45309' },
  accident: { label: 'Accident', color: '#DC2626' },
  caine: { label: 'Câine pierdut', color: '#0E7490' },
  ajutor: { label: 'Ajutor', color: '#16A34A' },
  eveniment: { label: 'Eveniment', color: '#FFC107' },
} as const;
export type PinType = keyof typeof PIN_TYPES;

export const LISTING_KINDS = {
  vanzare: 'Vânzare',
  cumparare: 'Cumpărare',
  gratis: 'Gratis',
} as const;
export type ListingKind = keyof typeof LISTING_KINDS;

export const LISTING_CATEGORIES = ['Auto', 'Electronice', 'Casă și grădină', 'Modă', 'Copii', 'Altele'] as const;
export type ListingCategory = (typeof LISTING_CATEGORIES)[number];

export const SESIZARE_TYPES = {
  groapa: 'Groapă',
  bec: 'Bec ars',
  gunoi: 'Gunoi',
  altceva: 'Altceva',
} as const;
export type SesizareType = keyof typeof SESIZARE_TYPES;

export const SESIZARE_STATUSES = {
  primita: { label: 'Primită', progress: 15, badge: 'bg-warning-100 text-warning-700', bar: 'bg-warning-500' },
  in_lucru: { label: 'În lucru', progress: 60, badge: 'bg-secondary-100 text-secondary-700', bar: 'bg-secondary-500' },
  rezolvata: { label: 'Rezolvată', progress: 100, badge: 'bg-success-100 text-success-700', bar: 'bg-success-500' },
} as const;
export type SesizareStatus = keyof typeof SESIZARE_STATUSES;

export const TOWN_CENTER = { lat: 45.6957, lng: 27.1829 } as const;

export const FOCSANI_BOUNDS = { latMin: 45.55, latMax: 45.85, lngMin: 27.0, lngMax: 27.35 } as const;

export const DAY_KEYS = ['duminica', 'luni', 'marti', 'miercuri', 'joi', 'vineri', 'sambata'] as const;
export const DAY_LABELS: Record<(typeof DAY_KEYS)[number], string> = {
  luni: 'Luni',
  marti: 'Marți',
  miercuri: 'Miercuri',
  joi: 'Joi',
  vineri: 'Vineri',
  sambata: 'Sâmbătă',
  duminica: 'Duminică',
};
export const BUSINESS_CATEGORIES = ['Cafenea', 'Restaurant', 'Magazin', 'Auto', 'Sănătate', 'Frizerie', 'Servicii', 'Altele'] as const;
export type BusinessCategory = (typeof BUSINESS_CATEGORIES)[number];

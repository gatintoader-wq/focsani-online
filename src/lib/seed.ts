import { writeTable, readTable } from '@/lib/localDb';
import type { Business, BusinessOffer } from '@/features/firme/types';
import type { Reward } from '@/features/premii/types';

const SEED_FLAG = 'focsani.seed-v1';

const BUSINESSES: Business[] = [
  {
    id: 'firma-cafeneaua-unirii',
    name: 'Cafeneaua Unirii',
    category: 'Cafenea',
    description: 'Cafea de specialitate, prăjituri făcute în casă și un colț liniștit în inima orașului, chiar lângă Piața Unirii.',
    address: 'Piața Unirii nr. 5, Focșani',
    phone: '0700 000 001',
    whatsapp: '40700000001',
    hours: { luni: '08:00-22:00', marti: '08:00-22:00', miercuri: '08:00-22:00', joi: '08:00-22:00', vineri: '08:00-23:00', sambata: '09:00-23:00', duminica: '09:00-21:00' },
    photos: [
      'https://images.pexels.com/photos/35518412/pexels-photo-35518412.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/4916548/pexels-photo-4916548.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ],
    created_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'firma-pizzeria-retro',
    name: 'Pizzeria Retro',
    category: 'Restaurant',
    description: 'Pizza în cuptor pe lemne, ingrediente locale și livrare rapidă în tot Focșaniul.',
    address: 'Str. Dunării nr. 14, Focșani',
    phone: '0700 000 002',
    whatsapp: '40700000002',
    hours: { luni: '11:00-22:30', marti: '11:00-22:30', miercuri: '11:00-22:30', joi: '11:00-22:30', vineri: '11:00-23:30', sambata: '11:00-23:30', duminica: '12:00-22:00' },
    photos: [
      'https://images.pexels.com/photos/17626467/pexels-photo-17626467.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/5953552/pexels-photo-5953552.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ],
    created_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'firma-bricolaj-centru',
    name: 'Bricolaj Centru',
    category: 'Magazin',
    description: 'Scule, materiale de construcții, vopsele și consultanță gratuită pentru proiectele tale de acasă.',
    address: 'Bd. Republicii nr. 40, Focșani',
    phone: '0700 000 003',
    whatsapp: '40700000003',
    hours: { luni: '08:00-19:00', marti: '08:00-19:00', miercuri: '08:00-19:00', joi: '08:00-19:00', vineri: '08:00-19:00', sambata: '08:00-15:00' },
    photos: [
      'https://images.pexels.com/photos/735338/pexels-photo-735338.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/12917478/pexels-photo-12917478.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ],
    created_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'firma-service-auto-vrancea',
    name: 'Service Auto Vrancea',
    category: 'Auto',
    description: 'Diagnoză computerizată, schimb de ulei, frâne și reparații generale pentru toate mărcile.',
    address: 'Str. Industriilor nr. 8, Focșani',
    phone: '0700 000 004',
    whatsapp: '40700000004',
    hours: { luni: '08:00-18:00', marti: '08:00-18:00', miercuri: '08:00-18:00', joi: '08:00-18:00', vineri: '08:00-17:00' },
    photos: [
      'https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/4489776/pexels-photo-4489776.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ],
    created_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'firma-farmacia-sfantul-nicolae',
    name: 'Farmacia Sfântul Nicolae',
    category: 'Sănătate',
    description: 'Medicamente, suplimente și farmacist disponibil pentru sfaturi, cu program extins în weekend.',
    address: 'Str. Mihai Viteazu nr. 3, Focșani',
    phone: '0700 000 005',
    whatsapp: '40700000005',
    hours: { luni: '08:00-20:00', marti: '08:00-20:00', miercuri: '08:00-20:00', joi: '08:00-20:00', vineri: '08:00-20:00', sambata: '09:00-18:00', duminica: '09:00-14:00' },
    photos: ['https://images.pexels.com/photos/8667531/pexels-photo-8667531.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'],
    created_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'firma-barbershop-focsani',
    name: 'Barbershop Focșani',
    category: 'Frizerie',
    description: 'Tunsori moderne, bărbierit cu prosopul cald și programare online pentru clienții fideli.',
    address: 'Str. Vrancei nr. 19, Focșani',
    phone: '0700 000 006',
    whatsapp: '40700000006',
    hours: { marti: '10:00-20:00', miercuri: '10:00-20:00', joi: '10:00-20:00', vineri: '10:00-20:00', sambata: '09:00-17:00' },
    photos: [
      'https://images.pexels.com/photos/9146943/pexels-photo-9146943.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/37764947/pexels-photo-37764947.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ],
    created_at: '2026-01-01T00:00:00.000Z',
  },
];

const OFFERS: BusinessOffer[] = [
  { id: 'oferta-cafeneaua-unirii', business_id: 'firma-cafeneaua-unirii', title: 'Cappuccino + croissant', description: 'Doar azi, la 19 lei.', valid_until: '2099-01-01T00:00:00.000Z', created_at: '2026-01-01T00:00:00.000Z' },
  { id: 'oferta-pizzeria-retro', business_id: 'firma-pizzeria-retro', title: 'Pizza Margherita -15%', description: 'Reducere la comenzile luate din local.', valid_until: '2099-01-01T00:00:00.000Z', created_at: '2026-01-01T00:00:00.000Z' },
  { id: 'oferta-service-auto', business_id: 'firma-service-auto-vrancea', title: 'Verificare gratuită', description: 'Diagnoză computerizată gratuită pentru clienții de azi.', valid_until: '2099-01-01T00:00:00.000Z', created_at: '2026-01-01T00:00:00.000Z' },
];

const REWARDS: Reward[] = [
  { id: 'premiu-cafea-gratis', name: 'Cafea gratis', description: 'O cafea la alegere la cafenelele partenere.', cost: 100, active: true },
  { id: 'premiu-reducere-20', name: 'Reducere 20%', description: 'Reducere de 20% la comenzile din firmele partenere.', cost: 200, active: true },
];

export function seedLocalData(): void {
  if (window.localStorage.getItem(SEED_FLAG)) return;
  if (readTable<Business>('businesses').length === 0) writeTable('businesses', BUSINESSES);
  if (readTable<BusinessOffer>('business_offers').length === 0) writeTable('business_offers', OFFERS);
  if (readTable<Reward>('rewards').length === 0) writeTable('rewards', REWARDS);
  window.localStorage.setItem(SEED_FLAG, '1');
}

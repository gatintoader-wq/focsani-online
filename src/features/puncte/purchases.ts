import { spendPoints } from '@/features/cont/localAccount';
import { getPointsSettings } from '@/features/puncte/pointsSettings';
import { readTable, updateRows } from '@/lib/localDb';
import type { Listing } from '@/features/bazar/types';
import type { Sesizare } from '@/features/sesizari/types';

const DAY = 24 * 60 * 60 * 1000;

export function highlightListing(userId: string, listingId: string, days: 3 | 7): void {
  const settings = getPointsSettings();
  const listing = readTable<Listing>('listings').find((item) => item.id === listingId);
  if (!listing || listing.user_id !== userId) throw new Error('Anunțul nu a fost găsit.');
  if (listing.aprobare !== 'aprobat') throw new Error('Poți evidenția doar un anunț aprobat.');

  const cost = days === 3 ? settings.evidentiere3Zile : settings.evidentiere7Zile;
  spendPoints(userId, cost);

  const now = Date.now();
  const current = listing.evidentiat_pana_la ? new Date(listing.evidentiat_pana_la).getTime() : 0;
  const start = Math.max(now, current);
  updateRows<Listing>('listings', (item) => item.id === listingId, {
    evidentiat_pana_la: new Date(start + days * DAY).toISOString(),
  });
}

export function prioritizeSesizare(userId: string, sesizareId: string): void {
  const settings = getPointsSettings();
  spendPoints(userId, settings.sesizarePrioritara);
  updateRows<Sesizare>(
    'sesizari',
    (item) => item.id === sesizareId && item.user_id === userId,
    { prioritar_pana_la: new Date(Date.now() + DAY).toISOString() },
  );
}

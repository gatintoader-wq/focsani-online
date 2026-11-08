import { insertRow, readTable, removeRows, updateRows } from '@/lib/localDb';

export type AdPosition = 'sus' | 'bazar' | 'jos';

export const AD_POSITIONS: Record<AdPosition, string> = {
  sus: 'Sus, pe Acasă',
  bazar: 'Între anunțuri, în Bazar',
  jos: 'Jos, pe pagină',
};

export interface Ad {
  id: string;
  title: string;
  imageUrl: string;
  link: string;
  position: AdPosition;
  active: boolean;
  createdAt: string;
}

export function listAds(): Ad[] {
  return readTable<Ad>('reclame');
}

export function addAd(input: Omit<Ad, 'id' | 'active' | 'createdAt'>): Ad {
  return insertRow<Ad>('reclame', { ...input, id: crypto.randomUUID(), active: true, createdAt: new Date().toISOString() });
}

export function updateAd(id: string, changes: Partial<Pick<Ad, 'active'>>): void {
  updateRows<Ad>('reclame', (ad) => ad.id === id, changes);
}

export function removeAd(id: string): void {
  removeRows<Ad>('reclame', (ad) => ad.id === id);
}

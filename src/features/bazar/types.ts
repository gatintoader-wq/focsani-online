import type { ListingCategory, ListingKind } from '@/lib/constants';
import type { Aprobare } from '@/lib/moderation';

export interface Listing {
  id: string;
  user_id: string;
  author_name: string;
  kind: ListingKind;
  category: ListingCategory;
  title: string;
  price: number | null;
  description: string | null;
  phone: string;
  image_url: string | null;
  created_at: string;
  expires_at: string;
  aprobare: Aprobare;
  evidentiat_pana_la: string | null;
}

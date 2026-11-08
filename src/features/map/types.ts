import type { PinType } from '@/lib/constants';

export interface MapPin {
  id: string;
  user_id: string;
  author_name: string;
  type: PinType;
  title: string;
  description: string | null;
  lat: number;
  lng: number;
  created_at: string;
}

export interface PickedPoint {
  lat: number;
  lng: number;
}

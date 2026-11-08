import type { SesizareStatus, SesizareType } from '@/lib/constants';
import type { Aprobare } from '@/lib/moderation';

export interface Sesizare {
  id: string;
  number: number;
  user_id: string;
  type: SesizareType;
  address: string;
  description: string;
  photo_url: string | null;
  status: SesizareStatus;
  aprobare: Aprobare;
  prioritar_pana_la: string | null;
  created_at: string;
}

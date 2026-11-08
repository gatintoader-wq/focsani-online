import type { Aprobare } from '@/lib/moderation';

export interface ArchivePhoto {
  id: string;
  user_id: string;
  author_name: string;
  image_url: string;
  year: number;
  place: string;
  caption: string | null;
  created_at: string;
  aprobare: Aprobare;
}

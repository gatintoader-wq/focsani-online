import type { Aprobare } from '@/lib/moderation';

export interface HelpRequest {
  id: string;
  user_id: string;
  author_name: string;
  need: string;
  location: string;
  status: 'activa' | 'rezolvata';
  aprobare: Aprobare;
  created_at: string;
}

export interface HelpResponse {
  id: string;
  request_id: string;
  user_id: string;
}

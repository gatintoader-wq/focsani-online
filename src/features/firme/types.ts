import type { BusinessCategory } from '@/lib/constants';

export interface Business {
  id: string;
  name: string;
  category: BusinessCategory;
  description: string;
  address: string;
  phone: string;
  whatsapp: string | null;
  hours: Record<string, string>;
  photos: string[];
  created_at: string;
}

export interface BusinessReview {
  id: string;
  business_id: string;
  user_id: string;
  author_name: string;
  stars: number;
  comment: string | null;
  created_at: string;
}

export interface BusinessOffer {
  id: string;
  business_id: string;
  title: string;
  description: string | null;
  valid_until: string;
  created_at: string;
}

export interface BusinessRegistration {
  id: string;
  user_id: string;
  name: string;
  category: string;
  phone: string;
  address: string;
  description: string;
  created_at: string;
}

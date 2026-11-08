import type { PostCategory } from '@/lib/constants';

export interface Post {
  id: string;
  user_id: string | null;
  author_name: string;
  category: PostCategory;
  content: string;
  image_url: string | null;
  created_at: string;
}

export interface PostLike {
  id: string;
  post_id: string;
  user_id: string;
}

export interface PostComment {
  id: string;
  post_id: string;
  user_id: string;
  author_name: string;
  body: string;
  created_at: string;
}

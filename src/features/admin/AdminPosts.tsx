import { Trash2 } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';
import { useTable } from '@/lib/useTable';
import { removeRows } from '@/lib/localDb';
import { timeAgo } from '@/lib/format';
import type { Post, PostComment, PostLike } from '@/features/feed/types';
import Avatar from '@/components/Avatar';

export default function AdminPosts() {
  const { showToast } = useToast();
  const posts = useTable<Post>('posts');

  const sorted = [...posts].sort((a, b) => b.created_at.localeCompare(a.created_at));

  const deletePost = (post: Post) => {
    if (!window.confirm('Ștergi această postare?')) return;
    removeRows<Post>('posts', (item) => item.id === post.id);
    removeRows<PostLike>('post_likes', (like) => like.post_id === post.id);
    removeRows<PostComment>('post_comments', (comment) => comment.post_id === post.id);
    showToast('Postarea a fost ștearsă.');
  };

  return (
    <div className="space-y-3">
      {sorted.length === 0 && <p className="text-sm text-neutral-500">Nu există postări.</p>}
      {sorted.map((post) => (
        <article key={post.id} className="card flex gap-3 p-4">
          <Avatar name={post.author_name} size="sm" />
          <div className="min-w-0 flex-1 space-y-2">
            <p className="text-sm">
              <span className="font-semibold text-primary-800">{post.author_name}</span>
              <span className="text-xs text-neutral-500"> · {post.category} · {timeAgo(post.created_at)}</span>
            </p>
            <p className="whitespace-pre-line break-words text-sm text-neutral-700">{post.content}</p>
            {post.image_url && <img src={post.image_url} alt="" className="max-h-48 rounded-xl object-cover" />}
          </div>
          <button type="button" onClick={() => deletePost(post)} aria-label="Șterge postarea" className="btn-ghost h-9 shrink-0 px-3 text-danger-600">
            <Trash2 className="h-4 w-4" />
          </button>
        </article>
      ))}
    </div>
  );
}

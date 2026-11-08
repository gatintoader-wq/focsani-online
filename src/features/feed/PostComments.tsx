import { useState, type FormEvent } from 'react';
import { Send, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { useTable } from '@/lib/useTable';
import { insertRow, removeRows } from '@/lib/localDb';
import { adjustPoints, authorNameOf } from '@/features/cont/localAccount';
import { getPointsSettings } from '@/features/puncte/pointsSettings';
import { timeAgo } from '@/lib/format';
import Avatar from '@/components/Avatar';
import type { PostComment } from '@/features/feed/types';

export default function PostComments({ postId }: { postId: string }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const allComments = useTable<PostComment>('post_comments');
  const comments = allComments
    .filter((comment) => comment.post_id === postId)
    .sort((a, b) => a.created_at.localeCompare(b.created_at));
  const [body, setBody] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!user) return;
    const trimmed = body.trim();
    if (trimmed.length < 2) return setError('Scrie cel puțin 2 caractere.');
    if (trimmed.length > 300) return setError('Comentariul nu poate depăși 300 de caractere.');
    try {
      insertRow<PostComment>('post_comments', {
        id: crypto.randomUUID(),
        post_id: postId,
        user_id: user.id,
        author_name: authorNameOf(user.id),
        body: trimmed,
        created_at: new Date().toISOString(),
      });
      const reward = getPointsSettings().comentariu;
      adjustPoints(user.id, reward);
      showToast(`Comentariu adăugat. Ai primit ${reward} puncte.`);
      setBody('');
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Comentariul nu a putut fi salvat.');
    }
  };

  const deleteComment = (id: string) => {
    removeRows<PostComment>('post_comments', (comment) => comment.id === id);
  };

  return (
    <div className="space-y-3 rounded-2xl bg-neutral-50 p-3">
      {comments.length === 0 && <p className="text-xs text-neutral-500">Fii primul care comentează.</p>}
      {comments.map((comment) => (
        <div key={comment.id} className="flex gap-2.5">
          <Avatar name={comment.author_name} size="sm" />
          <div className="min-w-0 flex-1 rounded-2xl bg-white p-2.5 shadow-sm">
            <div className="flex items-center gap-2">
              <p className="truncate text-xs font-semibold text-primary-800">{comment.author_name}</p>
              <span className="text-[11px] text-neutral-400">{timeAgo(comment.created_at)}</span>
              {user?.id === comment.user_id && (
                <button type="button" onClick={() => deleteComment(comment.id)} aria-label="Șterge comentariul" className="ml-auto text-neutral-400 hover:text-danger-600">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <p className="mt-0.5 whitespace-pre-line text-sm text-neutral-800">{comment.body}</p>
          </div>
        </div>
      ))}
      {user ? (
        <form onSubmit={handleSubmit} noValidate className="space-y-1.5">
          <div className="flex gap-2">
            <input
              aria-label="Scrie un comentariu"
              className="input py-2"
              placeholder="Scrie un comentariu"
              maxLength={300}
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
            <button type="submit" aria-label="Trimite comentariul" className="btn-primary px-3">
              <Send className="h-4 w-4" />
            </button>
          </div>
          {error && <p role="alert" className="text-xs font-semibold text-danger-600">{error}</p>}
        </form>
      ) : (
        <p className="text-xs text-neutral-500">Conectează-te ca să comentezi.</p>
      )}
    </div>
  );
}

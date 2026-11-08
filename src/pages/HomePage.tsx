import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, MessageSquareText, Plus, Search, Trash2, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { useTable } from '@/lib/useTable';
import { insertRow, removeRows } from '@/lib/localDb';
import { useAutoOpen } from '@/lib/useAutoOpen';
import { POST_CATEGORIES, POST_CATEGORY_STYLES, type PostCategory } from '@/lib/constants';
import { timeAgo } from '@/lib/format';
import { imageToDataUrl, validateImageFile } from '@/lib/storage';
import { authorNameOf } from '@/features/cont/localAccount';
import Avatar from '@/components/Avatar';
import Modal from '@/components/Modal';
import FormField from '@/components/FormField';
import ImagePicker from '@/components/ImagePicker';
import SignInPrompt from '@/components/SignInPrompt';
import EmptyState from '@/components/EmptyState';
import AdSlot from '@/components/AdSlot';
import PostComments from '@/features/feed/PostComments';
import { QUICK_LINKS } from '@/features/home/quickLinks';
import type { Post, PostComment, PostLike } from '@/features/feed/types';

const FILTERS = ['Toate', ...POST_CATEGORIES] as const;
type Filter = (typeof FILTERS)[number];

function PostCard({
  post,
  likes,
  commentCount,
  onToggleLike,
}: {
  post: Post;
  likes: PostLike[];
  commentCount: number;
  onToggleLike: () => void;
}) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [showComments, setShowComments] = useState(false);
  const liked = user ? likes.some((like) => like.user_id === user.id) : false;

  const deletePost = () => {
    if (!window.confirm('Ștergi această postare?')) return;
    removeRows<Post>('posts', (item) => item.id === post.id);
    removeRows<PostLike>('post_likes', (like) => like.post_id === post.id);
    removeRows<PostComment>('post_comments', (comment) => comment.post_id === post.id);
    showToast('Postarea a fost ștearsă.');
  };

  return (
    <article className="card space-y-3 p-4">
      <header className="flex items-center gap-3">
        <Avatar name={post.author_name} size="md" tone={post.user_id ? 'primary' : 'accent'} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-primary-800">{post.author_name}</p>
          <p className="text-xs text-neutral-500">{timeAgo(post.created_at)}</p>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${POST_CATEGORY_STYLES[post.category]}`}>
          {post.category}
        </span>
      </header>

      <p className="whitespace-pre-line text-sm leading-relaxed text-neutral-800">{post.content}</p>

      {post.image_url && (
        <img src={post.image_url} alt={post.content.slice(0, 60)} loading="lazy" className="aspect-[4/3] w-full rounded-2xl object-cover" />
      )}

      <footer className="flex items-center gap-1 border-t border-neutral-100 pt-2">
        <button
          type="button"
          onClick={() => (user ? onToggleLike() : showToast('Conectează-te pentru a da like.', 'error'))}
          aria-pressed={liked}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition hover:bg-danger-50 active:scale-95 ${
            liked ? 'text-danger-600' : 'text-neutral-500'
          }`}
        >
          <Heart className={`h-4.5 w-4.5 transition ${liked ? 'fill-danger-500' : ''}`} />
          {likes.length}
        </button>
        <button
          type="button"
          onClick={() => setShowComments((value) => !value)}
          aria-expanded={showComments}
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold text-neutral-500 transition hover:bg-primary-50 active:scale-95"
        >
          <MessageCircle className="h-4.5 w-4.5" />
          {commentCount}
        </button>
        {user && user.id === post.user_id && (
          <button
            type="button"
            onClick={deletePost}
            aria-label="Șterge postarea"
            className="ml-auto rounded-full p-2 text-neutral-400 transition hover:bg-danger-50 hover:text-danger-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </footer>

      {showComments && <PostComments postId={post.id} />}
    </article>
  );
}

function PostComposer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [category, setCategory] = useState<PostCategory>('General');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setCategory('General');
    setContent('');
    setImage(null);
    setError(null);
  };

  const handleClose = () => {
    if (submitting) return;
    reset();
    onClose();
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!user) return;
    const trimmed = content.trim();
    if (trimmed.length < 3) return setError('Scrie cel puțin 3 caractere.');
    if (trimmed.length > 500) return setError('Postarea nu poate depăși 500 de caractere.');
    if (image) {
      const problem = validateImageFile(image);
      if (problem) return setError(problem);
    }

    setSubmitting(true);
    setError(null);
    try {
      const imageUrl = image ? await imageToDataUrl(image) : null;
      insertRow<Post>('posts', {
        id: crypto.randomUUID(),
        user_id: user.id,
        author_name: authorNameOf(user.id),
        category,
        content: trimmed,
        image_url: imageUrl,
        created_at: new Date().toISOString(),
      });
      showToast('Postarea ta a fost publicată.');
      reset();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Postarea nu a putut fi publicată. Încearcă din nou.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} title="Postează în Focșani Live" description="Spune vecinilor ce se întâmplă în oraș">
      {!user ? (
        <SignInPrompt message="Trebuie să ai un cont ca să publici o postare." />
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <FormField label="Categorie" htmlFor="post-category">
            <select id="post-category" className="input" value={category} onChange={(e) => setCategory(e.target.value as PostCategory)}>
              {POST_CATEGORIES.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Ce se întâmplă?" htmlFor="post-content" error={error ?? undefined} hint={`${content.length}/500 caractere`}>
            <textarea
              id="post-content"
              rows={4}
              maxLength={500}
              className="input resize-none"
              placeholder="Ex: Coadă mare la sensul giratoriu din Piața Unirii"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </FormField>
          <ImagePicker id="post-image" file={image} onChange={setImage} label="Adaugă o poză (opțional)" />
          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Publică postarea
          </button>
        </form>
      )}
    </Modal>
  );
}

export default function HomePage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [composerOpen, setComposerOpen] = useAutoOpen();
  const posts = useTable<Post>('posts');
  const likes = useTable<PostLike>('post_likes');
  const comments = useTable<PostComment>('post_comments');
  const [filter, setFilter] = useState<Filter>('Toate');
  const [search, setSearch] = useState('');

  const sortedPosts = [...posts].sort((a, b) => b.created_at.localeCompare(a.created_at));
  const query = search.trim().toLowerCase();
  const visible = sortedPosts.filter((post) => {
    if (filter !== 'Toate' && post.category !== filter) return false;
    if (!query) return true;
    return post.content.toLowerCase().includes(query) || post.author_name.toLowerCase().includes(query);
  });

  const toggleLike = (post: Post) => {
    if (!user) return;
    const existing = likes.find((like) => like.post_id === post.id && like.user_id === user.id);
    if (existing) {
      removeRows<PostLike>('post_likes', (like) => like.id === existing.id);
    } else {
      insertRow<PostLike>('post_likes', { id: crypto.randomUUID(), post_id: post.id, user_id: user.id });
    }
  };

  return (
    <div className="space-y-5 px-5 pt-5">
      <section className="overflow-hidden rounded-3xl bg-primary-800 p-5 text-white shadow-lg shadow-primary-900/20">
        <p className="text-sm text-primary-200">Bun venit{user ? '' : ' în Focșani'}</p>
        <h1 className="mt-1 text-2xl font-bold">Focșani Live</h1>
        <p className="mt-1 text-sm text-primary-100">Ce se întâmplă în oraș, chiar acum.</p>
        <button type="button" onClick={() => setComposerOpen(true)} className="btn-accent mt-4 w-full">
          <Plus className="h-4 w-4" strokeWidth={2.6} />
          Postează
        </button>
      </section>

      <AdSlot position="sus" />

      <section aria-label="Servicii" className="grid grid-cols-3 gap-3">
        {QUICK_LINKS.map(({ to, label, icon: Icon, tone }) => (
          <Link
            key={to}
            to={to}
            className="card flex flex-col items-center gap-2 px-2 py-4 text-center transition hover:-translate-y-0.5 hover:shadow-md active:scale-95"
          >
            <span className={`rounded-2xl p-2.5 ${tone}`}>
              <Icon className="h-5 w-5" />
            </span>
            <span className="text-xs font-semibold text-primary-800">{label}</span>
          </Link>
        ))}
      </section>

      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-neutral-400" />
        <input
          type="search"
          aria-label="Caută în postări"
          placeholder="Caută în postări sau nume"
          className="input pl-11"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {FILTERS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={`chip ${filter === item ? 'chip-active' : 'chip-idle'}`}
            aria-pressed={filter === item}
          >
            {item}
          </button>
        ))}
      </div>

      <section className="space-y-4 pb-4">
        {visible.length === 0 && (
          <EmptyState
            icon={MessageSquareText}
            title={posts.length === 0 ? 'Încă nu există postări' : 'Nicio postare nu se potrivește'}
            description={posts.length === 0 ? 'Fii primul care postează ceva din Focșani.' : 'Schimbă filtrul sau căutarea.'}
          />
        )}
        {visible.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            likes={likes.filter((like) => like.post_id === post.id)}
            commentCount={comments.filter((comment) => comment.post_id === post.id).length}
            onToggleLike={() => toggleLike(post)}
          />
        ))}
      </section>

      <AdSlot position="jos" />

      <PostComposer open={composerOpen} onClose={() => setComposerOpen(false)} />
    </div>
  );
}

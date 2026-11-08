import { useState, type FormEvent } from 'react';
import { Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { useTable } from '@/lib/useTable';
import { insertRow } from '@/lib/localDb';
import { timeAgo } from '@/lib/format';
import { authorNameOf } from '@/features/cont/localAccount';
import type { BusinessReview } from '@/features/firme/types';

interface ReviewSectionProps {
  businessId: string;
}

export default function ReviewSection({ businessId }: ReviewSectionProps) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const reviews = useTable<BusinessReview>('business_reviews').filter((item) => item.business_id === businessId);
  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string | null>(null);

  const average = reviews.length ? reviews.reduce((sum, item) => sum + item.stars, 0) / reviews.length : null;
  const alreadyReviewed = !!user && reviews.some((item) => item.user_id === user.id);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!user) return;
    if (alreadyReviewed) return setError('Ai lăsat deja o recenzie pentru această firmă.');
    if (comment.trim().length > 500) return setError('Comentariul nu poate depăși 500 de caractere.');
    insertRow<BusinessReview>('business_reviews', {
      id: crypto.randomUUID(),
      business_id: businessId,
      user_id: user.id,
      author_name: authorNameOf(user.id),
      stars,
      comment: comment.trim() || null,
      created_at: new Date().toISOString(),
    });
    setComment('');
    setError(null);
    showToast('Recenzia ta a fost publicată.');
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <Star className="h-5 w-5 fill-accent-500 text-accent-500" />
        <h2 className="text-lg font-bold text-primary-800">
          {average === null ? 'Fără recenzii' : `${average.toFixed(1)} din 5`}
        </h2>
        <span className="text-sm text-neutral-500">({reviews.length})</span>
      </div>

      {reviews.map((item) => (
        <div key={item.id} className="card space-y-1.5 p-4">
          <div className="flex items-center gap-2">
            <p className="min-w-0 flex-1 truncate text-sm font-semibold text-primary-800">{item.author_name}</p>
            <p className="text-xs text-accent-700">{'★'.repeat(item.stars)}</p>
          </div>
          {item.comment && <p className="text-sm text-neutral-700">{item.comment}</p>}
          <p className="text-xs text-neutral-400">{timeAgo(item.created_at)}</p>
        </div>
      ))}

      {!user && <p className="text-sm text-neutral-500">Conectează-te ca să lași o recenzie.</p>}
      {user && !alreadyReviewed && (
        <form onSubmit={handleSubmit} noValidate className="card space-y-3 p-4">
          <div className="flex gap-1" role="radiogroup" aria-label="Numărul de stele">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={stars === value}
                aria-label={`${value} stele`}
                onClick={() => setStars(value)}
                className="rounded-full p-1 transition hover:scale-110"
              >
                <Star className={`h-6 w-6 ${value <= stars ? 'fill-accent-500 text-accent-500' : 'text-neutral-300'}`} />
              </button>
            ))}
          </div>
          <textarea
            aria-label="Comentariu"
            rows={3}
            maxLength={500}
            className="input resize-none"
            placeholder="Cum a fost experiența ta?"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          {error && <p role="alert" className="text-xs font-semibold text-danger-600">{error}</p>}
          <button type="submit" className="btn-primary w-full">Publică recenzia</button>
        </form>
      )}
    </section>
  );
}

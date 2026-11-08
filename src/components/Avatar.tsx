import { getInitials } from '@/lib/format';

interface AvatarProps {
  name: string | null | undefined;
  size?: 'sm' | 'md' | 'lg';
  tone?: 'primary' | 'accent';
}

const SIZES = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-20 w-20 text-2xl',
};

export default function Avatar({ name, size = 'md', tone = 'primary' }: AvatarProps) {
  const toneClass = tone === 'primary' ? 'bg-primary-800 text-white' : 'bg-accent-500 text-primary-800';
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-bold ${SIZES[size]} ${toneClass}`}
      aria-hidden="true"
    >
      {name ? getInitials(name) : 'FO'}
    </span>
  );
}

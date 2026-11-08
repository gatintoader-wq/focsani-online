import { DAY_KEYS } from '@/lib/constants';

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('ro-RO', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function timeAgo(iso: string): string {
  const diff = Math.max(0, Date.now() - new Date(iso).getTime());
  if (diff < MINUTE) return 'chiar acum';
  if (diff < HOUR) return `acum ${Math.floor(diff / MINUTE)} min`;
  if (diff < DAY) {
    const hours = Math.floor(diff / HOUR);
    return `acum ${hours} ${hours === 1 ? 'oră' : 'ore'}`;
  }
  if (diff < 7 * DAY) {
    const days = Math.floor(diff / DAY);
    return `acum ${days} ${days === 1 ? 'zi' : 'zile'}`;
  }
  return formatDate(iso);
}

export function daysUntil(iso: string): number {
  return Math.max(0, Math.ceil((new Date(iso).getTime() - Date.now()) / DAY));
}

export function formatPrice(price: number | null, kind: string): string {
  if (kind === 'gratis' || price === null) return 'Gratis';
  return `${price.toLocaleString('ro-RO', { maximumFractionDigits: 2 })} lei`;
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

export function isOpenNow(hours: Record<string, string>, now: Date = new Date()): boolean {
  const range = hours[DAY_KEYS[now.getDay()]];
  if (!range) return false;
  const [start, end] = range.split('-');
  const current = now.getHours() * 60 + now.getMinutes();
  return current >= toMinutes(start) && current < toMinutes(end);
}

export type TableName =
  | 'conturi'
  | 'posts'
  | 'post_likes'
  | 'post_comments'
  | 'listings'
  | 'map_pins'
  | 'help_requests'
  | 'help_responses'
  | 'sesizari'
  | 'archive_photos'
  | 'business_reviews'
  | 'business_registrations'
  | 'redemptions'
  | 'reclame'
  | 'businesses'
  | 'business_offers'
  | 'rewards';

const KEY_PREFIX = 'focsani.db.';
const CHANGE_EVENT = 'focsani:db';
const STORAGE_FULL_MESSAGE = 'Spațiul de stocare din browser este plin. Încearcă o poză mai mică sau șterge conținut vechi.';

export function readTable<T>(table: TableName): T[] {
  try {
    const raw = window.localStorage.getItem(KEY_PREFIX + table);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

export function writeTable<T>(table: TableName, rows: T[]): void {
  try {
    window.localStorage.setItem(KEY_PREFIX + table, JSON.stringify(rows));
  } catch {
    throw new Error(STORAGE_FULL_MESSAGE);
  }
  window.dispatchEvent(new CustomEvent<TableName>(CHANGE_EVENT, { detail: table }));
}

export function insertRow<T extends { id: string }>(table: TableName, row: T): T {
  writeTable<T>(table, [...readTable<T>(table), row]);
  return row;
}

export function updateRows<T extends { id: string }>(table: TableName, match: (row: T) => boolean, changes: Partial<T>): void {
  writeTable<T>(table, readTable<T>(table).map((row) => (match(row) ? { ...row, ...changes } : row)));
}

export function removeRows<T extends { id: string }>(table: TableName, match: (row: T) => boolean): void {
  writeTable<T>(table, readTable<T>(table).filter((row) => !match(row)));
}

export function subscribeTable(table: TableName, callback: () => void): () => void {
  const onLocalChange = (event: Event) => {
    if ((event as CustomEvent<TableName>).detail === table) callback();
  };
  const onOtherTab = (event: StorageEvent) => {
    if (event.key === KEY_PREFIX + table) callback();
  };
  window.addEventListener(CHANGE_EVENT, onLocalChange);
  window.addEventListener('storage', onOtherTab);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onLocalChange);
    window.removeEventListener('storage', onOtherTab);
  };
}

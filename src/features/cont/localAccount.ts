import type { Neighborhood } from '@/lib/constants';
import { insertRow, readTable, updateRows } from '@/lib/localDb';

export interface LocalAccount {
  id: string;
  name: string;
  phone: string;
  neighborhood: Neighborhood;
  village: string;
  email: string;
  password: string;
  points: number;
  blocked: boolean;
  role?: 'user' | 'admin';
  createdAt: string;
}

export interface CreateAccountInput {
  name: string;
  phone: string;
  neighborhood: Neighborhood;
  village: string;
  email: string;
  password: string;
}

const SESSION_KEY = 'focsani.sesiune';
const ADMIN_ACCOUNT_NAME = 'Mihaita Voicu';
const ADMIN_GRANT_FLAG = 'focsani.admin-grant-v1';

export function listAccounts(): LocalAccount[] {
  return readTable<LocalAccount>('conturi');
}

export function getSessionId(): string | null {
  return window.localStorage.getItem(SESSION_KEY);
}

export function clearSession(): void {
  window.localStorage.removeItem(SESSION_KEY);
}

export function createAccount(input: CreateAccountInput): LocalAccount {
  const email = input.email.trim().toLowerCase();
  if (listAccounts().some((account) => account.email === email)) {
    throw new Error('Există deja un cont cu acest email. Intră în cont.');
  }
  const account = insertRow<LocalAccount>('conturi', {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    phone: input.phone,
    neighborhood: input.neighborhood,
    village: input.neighborhood === 'Sat din Vrancea' ? input.village.trim() : '',
    email,
    password: input.password,
    points: 0,
    blocked: false,
    role: 'user',
    createdAt: new Date().toISOString(),
  });
  window.localStorage.setItem(SESSION_KEY, account.id);
  return account;
}

export function signInAccount(email: string, password: string): LocalAccount {
  const normalized = email.trim().toLowerCase();
  const account = listAccounts().find((item) => item.email === normalized);
  if (!account || account.password !== password) {
    throw new Error('Email sau parolă greșită.');
  }
  if (account.blocked) {
    throw new Error('Acest cont a fost blocat. Contactează administratorul.');
  }
  window.localStorage.setItem(SESSION_KEY, account.id);
  return account;
}

export function updateAccount(id: string, changes: Partial<Pick<LocalAccount, 'points' | 'blocked' | 'role'>>): void {
  updateRows<LocalAccount>('conturi', (account) => account.id === id, changes);
}

export function adjustPoints(id: string, delta: number): void {
  const account = listAccounts().find((item) => item.id === id);
  if (!account) return;
  updateAccount(id, { points: Math.max(0, account.points + delta) });
}

export function spendPoints(id: string, cost: number): void {
  const account = listAccounts().find((item) => item.id === id);
  if (!account) throw new Error('Trebuie să fii conectat pentru a folosi punctele.');
  if (account.points < cost) throw new Error(`Nu ai destule puncte. Îți trebuie ${cost}, ai ${account.points}.`);
  updateAccount(id, { points: account.points - cost });
}

export function isAdminAccount(account: Pick<LocalAccount, 'role'> | undefined): boolean {
  return account?.role === 'admin';
}

function normalizeName(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();
}

export function grantAdminToNamedAccount(): void {
  if (window.localStorage.getItem(ADMIN_GRANT_FLAG)) return;
  const target = normalizeName(ADMIN_ACCOUNT_NAME);
  const account = listAccounts().find((item) => normalizeName(item.name) === target);
  if (!account) return;
  updateAccount(account.id, { role: 'admin' });
  window.localStorage.setItem(ADMIN_GRANT_FLAG, 'true');
}

export function formatLocation(account: Pick<LocalAccount, 'neighborhood' | 'village'>): string {
  return account.neighborhood === 'Sat din Vrancea' && account.village
    ? `Sat din Vrancea · ${account.village}`
    : account.neighborhood;
}

export function authorNameOf(userId: string | null): string {
  if (!userId) return 'Vecin';
  return listAccounts().find((account) => account.id === userId)?.name ?? 'Vecin';
}

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Neighborhood } from '@/lib/constants';
import { useTable } from '@/lib/useTable';
import {
  clearSession,
  createAccount,
  getSessionId,
  signInAccount,
  type CreateAccountInput,
  type LocalAccount,
} from '@/features/cont/localAccount';

export interface Profile {
  id: string;
  name: string;
  neighborhood: Neighborhood;
  points: number;
  created_at: string;
}

export interface AuthUser {
  id: string;
  email: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  profile: Profile | null;
  signIn: (email: string, password: string) => void;
  signUp: (input: CreateAccountInput) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function toProfile(account: LocalAccount): Profile {
  return {
    id: account.id,
    name: account.name,
    neighborhood: account.neighborhood,
    points: account.points,
    created_at: account.createdAt,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const accounts = useTable<LocalAccount>('conturi');
  const [sessionId, setSessionId] = useState<string | null>(() => getSessionId());

  const account = accounts.find((item) => item.id === sessionId && !item.blocked) ?? null;

  const value = useMemo<AuthContextValue>(
    () => ({
      user: account ? { id: account.id, email: account.email } : null,
      profile: account ? toProfile(account) : null,
      signIn: (email, password) => setSessionId(signInAccount(email, password).id),
      signUp: (input) => setSessionId(createAccount(input).id),
      signOut: () => {
        clearSession();
        setSessionId(null);
      },
    }),
    [account],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth trebuie folosit în interiorul AuthProvider');
  return context;
}

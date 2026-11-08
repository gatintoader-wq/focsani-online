import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { CheckCircle2, CircleAlert } from 'lucide-react';

type Tone = 'success' | 'error';

interface ToastState {
  id: number;
  message: string;
  tone: Tone;
}

interface ToastContextValue {
  showToast: (message: string, tone?: Tone) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = useCallback((message: string, tone: Tone = 'success') => {
    setToast({ id: Date.now(), message, tone });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast && (
        <div
          key={toast.id}
          role="status"
          aria-live="polite"
          className="fixed inset-x-0 top-4 z-[60] mx-auto w-[calc(100%-2rem)] max-w-sm animate-toast-in"
        >
          <div
            className={`flex items-start gap-3 rounded-2xl px-4 py-3 text-sm font-semibold shadow-xl ${
              toast.tone === 'success' ? 'bg-success-600 text-white' : 'bg-danger-600 text-white'
            }`}
          >
            {toast.tone === 'success' ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
            ) : (
              <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast trebuie folosit în interiorul ToastProvider');
  return context;
}

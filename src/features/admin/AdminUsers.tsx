import { useState, type FormEvent } from 'react';
import { Ban, CircleCheck } from 'lucide-react';
import Avatar from '@/components/Avatar';
import Modal from '@/components/Modal';
import FormField from '@/components/FormField';
import { adjustPoints, formatLocation, listAccounts, updateAccount, type LocalAccount } from '@/features/cont/localAccount';

export default function AdminUsers() {
  const [accounts, setAccounts] = useState<LocalAccount[]>(() => listAccounts());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [exactValue, setExactValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  const refresh = () => setAccounts(listAccounts());
  const editing = accounts.find((account) => account.id === editingId) ?? null;

  const toggleBlocked = (account: LocalAccount) => {
    updateAccount(account.id, { blocked: !account.blocked });
    refresh();
  };

  const openEditor = (account: LocalAccount) => {
    setEditingId(account.id);
    setExactValue(String(account.points));
    setError(null);
  };

  const handleClose = () => {
    setEditingId(null);
    setError(null);
  };

  const applyDelta = (delta: number) => {
    if (!editing) return;
    adjustPoints(editing.id, delta);
    refresh();
    setExactValue(String(Math.max(0, editing.points + delta)));
  };

  const handleSetExact = (event: FormEvent) => {
    event.preventDefault();
    if (!editing) return;
    const value = Number(exactValue);
    if (!Number.isInteger(value) || value < 0) {
      setError('Introdu un număr întreg, 0 sau mai mare.');
      return;
    }
    updateAccount(editing.id, { points: value });
    refresh();
    setError(null);
  };

  return (
    <div className="space-y-4">
      {accounts.length === 0 ? (
        <p className="card p-5 text-sm text-neutral-600">Încă nu există conturi create.</p>
      ) : (
        <ul className="space-y-3">
          {accounts.map((account) => (
            <li key={account.id} className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <Avatar name={account.name} size="sm" />
                <div className="min-w-0">
                  <p className="truncate font-bold text-primary-800">
                    {account.name}
                    {account.blocked && <span className="ml-2 rounded-full bg-danger-100 px-2 py-0.5 text-[11px] text-danger-700">Blocat</span>}
                  </p>
                  <p className="truncate text-xs text-neutral-500">{account.email}</p>
                  <p className="truncate text-xs text-neutral-500">{formatLocation(account)} · {account.points} puncte</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => openEditor(account)} className="btn-ghost flex-1 sm:flex-none">
                  Editează puncte
                </button>
                <button type="button" onClick={() => toggleBlocked(account)} className="btn-ghost flex-1 sm:flex-none">
                  {account.blocked ? <CircleCheck className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                  {account.blocked ? 'Deblochează' : 'Blochează'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal open={editing !== null} onClose={handleClose} title="Editează punctele" description={editing?.name}>
        {editing && (
          <div className="space-y-5">
            <p className="text-sm text-neutral-700">
              Puncte actuale: <span className="font-bold text-primary-800">{editing.points}</span>
            </p>
            <form onSubmit={handleSetExact} noValidate className="space-y-3">
              <FormField label="Setează exact" htmlFor="admin-points-exact" error={error ?? undefined}>
                <input id="admin-points-exact" type="number" min={0} className="input" value={exactValue} onChange={(e) => setExactValue(e.target.value)} />
              </FormField>
              <button type="submit" className="btn-primary w-full">Salvează</button>
            </form>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => applyDelta(-10)} className="btn-ghost">-10</button>
              <button type="button" onClick={() => applyDelta(10)} className="btn-ghost">+10</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

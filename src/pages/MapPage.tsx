import { useState } from 'react';
import { MapPinned, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { useTable } from '@/lib/useTable';
import { removeRows } from '@/lib/localDb';
import { PIN_TYPES } from '@/lib/constants';
import { timeAgo } from '@/lib/format';
import type { MapPin, PickedPoint } from '@/features/map/types';
import MapCanvas from '@/features/map/MapCanvas';
import PinForm from '@/features/map/PinForm';
import PageHeader from '@/components/PageHeader';
import Modal from '@/components/Modal';

export default function MapPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const pins = useTable<MapPin>('map_pins');
  const [placing, setPlacing] = useState(false);
  const [point, setPoint] = useState<PickedPoint | null>(null);
  const [selected, setSelected] = useState<MapPin | null>(null);

  const handleMapClick = (lat: number, lng: number) => {
    if (!placing) return;
    setPoint({ lat, lng });
    setPlacing(false);
  };

  const deletePin = (pin: MapPin) => {
    if (!window.confirm('Ștergi acest pin?')) return;
    removeRows<MapPin>('map_pins', (item) => item.id === pin.id);
    setSelected(null);
    showToast('Pinul a fost șters.');
  };

  return (
    <div className="flex h-full flex-col gap-4 px-5 pb-4 pt-5">
      <PageHeader
        title="Harta Live"
        subtitle="Ce se întâmplă acum în Focșani"
        action={
          <button type="button" onClick={() => setPlacing((value) => !value)} className={placing ? 'btn-ghost px-4 py-2 text-sm' : 'btn-accent px-4 py-2 text-sm'}>
            <MapPinned className="h-4 w-4" />
            {placing ? 'Anulează' : 'Adaugă pin'}
          </button>
        }
      />
      {placing && <p className="rounded-2xl bg-accent-50 px-4 py-3 text-sm font-semibold text-primary-800">Apasă pe hartă locul problemei sau evenimentului.</p>}
      <div className="min-h-[60vh] flex-1 overflow-hidden rounded-3xl shadow-sm">
        <MapCanvas pins={pins} placing={placing} onMapClick={handleMapClick} onPinClick={setSelected} />
      </div>

      <Modal open={selected !== null} onClose={() => setSelected(null)} title={selected?.title ?? ''} description={selected ? PIN_TYPES[selected.type].label : undefined}>
        {selected && (
          <div className="space-y-4">
            {selected.description && <p className="text-sm text-neutral-700">{selected.description}</p>}
            <p className="text-xs text-neutral-500">{selected.author_name} · {timeAgo(selected.created_at)}</p>
            {user?.id === selected.user_id && (
              <button type="button" onClick={() => deletePin(selected)} className="btn-ghost w-full text-danger-600">
                <Trash2 className="h-4 w-4" />
                Șterge pinul
              </button>
            )}
          </div>
        )}
      </Modal>

      <PinForm open={point !== null} point={point} onClose={() => setPoint(null)} />
    </div>
  );
}

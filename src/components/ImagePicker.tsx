import { useEffect, useState, type ChangeEvent } from 'react';
import { ImagePlus, X } from 'lucide-react';
import { validateImageFile } from '@/lib/storage';

interface ImagePickerProps {
  file: File | null;
  onChange: (file: File | null) => void;
  label?: string;
  id: string;
}

export default function ImagePicker({ file, onChange, label = 'Adaugă o poză', id }: ImagePickerProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0] ?? null;
    event.target.value = '';
    if (!selected) return;
    const problem = validateImageFile(selected);
    if (problem) {
      setError(problem);
      return;
    }
    setError(null);
    onChange(selected);
  };

  if (previewUrl) {
    return (
      <div className="space-y-2">
        <div className="relative overflow-hidden rounded-2xl ring-1 ring-neutral-200">
          <img src={previewUrl} alt="Previzualizare poză" className="aspect-[4/3] w-full object-cover" />
          <button
            type="button"
            onClick={() => onChange(null)}
            aria-label="Elimină poza"
            className="absolute right-2 top-2 rounded-full bg-primary-900/70 p-1.5 text-white transition hover:bg-primary-900"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {error && <p role="alert" className="text-xs font-semibold text-danger-600">{error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50 px-4 py-6 text-center transition hover:border-primary-400 hover:bg-primary-50"
      >
        <span className="rounded-full bg-accent-100 p-3 text-accent-700">
          <ImagePlus className="h-5 w-5" />
        </span>
        <span className="text-sm font-semibold text-primary-800">{label}</span>
        <span className="text-xs text-neutral-500">JPG, PNG, WEBP sau GIF, max. 5 MB</span>
      </label>
      <input id={id} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="sr-only" onChange={handleChange} />
      {error && <p role="alert" className="text-xs font-semibold text-danger-600">{error}</p>}
    </div>
  );
}

import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
}

export default function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
      <span className="rounded-full bg-neutral-100 p-4 text-neutral-400">
        <Icon className="h-7 w-7" />
      </span>
      <p className="font-semibold text-neutral-800">{title}</p>
      {description && <p className="max-w-xs text-sm text-neutral-500">{description}</p>}
    </div>
  );
}

export type Aprobare = 'asteptare' | 'aprobat' | 'respins';

export const APROBARE_LABELS: Record<Aprobare, string> = {
  asteptare: 'În așteptare',
  aprobat: 'Aprobat',
  respins: 'Respins',
};

export const APROBARE_STYLES: Record<Aprobare, string> = {
  asteptare: 'bg-warning-100 text-warning-700',
  aprobat: 'bg-success-100 text-success-700',
  respins: 'bg-danger-100 text-danger-700',
};

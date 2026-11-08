export function isValidRomanianPhone(value: string): boolean {
  const normalized = value.replace(/[\s.()-]/g, '');
  return /^(\+40|0040|0)\d{9}$/.test(normalized);
}

export function normalizePhone(value: string): string {
  return value.replace(/[\s.()-]/g, '');
}

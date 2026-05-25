const DAY_MS = 24 * 60 * 60 * 1000;

export const toDate = (value: string | Date | null | undefined): Date | null => {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const formatDate = (value: string | Date | null | undefined): string => {
  const date = toDate(value);
  if (!date) return '—';
  return new Intl.DateTimeFormat('fr-CM', { dateStyle: 'medium' }).format(date);
};

export const formatDateTime = (value: string | Date | null | undefined): string => {
  const date = toDate(value);
  if (!date) return '—';
  return new Intl.DateTimeFormat('fr-CM', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
};

export const daysBetween = (a: string | Date, b: string | Date): number => {
  const da = toDate(a);
  const db = toDate(b);
  if (!da || !db) return 0;
  return Math.floor((db.getTime() - da.getTime()) / DAY_MS);
};

export const isPast = (value: string | Date): boolean => {
  const date = toDate(value);
  return !!date && date.getTime() < Date.now();
};

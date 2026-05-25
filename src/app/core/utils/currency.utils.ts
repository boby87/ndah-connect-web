export const formatXAF = (amount: number | null | undefined): string => {
  if (amount === null || amount === undefined || Number.isNaN(amount)) {
    return '— XAF';
  }
  return `${new Intl.NumberFormat('fr-CM', { maximumFractionDigits: 0 }).format(amount)} XAF`;
};

export const parseAmount = (input: string): number | null => {
  if (!input) return null;
  const normalized = input.replace(/[\s.]/g, '').replace(',', '.');
  const value = Number(normalized);
  return Number.isFinite(value) ? value : null;
};

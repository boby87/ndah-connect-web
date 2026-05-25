export type ReportCategory = 'TREASURY' | 'AUDIT' | 'CENSOR' | 'PERIODIC' | 'CYCLE';

export const REPORT_CATEGORY_LABELS: Record<ReportCategory, string> = {
  TREASURY: 'Trésorerie',
  AUDIT: 'Audit (Commissaire)',
  CENSOR: 'Censeur',
  PERIODIC: 'Périodique',
  CYCLE: 'Cycle',
};

export interface ReportEntry {
  id: string;
  tontineId: string;
  category: ReportCategory;
  title: string;
  description?: string;
  periodLabel: string;
  authorFullName: string;
  generatedAt: string;
  metricsJson?: Record<string, number | string>;
  downloadUrlPdf?: string;
  downloadUrlExcel?: string;
}

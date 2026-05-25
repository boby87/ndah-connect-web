export type ArchiveDocumentType =
  | 'MINUTES'
  | 'AGENDA'
  | 'FINANCIAL_REPORT'
  | 'AUDIT_REPORT'
  | 'CONVOCATION'
  | 'ATTENDANCE_SHEET'
  | 'ADHESION_FILE'
  | 'BYLAW'
  | 'OTHER';

export const ARCHIVE_DOCUMENT_TYPE_LABELS: Record<ArchiveDocumentType, string> = {
  MINUTES: 'Procès-verbal',
  AGENDA: "Ordre du jour",
  FINANCIAL_REPORT: 'Rapport financier',
  AUDIT_REPORT: 'Rapport audit',
  CONVOCATION: 'Convocation',
  ATTENDANCE_SHEET: 'Feuille de présence',
  ADHESION_FILE: "Dossier d'adhésion",
  BYLAW: 'Statuts / Règlement',
  OTHER: 'Autre',
};

export type ArchiveVisibility = 'ALL_MEMBERS' | 'BUREAU' | 'RESTRICTED';

export interface ArchiveDocument {
  id: string;
  tontineId: string;
  cycleNumber?: number;
  sessionNumber?: number;
  type: ArchiveDocumentType;
  title: string;
  description?: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  visibility: ArchiveVisibility;
  uploadedByFullName: string;
  uploadedAt: string;
  tags: string[];
}

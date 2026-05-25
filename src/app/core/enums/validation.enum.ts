export enum ValidationCategory {
  FINANCIAL_OPERATION = 'FINANCIAL_OPERATION',
  DOCUMENT = 'DOCUMENT',
  ADHESION = 'ADHESION',
  RESIGNATION = 'RESIGNATION',
}

export const VALIDATION_CATEGORY_LABELS: Record<ValidationCategory, string> = {
  [ValidationCategory.FINANCIAL_OPERATION]: 'Opération financière',
  [ValidationCategory.DOCUMENT]: 'Document',
  [ValidationCategory.ADHESION]: 'Adhésion',
  [ValidationCategory.RESIGNATION]: 'Démission',
};

export enum FinancialOperationType {
  LOAN_DISBURSEMENT = 'LOAN_DISBURSEMENT',
  FUND_TRANSFER = 'FUND_TRANSFER',
  EXPENSE_ABOVE_CAP = 'EXPENSE_ABOVE_CAP',
}

export const FINANCIAL_OPERATION_TYPE_LABELS: Record<FinancialOperationType, string> = {
  [FinancialOperationType.LOAN_DISBURSEMENT]: 'Décaissement de prêt',
  [FinancialOperationType.FUND_TRANSFER]: 'Transfert entre caisses',
  [FinancialOperationType.EXPENSE_ABOVE_CAP]: 'Dépense au-delà du plafond',
};

export enum DocumentKind {
  AGENDA = 'AGENDA',
  MINUTES = 'MINUTES',
  ADHESION_FILE = 'ADHESION_FILE',
}

export const DOCUMENT_KIND_LABELS: Record<DocumentKind, string> = {
  [DocumentKind.AGENDA]: "Ordre du jour",
  [DocumentKind.MINUTES]: 'Procès-verbal',
  [DocumentKind.ADHESION_FILE]: 'Dossier adhésion',
};

export enum DecisionType {
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  BLOCKED = 'BLOCKED',
}

export const DECISION_TYPE_LABELS: Record<DecisionType, string> = {
  [DecisionType.APPROVED]: 'Approuvé',
  [DecisionType.REJECTED]: 'Refusé',
  [DecisionType.BLOCKED]: 'Bloqué (infos demandées)',
};

export type Priority = 'CRITICAL' | 'HIGH' | 'NORMAL' | 'LOW';

export const PRIORITY_LABELS: Record<Priority, string> = {
  CRITICAL: 'Critique',
  HIGH: 'Haute',
  NORMAL: 'Normale',
  LOW: 'Basse',
};

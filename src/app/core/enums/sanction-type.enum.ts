export enum SanctionType {
  ABSENCE = 'ABSENCE',
  LATENESS = 'LATENESS',
  CONTRIBUTION_LATE = 'CONTRIBUTION_LATE',
  LOAN_DEFAULT = 'LOAN_DEFAULT',
  DISCIPLINE = 'DISCIPLINE',
  OTHER = 'OTHER',
}

export const SANCTION_TYPE_LABELS: Record<SanctionType, string> = {
  [SanctionType.ABSENCE]: 'Absence',
  [SanctionType.LATENESS]: 'Retard',
  [SanctionType.CONTRIBUTION_LATE]: 'Retard cotisation',
  [SanctionType.LOAN_DEFAULT]: 'Défaut de remboursement',
  [SanctionType.DISCIPLINE]: 'Discipline',
  [SanctionType.OTHER]: 'Autre',
};

export enum SanctionStatus {
  PENDING = 'PENDING',
  CONTESTED = 'CONTESTED',
  CONFIRMED = 'CONFIRMED',
  PAID = 'PAID',
  WAIVED = 'WAIVED',
  CANCELLED = 'CANCELLED',
}

export const SANCTION_STATUS_LABELS: Record<SanctionStatus, string> = {
  [SanctionStatus.PENDING]: 'En attente',
  [SanctionStatus.CONTESTED]: 'Contestée',
  [SanctionStatus.CONFIRMED]: 'Confirmée',
  [SanctionStatus.PAID]: 'Payée',
  [SanctionStatus.WAIVED]: 'Levée',
  [SanctionStatus.CANCELLED]: 'Annulée',
};

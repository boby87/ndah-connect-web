export enum LoanStatus {
  REQUESTED = 'REQUESTED',
  GUARANTOR_PENDING = 'GUARANTOR_PENDING',
  GUARANTOR_APPROVED = 'GUARANTOR_APPROVED',
  COMMITTEE_REVIEW = 'COMMITTEE_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  DISBURSED = 'DISBURSED',
  REPAYING = 'REPAYING',
  REPAID = 'REPAID',
  DEFAULTED = 'DEFAULTED',
}

export const LOAN_STATUS_LABELS: Record<LoanStatus, string> = {
  [LoanStatus.REQUESTED]: 'Demande introduite',
  [LoanStatus.GUARANTOR_PENDING]: 'Avals en attente',
  [LoanStatus.GUARANTOR_APPROVED]: 'Avals validés',
  [LoanStatus.COMMITTEE_REVIEW]: 'Examen du bureau',
  [LoanStatus.APPROVED]: 'Approuvé',
  [LoanStatus.REJECTED]: 'Rejeté',
  [LoanStatus.DISBURSED]: 'Décaissé',
  [LoanStatus.REPAYING]: 'Remboursement en cours',
  [LoanStatus.REPAID]: 'Remboursé',
  [LoanStatus.DEFAULTED]: 'En défaut',
};

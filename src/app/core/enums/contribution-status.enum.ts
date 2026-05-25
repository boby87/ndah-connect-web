export enum ContributionStatus {
  PENDING = 'PENDING',
  PARTIAL = 'PARTIAL',
  PAID = 'PAID',
  LATE = 'LATE',
  EXEMPTED = 'EXEMPTED',
}

export const CONTRIBUTION_STATUS_LABELS: Record<ContributionStatus, string> = {
  [ContributionStatus.PENDING]: 'À payer',
  [ContributionStatus.PARTIAL]: 'Partielle',
  [ContributionStatus.PAID]: 'Payée',
  [ContributionStatus.LATE]: 'En retard',
  [ContributionStatus.EXEMPTED]: 'Dispensée',
};

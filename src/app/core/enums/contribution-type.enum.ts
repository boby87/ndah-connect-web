export enum ContributionType {
  ORDINARY = 'ORDINARY',
  CASH_FUND = 'CASH_FUND',
  ATTENDANCE = 'ATTENDANCE',
  SAVINGS = 'SAVINGS',
}

export const CONTRIBUTION_TYPE_LABELS: Record<ContributionType, string> = {
  [ContributionType.ORDINARY]: 'Cotisation ordinaire',
  [ContributionType.CASH_FUND]: 'Fonds de caisse',
  [ContributionType.ATTENDANCE]: 'Présence',
  [ContributionType.SAVINGS]: 'Épargne',
};

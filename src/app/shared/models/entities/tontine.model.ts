import { TontineStatus } from '../../../core/enums/tontine-status.enum';

export type ContributionFrequency = 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY';

export interface TontineRules {
  latePenaltyAmount: number;
  absencePenaltyAmount: number;
  contributionLatePenaltyAmount: number;
  loanMaxAmount: number;
  loanInterestRatePercent: number;
  loanMaxDurationMonths: number;
  expenseCapWithoutValidation: number;
  emergencyDeductionPercent: number;
  operationsDeductionPercent: number;
}

export type FounderRole =
  | 'PRESIDENT'
  | 'SECRETARY'
  | 'TREASURER'
  | 'CENSOR'
  | 'AUDITOR'
  | 'MEMBER';

export interface FounderInvite {
  fullName: string;
  phone: string;
  email?: string;
  role: FounderRole;
}

export interface Tontine {
  id: string;
  name: string;
  description?: string;
  status: TontineStatus;
  contributionAmount: number;
  frequency: ContributionFrequency;
  startDate: string;
  endDate?: string;
  memberCount: number;
  maxMembers: number;
  currentCycleId?: string;
  totalSaved: number;
  createdAt: string;
  updatedAt: string;
  createdByUserId?: string;
  rules?: TontineRules;
  founders?: FounderInvite[];
}

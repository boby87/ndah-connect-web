import { TontineStatus } from '../../../core/enums';

export interface Tontine {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  status: TontineStatus;
  contributionAmount: number;
  currency: string;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  cycleDurationSessions: number;
  lateToleranceMinutes: number;
  absencePenaltyAmount: number;
  latePenaltyAmount: number;
  loanInterestRate: number;
  potDeductionRate: number;
  minMembers: number;
  maxMembers?: number;
  rulesDocumentUrl?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

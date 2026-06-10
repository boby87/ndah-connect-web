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

/**
 * Rôle assignable à un fondateur **autre que le créateur**.
 *
 * Le créateur d'une tontine devient automatiquement PRESIDENT (règle backend dans
 * `TontineService.buildCreatorMember()`). Aucun autre fondateur ne peut être déclaré
 * PRESIDENT — ce type l'exprime au niveau du compilateur.
 */
export type InvitableFounderRole = Exclude<FounderRole, 'PRESIDENT'>;

export interface FounderInvite {
  fullName: string;
  phone: string;
  email?: string;
  role: InvitableFounderRole;
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

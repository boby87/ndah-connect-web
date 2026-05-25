export type ExtraordinaryContributionStatus =
  | 'DRAFT'
  | 'COLLECTING'
  | 'CLOSED'
  | 'DISTRIBUTED'
  | 'CANCELLED';

export interface ExtraordinaryContributionMember {
  memberId: string;
  fullName: string;
  expected: number;
  paid: number;
  exempted: boolean;
  paidAt?: string;
}

export interface ExtraordinaryContribution {
  id: string;
  tontineId: string;
  motive: string;
  beneficiaryMemberId?: string;
  beneficiaryFullName?: string;
  amountPerMember: number;
  dueDate: string;
  status: ExtraordinaryContributionStatus;
  exemptBeneficiary: boolean;
  totalExpected: number;
  totalCollected: number;
  members: ExtraordinaryContributionMember[];
  votedByAssemblyAt: string;
  createdAt: string;
  closedAt?: string;
  distributedAt?: string;
}

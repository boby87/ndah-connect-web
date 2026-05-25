export type VoteStatus = 'DRAFT' | 'OPEN' | 'CLOSED' | 'CANCELLED';
export type VoteAudience = 'ALL' | 'BUREAU' | 'MEMBERS_ACTIVE';
export type VoteScope = 'STANDARD' | 'ASSEMBLY';

export interface VoteOption {
  id: string;
  label: string;
  count: number;
}

export interface Vote {
  id: string;
  tontineId: string;
  question: string;
  description?: string;
  options: VoteOption[];
  isAnonymous: boolean;
  hideResultsUntilClose: boolean;
  scope: VoteScope;
  audience: VoteAudience;
  status: VoteStatus;
  opensAt: string;
  closesAt: string;
  createdByUserId: string;
  createdByFullName: string;
  createdAt: string;
  totalVoters: number;
  totalVoted: number;
  quorumPercent: number;
  passed?: boolean;
}

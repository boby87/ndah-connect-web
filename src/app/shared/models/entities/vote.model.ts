export interface Vote {
  id: string;
  tontineId: string;
  sessionId?: string;
  title: string;
  description: string;
  type: 'majority' | 'unanimous' | 'two_thirds';
  status: 'draft' | 'open' | 'closed';
  options: VoteOption[];
  startedAt?: string;
  closedAt?: string;
  createdBy: string;
  createdAt: string;
}

export interface VoteOption {
  id: string;
  voteId: string;
  label: string;
  votes: number;
}

export interface VoteBallot {
  id: string;
  voteId: string;
  optionId: string;
  memberId: string;
  castedAt: string;
}

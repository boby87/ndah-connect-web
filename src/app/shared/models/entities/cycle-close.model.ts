export type CycleCloseChecklistItemStatus = 'PENDING' | 'DONE' | 'BLOCKED';

export interface CycleCloseChecklistItem {
  key: string;
  label: string;
  status: CycleCloseChecklistItemStatus;
  blockingReason?: string;
}

export interface CycleCloseSummary {
  totalCollected: number;
  totalDistributed: number;
  totalLoansOutstanding: number;
  totalSanctionsCollected: number;
  netResult: number;
  membersRetained: number;
  newMembersNextCycle: number;
}

export interface CycleClose {
  id: string;
  tontineId: string;
  cycleId: string;
  cycleNumber: number;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'AUDITOR_VALIDATED' | 'PRESIDENT_SIGNED' | 'CLOSED';
  checklist: CycleCloseChecklistItem[];
  summary: CycleCloseSummary;
  auditorValidatedAt?: string;
  presidentSignedAt?: string;
  closedAt?: string;
  nextCycleStartDate?: string;
  nextCycleDrawMode?: 'RANDOM' | 'SENIORITY' | 'ASSEMBLY_VOTE';
}

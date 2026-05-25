export type ConflictStatus =
  | 'OPEN'
  | 'MEDIATION_SCHEDULED'
  | 'MEDIATED'
  | 'DECIDED_BY_PRESIDENT'
  | 'ESCALATED_TO_ASSEMBLY'
  | 'CLOSED';

export type ConflictDecisionOutcome =
  | 'MEDIATION'
  | 'SANCTION'
  | 'WARNING'
  | 'EXCLUSION_PROPOSED'
  | 'CASE_CLOSED';

export interface ConflictParty {
  memberId: string;
  fullName: string;
  role?: 'INITIATOR' | 'RESPONDENT' | 'WITNESS';
}

export interface ConflictHistoryEntry {
  at: string;
  actor: string;
  action: string;
  note?: string;
}

export interface Conflict {
  id: string;
  tontineId: string;
  subject: string;
  description: string;
  parties: ConflictParty[];
  status: ConflictStatus;
  escalatedByUserId: string;
  escalatedByFullName: string;
  escalatedAt: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  history: ConflictHistoryEntry[];
  decisionOutcome?: ConflictDecisionOutcome;
  decisionComment?: string;
  decidedAt?: string;
  mediationScheduledAt?: string;
}

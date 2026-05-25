export type MembershipFileKind = 'ADHESION' | 'RESIGNATION' | 'EXCLUSION';

export type MembershipFileStatus =
  | 'SUBMITTED'
  | 'BUREAU_REVIEW'
  | 'ASSEMBLY_VOTE_PENDING'
  | 'ASSEMBLY_APPROVED'
  | 'ASSEMBLY_REJECTED'
  | 'PRESIDENT_REVIEW'
  | 'APPROVED'
  | 'REJECTED';

export interface MembershipFile {
  id: string;
  tontineId: string;
  kind: MembershipFileKind;
  candidateFullName: string;
  candidatePhone?: string;
  candidateEmail?: string;
  memberId?: string;
  sponsorFullName?: string;
  motivation: string;
  status: MembershipFileStatus;
  submittedAt: string;
  bureauReviewedAt?: string;
  assemblyVotedAt?: string;
  assemblyVoteYes?: number;
  assemblyVoteNo?: number;
  assemblyVoteAbstain?: number;
  presidentDecidedAt?: string;
  presidentDecisionComment?: string;
  attachments?: { id: string; name: string }[];
  history: { at: string; actor: string; action: string; note?: string }[];
}

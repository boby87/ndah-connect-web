export type RsvpStatus = 'PENDING' | 'CONFIRMED' | 'DECLINED' | 'TENTATIVE';

export const RSVP_STATUS_LABELS: Record<RsvpStatus, string> = {
  PENDING: 'Sans réponse',
  CONFIRMED: 'Confirmé',
  DECLINED: 'Décliné',
  TENTATIVE: 'Incertain',
};

export interface MemberRsvp {
  sessionId: string;
  memberId: string;
  memberFullName: string;
  status: RsvpStatus;
  reason?: string;
  respondedAt?: string;
}

export interface SessionRsvpSummary {
  sessionId: string;
  sessionNumber: number;
  scheduledAt: string;
  totalMembers: number;
  confirmed: number;
  declined: number;
  tentative: number;
  pending: number;
  quorumPercent: number;
  quorumReached: boolean;
  rsvps: MemberRsvp[];
}

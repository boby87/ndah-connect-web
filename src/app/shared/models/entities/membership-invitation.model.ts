import type { InvitableFounderRole } from './tontine.model';

export type InvitationStatus = 'PENDING' | 'SENT' | 'ACCEPTED' | 'EXPIRED' | 'CANCELLED';
export type InvitationChannel = 'SMS' | 'EMAIL' | 'WHATSAPP';

export const INVITATION_STATUS_LABELS: Record<InvitationStatus, string> = {
  PENDING: 'À envoyer',
  SENT: 'Envoyée',
  ACCEPTED: 'Acceptée',
  EXPIRED: 'Expirée',
  CANCELLED: 'Annulée',
};

export interface MembershipInvitation {
  id: string;
  tontineId: string;
  candidateFullName: string;
  candidatePhone: string;
  candidateEmail?: string;
  proposedRole: InvitableFounderRole;
  channels: InvitationChannel[];
  message?: string;
  status: InvitationStatus;
  sentAt?: string;
  acceptedAt?: string;
  expiresAt: string;
  invitedByUserId: string;
  invitedByFullName: string;
  invitedAt: string;
  remindersSent: number;
  cancelledAt?: string;
  cancelReason?: string;
  /** Public token used by the candidate to accept the invitation. Never expose to non-bureau users. */
  acceptUrl?: string;
}

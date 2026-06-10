export type PresidencyTransferStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'DECLINED'
  | 'CANCELLED'
  | 'EXPIRED';

export const PRESIDENCY_TRANSFER_STATUS_LABELS: Record<PresidencyTransferStatus, string> = {
  PENDING: 'En attente d\'acceptation',
  ACCEPTED: 'Acceptée',
  DECLINED: 'Refusée',
  CANCELLED: 'Annulée',
  EXPIRED: 'Expirée',
};

export interface PresidencyTransfer {
  id: string;
  tontineId: string;
  initiatedByUserId: string;
  initiatedByFullName: string;
  targetMemberId: string;
  targetMemberFullName: string;
  targetUserId?: string;
  reason: string;
  status: PresidencyTransferStatus;
  initiatedAt: string;
  expiresAt: string;
  acceptedAt?: string;
  declinedAt?: string;
  declineReason?: string;
  cancelledAt?: string;
  cancelReason?: string;
}

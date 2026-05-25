import type { UserRole } from '../../../core/enums/user-role.enum';

export type DelegationPower =
  | 'VALIDATE_DOCUMENTS'
  | 'VALIDATE_FINANCIAL_OPS'
  | 'PRESIDE_SESSION'
  | 'WAIVE_SANCTIONS'
  | 'PUBLISH_ANNOUNCEMENTS'
  | 'LAUNCH_VOTE';

export const DELEGATION_POWER_LABELS: Record<DelegationPower, string> = {
  VALIDATE_DOCUMENTS: 'Valider les documents',
  VALIDATE_FINANCIAL_OPS: 'Valider les opérations financières',
  PRESIDE_SESSION: 'Présider une séance',
  WAIVE_SANCTIONS: 'Lever des sanctions',
  PUBLISH_ANNOUNCEMENTS: 'Publier des annonces',
  LAUNCH_VOTE: 'Lancer un vote',
};

export type DelegationStatus = 'ACTIVE' | 'REVOKED' | 'EXPIRED';

export interface Delegation {
  id: string;
  tontineId: string;
  delegateeUserId: string;
  delegateeFullName: string;
  delegateeRole: UserRole;
  powers: DelegationPower[];
  reason: string;
  startsAt: string;
  endsAt: string;
  status: DelegationStatus;
  createdAt: string;
  revokedAt?: string;
  revokedReason?: string;
}

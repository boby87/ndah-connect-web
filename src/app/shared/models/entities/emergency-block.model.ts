export type EmergencyBlockTarget =
  | 'CASH_BOX'
  | 'LOAN_DISBURSEMENT'
  | 'TRANSFER'
  | 'MEMBER_ACCOUNT'
  | 'WHOLE_TONTINE';

export const EMERGENCY_BLOCK_TARGET_LABELS: Record<EmergencyBlockTarget, string> = {
  CASH_BOX: 'Caisse spécifique',
  LOAN_DISBURSEMENT: 'Décaissement de prêt',
  TRANSFER: 'Transferts entre caisses',
  MEMBER_ACCOUNT: 'Compte d’un membre',
  WHOLE_TONTINE: 'Toute la tontine',
};

export type EmergencyBlockStatus = 'ACTIVE' | 'LIFTED';

export interface EmergencyBlock {
  id: string;
  tontineId: string;
  target: EmergencyBlockTarget;
  targetRef?: string;
  reason: string;
  status: EmergencyBlockStatus;
  activatedByUserId: string;
  activatedByFullName: string;
  activatedAt: string;
  liftedByUserId?: string;
  liftedAt?: string;
  liftReason?: string;
}

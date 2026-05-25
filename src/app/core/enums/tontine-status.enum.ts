export enum TontineStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  CLOSED = 'CLOSED',
}

export const TONTINE_STATUS_LABELS: Record<TontineStatus, string> = {
  [TontineStatus.DRAFT]: 'Brouillon',
  [TontineStatus.ACTIVE]: 'Active',
  [TontineStatus.PAUSED]: 'En pause',
  [TontineStatus.COMPLETED]: 'Terminée',
  [TontineStatus.CLOSED]: 'Clôturée',
};

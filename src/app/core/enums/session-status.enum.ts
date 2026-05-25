export enum SessionStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  PENDING_VALIDATION = 'PENDING_VALIDATION',
  VALIDATED = 'VALIDATED',
}

export const SESSION_STATUS_LABELS: Record<SessionStatus, string> = {
  [SessionStatus.SCHEDULED]: 'Planifiée',
  [SessionStatus.IN_PROGRESS]: 'En cours',
  [SessionStatus.COMPLETED]: 'Terminée',
  [SessionStatus.CANCELLED]: 'Annulée',
  [SessionStatus.PENDING_VALIDATION]: 'En attente de validation',
  [SessionStatus.VALIDATED]: 'Validée',
};

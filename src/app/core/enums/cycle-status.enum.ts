export enum CycleStatus {
  ACTIVE = 'ACTIVE',
  CLOSURE_REQUESTED = 'CLOSURE_REQUESTED',
  CLOSED = 'CLOSED',
}

export const CYCLE_STATUS_LABELS: Record<CycleStatus, string> = {
  [CycleStatus.ACTIVE]: 'Actif',
  [CycleStatus.CLOSURE_REQUESTED]: 'Clôture demandée',
  [CycleStatus.CLOSED]: 'Clôturé',
};

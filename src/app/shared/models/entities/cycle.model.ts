import type { CycleStatus } from '../../../core/enums/cycle-status.enum';

export interface Cycle {
  id: string;
  tontineId: string;
  number: number;
  startDate: string;
  endDate?: string;
  status: CycleStatus;
  isActive: boolean;
  totalSessions: number;
  completedSessions: number;
  totalCollected: number;
}

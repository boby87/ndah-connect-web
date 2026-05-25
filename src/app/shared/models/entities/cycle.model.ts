export interface Cycle {
  id: string;
  tontineId: string;
  number: number;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  totalSessions: number;
  completedSessions: number;
  totalCollected: number;
}

export interface Cycle {
  id: string;
  tontineId: string;
  number: number;
  startDate: string;
  endDate?: string;
  totalSessions: number;
  completedSessions: number;
  status: 'active' | 'completed';
  createdAt: string;
}

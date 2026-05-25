import { SessionStatus } from '../../../core/enums/session-status.enum';

export interface Session {
  id: string;
  tontineId: string;
  cycleId: string;
  number: number;
  scheduledAt: string;
  startedAt?: string;
  endedAt?: string;
  location?: string;
  status: SessionStatus;
  agenda: AgendaItem[];
  beneficiaryMemberId?: string;
  totalCollected: number;
  totalDistributed: number;
  attendanceCount: number;
  quorumReached: boolean;
}

export interface AgendaItem {
  id: string;
  order: number;
  title: string;
  description?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'DONE' | 'SKIPPED';
}

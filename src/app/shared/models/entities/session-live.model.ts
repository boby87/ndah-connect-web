import type { SessionStatus } from '../../../core/enums/session-status.enum';
import type { AgendaItem } from './session.model';

export interface SessionAttendanceEntry {
  memberId: string;
  fullName: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
  checkInAt?: string;
}

export interface SessionLive {
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
  attendance: SessionAttendanceEntry[];
  totalCollected: number;
  totalDistributed: number;
  quorumThreshold: number;
  beneficiaryMemberId?: string;
  beneficiaryFullName?: string;
  cagnotteAmount?: number;
  cagnotteSignedByPresident: boolean;
}

import type { AttendanceStatus } from '../../../core/enums/attendance-status.enum';
import type { ContributionStatus } from '../../../core/enums/contribution-status.enum';
import type { CycleStatus } from '../../../core/enums/cycle-status.enum';
import type { SessionStatus } from '../../../core/enums/session-status.enum';
import type { AgendaDraftItem } from './agenda-draft.model';

export interface MemberAttendanceEntry {
  memberId: string;
  fullName: string;
  status: AttendanceStatus;
  checkInAt?: string;
}

export interface MemberContributionEntry {
  memberId: string;
  memberName: string;
  expectedAmount: number;
  paidAmount: number;
  status: ContributionStatus;
  paidAt?: string;
  paymentMethod?: string;
}

export interface MemberSessionView {
  id: string;
  tontineId: string;
  cycleId: string;
  cycleNumber: number;
  cycleStatus: CycleStatus;
  number: number;
  scheduledAt: string;
  startedAt?: string;
  endedAt?: string;
  location?: string;
  status: SessionStatus;
  beneficiaryFullName?: string;
  agenda: AgendaDraftItem[];
  agendaApprovedAt?: string;
  attendance: MemberAttendanceEntry[];
  contributions: MemberContributionEntry[];
}

import { Member } from './member.model';

export interface Attendance {
  id: string;
  sessionId: string;
  memberId: string;
  member: Member;
  status: 'present' | 'absent' | 'late' | 'excused';
  arrivedAt?: string;
  lateMinutes?: number;
  excuseReason?: string;
  markedBy: string;
  createdAt: string;
}

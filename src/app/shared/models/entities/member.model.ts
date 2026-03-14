import { MemberStatus, UserRole } from '../../../core/enums';
import { User } from './user.model';

export interface Member {
  id: string;
  userId: string;
  user: User;
  tontineId: string;
  role: UserRole;
  status: MemberStatus;
  joinedAt: string;
  sponsorId?: string;
  sponsor?: Member;
  tourNumber?: number;
  canRequestLoan: boolean;
  createdAt: string;
  updatedAt: string;
}

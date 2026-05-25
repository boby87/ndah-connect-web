import { MemberStatus } from '../../../core/enums/member-status.enum';
import { UserRole } from '../../../core/enums/user-role.enum';

export interface Member {
  id: string;
  userId: string;
  tontineId: string;
  matricule: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  avatarUrl?: string;
  status: MemberStatus;
  roles: UserRole[];
  joinedAt: string;
  tourOrder?: number;
  hasReceivedTour: boolean;
  totalContributed: number;
  totalArrears: number;
}

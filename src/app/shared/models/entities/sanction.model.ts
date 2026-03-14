import { PaymentMethod, SanctionType } from '../../../core/enums';
import { Member } from './member.model';

export interface Sanction {
  id: string;
  memberId: string;
  member: Member;
  tontineId: string;
  sessionId?: string;
  type: SanctionType;
  reason: string;
  amount: number;
  status: 'pending' | 'paid' | 'contested' | 'cancelled';
  appliedBy: string;
  appliedAt: string;
  paymentMethod?: PaymentMethod;
  paymentReference?: string;
  paidAt?: string;
  contested: boolean;
  contestReason?: string;
  contestResult?: 'accepted' | 'rejected';
  cancelledBy?: string;
  cancelledAt?: string;
  cancelReason?: string;
}

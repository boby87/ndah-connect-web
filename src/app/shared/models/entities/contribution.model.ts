import { ContributionStatus, PaymentMethod } from '../../../core/enums';
import { Member } from './member.model';

export interface Contribution {
  id: string;
  memberId: string;
  member: Member;
  sessionId: string;
  tontineId: string;
  amount: number;
  contributionType: 'regular' | 'arrears' | 'extraordinary';
  paymentMethod: PaymentMethod;
  paymentReference?: string;
  status: ContributionStatus;
  paidAt?: string;
  confirmedBy?: string;
  createdAt: string;
}

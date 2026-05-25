import { ContributionStatus } from '../../../core/enums/contribution-status.enum';
import { PaymentMethod } from '../../../core/enums/payment-method.enum';

export interface Contribution {
  id: string;
  tontineId: string;
  sessionId: string;
  memberId: string;
  expectedAmount: number;
  paidAmount: number;
  status: ContributionStatus;
  paidAt?: string;
  paymentMethod?: PaymentMethod;
  reference?: string;
  collectedByUserId?: string;
  note?: string;
}

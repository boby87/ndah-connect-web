import { PaymentMethod } from '../../../core/enums';

export interface LoanRepayment {
  id: string;
  loanId: string;
  memberId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentReference?: string;
  status: 'pending' | 'confirmed';
  confirmedBy?: string;
  paidAt: string;
  createdAt: string;
}

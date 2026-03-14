import { LoanStatus, PaymentMethod } from '../../../core/enums';
import { Member } from './member.model';

export interface Loan {
  id: string;
  memberId: string;
  member: Member;
  tontineId: string;
  amount: number;
  interestRate: number;
  durationMonths: number;
  totalToRepay: number;
  monthlyPayment: number;
  status: LoanStatus;
  requestReason?: string;
  guarantors: LoanGuarantor[];
  auditorApproved?: boolean;
  auditorComment?: string;
  auditorApprovedAt?: string;
  presidentApproved?: boolean;
  presidentComment?: string;
  presidentApprovedAt?: string;
  disbursementMethod?: PaymentMethod;
  disbursementReference?: string;
  disbursedAt?: string;
  nextPaymentDate?: string;
  remainingAmount: number;
  createdAt: string;
}

export interface LoanGuarantor {
  id: string;
  loanId: string;
  guarantorId: string;
  guarantor: Member;
  status: 'pending' | 'accepted' | 'refused';
  respondedAt?: string;
}

import { LoanStatus } from '../../../core/enums/loan-status.enum';

export interface Loan {
  id: string;
  tontineId: string;
  memberId: string;
  principal: number;
  interestRate: number;
  durationMonths: number;
  monthlyPayment: number;
  totalDue: number;
  totalRepaid: number;
  status: LoanStatus;
  purpose: string;
  guarantorIds: string[];
  requestedAt: string;
  approvedAt?: string;
  disbursedAt?: string;
  dueDate?: string;
}

export interface LoanRepayment {
  id: string;
  loanId: string;
  amount: number;
  paidAt: string;
  installmentNumber: number;
  remainingBalance: number;
}

export interface LoanSimulation {
  principal: number;
  interestRate: number;
  durationMonths: number;
  monthlyPayment: number;
  totalInterest: number;
  totalDue: number;
  schedule: LoanSimulationRow[];
}

export interface LoanSimulationRow {
  month: number;
  principal: number;
  interest: number;
  payment: number;
  remainingBalance: number;
}

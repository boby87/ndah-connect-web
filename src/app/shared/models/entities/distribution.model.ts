import { PaymentMethod } from '../../../core/enums';
import { Member } from './member.model';

export interface Distribution {
  id: string;
  sessionId: string;
  beneficiaryId: string;
  beneficiary: Member;
  tontineId: string;
  grossAmount: number;
  emergencyFundDeduction: number;
  operationalFundDeduction: number;
  otherDeductions: number;
  netAmount: number;
  paymentMethod: PaymentMethod;
  paymentReference?: string;
  status: 'pending' | 'signed' | 'distributed';
  treasurerSignature: boolean;
  presidentSignature: boolean;
  beneficiarySignature: boolean;
  distributedAt?: string;
  createdAt: string;
}

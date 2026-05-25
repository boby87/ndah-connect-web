import type { PaymentMethod } from '../../../core/enums/payment-method.enum';

export type CashBoxType = 'PRINCIPAL' | 'EMERGENCY' | 'OPERATIONS' | 'OTHER';

export const CASH_BOX_TYPE_LABELS: Record<CashBoxType, string> = {
  PRINCIPAL: 'Principale',
  EMERGENCY: 'Secours',
  OPERATIONS: 'Fonctionnement',
  OTHER: 'Autre',
};

export type CashMovementKind =
  | 'CONTRIBUTION_IN'
  | 'EXTRA_CONTRIBUTION_IN'
  | 'SANCTION_IN'
  | 'LOAN_REPAYMENT_IN'
  | 'MOBILE_MONEY_IN'
  | 'CAGNOTTE_OUT'
  | 'LOAN_DISBURSEMENT_OUT'
  | 'EXPENSE_OUT'
  | 'SANCTION_REFUND_OUT'
  | 'TRANSFER_IN'
  | 'TRANSFER_OUT';

export interface CashBox {
  id: string;
  tontineId: string;
  name: string;
  type: CashBoxType;
  balance: number;
  isLocked: boolean;
  thresholdMin?: number;
  createdAt: string;
}

export interface CashMovement {
  id: string;
  tontineId: string;
  cashBoxId: string;
  cashBoxName: string;
  kind: CashMovementKind;
  amount: number;
  direction: 'IN' | 'OUT';
  reference?: string;
  description: string;
  balanceAfter: number;
  recordedByFullName: string;
  recordedAt: string;
}

export type CashBoxTransferStatus =
  | 'DRAFT'
  | 'PENDING_PRESIDENT'
  | 'PENDING_AUDITOR'
  | 'APPROVED'
  | 'REJECTED'
  | 'COMPLETED';

export interface CashBoxTransfer {
  id: string;
  tontineId: string;
  fromCashBoxId: string;
  fromCashBoxName: string;
  toCashBoxId: string;
  toCashBoxName: string;
  amount: number;
  justification: string;
  status: CashBoxTransferStatus;
  presidentApprovedAt?: string;
  auditorApprovedAt?: string;
  completedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  requestedByFullName: string;
  requestedAt: string;
}

export type ExpenseCategory =
  | 'VENUE'
  | 'SUPPLIES'
  | 'TRANSPORT'
  | 'COMMUNICATION'
  | 'ADMIN_FEES'
  | 'EVENT'
  | 'OTHER';

export const EXPENSE_CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  VENUE: 'Location salle',
  SUPPLIES: 'Fournitures',
  TRANSPORT: 'Transport',
  COMMUNICATION: 'Communication',
  ADMIN_FEES: 'Frais administratifs',
  EVENT: 'Évènement',
  OTHER: 'Autre',
};

export type ExpenseStatus =
  | 'DRAFT'
  | 'PENDING_VALIDATION'
  | 'APPROVED'
  | 'PAID'
  | 'REJECTED';

export interface Expense {
  id: string;
  tontineId: string;
  cashBoxId: string;
  category: ExpenseCategory;
  amount: number;
  description: string;
  vendor?: string;
  receiptFileName?: string;
  status: ExpenseStatus;
  needsValidation: boolean;
  cap: number;
  paidAt?: string;
  paymentMethod?: PaymentMethod;
  createdByFullName: string;
  createdAt: string;
}

export type MobileMoneyDirection = 'IN' | 'OUT';
export type MobileMoneyStatus =
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'REJECTED'
  | 'COMPLETED'
  | 'FAILED'
  | 'REFUNDED';

export type MobileMoneyProvider = 'MTN_MOMO' | 'ORANGE_MONEY';

export const MOBILE_MONEY_PROVIDER_LABELS: Record<MobileMoneyProvider, string> = {
  MTN_MOMO: 'MTN Mobile Money',
  ORANGE_MONEY: 'Orange Money',
};

export interface MobileMoneyTransaction {
  id: string;
  tontineId: string;
  provider: MobileMoneyProvider;
  direction: MobileMoneyDirection;
  amount: number;
  fromPhone?: string;
  toPhone?: string;
  externalReference: string;
  matchedMemberId?: string;
  matchedMemberFullName?: string;
  contributionId?: string;
  status: MobileMoneyStatus;
  receivedAt: string;
  reviewedAt?: string;
  reviewedByFullName?: string;
  rejectionReason?: string;
}

export interface MobileMoneyReconciliationReport {
  id: string;
  tontineId: string;
  generatedAt: string;
  periodLabel: string;
  apiTransactionsCount: number;
  recordedCount: number;
  unmatchedApi: MobileMoneyTransaction[];
  unmatchedRecorded: { id: string; reference: string; amount: number }[];
}

export interface CagnotteDistribution {
  id: string;
  sessionId: string;
  sessionNumber: number;
  tontineId: string;
  beneficiaryMemberId: string;
  beneficiaryFullName: string;
  beneficiaryPhone: string;
  grossAmount: number;
  deductionEmergency: number;
  deductionOperations: number;
  netAmount: number;
  paymentMethod?: PaymentMethod;
  beneficiaryConfirmed: boolean;
  beneficiaryConfirmedAt?: string;
  treasurerPaidAt?: string;
}

export interface SessionFinancialReport {
  sessionId: string;
  sessionNumber: number;
  sessionDate: string;
  totalContributions: number;
  totalExtraContributions: number;
  totalSanctions: number;
  totalRepayments: number;
  totalIncome: number;
  totalDistribution: number;
  totalExpenses: number;
  totalDisbursements: number;
  totalOutflows: number;
  netResult: number;
  cashBoxBalances: { name: string; balance: number }[];
  signedByTreasurer: boolean;
  signedByPresident: boolean;
  treasurerSignedAt?: string;
  presidentSignedAt?: string;
}

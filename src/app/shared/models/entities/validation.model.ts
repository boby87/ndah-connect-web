import type {
  DecisionType,
  DocumentKind,
  FinancialOperationType,
  Priority,
  ValidationCategory,
} from '../../../core/enums/validation.enum';

export interface AuditorOpinion {
  status: 'FAVORABLE' | 'RESERVED' | 'UNFAVORABLE';
  comment?: string;
  userId: string;
  userFullName: string;
  emittedAt: string;
}

export interface BorrowerProfile {
  fullName: string;
  memberSince: string;
  contributionsUpToDate: boolean;
  previousLoansCount: number;
  previousLoansRepaidOnTime: number;
  unpaidSanctionsCount: number;
  attendanceRate: number;
}

export interface CashBoxSnapshot {
  name: string;
  balanceBefore: number;
  balanceAfter: number;
  isSufficient: boolean;
}

export interface PendingValidationBase {
  id: string;
  tontineId: string;
  category: ValidationCategory;
  title: string;
  description: string;
  amount?: number;
  priority: Priority;
  submittedByUserId: string;
  submittedByFullName: string;
  submittedAt: string;
  auditorOpinion?: AuditorOpinion;
}

export interface FinancialOperationValidation extends PendingValidationBase {
  category: ValidationCategory.FINANCIAL_OPERATION;
  operationType: FinancialOperationType;
  reference: string;
  borrowerProfile?: BorrowerProfile;
  guarantors?: { memberId: string; fullName: string; approved: boolean }[];
  cashBox?: CashBoxSnapshot;
  durationMonths?: number;
  interestRate?: number;
  totalDue?: number;
}

export interface AgendaPoint {
  order: number;
  title: string;
}

export interface DocumentValidation extends PendingValidationBase {
  category: ValidationCategory.DOCUMENT;
  documentKind: DocumentKind;
  sessionNumber?: number;
  sessionDate?: string;
  location?: string;
  beneficiary?: string;
  agendaPoints?: AgendaPoint[];
  signedBySecretary?: boolean;
  signedBySecretaryAt?: string;
  attachments?: { id: string; name: string }[];
  previewSnippet?: string;
}

export interface AdhesionValidation extends PendingValidationBase {
  category: ValidationCategory.ADHESION;
  candidateFullName: string;
  candidatePhone: string;
  candidateEmail: string;
  sponsorFullName?: string;
  votedByAssembly: boolean;
  voteResult?: 'APPROVED' | 'REJECTED';
}

export type PendingValidation =
  | FinancialOperationValidation
  | DocumentValidation
  | AdhesionValidation;

export interface ValidationDecision {
  id: string;
  validationId: string;
  decision: DecisionType;
  comment?: string;
  decidedAt: string;
  decidedByUserId: string;
}

import { SanctionStatus, SanctionType } from '../../../core/enums/sanction-type.enum';

export type SanctionSeverity = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Sanction {
  id: string;
  tontineId: string;
  memberId: string;
  memberFullName?: string;
  sessionId?: string;
  sessionNumber?: number;
  type: SanctionType;
  customLabel?: string;
  amount: number;
  isFinancial?: boolean;
  severity?: SanctionSeverity;
  reason: string;
  status: SanctionStatus;
  autoDetected?: boolean;
  issuedByUserId: string;
  issuedByFullName?: string;
  issuedAt: string;
  paidAt?: string;
  contestedAt?: string;
  contestReason?: string;
  contestAttachmentName?: string;
  resolvedByUserId?: string;
  cancelledAt?: string;
  cancelledByUserId?: string;
  cancelledByFullName?: string;
  cancelReason?: string;
  cancelledByRole?: 'CENSOR' | 'PRESIDENT' | 'ASSEMBLY';
  refundInitiated?: boolean;
}

export interface SanctionContestationDecision {
  decision: 'ACCEPT' | 'REJECT' | 'TRANSFER_PRESIDENT';
  comment?: string;
}

export interface AttendanceModificationRequest {
  id: string;
  tontineId: string;
  sessionId: string;
  sessionNumber: number;
  memberId: string;
  memberFullName: string;
  fromStatus: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
  toStatus: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
  reason: string;
  requestedByUserId: string;
  requestedByFullName: string;
  requestedAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'INFO_REQUESTED';
  decisionComment?: string;
  decidedAt?: string;
  linkedSanctionId?: string;
  infoRequest?: string;
  infoResponse?: string;
}

export interface AbsenceJustification {
  id: string;
  tontineId: string;
  sessionId: string;
  sessionNumber: number;
  memberId: string;
  memberFullName: string;
  documentName: string;
  documentType: string;
  documentSizeKb?: number;
  reason: string;
  submittedAt: string;
  status:
    | 'PENDING_CENSOR'
    | 'PENDING_PRESIDENT'
    | 'APPROVED'
    | 'REJECTED_CENSOR'
    | 'REJECTED_PRESIDENT'
    | 'INFO_REQUESTED';
  censorComment?: string;
  censorDecidedAt?: string;
  presidentComment?: string;
  presidentDecidedAt?: string;
  linkedSanctionId?: string;
}

export interface CensorCommunication {
  id: string;
  tontineId: string;
  kind: 'WARNING' | 'PAYMENT_REMINDER' | 'INFORMATION' | 'CALL_TO_ORDER';
  subject: string;
  body: string;
  channels: ('SMS' | 'EMAIL' | 'PUSH' | 'WHATSAPP')[];
  recipientMemberIds: string[];
  recipientLabels: string[];
  sentByUserId: string;
  sentByFullName: string;
  sentAt: string;
  relatedSanctionIds?: string[];
}

export interface CensorReport {
  id: string;
  tontineId: string;
  sessionId?: string;
  sessionNumber?: number;
  periodLabel: string;
  scope: 'LAST_SESSION' | 'CUSTOM_RANGE' | 'CYCLE';
  generatedAt: string;
  authorFullName: string;
  totalSanctions: number;
  totalAmount: number;
  breakdown: { type: string; count: number; amount: number }[];
  unpaidCount: number;
  unpaidAmount: number;
  observations?: string;
}

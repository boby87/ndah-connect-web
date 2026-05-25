export type AgendaDraftStatus =
  | 'DRAFT'
  | 'SUBMITTED_TO_PRESIDENT'
  | 'CHANGES_REQUESTED'
  | 'APPROVED'
  | 'PUBLISHED';

export interface AgendaDraftItem {
  id: string;
  order: number;
  title: string;
  description?: string;
  isStandard: boolean;
  estimatedDurationMin?: number;
  proposedBy?: string;
}

export interface AgendaDraft {
  id: string;
  tontineId: string;
  sessionId?: string;
  sessionNumber: number;
  scheduledAt: string;
  location?: string;
  beneficiaryMemberId?: string;
  beneficiaryFullName?: string;
  items: AgendaDraftItem[];
  status: AgendaDraftStatus;
  createdAt: string;
  submittedAt?: string;
  approvedAt?: string;
  publishedAt?: string;
  presidentComment?: string;
}

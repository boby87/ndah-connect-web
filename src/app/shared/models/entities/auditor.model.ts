export type AnomalyCategory =
  | 'CASH_DISCREPANCY'
  | 'MISSING_RECEIPT'
  | 'UNAUTHORIZED_OPERATION'
  | 'PROCEDURE_BREACH'
  | 'CALCULATION_ERROR'
  | 'OTHER';

export type AnomalySeverity = 'LOW' | 'MEDIUM' | 'HIGH';
export type AnomalyAudience = 'PRESIDENT' | 'BUREAU' | 'ASSEMBLY';
export type AnomalyStatus = 'OPEN' | 'IN_RESPONSE' | 'RESOLVED' | 'CLOSED';

export interface AnomalyHistoryEntry {
  at: string;
  actor: string;
  action: string;
}

export interface AuditorAnomaly {
  id: string;
  tontineId: string;
  reference: string;
  category: AnomalyCategory;
  severity: AnomalySeverity;
  title: string;
  description: string;
  audience: AnomalyAudience;
  status: AnomalyStatus;
  raisedAt: string;
  raisedByUserId: string;
  raisedByFullName: string;
  detectedAt?: string;
  requestsResponse: boolean;
  copyToTreasurer: boolean;
  response?: string;
  responseAt?: string;
  responseByFullName?: string;
  resolutionComment?: string;
  closedAt?: string;
  history: AnomalyHistoryEntry[];
}

export type ControlKind = 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'AD_HOC';
export type ControlStatus = 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED';

export interface ControlCheckpoint {
  id: string;
  label: string;
  category: 'CASH' | 'RECEIPT' | 'CONTRIBUTION' | 'LOAN' | 'DISTRIBUTION' | 'OTHER';
  expectedValue?: number;
  observedValue?: number;
  variance?: number;
  conform?: boolean;
  note?: string;
}

export interface AuditorControl {
  id: string;
  tontineId: string;
  reference: string;
  kind: ControlKind;
  status: ControlStatus;
  periodFrom: string;
  periodTo: string;
  dueDate?: string;
  startedAt?: string;
  completedAt?: string;
  authorFullName: string;
  checkpoints: ControlCheckpoint[];
  observations?: string;
  conformCount: number;
  anomaliesCount: number;
  generatedAnomalyIds: string[];
}

export type AuditScope = 'FINANCIAL' | 'COMPLIANCE' | 'OPERATIONAL' | 'COMPLETE';
export type AuditStatus = 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED';
export type AuditFinding = 'CONFORM' | 'WITH_RESERVES' | 'NON_CONFORM';

export interface AuditFindingEntry {
  id: string;
  area: string;
  finding: AuditFinding;
  description: string;
}

export interface AuditorAudit {
  id: string;
  tontineId: string;
  reference: string;
  scope: AuditScope;
  status: AuditStatus;
  periodFrom: string;
  periodTo: string;
  startedAt?: string;
  completedAt?: string;
  authorFullName: string;
  overallFinding?: AuditFinding;
  findings: AuditFindingEntry[];
  observations?: string;
  generatedRecommendationIds: string[];
}

export type RecommendationStatus = 'PENDING' | 'IN_PROGRESS' | 'IMPLEMENTED' | 'CLOSED' | 'OVERDUE';
export type RecommendationPriority = 'LOW' | 'MEDIUM' | 'HIGH';
export type RecommendationOrigin = 'PERIODIC_CONTROL' | 'AUDIT' | 'ANOMALY' | 'GENERAL';

export interface AuditorRecommendation {
  id: string;
  tontineId: string;
  reference: string;
  origin: RecommendationOrigin;
  originId?: string;
  title: string;
  description: string;
  priority: RecommendationPriority;
  recipient: 'BUREAU' | 'PRESIDENT' | 'TREASURER';
  dueDate?: string;
  status: RecommendationStatus;
  emittedAt: string;
  emittedByFullName: string;
  acknowledgedAt?: string;
  implementationProgress?: number;
  implementedAt?: string;
  closeNote?: string;
}

export type ClarificationStatus = 'PENDING' | 'RESPONDED' | 'CLOSED' | 'ESCALATED';

export interface AuditorClarification {
  id: string;
  tontineId: string;
  reference: string;
  subject: string;
  question: string;
  targetRole: 'TREASURER' | 'SECRETARY' | 'CENSOR';
  dueWithinHours: number;
  status: ClarificationStatus;
  raisedAt: string;
  raisedByFullName: string;
  response?: string;
  respondedAt?: string;
  respondedByFullName?: string;
  evaluation?: 'SATISFACTORY' | 'PARTIAL' | 'UNSATISFACTORY';
  closedAt?: string;
}

export type CertificationScope = 'MONTH' | 'CYCLE' | 'YEAR';
export type CertificationDecision = 'CERTIFIED' | 'CERTIFIED_WITH_RESERVES' | 'REFUSED';

export interface CertificationBalanceLine {
  label: string;
  amount: number;
}

export interface AuditorCertification {
  id: string;
  tontineId: string;
  reference: string;
  scope: CertificationScope;
  periodLabel: string;
  emittedAt: string;
  emittedByFullName: string;
  decision: CertificationDecision;
  reserves?: string;
  assets: CertificationBalanceLine[];
  liabilities: CertificationBalanceLine[];
  totalAssets: number;
  totalLiabilities: number;
  balanced: boolean;
  signedDigitally: boolean;
  downloadUrl?: string;
}

export type SessionBalanceReviewDecision = 'CONFORM' | 'WITH_RESERVES' | 'REJECTED';

export interface SessionBalanceReview {
  id: string;
  tontineId: string;
  sessionId: string;
  sessionNumber: number;
  reviewedAt: string;
  reviewedByFullName: string;
  decision: SessionBalanceReviewDecision;
  observations?: string;
  reserves?: string;
}

export interface AuditorReport {
  id: string;
  tontineId: string;
  reference: string;
  scope: 'LAST_SESSION' | 'PERIOD' | 'CYCLE';
  periodLabel: string;
  sessionId?: string;
  sessionNumber?: number;
  generatedAt: string;
  authorFullName: string;
  totalBalance: number;
  cashBoxSnapshot: { name: string; balance: number }[];
  validationsCount: number;
  anomaliesCount: number;
  recommendationsCount: number;
  observations?: string;
}

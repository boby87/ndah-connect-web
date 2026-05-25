import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { API_CONFIG } from '../../../core/config/api.config';
import type { ApiResponse } from '../../../core/api/models/api-response.model';
import type { CashMovement, CashBox, Expense, CagnotteDistribution, MobileMoneyTransaction } from '../../../shared/models/entities/treasury.model';
import type { Contribution } from '../../../shared/models/entities/contribution.model';
import type { Loan } from '../../../shared/models/entities/loan.model';
import type { Sanction } from '../../../shared/models/entities/sanction.model';
import type { SessionLive } from '../../../shared/models/entities/session-live.model';
import type {
  AnomalyAudience,
  AnomalyCategory,
  AnomalySeverity,
  AuditFinding,
  AuditScope,
  AuditorAnomaly,
  AuditorAudit,
  AuditorCertification,
  AuditorClarification,
  AuditorControl,
  AuditorRecommendation,
  AuditorReport,
  CertificationDecision,
  CertificationScope,
  ControlCheckpoint,
  ControlKind,
  RecommendationOrigin,
  RecommendationPriority,
  RecommendationStatus,
  SessionBalanceReview,
  SessionBalanceReviewDecision,
} from '../../../shared/models/entities/auditor.model';
import type { PendingValidation } from '../../../shared/models/entities/validation.model';

export interface AuditorDashboard {
  cashBoxes: CashBox[];
  totalBalance: number;
  validations: { financialPending: number; opinionPending: number };
  anomalies: { open: number; severityHigh: number };
  controls: { planned: number; nextDue?: string };
  recommendations: { active: number; implementedRate: number };
  loans: { active: number; overdue: number; totalOutstanding: number };
  recentMovements: CashMovement[];
}

export interface FinancialDataSnapshot {
  cashBoxes: CashBox[];
  movements: CashMovement[];
  contributions: Contribution[];
  loans: Loan[];
  expenses: Expense[];
  distributions: CagnotteDistribution[];
  sanctions: Sanction[];
  totals: {
    totalBalance: number;
    contributions: number;
    expenses: number;
    distributions: number;
  };
}

export interface OpinionPayload {
  status: 'FAVORABLE' | 'RESERVED' | 'UNFAVORABLE';
  comment?: string;
}

export interface BalanceReviewPayload {
  sessionId: string;
  decision: SessionBalanceReviewDecision;
  observations?: string;
  reserves?: string;
}

export interface CreateControlPayload {
  kind: ControlKind;
  periodFrom: string;
  periodTo: string;
}

export interface CompleteControlPayload {
  checkpoints: ControlCheckpoint[];
  observations?: string;
}

export interface CreateAuditPayload {
  scope: AuditScope;
  periodFrom: string;
  periodTo: string;
  findings: { area: string; finding: AuditFinding; description: string }[];
  overallFinding: AuditFinding;
  observations?: string;
}

export interface CreateAnomalyPayload {
  category: AnomalyCategory;
  severity: AnomalySeverity;
  title: string;
  description: string;
  audience: AnomalyAudience;
  requestsResponse?: boolean;
  copyToTreasurer?: boolean;
}

export interface CreateClarificationPayload {
  subject: string;
  question: string;
  targetRole: 'TREASURER' | 'SECRETARY' | 'CENSOR';
  dueWithinHours: number;
}

export interface CreateRecommendationPayload {
  origin: RecommendationOrigin;
  originId?: string;
  title: string;
  description: string;
  priority: RecommendationPriority;
  recipient: 'BUREAU' | 'PRESIDENT' | 'TREASURER';
  dueDate?: string;
}

export interface CreateCertificationPayload {
  scope: CertificationScope;
  periodLabel: string;
  decision: CertificationDecision;
  reserves?: string;
  otp: string;
}

@Injectable({ providedIn: 'root' })
export class AuditorService {
  private readonly http = inject(HttpClient);
  private readonly base = `${API_CONFIG.baseUrl}/auditor`;

  // Dashboard
  async getDashboard(): Promise<AuditorDashboard> {
    const r = await firstValueFrom(
      this.http.get<ApiResponse<AuditorDashboard>>(`${this.base}/dashboard`),
    );
    return r.data;
  }

  async getFinancialData(): Promise<FinancialDataSnapshot> {
    const r = await firstValueFrom(
      this.http.get<ApiResponse<FinancialDataSnapshot>>(`${this.base}/financial-data`),
    );
    return r.data;
  }

  async getSessions(): Promise<SessionLive[]> {
    const r = await firstValueFrom(
      this.http.get<ApiResponse<SessionLive[]>>(`${this.base}/sessions`),
    );
    return r.data;
  }

  // Validations
  async getValidations(): Promise<PendingValidation[]> {
    const r = await firstValueFrom(
      this.http.get<ApiResponse<PendingValidation[]>>(`${this.base}/validations`),
    );
    return r.data;
  }

  async emitOpinion(id: string, payload: OpinionPayload): Promise<PendingValidation> {
    const r = await firstValueFrom(
      this.http.post<ApiResponse<PendingValidation>>(
        `${this.base}/validations/${id}/opinion`,
        payload,
      ),
    );
    return r.data;
  }

  // Balance reviews
  async getBalanceReviews(): Promise<SessionBalanceReview[]> {
    const r = await firstValueFrom(
      this.http.get<ApiResponse<SessionBalanceReview[]>>(`${this.base}/balance-reviews`),
    );
    return r.data;
  }

  async reviewBalance(payload: BalanceReviewPayload): Promise<SessionBalanceReview> {
    const r = await firstValueFrom(
      this.http.post<ApiResponse<SessionBalanceReview>>(`${this.base}/balance-reviews`, payload),
    );
    return r.data;
  }

  // Controls
  async getControls(): Promise<AuditorControl[]> {
    const r = await firstValueFrom(
      this.http.get<ApiResponse<AuditorControl[]>>(`${this.base}/controls`),
    );
    return r.data;
  }

  async createControl(payload: CreateControlPayload): Promise<AuditorControl> {
    const r = await firstValueFrom(
      this.http.post<ApiResponse<AuditorControl>>(`${this.base}/controls`, payload),
    );
    return r.data;
  }

  async completeControl(id: string, payload: CompleteControlPayload): Promise<AuditorControl> {
    const r = await firstValueFrom(
      this.http.post<ApiResponse<AuditorControl>>(`${this.base}/controls/${id}/complete`, payload),
    );
    return r.data;
  }

  // Audits
  async getAudits(): Promise<AuditorAudit[]> {
    const r = await firstValueFrom(
      this.http.get<ApiResponse<AuditorAudit[]>>(`${this.base}/audits`),
    );
    return r.data;
  }

  async createAudit(payload: CreateAuditPayload): Promise<AuditorAudit> {
    const r = await firstValueFrom(
      this.http.post<ApiResponse<AuditorAudit>>(`${this.base}/audits`, payload),
    );
    return r.data;
  }

  // Anomalies
  async getAnomalies(): Promise<AuditorAnomaly[]> {
    const r = await firstValueFrom(
      this.http.get<ApiResponse<AuditorAnomaly[]>>(`${this.base}/anomalies`),
    );
    return r.data;
  }

  async createAnomaly(payload: CreateAnomalyPayload): Promise<AuditorAnomaly> {
    const r = await firstValueFrom(
      this.http.post<ApiResponse<AuditorAnomaly>>(`${this.base}/anomalies`, payload),
    );
    return r.data;
  }

  async closeAnomaly(id: string, resolutionComment?: string): Promise<AuditorAnomaly> {
    const r = await firstValueFrom(
      this.http.post<ApiResponse<AuditorAnomaly>>(`${this.base}/anomalies/${id}/close`, {
        resolutionComment,
      }),
    );
    return r.data;
  }

  async reopenAnomaly(id: string): Promise<AuditorAnomaly> {
    const r = await firstValueFrom(
      this.http.post<ApiResponse<AuditorAnomaly>>(`${this.base}/anomalies/${id}/reopen`, {}),
    );
    return r.data;
  }

  // Clarifications
  async getClarifications(): Promise<AuditorClarification[]> {
    const r = await firstValueFrom(
      this.http.get<ApiResponse<AuditorClarification[]>>(`${this.base}/clarifications`),
    );
    return r.data;
  }

  async createClarification(payload: CreateClarificationPayload): Promise<AuditorClarification> {
    const r = await firstValueFrom(
      this.http.post<ApiResponse<AuditorClarification>>(`${this.base}/clarifications`, payload),
    );
    return r.data;
  }

  async simulateClarificationResponse(id: string, response?: string): Promise<AuditorClarification> {
    const r = await firstValueFrom(
      this.http.post<ApiResponse<AuditorClarification>>(
        `${this.base}/clarifications/${id}/simulate-response`,
        { response },
      ),
    );
    return r.data;
  }

  async evaluateClarification(
    id: string,
    evaluation: 'SATISFACTORY' | 'PARTIAL' | 'UNSATISFACTORY',
  ): Promise<AuditorClarification> {
    const r = await firstValueFrom(
      this.http.post<ApiResponse<AuditorClarification>>(
        `${this.base}/clarifications/${id}/evaluate`,
        { evaluation },
      ),
    );
    return r.data;
  }

  // Recommendations
  async getRecommendations(): Promise<AuditorRecommendation[]> {
    const r = await firstValueFrom(
      this.http.get<ApiResponse<AuditorRecommendation[]>>(`${this.base}/recommendations`),
    );
    return r.data;
  }

  async createRecommendation(payload: CreateRecommendationPayload): Promise<AuditorRecommendation> {
    const r = await firstValueFrom(
      this.http.post<ApiResponse<AuditorRecommendation>>(`${this.base}/recommendations`, payload),
    );
    return r.data;
  }

  async updateRecommendationStatus(
    id: string,
    status: RecommendationStatus,
    progress?: number,
    closeNote?: string,
  ): Promise<AuditorRecommendation> {
    const r = await firstValueFrom(
      this.http.post<ApiResponse<AuditorRecommendation>>(
        `${this.base}/recommendations/${id}/status`,
        { status, progress, closeNote },
      ),
    );
    return r.data;
  }

  // Certifications
  async getCertifications(): Promise<AuditorCertification[]> {
    const r = await firstValueFrom(
      this.http.get<ApiResponse<AuditorCertification[]>>(`${this.base}/certifications`),
    );
    return r.data;
  }

  async certify(payload: CreateCertificationPayload): Promise<AuditorCertification> {
    const r = await firstValueFrom(
      this.http.post<ApiResponse<AuditorCertification>>(`${this.base}/certifications`, payload),
    );
    return r.data;
  }

  // Reports
  async getReports(): Promise<AuditorReport[]> {
    const r = await firstValueFrom(
      this.http.get<ApiResponse<AuditorReport[]>>(`${this.base}/reports`),
    );
    return r.data;
  }

  async generateReport(
    scope: 'LAST_SESSION' | 'PERIOD' | 'CYCLE',
    periodLabel: string,
    observations?: string,
  ): Promise<AuditorReport> {
    const r = await firstValueFrom(
      this.http.post<ApiResponse<AuditorReport>>(`${this.base}/reports/generate`, {
        scope,
        periodLabel,
        observations,
      }),
    );
    return r.data;
  }

  // Export
  async exportData(dataset: string): Promise<{
    dataset: string;
    generatedAt: string;
    downloadUrlExcel: string;
    downloadUrlCsv: string;
    downloadUrlPdf: string;
    recordCount: number;
  }> {
    const r = await firstValueFrom(
      this.http.get<
        ApiResponse<{
          dataset: string;
          generatedAt: string;
          downloadUrlExcel: string;
          downloadUrlCsv: string;
          downloadUrlPdf: string;
          recordCount: number;
        }>
      >(`${this.base}/export`, { params: { dataset } }),
    );
    return r.data;
  }
}

// Re-export for components
export type { MobileMoneyTransaction };

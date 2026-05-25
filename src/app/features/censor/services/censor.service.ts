import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { API_CONFIG } from '../../../core/config/api.config';
import type { ApiResponse } from '../../../core/api/models/api-response.model';
import type { SanctionType } from '../../../core/enums/sanction-type.enum';
import type { Member } from '../../../shared/models/entities/member.model';
import type {
  AbsenceJustification,
  AttendanceModificationRequest,
  CensorCommunication,
  CensorReport,
  Sanction,
  SanctionSeverity,
} from '../../../shared/models/entities/sanction.model';

export interface CensorDashboard {
  alerts: {
    pendingAttendance: number;
    pendingJustifications: number;
    pendingContestations: number;
    unpaidCount: number;
    unpaidAmount: number;
  };
  sanctionsThisPeriod: {
    count: number;
    amount: number;
    collected: number;
    breakdown: { type: string; count: number; amount: number }[];
  };
  topSanctioned: { memberId: string; name: string; count: number; amount: number }[];
  session: { id: string; number: number; status: string; scheduledAt: string } | null;
}

export interface ApplySanctionPayload {
  memberId: string;
  type: SanctionType;
  amount?: number;
  reason: string;
  severity?: SanctionSeverity;
  customLabel?: string;
  isFinancial?: boolean;
}

export interface ApplyMultipleSanctionsPayload {
  memberId: string;
  sanctions: Omit<ApplySanctionPayload, 'memberId'>[];
}

export interface CommunicationPayload {
  kind: 'WARNING' | 'PAYMENT_REMINDER' | 'INFORMATION' | 'CALL_TO_ORDER';
  subject: string;
  body: string;
  channels: ('SMS' | 'EMAIL' | 'PUSH' | 'WHATSAPP')[];
  recipientMemberIds: string[];
  relatedSanctionIds?: string[];
}

export type UnpaidSanction = Sanction & { daysOpen: number };

@Injectable({ providedIn: 'root' })
export class CensorService {
  private readonly http = inject(HttpClient);
  private readonly base = `${API_CONFIG.baseUrl}/censor`;

  // ─── Dashboard ─────────────────────────────────────────────────────────
  async getDashboard(): Promise<CensorDashboard> {
    const r = await firstValueFrom(this.http.get<ApiResponse<CensorDashboard>>(`${this.base}/dashboard`));
    return r.data;
  }

  // ─── Members ───────────────────────────────────────────────────────────
  async getMembers(): Promise<Member[]> {
    const r = await firstValueFrom(this.http.get<ApiResponse<Member[]>>(`${this.base}/members`));
    return r.data;
  }

  // ─── Sanctions ─────────────────────────────────────────────────────────
  async getSanctions(filters?: { status?: string; sessionId?: string }): Promise<Sanction[]> {
    const params: Record<string, string> = {};
    if (filters?.status) params['status'] = filters.status;
    if (filters?.sessionId) params['sessionId'] = filters.sessionId;
    const r = await firstValueFrom(
      this.http.get<ApiResponse<Sanction[]>>(`${this.base}/sanctions`, { params }),
    );
    return r.data;
  }

  async applySanction(payload: ApplySanctionPayload): Promise<Sanction> {
    const r = await firstValueFrom(
      this.http.post<ApiResponse<Sanction>>(`${this.base}/sanctions`, payload),
    );
    return r.data;
  }

  async applyMultipleSanctions(payload: ApplyMultipleSanctionsPayload): Promise<Sanction[]> {
    const r = await firstValueFrom(
      this.http.post<ApiResponse<Sanction[]>>(`${this.base}/sanctions/batch`, payload),
    );
    return r.data;
  }

  async getAutoDetectedSanctions(): Promise<Sanction[]> {
    const r = await firstValueFrom(
      this.http.get<ApiResponse<Sanction[]>>(`${this.base}/sanctions/auto-detected`),
    );
    return r.data;
  }

  async confirmSanctions(sanctionIds: string[]): Promise<Sanction[]> {
    const r = await firstValueFrom(
      this.http.post<ApiResponse<Sanction[]>>(`${this.base}/sanctions/confirm-batch`, { sanctionIds }),
    );
    return r.data;
  }

  async cancelSanction(id: string, reason: string): Promise<Sanction> {
    const r = await firstValueFrom(
      this.http.post<ApiResponse<Sanction>>(`${this.base}/sanctions/${id}/cancel`, { reason }),
    );
    return r.data;
  }

  // ─── Contestations ─────────────────────────────────────────────────────
  async getContestations(): Promise<Sanction[]> {
    const r = await firstValueFrom(
      this.http.get<ApiResponse<Sanction[]>>(`${this.base}/contestations`),
    );
    return r.data;
  }

  async decideContestation(
    id: string,
    decision: 'ACCEPT' | 'REJECT' | 'TRANSFER_PRESIDENT',
    comment?: string,
  ): Promise<Sanction> {
    const r = await firstValueFrom(
      this.http.post<ApiResponse<Sanction>>(`${this.base}/contestations/${id}/decide`, {
        decision,
        comment,
      }),
    );
    return r.data;
  }

  // ─── Attendance modifications ──────────────────────────────────────────
  async getAttendanceModifications(): Promise<AttendanceModificationRequest[]> {
    const r = await firstValueFrom(
      this.http.get<ApiResponse<AttendanceModificationRequest[]>>(
        `${this.base}/attendance-modifications`,
      ),
    );
    return r.data;
  }

  async decideAttendanceModification(
    id: string,
    decision: 'APPROVE' | 'REJECT' | 'REQUEST_INFO',
    comment?: string,
    infoRequest?: string,
  ): Promise<AttendanceModificationRequest> {
    const r = await firstValueFrom(
      this.http.post<ApiResponse<AttendanceModificationRequest>>(
        `${this.base}/attendance-modifications/${id}/decide`,
        { decision, comment, infoRequest },
      ),
    );
    return r.data;
  }

  // ─── Justifications ────────────────────────────────────────────────────
  async getJustifications(): Promise<AbsenceJustification[]> {
    const r = await firstValueFrom(
      this.http.get<ApiResponse<AbsenceJustification[]>>(`${this.base}/justifications`),
    );
    return r.data;
  }

  async decideJustification(
    id: string,
    decision: 'VALIDATE' | 'REJECT' | 'REQUEST_INFO',
    comment?: string,
  ): Promise<AbsenceJustification> {
    const r = await firstValueFrom(
      this.http.post<ApiResponse<AbsenceJustification>>(
        `${this.base}/justifications/${id}/decide`,
        { decision, comment },
      ),
    );
    return r.data;
  }

  async simulatePresidentApproval(id: string): Promise<AbsenceJustification> {
    const r = await firstValueFrom(
      this.http.post<ApiResponse<AbsenceJustification>>(
        `${this.base}/justifications/${id}/president-approve`,
        {},
      ),
    );
    return r.data;
  }

  // ─── Unpaid sanctions ──────────────────────────────────────────────────
  async getUnpaidSanctions(): Promise<UnpaidSanction[]> {
    const r = await firstValueFrom(
      this.http.get<ApiResponse<UnpaidSanction[]>>(`${this.base}/unpaid-sanctions`),
    );
    return r.data;
  }

  // ─── Communications ────────────────────────────────────────────────────
  async getCommunications(): Promise<CensorCommunication[]> {
    const r = await firstValueFrom(
      this.http.get<ApiResponse<CensorCommunication[]>>(`${this.base}/communications`),
    );
    return r.data;
  }

  async sendCommunication(payload: CommunicationPayload): Promise<CensorCommunication> {
    const r = await firstValueFrom(
      this.http.post<ApiResponse<CensorCommunication>>(`${this.base}/communications`, payload),
    );
    return r.data;
  }

  // ─── Reports ───────────────────────────────────────────────────────────
  async getReports(): Promise<CensorReport[]> {
    const r = await firstValueFrom(
      this.http.get<ApiResponse<CensorReport[]>>(`${this.base}/reports`),
    );
    return r.data;
  }

  async generateReport(
    scope: 'LAST_SESSION' | 'CUSTOM_RANGE' | 'CYCLE',
    periodLabel?: string,
    observations?: string,
  ): Promise<CensorReport> {
    const r = await firstValueFrom(
      this.http.post<ApiResponse<CensorReport>>(`${this.base}/reports/generate`, {
        scope,
        periodLabel,
        observations,
      }),
    );
    return r.data;
  }

  async updateReportObservations(id: string, observations: string): Promise<CensorReport> {
    const r = await firstValueFrom(
      this.http.post<ApiResponse<CensorReport>>(`${this.base}/reports/${id}/observations`, {
        observations,
      }),
    );
    return r.data;
  }
}

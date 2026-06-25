import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { API_CONFIG } from '../../../core/config/api.config';
import type { ApiResponse } from '../../../core/api/models/api-response.model';
import type { AgendaDraft } from '../../../shared/models/entities/agenda-draft.model';
import type { Announcement } from '../../../shared/models/entities/announcement.model';
import type {
  ArchiveDocument,
  ArchiveDocumentType,
  ArchiveVisibility,
} from '../../../shared/models/entities/archive-document.model';
import type {
  Convocation,
  ConvocationChannel,
} from '../../../shared/models/entities/convocation.model';
import type { Member } from '../../../shared/models/entities/member.model';
import type {
  MembershipFile,
  MembershipFileKind,
} from '../../../shared/models/entities/membership.model';
import type {
  MinutesDraft,
  MinutesSection,
} from '../../../shared/models/entities/minutes-draft.model';
import type { ReportEntry } from '../../../shared/models/entities/report.model';
import type { RsvpStatus, SessionRsvpSummary } from '../../../shared/models/entities/rsvp.model';
import type { SessionLive } from '../../../shared/models/entities/session-live.model';

export interface SecretaryDashboard {
  nextSession: {
    id: string;
    number: number;
    scheduledAt: string;
    location?: string;
    daysUntil: number;
  } | null;
  rsvpSummary: SessionRsvpSummary | null;
  kpi: {
    minutesPending: number;
    agendaPending: number;
    pendingAdhesions: number;
    pendingResignations: number;
    totalMembers: number;
    archivesCount: number;
  };
  recentActivity: { id: string; label: string; status: string; updatedAt: string }[];
}

export interface CreateAgendaDraftPayload {
  sessionId: string;
  sessionNumber: number;
  scheduledAt: string;
  location?: string;
  beneficiaryMemberId?: string;
  items: {
    title: string;
    description?: string;
    isStandard: boolean;
    estimatedDurationMin?: number;
  }[];
}

export interface CreateConvocationPayload {
  sessionId: string;
  channels: ConvocationChannel[];
  audienceMemberIds: string[];
  includeCandidates?: boolean;
  message: string;
  reminders?: { offsetHoursBefore: number }[];
  scheduledAt?: string;
}

export interface CreateArchivePayload {
  type: ArchiveDocumentType;
  title: string;
  description?: string;
  fileName: string;
  fileSize: number;
  visibility: ArchiveVisibility;
  cycleNumber?: number;
  sessionNumber?: number;
  tags?: string[];
}

export interface GenerateReportPayload {
  category: 'PERIODIC' | 'CYCLE' | 'ATTENDANCE' | 'MEMBERSHIP';
  periodLabel: string;
}

@Injectable({ providedIn: 'root' })
export class SecretaryService {
  private readonly http = inject(HttpClient);
  private readonly base = `${API_CONFIG.baseUrl}/secretary`;

  // ─── Dashboard ─────────────────────────────────────────────────────────
  async getDashboard(): Promise<SecretaryDashboard> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<SecretaryDashboard>>(`${this.base}/dashboard`),
    );
    return response.data;
  }

  // ─── Agendas ───────────────────────────────────────────────────────────
  async getNextSessionNumber(): Promise<number> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<number>>(`${this.base}/agendas/next-session-number`),
    );
    return response.data;
  }

  async getAgendas(): Promise<AgendaDraft[]> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<AgendaDraft[]>>(`${this.base}/agendas`),
    );
    return response.data;
  }

  async getAgenda(id: string): Promise<AgendaDraft> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<AgendaDraft>>(`${this.base}/agendas/${id}`),
    );
    return response.data;
  }

  async createAgenda(payload: CreateAgendaDraftPayload): Promise<AgendaDraft> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<AgendaDraft>>(`${this.base}/agendas`, payload),
    );
    return response.data;
  }

  async submitAgenda(id: string): Promise<AgendaDraft> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<AgendaDraft>>(`${this.base}/agendas/${id}/submit`, {}),
    );
    return response.data;
  }

  // ─── Convocations ──────────────────────────────────────────────────────
  async getConvocations(): Promise<Convocation[]> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<Convocation[]>>(`${this.base}/convocations`),
    );
    return response.data;
  }

  async createConvocation(payload: CreateConvocationPayload): Promise<Convocation> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<Convocation>>(`${this.base}/convocations`, payload),
    );
    return response.data;
  }

  // ─── RSVPs ─────────────────────────────────────────────────────────────
  async getRsvps(sessionId: string): Promise<SessionRsvpSummary> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<SessionRsvpSummary>>(`${this.base}/sessions/${sessionId}/rsvps`),
    );
    return response.data;
  }

  async setRsvp(
    sessionId: string,
    memberId: string,
    status: RsvpStatus,
    reason?: string,
  ): Promise<SessionRsvpSummary> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<SessionRsvpSummary>>(
        `${this.base}/sessions/${sessionId}/rsvps/${memberId}`,
        { status, reason },
      ),
    );
    return response.data;
  }

  async remindPendingRsvps(sessionId: string): Promise<{ remindersSent: number }> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<{ remindersSent: number }>>(
        `${this.base}/sessions/${sessionId}/rsvps/remind`,
        {},
      ),
    );
    return response.data;
  }

  // ─── Attendance ────────────────────────────────────────────────────────
  async setAttendance(
    sessionId: string,
    memberId: string,
    status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED',
  ): Promise<SessionLive> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<SessionLive>>(
        `${this.base}/sessions/${sessionId}/attendance/${memberId}`,
        { status },
      ),
    );
    return response.data;
  }

  async finalizeAttendance(sessionId: string): Promise<SessionLive> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<SessionLive>>(
        `${this.base}/sessions/${sessionId}/attendance/finalize`,
        {},
      ),
    );
    return response.data;
  }

  // ─── Minutes ───────────────────────────────────────────────────────────
  async getMinutesDrafts(): Promise<MinutesDraft[]> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<MinutesDraft[]>>(`${this.base}/minutes`),
    );
    return response.data;
  }

  async getMinutes(id: string): Promise<MinutesDraft> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<MinutesDraft>>(`${this.base}/minutes/${id}`),
    );
    return response.data;
  }

  async saveMinutes(id: string, sections: MinutesSection[]): Promise<MinutesDraft> {
    const response = await firstValueFrom(
      this.http.put<ApiResponse<MinutesDraft>>(`${this.base}/minutes/${id}`, { sections }),
    );
    return response.data;
  }

  async signMinutes(id: string): Promise<MinutesDraft> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<MinutesDraft>>(`${this.base}/minutes/${id}/sign`, {}),
    );
    return response.data;
  }

  // ─── Membership ────────────────────────────────────────────────────────
  async getMembershipFiles(kind?: MembershipFileKind): Promise<MembershipFile[]> {
    const params: Record<string, string> = kind ? { kind } : {};
    const response = await firstValueFrom(
      this.http.get<ApiResponse<MembershipFile[]>>(`${this.base}/membership`, { params }),
    );
    return response.data;
  }

  async reviewMembership(
    id: string,
    decision: 'FORWARD' | 'REJECT',
    comment?: string,
  ): Promise<MembershipFile> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<MembershipFile>>(`${this.base}/membership/${id}/review`, {
        decision,
        comment,
      }),
    );
    return response.data;
  }

  // ─── Members registry ──────────────────────────────────────────────────
  async getMembers(): Promise<Member[]> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<Member[]>>(`${this.base}/members`),
    );
    return response.data;
  }

  async patchMember(id: string, payload: Partial<Pick<Member, 'phone' | 'email' | 'matricule'>>): Promise<Member> {
    const response = await firstValueFrom(
      this.http.patch<ApiResponse<Member>>(`${this.base}/members/${id}`, payload),
    );
    return response.data;
  }

  // ─── Archives ──────────────────────────────────────────────────────────
  async getArchives(params?: { type?: ArchiveDocumentType; cycle?: number }): Promise<ArchiveDocument[]> {
    const q: Record<string, string> = {};
    if (params?.type) q['type'] = params.type;
    if (params?.cycle !== undefined) q['cycle'] = String(params.cycle);
    const response = await firstValueFrom(
      this.http.get<ApiResponse<ArchiveDocument[]>>(`${this.base}/archives`, { params: q }),
    );
    return response.data;
  }

  async addArchive(payload: CreateArchivePayload): Promise<ArchiveDocument> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<ArchiveDocument>>(`${this.base}/archives`, payload),
    );
    return response.data;
  }

  // ─── Announcements ─────────────────────────────────────────────────────
  async getAnnouncements(): Promise<Announcement[]> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<Announcement[]>>(`${this.base}/announcements`),
    );
    return response.data;
  }

  async createAnnouncement(payload: {
    title: string;
    body: string;
    audience: 'ALL' | 'BUREAU' | 'MEMBERS';
    channels: ('IN_APP' | 'SMS' | 'EMAIL')[];
  }): Promise<Announcement> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<Announcement>>(`${this.base}/announcements`, payload),
    );
    return response.data;
  }

  // ─── Reports ───────────────────────────────────────────────────────────
  async getReports(): Promise<ReportEntry[]> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<ReportEntry[]>>(`${this.base}/reports`),
    );
    return response.data;
  }

  async generateReport(payload: GenerateReportPayload): Promise<ReportEntry> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<ReportEntry>>(`${this.base}/reports/generate`, payload),
    );
    return response.data;
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { API_CONFIG } from '../../../core/config/api.config';
import { DecisionType } from '../../../core/enums/validation.enum';
import type { ApiResponse } from '../../../core/api/models/api-response.model';
import type {
  Announcement,
  AnnouncementAudience,
  AnnouncementChannel,
  PresidentDashboard,
} from '../../../shared/models/entities/announcement.model';
import type {
  Conflict,
  ConflictDecisionOutcome,
} from '../../../shared/models/entities/conflict.model';
import type { CycleClose } from '../../../shared/models/entities/cycle-close.model';
import type {
  Delegation,
  DelegationPower,
} from '../../../shared/models/entities/delegation.model';
import type {
  EmergencyBlock,
  EmergencyBlockTarget,
} from '../../../shared/models/entities/emergency-block.model';
import type { ExtraordinaryContribution } from '../../../shared/models/entities/extraordinary-contribution.model';
import type {
  MembershipFile,
  MembershipFileKind,
} from '../../../shared/models/entities/membership.model';
import type { ReportEntry, ReportCategory } from '../../../shared/models/entities/report.model';
import type { Sanction } from '../../../shared/models/entities/sanction.model';
import type { SessionLive } from '../../../shared/models/entities/session-live.model';
import type {
  PendingValidation,
  ValidationDecision,
} from '../../../shared/models/entities/validation.model';
import type { Vote, VoteAudience, VoteScope } from '../../../shared/models/entities/vote.model';

export interface DecisionPayload {
  decision: DecisionType;
  comment?: string;
}

export interface CreateAnnouncementPayload {
  title: string;
  body: string;
  audience: AnnouncementAudience;
  channels: AnnouncementChannel[];
}

export interface CreateExtraordinaryContributionPayload {
  motive: string;
  beneficiaryMemberId?: string;
  amountPerMember: number;
  dueDate: string;
  exemptBeneficiary: boolean;
}

export interface CreateVotePayload {
  question: string;
  description?: string;
  options: string[];
  isAnonymous: boolean;
  hideResultsUntilClose: boolean;
  scope: VoteScope;
  audience: VoteAudience;
  opensAt: string;
  closesAt: string;
  quorumPercent: number;
}

export interface CreateDelegationPayload {
  delegateeUserId: string;
  powers: DelegationPower[];
  reason: string;
  startsAt: string;
  endsAt: string;
}

export interface CreateEmergencyBlockPayload {
  target: EmergencyBlockTarget;
  targetRef?: string;
  reason: string;
}

@Injectable({ providedIn: 'root' })
export class PresidentService {
  private readonly http = inject(HttpClient);
  private readonly base = `${API_CONFIG.baseUrl}/president`;

  // ─── Dashboard ─────────────────────────────────────────────────────────
  async getDashboard(): Promise<PresidentDashboard> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<PresidentDashboard>>(`${this.base}/dashboard`),
    );
    return response.data;
  }

  // ─── Validations (Flows 2 & 3) ─────────────────────────────────────────
  async getValidations(category?: string): Promise<PendingValidation[]> {
    const params: Record<string, string> = category ? { category } : {};
    const response = await firstValueFrom(
      this.http.get<ApiResponse<PendingValidation[]>>(`${this.base}/validations`, { params }),
    );
    return response.data;
  }

  async getValidation(id: string): Promise<PendingValidation> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<PendingValidation>>(`${this.base}/validations/${id}`),
    );
    return response.data;
  }

  async decideValidation(id: string, payload: DecisionPayload): Promise<ValidationDecision> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<ValidationDecision>>(
        `${this.base}/validations/${id}/decide`,
        payload,
      ),
    );
    return response.data;
  }

  // ─── Sanctions (Flow 11) ───────────────────────────────────────────────
  async getSanctionsForReview(): Promise<Sanction[]> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<Sanction[]>>(`${this.base}/sanctions`),
    );
    return response.data;
  }

  async waiveSanction(id: string, reason: string): Promise<Sanction> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<Sanction>>(`${this.base}/sanctions/${id}/waive`, { reason }),
    );
    return response.data;
  }

  async confirmSanction(id: string): Promise<Sanction> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<Sanction>>(`${this.base}/sanctions/${id}/confirm`, {}),
    );
    return response.data;
  }

  // ─── Announcements (Flow 9) ────────────────────────────────────────────
  async getAnnouncements(): Promise<Announcement[]> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<Announcement[]>>(`${this.base}/announcements`),
    );
    return response.data;
  }

  async createAnnouncement(payload: CreateAnnouncementPayload): Promise<Announcement> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<Announcement>>(`${this.base}/announcements`, payload),
    );
    return response.data;
  }

  // ─── Sessions (Flow 4) ─────────────────────────────────────────────────
  async getSessions(): Promise<SessionLive[]> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<SessionLive[]>>(`${this.base}/sessions`),
    );
    return response.data;
  }

  async getSession(id: string): Promise<SessionLive> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<SessionLive>>(`${this.base}/sessions/${id}`),
    );
    return response.data;
  }

  async openSession(id: string): Promise<SessionLive> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<SessionLive>>(`${this.base}/sessions/${id}/open`, {}),
    );
    return response.data;
  }

  async advanceAgenda(sessionId: string, agendaId: string): Promise<SessionLive> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<SessionLive>>(
        `${this.base}/sessions/${sessionId}/agenda/${agendaId}/advance`,
        {},
      ),
    );
    return response.data;
  }

  async signCagnotte(id: string): Promise<SessionLive> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<SessionLive>>(`${this.base}/sessions/${id}/sign-cagnotte`, {}),
    );
    return response.data;
  }

  async closeSession(id: string, nextSessionDate?: string): Promise<SessionLive> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<SessionLive>>(`${this.base}/sessions/${id}/close`, {
        nextSessionDate,
      }),
    );
    return response.data;
  }

  // ─── Membership (Flow 5) ───────────────────────────────────────────────
  async getMembershipFiles(kind?: MembershipFileKind): Promise<MembershipFile[]> {
    const params: Record<string, string> = kind ? { kind } : {};
    const response = await firstValueFrom(
      this.http.get<ApiResponse<MembershipFile[]>>(`${this.base}/membership`, { params }),
    );
    return response.data;
  }

  async getMembershipFile(id: string): Promise<MembershipFile> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<MembershipFile>>(`${this.base}/membership/${id}`),
    );
    return response.data;
  }

  async decideMembershipFile(
    id: string,
    decision: 'APPROVE' | 'REJECT',
    comment?: string,
  ): Promise<MembershipFile> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<MembershipFile>>(`${this.base}/membership/${id}/decide`, {
        decision,
        comment,
      }),
    );
    return response.data;
  }

  // ─── Extraordinary Contributions (Flow 6) ──────────────────────────────
  async getExtraordinaryContributions(): Promise<ExtraordinaryContribution[]> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<ExtraordinaryContribution[]>>(
        `${this.base}/extraordinary-contributions`,
      ),
    );
    return response.data;
  }

  async createExtraordinaryContribution(
    payload: CreateExtraordinaryContributionPayload,
  ): Promise<ExtraordinaryContribution> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<ExtraordinaryContribution>>(
        `${this.base}/extraordinary-contributions`,
        payload,
      ),
    );
    return response.data;
  }

  async closeExtraordinaryContribution(id: string): Promise<ExtraordinaryContribution> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<ExtraordinaryContribution>>(
        `${this.base}/extraordinary-contributions/${id}/close`,
        {},
      ),
    );
    return response.data;
  }

  async distributeExtraordinaryContribution(id: string): Promise<ExtraordinaryContribution> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<ExtraordinaryContribution>>(
        `${this.base}/extraordinary-contributions/${id}/distribute`,
        {},
      ),
    );
    return response.data;
  }

  // ─── Conflicts (Flow 7) ────────────────────────────────────────────────
  async getConflicts(): Promise<Conflict[]> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<Conflict[]>>(`${this.base}/conflicts`),
    );
    return response.data;
  }

  async getConflict(id: string): Promise<Conflict> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<Conflict>>(`${this.base}/conflicts/${id}`),
    );
    return response.data;
  }

  async scheduleConflictMediation(
    id: string,
    scheduledAt: string,
    note?: string,
  ): Promise<Conflict> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<Conflict>>(`${this.base}/conflicts/${id}/schedule-mediation`, {
        scheduledAt,
        note,
      }),
    );
    return response.data;
  }

  async decideConflict(
    id: string,
    outcome: ConflictDecisionOutcome,
    comment: string,
  ): Promise<Conflict> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<Conflict>>(`${this.base}/conflicts/${id}/decide`, {
        outcome,
        comment,
      }),
    );
    return response.data;
  }

  // ─── Cycle Close (Flow 8) ──────────────────────────────────────────────
  async getCycleClose(): Promise<CycleClose> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<CycleClose>>(`${this.base}/cycle-close`),
    );
    return response.data;
  }

  async markCycleCheck(key: string): Promise<CycleClose> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<CycleClose>>(`${this.base}/cycle-close/check/${key}`, {}),
    );
    return response.data;
  }

  async signCycleClose(
    nextCycleStartDate: string,
    drawMode: 'RANDOM' | 'SENIORITY' | 'ASSEMBLY_VOTE',
  ): Promise<CycleClose> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<CycleClose>>(`${this.base}/cycle-close/sign`, {
        nextCycleStartDate,
        drawMode,
      }),
    );
    return response.data;
  }

  // ─── Votes (Flow 10) ───────────────────────────────────────────────────
  async getVotes(): Promise<Vote[]> {
    const response = await firstValueFrom(this.http.get<ApiResponse<Vote[]>>(`${this.base}/votes`));
    return response.data;
  }

  async getVote(id: string): Promise<Vote> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<Vote>>(`${this.base}/votes/${id}`),
    );
    return response.data;
  }

  async createVote(payload: CreateVotePayload): Promise<Vote> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<Vote>>(`${this.base}/votes`, payload),
    );
    return response.data;
  }

  async closeVote(id: string): Promise<Vote> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<Vote>>(`${this.base}/votes/${id}/close`, {}),
    );
    return response.data;
  }

  // ─── Delegations (Flow 12) ─────────────────────────────────────────────
  async getDelegations(): Promise<Delegation[]> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<Delegation[]>>(`${this.base}/delegations`),
    );
    return response.data;
  }

  async createDelegation(payload: CreateDelegationPayload): Promise<Delegation> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<Delegation>>(`${this.base}/delegations`, payload),
    );
    return response.data;
  }

  async revokeDelegation(id: string, reason: string): Promise<Delegation> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<Delegation>>(`${this.base}/delegations/${id}/revoke`, { reason }),
    );
    return response.data;
  }

  // ─── Emergency Blocks (Flow 13) ────────────────────────────────────────
  async getEmergencyBlocks(): Promise<EmergencyBlock[]> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<EmergencyBlock[]>>(`${this.base}/emergency-blocks`),
    );
    return response.data;
  }

  async createEmergencyBlock(payload: CreateEmergencyBlockPayload): Promise<EmergencyBlock> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<EmergencyBlock>>(`${this.base}/emergency-blocks`, payload),
    );
    return response.data;
  }

  async liftEmergencyBlock(id: string, reason: string): Promise<EmergencyBlock> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<EmergencyBlock>>(`${this.base}/emergency-blocks/${id}/lift`, {
        reason,
      }),
    );
    return response.data;
  }

  // ─── Reports (Flow 14) ─────────────────────────────────────────────────
  async getReports(category?: ReportCategory): Promise<ReportEntry[]> {
    const params: Record<string, string> = category ? { category } : {};
    const response = await firstValueFrom(
      this.http.get<ApiResponse<ReportEntry[]>>(`${this.base}/reports`, { params }),
    );
    return response.data;
  }

  async getReport(id: string): Promise<ReportEntry> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<ReportEntry>>(`${this.base}/reports/${id}`),
    );
    return response.data;
  }
}

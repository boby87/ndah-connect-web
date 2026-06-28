import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { API_CONFIG } from '../../../core/config/api.config';
import type { ApiResponse } from '../../../core/api/models/api-response.model';
import type { Contribution } from '../../../shared/models/entities/contribution.model';
import type { Cycle } from '../../../shared/models/entities/cycle.model';
import type { Loan } from '../../../shared/models/entities/loan.model';
import type { Member } from '../../../shared/models/entities/member.model';
import type { MemberSessionView } from '../../../shared/models/entities/member-session-view.model';
import type { Session } from '../../../shared/models/entities/session.model';
import type { Tontine } from '../../../shared/models/entities/tontine.model';

export interface MemberSummary {
  member: Member;
  tontine?: Tontine;
  totalContributed: number;
  totalArrears: number;
  activeLoans: number;
  nextSession?: Session;
  tourPosition?: number;
}

@Injectable({ providedIn: 'root' })
export class MemberService {
  private readonly http = inject(HttpClient);
  private readonly base = `${API_CONFIG.baseUrl}/members/me`;

  async getSummary(): Promise<MemberSummary> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<MemberSummary>>(`${this.base}/summary`),
    );
    return response.data;
  }

  async getContributions(): Promise<Contribution[]> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<Contribution[]>>(`${this.base}/contributions`),
    );
    return response.data;
  }

  async getLoans(): Promise<Loan[]> {
    const response = await firstValueFrom(this.http.get<ApiResponse<Loan[]>>(`${this.base}/loans`));
    return response.data;
  }

  async getPlanning(): Promise<Session[]> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<Session[]>>(`${this.base}/planning`),
    );
    return response.data;
  }

  async getCycles(): Promise<Cycle[]> {
    try {
      const response = await firstValueFrom(
        this.http.get<ApiResponse<Cycle[]>>(`${this.base}/cycles`),
      );
      return response.data;
    } catch (err) {
      if (err instanceof HttpErrorResponse && err.status === 404) return [];
      throw err;
    }
  }

  async getSessionsByCycle(cycleId: string): Promise<MemberSessionView[]> {
    try {
      const response = await firstValueFrom(
        this.http.get<ApiResponse<MemberSessionView[]>>(`${this.base}/cycles/${cycleId}/sessions`),
      );
      return response.data;
    } catch (err) {
      if (err instanceof HttpErrorResponse && err.status === 404) return [];
      throw err;
    }
  }

  async getSessions(): Promise<MemberSessionView[]> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<MemberSessionView[]>>(`${this.base}/sessions`),
    );
    return response.data;
  }

  async getSession(sessionId: string): Promise<MemberSessionView> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<MemberSessionView>>(`${this.base}/sessions/${sessionId}`),
    );
    return response.data;
  }
}

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { API_CONFIG } from '../../../core/config/api.config';
import type { ApiResponse } from '../../../core/api/models/api-response.model';
import type { Vote, VoteStatus } from '../../../shared/models/entities/vote.model';

export interface MemberVoteBallot {
  voteId: string;
  optionId: string;
  optionLabel: string;
  castAt: string;
}

export interface CastVotePayload {
  optionId: string;
}

@Injectable({ providedIn: 'root' })
export class MemberVoteService {
  private readonly http = inject(HttpClient);
  private readonly base = `${API_CONFIG.baseUrl}/members/me/votes`;

  async list(status?: VoteStatus): Promise<Vote[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    const response = await firstValueFrom(
      this.http.get<ApiResponse<Vote[]>>(this.base, { params }),
    );
    return response.data;
  }

  listOpen(): Promise<Vote[]> {
    return this.list('OPEN');
  }

  async getDetail(id: string): Promise<Vote> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<Vote>>(`${this.base}/${id}`),
    );
    return response.data;
  }

  async cast(voteId: string, optionId: string): Promise<MemberVoteBallot> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<MemberVoteBallot>>(`${this.base}/${voteId}/cast`, { optionId }),
    );
    return response.data;
  }

  async hasVoted(voteId: string): Promise<boolean> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<{ hasVoted: boolean }>>(`${this.base}/${voteId}/ballot-status`),
    );
    return response.data.hasVoted;
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { API_CONFIG } from '../../../core/config/api.config';
import type { ApiResponse } from '../../../core/api/models/api-response.model';
import type {
  ContributionFrequency,
  FounderInvite,
  Tontine,
  TontineRules,
} from '../../../shared/models/entities/tontine.model';

export interface CreateTontinePayload {
  name: string;
  description?: string;
  startDate: string;
  contributionAmount: number;
  frequency: ContributionFrequency;
  maxMembers: number;
  rules: TontineRules;
  founders: FounderInvite[];
}

@Injectable({ providedIn: 'root' })
export class TontineService {
  private readonly http = inject(HttpClient);
  private readonly base = `${API_CONFIG.baseUrl}/tontines`;

  async list(): Promise<Tontine[]> {
    const r = await firstValueFrom(this.http.get<ApiResponse<Tontine[]>>(this.base));
    return r.data;
  }

  async mine(): Promise<Tontine[]> {
    const r = await firstValueFrom(this.http.get<ApiResponse<Tontine[]>>(`${this.base}/mine`));
    return r.data;
  }

  async create(payload: CreateTontinePayload): Promise<Tontine> {
    const r = await firstValueFrom(
      this.http.post<ApiResponse<Tontine>>(this.base, payload),
    );
    return r.data;
  }
}

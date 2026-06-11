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

/**
 * Champs modifiables d'une tontine après sa création.
 *
 * Les fondateurs ne sont pas inclus : la composition du bureau se gère via le module
 * d'invitations (`/president/invitations`) et les dossiers d'adhésion, pas par édition directe.
 */
export interface UpdateTontinePayload {
  name: string;
  description?: string;
  startDate: string;
  contributionAmount: number;
  frequency: ContributionFrequency;
  maxMembers: number;
  rules: TontineRules;
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

  async getById(id: string): Promise<Tontine> {
    const r = await firstValueFrom(
      this.http.get<ApiResponse<Tontine>>(`${this.base}/${id}`),
    );
    return r.data;
  }

  async update(id: string, payload: UpdateTontinePayload): Promise<Tontine> {
    // Le backend expose un PATCH partiel (cf. TontineController.update), réservé au Président.
    const r = await firstValueFrom(
      this.http.patch<ApiResponse<Tontine>>(`${this.base}/${id}`, payload),
    );
    return r.data;
  }
}

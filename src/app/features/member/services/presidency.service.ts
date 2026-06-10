import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { API_CONFIG } from '../../../core/config/api.config';
import type { ApiResponse } from '../../../core/api/models/api-response.model';
import type { PresidencyTransfer } from '../../../shared/models/entities/presidency-transfer.model';

export interface DeclinePresidencyTransferPayload {
  reason: string;
}

@Injectable({ providedIn: 'root' })
export class MemberPresidencyService {
  private readonly http = inject(HttpClient);
  private readonly base = `${API_CONFIG.baseUrl}/members/me/presidency-transfer`;

  async getPending(): Promise<PresidencyTransfer | null> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<PresidencyTransfer | null>>(`${this.base}/pending`),
    );
    return response.data;
  }

  async accept(id: string): Promise<PresidencyTransfer> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<PresidencyTransfer>>(`${this.base}/${id}/accept`, {}),
    );
    return response.data;
  }

  async decline(id: string, reason: string): Promise<PresidencyTransfer> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<PresidencyTransfer>>(`${this.base}/${id}/decline`, { reason }),
    );
    return response.data;
  }
}

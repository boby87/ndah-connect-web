import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiListResponse, ApiResponse, PaginationParams } from '../models';
import { Sanction } from '../../../shared/models/entities';

@Injectable({ providedIn: 'root' })
export class SanctionApiService {
  private readonly api = inject(ApiService);

  getAll(tontineId: string, params?: PaginationParams): Observable<ApiListResponse<Sanction>> {
    return this.api.get(`tontines/${tontineId}/sanctions`, params as Record<string, string | number>);
  }

  getByMember(memberId: string): Observable<ApiListResponse<Sanction>> {
    return this.api.get(`members/${memberId}/sanctions`);
  }

  create(data: Partial<Sanction>): Observable<ApiResponse<Sanction>> {
    return this.api.post('sanctions', data);
  }

  pay(id: string, data: { method: string; reference?: string }): Observable<ApiResponse<void>> {
    return this.api.post(`sanctions/${id}/pay`, data);
  }

  contest(id: string, reason: string): Observable<ApiResponse<void>> {
    return this.api.post(`sanctions/${id}/contest`, { reason });
  }

  resolveContest(id: string, accept: boolean, reason?: string): Observable<ApiResponse<void>> {
    return this.api.post(`sanctions/${id}/resolve-contest`, { accept, reason });
  }

  cancel(id: string, reason: string): Observable<ApiResponse<void>> {
    return this.api.post(`sanctions/${id}/cancel`, { reason });
  }
}

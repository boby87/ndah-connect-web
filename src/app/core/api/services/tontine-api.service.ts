import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiListResponse, ApiResponse, PaginationParams } from '../models';
import { CashBox, Member, Session, Tontine } from '../../../shared/models/entities';

@Injectable({ providedIn: 'root' })
export class TontineApiService {
  private readonly api = inject(ApiService);

  getAll(params?: PaginationParams): Observable<ApiListResponse<Tontine>> {
    return this.api.get('tontines', params as Record<string, string | number>);
  }

  getById(id: string): Observable<ApiResponse<Tontine>> {
    return this.api.get(`tontines/${id}`);
  }

  create(data: Partial<Tontine>): Observable<ApiResponse<Tontine>> {
    return this.api.post('tontines', data);
  }

  update(id: string, data: Partial<Tontine>): Observable<ApiResponse<Tontine>> {
    return this.api.put(`tontines/${id}`, data);
  }

  delete(id: string): Observable<ApiResponse<void>> {
    return this.api.delete(`tontines/${id}`);
  }

  getMembers(tontineId: string, params?: PaginationParams): Observable<ApiListResponse<Member>> {
    return this.api.get(`tontines/${tontineId}/members`, params as Record<string, string | number>);
  }

  getSessions(tontineId: string, params?: PaginationParams): Observable<ApiListResponse<Session>> {
    return this.api.get(`tontines/${tontineId}/sessions`, params as Record<string, string | number>);
  }

  getCashBoxes(tontineId: string): Observable<ApiResponse<CashBox[]>> {
    return this.api.get(`tontines/${tontineId}/cash-boxes`);
  }
}

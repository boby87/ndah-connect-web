import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiListResponse, ApiResponse } from '../models';
import { Member } from '../../../shared/models/entities';

@Injectable({ providedIn: 'root' })
export class MemberApiService {
  private readonly api = inject(ApiService);

  getById(id: string): Observable<ApiResponse<Member>> {
    return this.api.get(`members/${id}`);
  }

  update(id: string, data: Partial<Member>): Observable<ApiResponse<Member>> {
    return this.api.put(`members/${id}`, data);
  }

  requestAdhesion(tontineId: string, data: unknown): Observable<ApiResponse<void>> {
    return this.api.post(`tontines/${tontineId}/adhesion`, data);
  }

  getAdhesionRequests(tontineId: string): Observable<ApiListResponse<Member>> {
    return this.api.get(`tontines/${tontineId}/adhesion-requests`);
  }

  approveAdhesion(requestId: string): Observable<ApiResponse<void>> {
    return this.api.post(`adhesion-requests/${requestId}/approve`, {});
  }

  rejectAdhesion(requestId: string, reason: string): Observable<ApiResponse<void>> {
    return this.api.post(`adhesion-requests/${requestId}/reject`, { reason });
  }

  resign(memberId: string, reason: string): Observable<ApiResponse<void>> {
    return this.api.post(`members/${memberId}/resign`, { reason });
  }

  suspend(memberId: string, reason: string): Observable<ApiResponse<void>> {
    return this.api.post(`members/${memberId}/suspend`, { reason });
  }

  activate(memberId: string): Observable<ApiResponse<void>> {
    return this.api.post(`members/${memberId}/activate`, {});
  }
}

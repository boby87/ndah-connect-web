import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiListResponse, ApiResponse } from '../models';
import { Contribution } from '../../../shared/models/entities';

@Injectable({ providedIn: 'root' })
export class ContributionApiService {
  private readonly api = inject(ApiService);

  getBySession(sessionId: string): Observable<ApiListResponse<Contribution>> {
    return this.api.get(`sessions/${sessionId}/contributions`);
  }

  getByMember(memberId: string): Observable<ApiListResponse<Contribution>> {
    return this.api.get(`members/${memberId}/contributions`);
  }

  create(data: Partial<Contribution>): Observable<ApiResponse<Contribution>> {
    return this.api.post('contributions', data);
  }

  confirm(id: string): Observable<ApiResponse<Contribution>> {
    return this.api.post(`contributions/${id}/confirm`, {});
  }

  getArrears(tontineId: string): Observable<ApiListResponse<Contribution>> {
    return this.api.get(`tontines/${tontineId}/arrears`);
  }
}

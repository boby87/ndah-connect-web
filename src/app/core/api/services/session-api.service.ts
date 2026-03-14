import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse } from '../models';
import { Attendance, Session } from '../../../shared/models/entities';

@Injectable({ providedIn: 'root' })
export class SessionApiService {
  private readonly api = inject(ApiService);

  getById(id: string): Observable<ApiResponse<Session>> {
    return this.api.get(`sessions/${id}`);
  }

  create(data: Partial<Session>): Observable<ApiResponse<Session>> {
    return this.api.post('sessions', data);
  }

  update(id: string, data: Partial<Session>): Observable<ApiResponse<Session>> {
    return this.api.put(`sessions/${id}`, data);
  }

  open(id: string): Observable<ApiResponse<Session>> {
    return this.api.post(`sessions/${id}/open`, {});
  }

  close(id: string): Observable<ApiResponse<Session>> {
    return this.api.post(`sessions/${id}/close`, {});
  }

  getAttendance(sessionId: string): Observable<ApiResponse<Attendance[]>> {
    return this.api.get(`sessions/${sessionId}/attendance`);
  }

  markAttendance(sessionId: string, data: Partial<Attendance>[]): Observable<ApiResponse<void>> {
    return this.api.post(`sessions/${sessionId}/attendance`, data);
  }
}

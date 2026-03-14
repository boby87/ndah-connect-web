import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiListResponse, ApiResponse, PaginationParams } from '../models';
import { Notification } from '../../../shared/models/entities';

@Injectable({ providedIn: 'root' })
export class NotificationApiService {
  private readonly api = inject(ApiService);

  getAll(params?: PaginationParams): Observable<ApiListResponse<Notification>> {
    return this.api.get('notifications', params as Record<string, string | number>);
  }

  markAsRead(id: string): Observable<ApiResponse<void>> {
    return this.api.post(`notifications/${id}/read`, {});
  }

  markAllAsRead(): Observable<ApiResponse<void>> {
    return this.api.post('notifications/read-all', {});
  }

  getUnreadCount(): Observable<ApiResponse<{ count: number }>> {
    return this.api.get('notifications/unread-count');
  }
}

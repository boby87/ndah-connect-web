import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { API_CONFIG } from '../../../core/config/api.config';
import type { ApiResponse, ApiListResponse } from '../../../core/api/models/api-response.model';
import type {
  AppNotification,
  NotificationCategory,
} from '../../../shared/models/entities/notification.model';

export interface NotificationListQuery {
  page?: number;
  pageSize?: number;
  isRead?: boolean;
  category?: NotificationCategory;
}

export interface NotificationListResult {
  items: AppNotification[];
  total: number;
  page: number;
  pageSize: number;
  hasNext: boolean;
}

@Injectable({ providedIn: 'root' })
export class NotificationsApiService {
  private readonly http = inject(HttpClient);
  private readonly base = `${API_CONFIG.baseUrl}/notifications`;

  private readonly unreadCountSignal = signal<number>(0);
  readonly unreadCount = this.unreadCountSignal.asReadonly();
  readonly hasUnread = computed(() => this.unreadCountSignal() > 0);

  async list(query: NotificationListQuery = {}): Promise<NotificationListResult> {
    let params = new HttpParams();
    if (query.page !== undefined) params = params.set('page', String(query.page));
    if (query.pageSize !== undefined) params = params.set('pageSize', String(query.pageSize));
    if (query.isRead !== undefined) params = params.set('isRead', String(query.isRead));
    if (query.category) params = params.set('category', query.category);

    const response = await firstValueFrom(
      this.http.get<ApiListResponse<AppNotification>>(this.base, { params }),
    );
    return {
      items: response.data,
      total: response.meta.total,
      page: response.meta.page,
      pageSize: response.meta.pageSize,
      hasNext: response.meta.hasNext,
    };
  }

  async fetchUnreadCount(): Promise<number> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<{ count: number }>>(`${this.base}/unread-count`),
    );
    this.unreadCountSignal.set(response.data.count);
    return response.data.count;
  }

  async markAsRead(id: string): Promise<AppNotification> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<AppNotification>>(`${this.base}/${id}/read`, {}),
    );
    this.unreadCountSignal.update((count) => Math.max(0, count - 1));
    return response.data;
  }

  async markAllAsRead(): Promise<{ updated: number }> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<{ updated: number }>>(`${this.base}/read-all`, {}),
    );
    this.unreadCountSignal.set(0);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await firstValueFrom(this.http.delete<void>(`${this.base}/${id}`));
  }

  async deleteAllRead(): Promise<number> {
    const response = await firstValueFrom(
      this.http.delete<ApiResponse<{ count: number }>>(`${this.base}/read-all`),
    );
    return response.data.count;
  }
}

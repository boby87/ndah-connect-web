import { Injectable, computed, effect, inject } from '@angular/core';
import { WebSocketService } from '../../core/services/websocket.service';
import { NotificationService } from '../../core/services/notification.service';

interface NotificationPayload {
  title?: string;
  message?: string;
  kind?: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationStore {
  private readonly ws = inject(WebSocketService);
  private readonly toast = inject(NotificationService);

  readonly unreadCount = this.ws.unreadCount;
  readonly lastNotification = this.ws.lastNotification;
  readonly connected = this.ws.connected;

  readonly hasUnread = computed(() => this.unreadCount() > 0);

  constructor() {
    effect(() => {
      const notification = this.lastNotification();
      if (notification?.type === 'notification.created') {
        const payload = notification.payload as NotificationPayload;
        const title = payload?.title ?? 'Nouvelle notification';
        const message = payload?.message ?? '';
        this.toast.info(message, title);
      }
    });
  }
}

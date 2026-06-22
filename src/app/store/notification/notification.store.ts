import { Injectable, computed, effect, inject } from '@angular/core';
import { WebSocketService } from '../../core/services/websocket.service';

@Injectable({ providedIn: 'root' })
export class NotificationStore {
  private readonly ws = inject(WebSocketService);

  readonly unreadCount = this.ws.unreadCount;
  readonly lastNotification = this.ws.lastNotification;
  readonly connected = this.ws.connected;

  readonly hasUnread = computed(() => this.unreadCount() > 0);

  constructor() {
    effect(() => {
      const notification = this.lastNotification();
      if (notification?.type === 'notification.created') {
        // signal pour déclencher un rafraichissement dans les composants abonnés
      }
    });
  }
}

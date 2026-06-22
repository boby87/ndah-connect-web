import { Injectable, OnDestroy, inject, signal } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { environment } from '../../../environments/environment';
import { TokenService } from '../auth/services/token.service';
import { NotificationsApiService } from '../../features/notifications/services/notifications-api.service';

export interface WsNotification {
  type: string;
  payload: unknown;
  emittedAt: string;
}

export interface WsEvent {
  type: string;
  payload: unknown;
  emittedAt: string;
}

@Injectable({ providedIn: 'root' })
export class WebSocketService implements OnDestroy {
  private readonly tokenService = inject(TokenService);
  private readonly notificationsApi = inject(NotificationsApiService);

  private client: Client | null = null;
  readonly connected = signal(false);
  readonly lastNotification = signal<WsNotification | null>(null);
  readonly unreadCount = signal(0);

  private buildWsFactory(token: string): () => WebSocket {
    const base = environment.wsUrl || '/api/ws';
    const url = `${base}?token=${token}`;
    return () => new SockJS(url) as unknown as WebSocket;
  }

  connect(): void {
    if (this.client?.active) return;

    const token = this.tokenService.getAccessToken();
    if (!token) return;

    this.client = new Client({
      webSocketFactory: this.buildWsFactory(token),
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 5000,
      onConnect: () => {
        this.connected.set(true);
        this.subscribeToNotifications();
        void this.notificationsApi.fetchUnreadCount().then((count) => this.unreadCount.set(count));
      },
      onDisconnect: () => {
        this.connected.set(false);
      },
      onStompError: () => {
        this.connected.set(false);
      },
    });

    this.client.activate();
  }

  disconnect(): void {
    if (this.client?.active) {
      void this.client.deactivate();
    }
    this.client = null;
    this.connected.set(false);
  }

  private subscribeToNotifications(): void {
    this.client?.subscribe('/user/queue/notifications', (msg: IMessage) => {
      try {
        const notification = JSON.parse(msg.body) as WsNotification;
        this.lastNotification.set(notification);
      } catch {
        // ignore malformed messages
      }
    });

    this.client?.subscribe('/user/queue/notifications/count', (msg: IMessage) => {
      try {
        const event = JSON.parse(msg.body) as WsEvent;
        if (typeof event.payload === 'number') {
          this.unreadCount.set(event.payload);
        }
      } catch {
        // ignore malformed messages
      }
    });
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}

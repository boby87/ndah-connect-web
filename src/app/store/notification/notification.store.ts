import { Injectable, signal } from '@angular/core';
import { Notification } from '../../shared/models/entities';

@Injectable({ providedIn: 'root' })
export class NotificationStore {
  private readonly _notifications = signal<Notification[]>([]);
  private readonly _unreadCount = signal(0);

  readonly notifications = this._notifications.asReadonly();
  readonly unreadCount = this._unreadCount.asReadonly();

  addNotification(notification: Notification): void {
    this._notifications.update(list => [notification, ...list]);
    if (!notification.isRead) {
      this._unreadCount.update(c => c + 1);
    }
  }

  setNotifications(notifications: Notification[]): void {
    this._notifications.set(notifications);
    this._unreadCount.set(notifications.filter(n => !n.isRead).length);
  }

  markAsRead(id: string): void {
    this._notifications.update(list =>
      list.map(n => (n.id === id ? { ...n, isRead: true, readAt: new Date().toISOString() } : n))
    );
    this._unreadCount.update(c => Math.max(0, c - 1));
  }

  markAllAsRead(): void {
    this._notifications.update(list =>
      list.map(n => ({ ...n, isRead: true, readAt: new Date().toISOString() }))
    );
    this._unreadCount.set(0);
  }

  removeNotification(id: string): void {
    const notification = this._notifications().find(n => n.id === id);
    this._notifications.update(list => list.filter(n => n.id !== id));
    if (notification && !notification.isRead) {
      this._unreadCount.update(c => Math.max(0, c - 1));
    }
  }
}

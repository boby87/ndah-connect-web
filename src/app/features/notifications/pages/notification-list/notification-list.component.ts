import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationsApiService } from '../../services/notifications-api.service';
import type { AppNotification } from '../../../../shared/models/entities/notification.model';
import { NotificationItemComponent } from '../../components/notification-item/notification-item.component';
import { IconComponent } from '../../../../shared/components/ui/icon/icon.component';
import { SpinnerComponent } from '../../../../shared/components/ui/spinner/spinner.component';

@Component({
  selector: 'tc-notification-list-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NotificationItemComponent, IconComponent, SpinnerComponent],
  templateUrl: './notification-list.component.html',
  styleUrl: './notification-list.component.scss',
})
export class NotificationListPageComponent {
  private readonly api = inject(NotificationsApiService);
  private readonly router = inject(Router);

  private readonly PAGE_SIZE = 20;

  protected readonly activeTab = signal<'all' | 'unread'>('all');
  protected readonly isLoading = signal(false);
  protected readonly items = signal<AppNotification[]>([]);
  protected readonly page = signal(0);
  protected readonly hasNext = signal(false);
  protected readonly total = signal(0);

  protected readonly isEmpty = computed(() => !this.isLoading() && this.items().length === 0);
  protected readonly hasUnread = this.api.hasUnread;
  protected readonly hasRead = computed(() => this.items().some((n) => n.isRead));

  constructor() {
    effect(() => {
      const tab = this.activeTab();
      untracked(() => void this.fetchPage(0, tab));
    });
  }

  protected setTab(tab: 'all' | 'unread'): void {
    this.items.set([]);
    this.activeTab.set(tab);
  }

  protected async loadMore(): Promise<void> {
    await this.fetchPage(this.page() + 1);
  }

  protected async markAllRead(): Promise<void> {
    await this.api.markAllAsRead();
    this.items.update((list) => list.map((n) => ({ ...n, isRead: true })));
  }

  protected async onItemClick(notification: AppNotification): Promise<void> {
    if (!notification.isRead) {
      await this.api.markAsRead(notification.id);
      this.items.update((list) =>
        list.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n)),
      );
    }
    if (notification.link) {
      try {
        const parsed = new URL(notification.link, window.location.origin);
        void this.router.navigateByUrl(parsed.pathname + parsed.search + parsed.hash);
      } catch {
        void this.router.navigateByUrl(notification.link);
      }
    }
  }

  protected async onItemDelete(notification: AppNotification): Promise<void> {
    await this.api.delete(notification.id);
    this.items.update((list) => list.filter((n) => n.id !== notification.id));
    this.total.update((t) => Math.max(0, t - 1));
    if (!notification.isRead) {
      this.api.fetchUnreadCount();
    }
  }

  protected async deleteAllRead(): Promise<void> {
    await this.api.deleteAllRead();
    void this.fetchPage(0);
  }

  private async fetchPage(page: number, tab = this.activeTab()): Promise<void> {
    this.isLoading.set(true);
    try {
      const result = await this.api.list({
        page,
        pageSize: this.PAGE_SIZE,
        isRead: tab === 'unread' ? false : undefined,
      });
      if (page === 0) {
        this.items.set(result.items);
      } else {
        this.items.update((prev) => [...prev, ...result.items]);
      }
      this.total.set(result.total);
      this.page.set(page);
      this.hasNext.set(result.hasNext);
    } finally {
      this.isLoading.set(false);
    }
  }
}

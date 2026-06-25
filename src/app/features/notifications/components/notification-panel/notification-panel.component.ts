import { ChangeDetectionStrategy, Component, computed, inject, output, resource } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationsApiService } from '../../services/notifications-api.service';
import type { AppNotification } from '../../../../shared/models/entities/notification.model';
import { NotificationItemComponent } from '../notification-item/notification-item.component';
import { IconComponent } from '../../../../shared/components/ui/icon/icon.component';
import { SpinnerComponent } from '../../../../shared/components/ui/spinner/spinner.component';

@Component({
  selector: 'tc-notification-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NotificationItemComponent, IconComponent, SpinnerComponent],
  templateUrl: './notification-panel.component.html',
  styleUrl: './notification-panel.component.scss',
})
export class NotificationPanelComponent {
  private readonly api = inject(NotificationsApiService);
  private readonly router = inject(Router);

  readonly close = output<void>();

  private readonly listResource = resource({
    loader: () => this.api.list({ pageSize: 5, page: 0 }),
  });

  protected readonly items = computed(() => this.listResource.value()?.items ?? []);
  protected readonly isLoading = computed(() => this.listResource.isLoading());
  protected readonly isEmpty = computed(() => !this.isLoading() && this.items().length === 0);
  protected readonly hasUnread = this.api.hasUnread;

  protected async markAllRead(): Promise<void> {
    await this.api.markAllAsRead();
    this.listResource.reload();
  }

  protected async onItemClick(notification: AppNotification): Promise<void> {
    if (!notification.isRead) {
      await this.api.markAsRead(notification.id);
    }
    this.close.emit();
    if (notification.link) {
      try {
        const parsed = new URL(notification.link, window.location.origin);
        void this.router.navigateByUrl(parsed.pathname + parsed.search + parsed.hash);
      } catch {
        void this.router.navigateByUrl(notification.link);
      }
    } else {
      void this.router.navigate(['/notifications']);
    }
  }

  protected viewAll(): void {
    this.close.emit();
    void this.router.navigate(['/notifications']);
  }
}

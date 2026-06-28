import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import type { AppNotification, NotificationCategory } from '../../../../shared/models/entities/notification.model';
import { IconComponent } from '../../../../shared/components/ui/icon/icon.component';

@Component({
  selector: 'tc-notification-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  templateUrl: './notification-item.component.html',
  styleUrl: './notification-item.component.scss',
})
export class NotificationItemComponent {
  readonly notification = input.required<AppNotification>();
  readonly itemClick = output<AppNotification>();
  readonly itemDelete = output<AppNotification>();

  protected relativeTime(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return "à l'instant";
    if (m < 60) return `il y a ${m} min`;
    const h = Math.floor(m / 60);
    if (h < 24) return `il y a ${h} h`;
    return `il y a ${Math.floor(h / 24)} j`;
  }

  protected categoryClass(cat: NotificationCategory): string {
    return cat.toLowerCase();
  }

  protected iconForCategory(cat: NotificationCategory): string {
    const map: Record<NotificationCategory, string> = {
      CONTRIBUTION: 'coins',
      LOAN: 'banknote',
      SESSION: 'calendar',
      SANCTION: 'gavel',
      VOTE: 'ballot',
      VALIDATION: 'check-circle',
      INVITATION: 'user-plus',
      AGENDA: 'list',
      GENERAL: 'bell',
    };
    return map[cat] ?? 'bell';
  }

  protected onClick(): void {
    this.itemClick.emit(this.notification());
  }

  protected onDelete(event: MouseEvent): void {
    event.stopPropagation();
    this.itemDelete.emit(this.notification());
  }
}

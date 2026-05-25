import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'tc-toast-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './toast-container.component.html',
  styleUrl: './toast-container.component.scss',
})
export class ToastContainerComponent {
  readonly notifications = inject(NotificationService);

  toastClass(kind: 'success' | 'error' | 'warning' | 'info'): string {
    return `tc-toast tc-toast--${kind}`;
  }
}

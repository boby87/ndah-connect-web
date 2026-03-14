import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { PageHeaderComponent } from '../../../../shared/components/layout/page-header/page-header.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { SpinnerComponent } from '../../../../shared/components/ui/spinner/spinner.component';
import { EmptyStateComponent } from '../../../../shared/components/layout/empty-state/empty-state.component';

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [
    PageHeaderComponent,
    CardComponent,
    SpinnerComponent,
    EmptyStateComponent,
  ],
  templateUrl: './notification-list.component.html',
  styleUrl: './notification-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationListComponent {
  private readonly router = inject(Router);

  readonly notifications = signal<any[]>([]);
  readonly isLoading = signal(false);

  navigateToSettings(): void {
    this.router.navigate(['/notifications/settings']);
  }
}

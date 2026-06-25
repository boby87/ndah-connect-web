import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { LoadingService } from '../../../../core/services/loading.service';
import { ThemeService } from '../../../../core/services/theme.service';
import { UiStore } from '../../../../store/ui/ui.store';
import { NotificationStore } from '../../../../store/notification/notification.store';
import { InitialsPipe } from '../../../../shared/pipes/initials.pipe';
import { IconComponent } from '../../../../shared/components/ui/icon/icon.component';
import { NotificationPanelComponent } from '../../../../features/notifications/components/notification-panel/notification-panel.component';

@Component({
  selector: 'tc-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [InitialsPipe, IconComponent, NotificationPanelComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  protected readonly ui = inject(UiStore);
  protected readonly auth = inject(AuthService);
  protected readonly theme = inject(ThemeService);
  protected readonly loading = inject(LoadingService);
  protected readonly notifications = inject(NotificationStore);
  protected readonly panelOpen = signal(false);

  protected togglePanel(): void {
    this.panelOpen.update((v) => !v);
  }

  protected closePanel(): void {
    this.panelOpen.set(false);
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    if (this.panelOpen()) {
      this.panelOpen.set(false);
    }
  }
}

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UiStore } from '../../../../store/ui/ui.store';
import { AuthStore } from '../../../../store/auth/auth.store';
import { NotificationStore } from '../../../../store/notification/notification.store';
import { TontineStore } from '../../../../store/tontine/tontine.store';
import { TontineSelectorComponent } from '../tontine-selector/tontine-selector.component';
import { UserMenuComponent } from '../user-menu/user-menu.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [TontineSelectorComponent, UserMenuComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  protected readonly uiStore = inject(UiStore);
  protected readonly authStore = inject(AuthStore);
  protected readonly notificationStore = inject(NotificationStore);
  protected readonly tontineStore = inject(TontineStore);

  toggleSidebar(): void {
    this.uiStore.toggleSidebar();
  }
}

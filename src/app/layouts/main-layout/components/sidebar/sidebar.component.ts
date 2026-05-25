import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { UiStore } from '../../../../store/ui/ui.store';
import { IconComponent } from '../../../../shared/components/ui/icon/icon.component';
import { SIDEBAR_MENU, MenuSection } from './sidebar-menu.config';

@Component({
  selector: 'tc-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, IconComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  protected readonly ui = inject(UiStore);
  protected readonly auth = inject(AuthService);

  readonly visibleSections = computed<MenuSection[]>(() =>
    SIDEBAR_MENU.map((section) => ({
      ...section,
      items: section.items.filter((item) => !item.roles || this.auth.hasAnyRole(item.roles)),
    })).filter((section) => section.items.length > 0),
  );

  logout(): void {
    this.auth.logout();
  }
}

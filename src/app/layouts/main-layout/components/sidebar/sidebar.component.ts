import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UiStore } from '../../../../store/ui/ui.store';
import { TontineStore } from '../../../../store/tontine/tontine.store';
import { SIDEBAR_MENU, SidebarMenuItem } from './sidebar-menu.config';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  protected readonly uiStore = inject(UiStore);
  private readonly tontineStore = inject(TontineStore);

  get menuItems(): SidebarMenuItem[] {
    const role = this.tontineStore.currentMemberRole();
    return SIDEBAR_MENU.filter(item => {
      if (!item.roles) return true;
      return role ? item.roles.includes(role) : false;
    });
  }
}

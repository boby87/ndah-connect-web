import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UiStore } from '../../../../store/ui/ui.store';
import { TontineStore } from '../../../../store/tontine/tontine.store';
import { SIDEBAR_MENU, SidebarMenuItem } from './sidebar-menu.config';
import { UserRole } from '../../../../core/enums/user-role.enum';

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

  private readonly expandedGroups = signal<Set<string>>(new Set());

  get menuItems(): SidebarMenuItem[] {
    return this.filterByRole(SIDEBAR_MENU);
  }

  isExpanded(id: string): boolean {
    return this.expandedGroups().has(id);
  }

  toggleGroup(id: string): void {
    this.expandedGroups.update(set => {
      const next = new Set(set);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  private filterByRole(items: SidebarMenuItem[]): SidebarMenuItem[] {
    const role = this.tontineStore.currentMemberRole();
    return items
      .filter(item => {
        if (!item.roles) return true;
        return role ? item.roles.includes(role) : false;
      })
      .map(item => {
        if (!item.children) return item;
        const filtered = this.filterByRole(item.children);
        if (filtered.length === 0) return null;
        return { ...item, children: filtered };
      })
      .filter((item): item is SidebarMenuItem => item !== null);
  }
}

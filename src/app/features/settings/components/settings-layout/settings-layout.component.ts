import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

interface SettingsTab {
  key: string;
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-settings-layout',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './settings-layout.component.html',
  styleUrl: './settings-layout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsLayoutComponent {
  private readonly router = inject(Router);

  readonly tabs: SettingsTab[] = [
    { key: 'profile', label: 'Profil', icon: '👤', route: '/settings/profile' },
    { key: 'security', label: 'Sécurité', icon: '🔒', route: '/settings/security' },
    { key: 'notifications', label: 'Notifications', icon: '🔔', route: '/settings/notifications' },
    { key: 'tontine', label: 'Tontine', icon: '⚙️', route: '/settings/tontine' },
    { key: 'appearance', label: 'Apparence', icon: '🎨', route: '/settings/appearance' },
  ];

  readonly activeTab = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(e => {
        const segments = e.urlAfterRedirects.split('/');
        return segments[segments.length - 1] || 'profile';
      }),
    ),
    { initialValue: this.getInitialTab() },
  );

  navigate(tab: SettingsTab): void {
    this.router.navigateByUrl(tab.route);
  }

  private getInitialTab(): string {
    const segments = this.router.url.split('/');
    return segments[segments.length - 1] || 'profile';
  }
}

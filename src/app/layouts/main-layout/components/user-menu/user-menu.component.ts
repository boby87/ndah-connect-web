import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStore } from '../../../../store/auth/auth.store';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { AvatarComponent } from '../../../../shared/components/ui/avatar/avatar.component';

@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [AvatarComponent],
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserMenuComponent {
  protected readonly authStore = inject(AuthStore);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected isOpen = signal(false);

  toggle(): void { this.isOpen.set(!this.isOpen()); }
  close(): void { this.isOpen.set(false); }

  goToProfile(): void {
    this.router.navigate(['/settings']);
    this.close();
  }

  logout(): void {
    this.authService.logout();
    this.close();
  }
}

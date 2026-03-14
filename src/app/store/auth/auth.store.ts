import { computed, inject, Injectable, signal } from '@angular/core';
import { User } from '../../shared/models/entities';
import { AuthService } from '../../core/auth/services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly authService = inject(AuthService);

  private readonly _user = signal<User | null>(this.authService.getStoredUser());
  private readonly _isLoading = signal(false);

  readonly user = this._user.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly isAuthenticated = computed(() => this._user() !== null);
  readonly userFullName = computed(() => {
    const u = this._user();
    return u ? `${u.firstName} ${u.lastName}` : '';
  });

  setUser(user: User | null): void {
    this._user.set(user);
  }

  async logout(): Promise<void> {
    this.authService.logout();
    this._user.set(null);
  }

  updateProfile(data: Partial<User>): void {
    this._user.update(current => (current ? { ...current, ...data } : null));
  }

  setLoading(loading: boolean): void {
    this._isLoading.set(loading);
  }
}

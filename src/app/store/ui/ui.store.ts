import { computed, inject, Injectable, signal } from '@angular/core';
import { StorageService } from '../../core/services/storage.service';
import { STORAGE_KEYS } from '../../core/constants';

@Injectable({ providedIn: 'root' })
export class UiStore {
  private readonly storage = inject(StorageService);

  private readonly _sidebarOpen = signal(
    this.storage.get(STORAGE_KEYS.SIDEBAR_STATE) !== 'closed'
  );
  private readonly _theme = signal<'light' | 'dark'>('light');
  private readonly _isMobile = signal(false);
  private readonly _currentRoute = signal('');

  readonly sidebarOpen = this._sidebarOpen.asReadonly();
  readonly theme = this._theme.asReadonly();
  readonly isMobile = this._isMobile.asReadonly();
  readonly currentRoute = this._currentRoute.asReadonly();

  toggleSidebar(): void {
    this._sidebarOpen.update(open => {
      const newState = !open;
      this.storage.set(STORAGE_KEYS.SIDEBAR_STATE, newState ? 'open' : 'closed');
      return newState;
    });
  }

  setSidebarOpen(open: boolean): void {
    this._sidebarOpen.set(open);
    this.storage.set(STORAGE_KEYS.SIDEBAR_STATE, open ? 'open' : 'closed');
  }

  setTheme(theme: 'light' | 'dark'): void {
    this._theme.set(theme);
  }

  setIsMobile(isMobile: boolean): void {
    this._isMobile.set(isMobile);
  }

  setCurrentRoute(route: string): void {
    this._currentRoute.set(route);
  }
}

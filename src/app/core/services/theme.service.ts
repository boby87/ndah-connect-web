import { effect, inject, Injectable, signal } from '@angular/core';
import { StorageService } from './storage.service';
import { STORAGE_KEYS } from '../constants';

export type Theme = 'light' | 'dark' | 'system';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storage = inject(StorageService);

  readonly theme = signal<Theme>(
    (this.storage.get(STORAGE_KEYS.THEME) as Theme) || 'system'
  );

  constructor() {
    effect(() => {
      const theme = this.theme();
      this.storage.set(STORAGE_KEYS.THEME, theme);
      this.applyTheme(theme);
    });
  }

  setTheme(theme: Theme): void {
    this.theme.set(theme);
  }

  toggleTheme(): void {
    const current = this.theme();
    this.theme.set(current === 'dark' ? 'light' : 'dark');
  }

  private applyTheme(theme: Theme): void {
    const isDark =
      theme === 'dark' ||
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    document.documentElement.classList.toggle('dark', isDark);
  }
}

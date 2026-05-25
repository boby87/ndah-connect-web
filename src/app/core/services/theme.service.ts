import { Injectable, effect, inject, signal } from '@angular/core';
import { STORAGE_KEYS } from '../constants/storage-keys.constants';
import { StorageService } from './storage.service';

export type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storage = inject(StorageService);
  private readonly themeSignal = signal<Theme>(this.storage.get<Theme>(STORAGE_KEYS.theme) ?? 'light');

  readonly theme = this.themeSignal.asReadonly();

  constructor() {
    effect(() => {
      const theme = this.themeSignal();
      this.storage.set(STORAGE_KEYS.theme, theme);
      if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('dark', theme === 'dark');
      }
    });
  }

  set(theme: Theme): void {
    this.themeSignal.set(theme);
  }

  toggle(): void {
    this.themeSignal.update((t) => (t === 'light' ? 'dark' : 'light'));
  }
}

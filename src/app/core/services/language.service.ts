import { inject, Injectable, signal } from '@angular/core';
import { StorageService } from './storage.service';
import { DEFAULT_LANGUAGE, STORAGE_KEYS } from '../constants';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly storage = inject(StorageService);
  private translations: Record<string, string> = {};

  readonly currentLang = signal<string>(
    this.storage.get(STORAGE_KEYS.LANGUAGE) || DEFAULT_LANGUAGE
  );

  async setLanguage(lang: string): Promise<void> {
    const response = await fetch(`/assets/i18n/${lang}.json`);
    this.translations = await response.json();
    this.currentLang.set(lang);
    this.storage.set(STORAGE_KEYS.LANGUAGE, lang);
  }

  translate(key: string): string {
    return this.translations[key] || key;
  }
}

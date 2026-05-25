import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly storage = typeof window !== 'undefined' ? window.localStorage : null;

  get<T>(key: string): T | null {
    if (!this.storage) return null;
    const raw = this.storage.getItem(key);
    if (raw === null) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return raw as unknown as T;
    }
  }

  set<T>(key: string, value: T): void {
    if (!this.storage) return;
    this.storage.setItem(key, JSON.stringify(value));
  }

  remove(key: string): void {
    this.storage?.removeItem(key);
  }

  clear(): void {
    this.storage?.clear();
  }
}

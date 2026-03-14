import { inject, Injectable } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { STORAGE_KEYS } from '../../constants';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private readonly storage = inject(StorageService);

  getAccessToken(): string | null {
    return this.storage.get(STORAGE_KEYS.ACCESS_TOKEN);
  }

  getRefreshToken(): string | null {
    return this.storage.get(STORAGE_KEYS.REFRESH_TOKEN);
  }

  setTokens(accessToken: string, refreshToken: string): void {
    this.storage.set(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    this.storage.set(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  }

  clearTokens(): void {
    this.storage.remove(STORAGE_KEYS.ACCESS_TOKEN);
    this.storage.remove(STORAGE_KEYS.REFRESH_TOKEN);
  }

  isTokenExpired(): boolean {
    const token = this.getAccessToken();
    if (!token) return true;

    try {
      const payload = this.getTokenPayload();
      if (!payload?.['exp']) return true;
      return Date.now() >= (payload['exp'] as number) * 1000;
    } catch {
      return true;
    }
  }

  getTokenPayload(): Record<string, unknown> | null {
    const token = this.getAccessToken();
    if (!token) return null;

    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(base64));
    } catch {
      return null;
    }
  }
}

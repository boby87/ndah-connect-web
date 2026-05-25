import { Injectable, inject, signal } from '@angular/core';
import { STORAGE_KEYS } from '../../constants/storage-keys.constants';
import { StorageService } from '../../services/storage.service';
import type { AuthTokens } from '../../../shared/models/entities/user.model';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private readonly storage = inject(StorageService);

  private readonly tokensSignal = signal<AuthTokens | null>(this.readFromStorage());

  readonly tokens = this.tokensSignal.asReadonly();

  setTokens(tokens: AuthTokens): void {
    this.storage.set(STORAGE_KEYS.accessToken, tokens.accessToken);
    this.storage.set(STORAGE_KEYS.refreshToken, tokens.refreshToken);
    this.tokensSignal.set(tokens);
  }

  clearTokens(): void {
    this.storage.remove(STORAGE_KEYS.accessToken);
    this.storage.remove(STORAGE_KEYS.refreshToken);
    this.tokensSignal.set(null);
  }

  getAccessToken(): string | null {
    return this.tokensSignal()?.accessToken ?? null;
  }

  getRefreshToken(): string | null {
    return this.tokensSignal()?.refreshToken ?? null;
  }

  isAuthenticated(): boolean {
    return !!this.tokensSignal()?.accessToken;
  }

  private readFromStorage(): AuthTokens | null {
    const accessToken = this.storage.get<string>(STORAGE_KEYS.accessToken);
    const refreshToken = this.storage.get<string>(STORAGE_KEYS.refreshToken);
    if (!accessToken || !refreshToken) return null;
    return { accessToken, refreshToken, expiresIn: 0 };
  }
}

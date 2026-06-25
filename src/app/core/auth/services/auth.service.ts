import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { API_CONFIG, API_ENDPOINTS } from '../../config/api.config';
import { STORAGE_KEYS } from '../../constants/storage-keys.constants';
import { UserRole } from '../../enums/user-role.enum';
import { StorageService } from '../../services/storage.service';
import { TokenService } from './token.service';
import { WebSocketService } from '../../services/websocket.service';
import type { ApiResponse } from '../../api/models/api-response.model';
import type { AuthSession, User } from '../../../shared/models/entities/user.model';

export interface LoginPayload {
  identifier: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
}

export interface OtpPayload {
  identifier: string;
  code: string;
}

export interface ResetPasswordPayload {
  identifier: string;
  code: string;
  newPassword: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokens = inject(TokenService);
  private readonly storage = inject(StorageService);
  private readonly router = inject(Router);

  private readonly ws = inject(WebSocketService);
  private readonly userSignal = signal<User | null>(this.storage.get<User>(STORAGE_KEYS.currentUser));

  readonly user = this.userSignal.asReadonly();
  readonly isAuthenticated = computed(() => !!this.userSignal() && this.tokens.isAuthenticated());
  readonly roles = computed<UserRole[]>(() => this.userSignal()?.roles ?? []);

  hasRole(role: UserRole): boolean {
    return this.roles().includes(role);
  }

  hasAnyRole(roles: UserRole[]): boolean {
    return roles.some((role) => this.hasRole(role));
  }

  async login(payload: LoginPayload): Promise<AuthSession> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<AuthSession>>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.auth.login}`, payload),
    );
    this.persistSession(response.data);
    return response.data;
  }

  async register(payload: RegisterPayload): Promise<{ identifier: string }> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<{ identifier: string }>>(
        `${API_CONFIG.baseUrl}${API_ENDPOINTS.auth.register}`,
        payload,
      ),
    );
    return response.data;
  }

  async verifyOtp(payload: OtpPayload): Promise<AuthSession> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<AuthSession>>(
        `${API_CONFIG.baseUrl}${API_ENDPOINTS.auth.verifyOtp}`,
        payload,
      ),
    );
    this.persistSession(response.data);
    return response.data;
  }

  async forgotPassword(identifier: string): Promise<void> {
    await firstValueFrom(
      this.http.post<ApiResponse<void>>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.auth.forgotPassword}`, {
        identifier,
      }),
    );
  }

  async resetPassword(payload: ResetPasswordPayload): Promise<void> {
    await firstValueFrom(
      this.http.post<ApiResponse<void>>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.auth.resetPassword}`, payload),
    );
  }

  async loadCurrentUser(): Promise<User | null> {
    if (!this.tokens.isAuthenticated()) return null;
    try {
      const response = await firstValueFrom(
        this.http.get<ApiResponse<User>>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.auth.me}`),
      );
      this.userSignal.set(response.data);
      this.storage.set(STORAGE_KEYS.currentUser, response.data);
      return response.data;
    } catch {
      this.logout();
      return null;
    }
  }

  logout(redirectToLogin = true): void {
    this.ws.disconnect();
    this.tokens.clearTokens();
    this.storage.remove(STORAGE_KEYS.currentUser);
    this.storage.remove(STORAGE_KEYS.currentTontineId);
    this.userSignal.set(null);
    if (redirectToLogin) {
      void this.router.navigateByUrl('/auth/login');
    }
  }

  applySession(session: AuthSession): void {
    this.persistSession(session);
  }

  private persistSession(session: AuthSession): void {
    this.tokens.setTokens(session.tokens);
    this.userSignal.set(session.user);
    this.storage.set(STORAGE_KEYS.currentUser, session.user);
    if (session.activeTontineId) {
      this.storage.set(STORAGE_KEYS.currentTontineId, session.activeTontineId);
    }
  }
}

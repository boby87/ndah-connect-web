import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthApiService, LoginRequest, RegisterRequest, ResetPasswordRequest, VerifyOtpRequest } from '../../api/services/auth-api.service';
import { TokenService } from './token.service';
import { StorageService } from '../../services/storage.service';
import { STORAGE_KEYS } from '../../constants';
import { NotificationService } from '../../services/notification.service';
import { User } from '../../../shared/models/entities';
import { environment } from '../../../../environments/environment';
import { UserRole } from '../../enums/user-role.enum';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly authApi = inject(AuthApiService);
  private readonly tokenService = inject(TokenService);
  private readonly storage = inject(StorageService);
  private readonly router = inject(Router);
  private readonly notification = inject(NotificationService);

  async login(credentials: LoginRequest): Promise<User> {
    if (environment.useMock) {
      return this.mockLogin(credentials);
    }
    const response = await firstValueFrom(this.authApi.login(credentials));
    this.tokenService.setTokens(response.data.accessToken, response.data.refreshToken);
    this.storage.setObject(STORAGE_KEYS.USER, response.data.user);
    return response.data.user;
  }

  private mockLogin(credentials: LoginRequest): User {
    const mockUser: User = {
      id: 'u-001',
      phoneNumber: credentials.phoneNumber,
      firstName: 'Alain',
      lastName: 'NKOMO',
      email: 'alain.nkomo@email.cm',
      gender: 'male',
      profession: 'Ingénieur Informatique',
      address: 'Douala, Bonanjo',
      kycStatus: 'verified',
      isActive: true,
      createdAt: '2024-06-15T10:00:00Z',
      updatedAt: '2026-03-01T08:00:00Z',
    };
    // Create a fake JWT (header.payload.signature) with a far future expiry
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({ sub: mockUser.id, role: UserRole.PRESIDENT, exp: Math.floor(Date.now() / 1000) + 86400 }));
    const fakeToken = `${header}.${payload}.mock-signature`;
    this.tokenService.setTokens(fakeToken, fakeToken);
    this.storage.setObject(STORAGE_KEYS.USER, mockUser);
    return mockUser;
  }

  async register(data: RegisterRequest): Promise<void> {
    await firstValueFrom(this.authApi.register(data));
  }

  async verifyOtp(data: VerifyOtpRequest): Promise<User> {
    const response = await firstValueFrom(this.authApi.verifyOtp(data));
    this.tokenService.setTokens(response.data.accessToken, response.data.refreshToken);
    this.storage.setObject(STORAGE_KEYS.USER, response.data.user);
    return response.data.user;
  }

  async resendOtp(phoneNumber: string): Promise<void> {
    await firstValueFrom(this.authApi.resendOtp(phoneNumber));
  }

  async forgotPassword(phoneNumber: string): Promise<void> {
    await firstValueFrom(this.authApi.forgotPassword(phoneNumber));
  }

  async resetPassword(data: ResetPasswordRequest): Promise<void> {
    await firstValueFrom(this.authApi.resetPassword(data));
  }

  async getCurrentUser(): Promise<User> {
    const response = await firstValueFrom(this.authApi.getCurrentUser());
    this.storage.setObject(STORAGE_KEYS.USER, response.data);
    return response.data;
  }

  logout(): void {
    this.authApi.logout().subscribe();
    this.tokenService.clearTokens();
    this.storage.remove(STORAGE_KEYS.USER);
    this.router.navigate(['/auth/login']);
  }

  isAuthenticated(): boolean {
    return !this.tokenService.isTokenExpired();
  }

  getStoredUser(): User | null {
    return this.storage.getObject<User>(STORAGE_KEYS.USER);
  }
}

import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse } from '../models';
import { User } from '../../../shared/models/entities';

export interface LoginRequest {
  phoneNumber: string;
  password: string;
}

export interface RegisterRequest {
  phoneNumber: string;
  firstName: string;
  lastName: string;
  email?: string;
  password: string;
  passwordConfirmation: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface VerifyOtpRequest {
  phoneNumber: string;
  code: string;
}

export interface ResetPasswordRequest {
  phoneNumber: string;
  code: string;
  password: string;
  passwordConfirmation: string;
}

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private readonly api = inject(ApiService);

  login(credentials: LoginRequest): Observable<ApiResponse<AuthTokens & { user: User }>> {
    return this.api.post('auth/login', credentials);
  }

  register(data: RegisterRequest): Observable<ApiResponse<{ phoneNumber: string }>> {
    return this.api.post('auth/register', data);
  }

  verifyOtp(data: VerifyOtpRequest): Observable<ApiResponse<AuthTokens & { user: User }>> {
    return this.api.post('auth/verify-otp', data);
  }

  resendOtp(phoneNumber: string): Observable<ApiResponse<void>> {
    return this.api.post('auth/resend-otp', { phoneNumber });
  }

  forgotPassword(phoneNumber: string): Observable<ApiResponse<void>> {
    return this.api.post('auth/forgot-password', { phoneNumber });
  }

  resetPassword(data: ResetPasswordRequest): Observable<ApiResponse<void>> {
    return this.api.post('auth/reset-password', data);
  }

  refreshToken(refreshToken: string): Observable<ApiResponse<AuthTokens>> {
    return this.api.post('auth/refresh-token', { refreshToken });
  }

  logout(): Observable<ApiResponse<void>> {
    return this.api.post('auth/logout', {});
  }

  getCurrentUser(): Observable<ApiResponse<User>> {
    return this.api.get('auth/me');
  }
}

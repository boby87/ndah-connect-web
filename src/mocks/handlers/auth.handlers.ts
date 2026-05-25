import { HttpResponse, http } from 'msw';
import { environment } from '../../environments/environment';
import { db, findUserByIdentifier, generateOtp } from '../db';
import type { ApiResponse } from '../../app/core/api/models/api-response.model';
import type { AuthSession, User } from '../../app/shared/models/entities/user.model';

const base = environment.apiUrl;

const wrap = <T>(data: T, message?: string): ApiResponse<T> => ({
  data,
  message,
  timestamp: new Date().toISOString(),
});

const buildSession = (user: User): AuthSession => ({
  user,
  tokens: {
    accessToken: `mock-access-${user.id}-${Date.now()}`,
    refreshToken: `mock-refresh-${user.id}-${Date.now()}`,
    expiresIn: 3600,
  },
  activeTontineId: 'tontine-1',
});

export const authHandlers = [
  http.post(`${base}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as { identifier: string; password: string };
    const user = findUserByIdentifier(body.identifier);

    if (!user || body.password !== 'password') {
      return HttpResponse.json(
        {
          code: 'INVALID_CREDENTIALS',
          message: 'Identifiant ou mot de passe incorrect.',
          status: 401,
          timestamp: new Date().toISOString(),
        },
        { status: 401 },
      );
    }

    return HttpResponse.json(wrap(buildSession(user), 'Connexion réussie'));
  }),

  http.post(`${base}/auth/register`, async ({ request }) => {
    const body = (await request.json()) as {
      firstName: string;
      lastName: string;
      phone: string;
      email: string;
      password: string;
    };

    if (findUserByIdentifier(body.email) || findUserByIdentifier(body.phone)) {
      return HttpResponse.json(
        {
          code: 'USER_EXISTS',
          message: 'Un compte existe déjà avec ces identifiants.',
          status: 409,
          timestamp: new Date().toISOString(),
        },
        { status: 409 },
      );
    }

    const id = `user-${db.users.length + 1}`;
    const newUser: User = {
      id,
      firstName: body.firstName,
      lastName: body.lastName,
      phone: body.phone,
      email: body.email,
      roles: [],
      isActive: false,
      isPhoneVerified: false,
      isEmailVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.users.push(newUser);
    generateOtp(body.phone);

    return HttpResponse.json(wrap({ identifier: body.phone }, 'Inscription enregistrée. OTP envoyé.'), {
      status: 201,
    });
  }),

  http.post(`${base}/auth/verify-otp`, async ({ request }) => {
    const body = (await request.json()) as { identifier: string; code: string };
    const expected = db.otpStore.get(body.identifier);

    if (!expected || expected !== body.code) {
      return HttpResponse.json(
        {
          code: 'INVALID_OTP',
          message: 'Code OTP invalide ou expiré.',
          status: 422,
          timestamp: new Date().toISOString(),
        },
        { status: 422 },
      );
    }

    db.otpStore.delete(body.identifier);
    const user = findUserByIdentifier(body.identifier);
    if (!user) {
      return HttpResponse.json(
        {
          code: 'USER_NOT_FOUND',
          message: 'Utilisateur introuvable.',
          status: 404,
          timestamp: new Date().toISOString(),
        },
        { status: 404 },
      );
    }

    user.isPhoneVerified = true;
    user.isActive = true;
    return HttpResponse.json(wrap(buildSession(user), 'OTP vérifié'));
  }),

  http.post(`${base}/auth/forgot-password`, async ({ request }) => {
    const body = (await request.json()) as { identifier: string };
    const user = findUserByIdentifier(body.identifier);
    if (user) {
      generateOtp(body.identifier);
    }
    return HttpResponse.json(wrap(null, 'Si le compte existe, un code a été envoyé.'));
  }),

  http.post(`${base}/auth/reset-password`, async ({ request }) => {
    const body = (await request.json()) as { identifier: string; code: string; newPassword: string };
    const expected = db.otpStore.get(body.identifier);
    if (!expected || expected !== body.code) {
      return HttpResponse.json(
        {
          code: 'INVALID_OTP',
          message: 'Code de réinitialisation invalide.',
          status: 422,
          timestamp: new Date().toISOString(),
        },
        { status: 422 },
      );
    }
    db.otpStore.delete(body.identifier);
    return HttpResponse.json(wrap(null, 'Mot de passe réinitialisé.'));
  }),

  http.get(`${base}/auth/me`, ({ request }) => {
    const auth = request.headers.get('Authorization');
    const match = auth?.match(/^Bearer mock-access-(user-\d+)-\d+$/);
    if (!match) {
      return HttpResponse.json(
        {
          code: 'UNAUTHENTICATED',
          message: 'Non authentifié.',
          status: 401,
          timestamp: new Date().toISOString(),
        },
        { status: 401 },
      );
    }
    const userId = match[1];
    const user = db.users.find((u) => u.id === userId);
    if (!user) {
      return HttpResponse.json(
        {
          code: 'USER_NOT_FOUND',
          message: 'Utilisateur introuvable.',
          status: 404,
          timestamp: new Date().toISOString(),
        },
        { status: 404 },
      );
    }
    return HttpResponse.json(wrap(user));
  }),
];

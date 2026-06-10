import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';

import { MemberPresidencyService } from './presidency.service';
import { API_CONFIG } from '../../../core/config/api.config';
import type { PresidencyTransfer } from '../../../shared/models/entities/presidency-transfer.model';

const BASE = `${API_CONFIG.baseUrl}/members/me/presidency-transfer`;

const transfer = (overrides: Partial<PresidencyTransfer> = {}): PresidencyTransfer => ({
  id: 'tr-1',
  tontineId: 't-1',
  initiatedByUserId: 'u-pres',
  initiatedByFullName: 'Président actuel',
  targetMemberId: 'm-bob',
  targetMemberFullName: 'Bob',
  reason: 'Motif détaillé du transfert',
  status: 'PENDING',
  initiatedAt: '2026-06-09T10:00:00Z',
  expiresAt: '2026-06-12T10:00:00Z',
  ...overrides,
});

describe('MemberPresidencyService', () => {
  let service: MemberPresidencyService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        MemberPresidencyService,
      ],
    });
    service = TestBed.inject(MemberPresidencyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('GET /pending retourne le transfert en attente ou null', async () => {
    const promise = service.getPending();
    const req = httpMock.expectOne(`${BASE}/pending`);
    expect(req.request.method).toBe('GET');
    req.flush({ data: transfer(), timestamp: '' });
    const result = await promise;
    expect(result?.status).toBe('PENDING');
  });

  it('GET /pending peut renvoyer null', async () => {
    const promise = service.getPending();
    const req = httpMock.expectOne(`${BASE}/pending`);
    req.flush({ data: null, timestamp: '' });
    expect(await promise).toBeNull();
  });

  it('POST /:id/accept', async () => {
    const promise = service.accept('tr-1');
    const req = httpMock.expectOne(`${BASE}/tr-1/accept`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});
    req.flush({
      data: transfer({ status: 'ACCEPTED', acceptedAt: '2026-06-09T11:00:00Z' }),
      timestamp: '',
    });
    const result = await promise;
    expect(result.status).toBe('ACCEPTED');
    expect(result.acceptedAt).toBeDefined();
  });

  it('POST /:id/decline avec motif', async () => {
    const promise = service.decline('tr-1', 'Je ne suis pas disponible');
    const req = httpMock.expectOne(`${BASE}/tr-1/decline`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ reason: 'Je ne suis pas disponible' });
    req.flush({
      data: transfer({
        status: 'DECLINED',
        declinedAt: '2026-06-09T11:00:00Z',
        declineReason: 'Je ne suis pas disponible',
      }),
      timestamp: '',
    });
    const result = await promise;
    expect(result.status).toBe('DECLINED');
    expect(result.declineReason).toBe('Je ne suis pas disponible');
  });
});

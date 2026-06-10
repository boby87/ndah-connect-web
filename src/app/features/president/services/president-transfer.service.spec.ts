import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';

import { PresidentService } from './president.service';
import { API_CONFIG } from '../../../core/config/api.config';
import type { PresidencyTransfer } from '../../../shared/models/entities/presidency-transfer.model';

const BASE = `${API_CONFIG.baseUrl}/president`;

const transfer = (overrides: Partial<PresidencyTransfer> = {}): PresidencyTransfer => ({
  id: 'tr-1',
  tontineId: 't-1',
  initiatedByUserId: 'u-pres',
  initiatedByFullName: 'Président actuel',
  targetMemberId: 'm-bob',
  targetMemberFullName: 'Bob Tagne',
  reason: 'Je passe la main pour raisons personnelles',
  status: 'PENDING',
  initiatedAt: '2026-06-09T10:00:00Z',
  expiresAt: '2026-06-12T10:00:00Z',
  ...overrides,
});

describe('PresidentService — presidency transfer', () => {
  let service: PresidentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        PresidentService,
      ],
    });
    service = TestBed.inject(PresidentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('POST /president/presidency-transfer envoie le payload', async () => {
    const promise = service.initiatePresidencyTransfer({
      targetMemberId: 'm-bob',
      reason: 'Je passe la main',
    });
    const req = httpMock.expectOne(`${BASE}/presidency-transfer`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ targetMemberId: 'm-bob', reason: 'Je passe la main' });
    req.flush({ data: transfer(), timestamp: '' });
    expect((await promise).status).toBe('PENDING');
  });

  it('GET /president/presidency-transfers retourne la liste', async () => {
    const promise = service.getPresidencyTransfers();
    const req = httpMock.expectOne(`${BASE}/presidency-transfers`);
    expect(req.request.method).toBe('GET');
    req.flush({
      data: [transfer(), transfer({ id: 'tr-2', status: 'DECLINED' })],
      timestamp: '',
    });
    const result = await promise;
    expect(result.length).toBe(2);
    expect(result[1].status).toBe('DECLINED');
  });

  it('POST /president/presidency-transfers/:id/cancel passe le motif', async () => {
    const promise = service.cancelPresidencyTransfer('tr-1', 'Changement de plans');
    const req = httpMock.expectOne(`${BASE}/presidency-transfers/tr-1/cancel`);
    expect(req.request.body).toEqual({ reason: 'Changement de plans' });
    req.flush({
      data: transfer({ status: 'CANCELLED', cancelReason: 'Changement de plans' }),
      timestamp: '',
    });
    expect((await promise).status).toBe('CANCELLED');
  });

  it('cancel sans motif → { reason: undefined }', async () => {
    const promise = service.cancelPresidencyTransfer('tr-1');
    const req = httpMock.expectOne(`${BASE}/presidency-transfers/tr-1/cancel`);
    expect(req.request.body).toEqual({ reason: undefined });
    req.flush({ data: transfer({ status: 'CANCELLED' }), timestamp: '' });
    await promise;
  });
});

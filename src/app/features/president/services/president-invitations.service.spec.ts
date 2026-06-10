import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';

import { PresidentService } from './president.service';
import { API_CONFIG } from '../../../core/config/api.config';
import type { MembershipInvitation } from '../../../shared/models/entities/membership-invitation.model';

const BASE = `${API_CONFIG.baseUrl}/president/membership`;

const invitation = (overrides: Partial<MembershipInvitation> = {}): MembershipInvitation => ({
  id: 'inv-1',
  tontineId: 't-1',
  candidateFullName: 'Jean Tagne',
  candidatePhone: '+237699999999',
  candidateEmail: 'jean@example.cm',
  proposedRole: 'MEMBER',
  channels: ['SMS', 'EMAIL'],
  status: 'SENT',
  sentAt: '2026-06-07T08:00:00Z',
  expiresAt: '2026-06-14T08:00:00Z',
  invitedByUserId: 'u-pres',
  invitedByFullName: 'Président',
  invitedAt: '2026-06-07T08:00:00Z',
  remindersSent: 0,
  ...overrides,
});

describe('PresidentService — invitations', () => {
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

  it('POST /president/membership/invite envoie le payload complet', async () => {
    const promise = service.inviteMember({
      candidateFullName: 'Jean Tagne',
      candidatePhone: '+237699999999',
      candidateEmail: 'jean@example.cm',
      proposedRole: 'TREASURER',
      channels: ['SMS', 'EMAIL'],
      message: 'Bienvenue',
    });

    const req = httpMock.expectOne(`${BASE}/invite`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      candidateFullName: 'Jean Tagne',
      candidatePhone: '+237699999999',
      candidateEmail: 'jean@example.cm',
      proposedRole: 'TREASURER',
      channels: ['SMS', 'EMAIL'],
      message: 'Bienvenue',
    });
    req.flush({ data: invitation({ proposedRole: 'TREASURER' }), timestamp: '' });

    const result = await promise;
    expect(result.proposedRole).toBe('TREASURER');
  });

  it('GET /president/membership/invitations retourne la liste', async () => {
    const promise = service.getInvitations();
    const req = httpMock.expectOne(`${BASE}/invitations`);
    expect(req.request.method).toBe('GET');
    req.flush({ data: [invitation(), invitation({ id: 'inv-2', status: 'ACCEPTED' })], timestamp: '' });
    const result = await promise;
    expect(result.length).toBe(2);
    expect(result[1].status).toBe('ACCEPTED');
  });

  it('POST /president/membership/invitations/:id/resend', async () => {
    const promise = service.resendInvitation('inv-1');
    const req = httpMock.expectOne(`${BASE}/invitations/inv-1/resend`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});
    req.flush({ data: invitation({ remindersSent: 1 }), timestamp: '' });
    expect((await promise).remindersSent).toBe(1);
  });

  it('POST /president/membership/invitations/:id/cancel avec motif', async () => {
    const promise = service.cancelInvitation('inv-1', 'Erreur de saisie');
    const req = httpMock.expectOne(`${BASE}/invitations/inv-1/cancel`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ reason: 'Erreur de saisie' });
    req.flush({
      data: invitation({ status: 'CANCELLED', cancelReason: 'Erreur de saisie' }),
      timestamp: '',
    });
    const result = await promise;
    expect(result.status).toBe('CANCELLED');
    expect(result.cancelReason).toBe('Erreur de saisie');
  });

  it('POST /cancel sans motif passe { reason: undefined }', async () => {
    const promise = service.cancelInvitation('inv-1');
    const req = httpMock.expectOne(`${BASE}/invitations/inv-1/cancel`);
    expect(req.request.body).toEqual({ reason: undefined });
    req.flush({ data: invitation({ status: 'CANCELLED' }), timestamp: '' });
    await promise;
  });
});

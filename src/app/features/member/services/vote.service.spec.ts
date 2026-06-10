import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';

import { MemberVoteService } from './vote.service';
import { API_CONFIG } from '../../../core/config/api.config';
import type { Vote } from '../../../shared/models/entities/vote.model';

const BASE = `${API_CONFIG.baseUrl}/members/me/votes`;

const vote = (overrides: Partial<Vote> = {}): Vote => ({
  id: 'v1',
  tontineId: 't1',
  question: 'Élection du nouveau Président ?',
  options: [
    { id: 'o1', label: 'Alice', count: 0 },
    { id: 'o2', label: 'Bob', count: 0 },
  ],
  isAnonymous: true,
  hideResultsUntilClose: true,
  scope: 'ASSEMBLY',
  audience: 'MEMBERS_ACTIVE',
  status: 'OPEN',
  opensAt: '2026-01-01T00:00:00Z',
  closesAt: '2026-01-08T00:00:00Z',
  createdByUserId: 'u-pres',
  createdByFullName: 'Président',
  createdAt: '2025-12-30T00:00:00Z',
  totalVoters: 12,
  totalVoted: 0,
  quorumPercent: 0.5,
  ...overrides,
});

describe('MemberVoteService', () => {
  let service: MemberVoteService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        MemberVoteService,
      ],
    });
    service = TestBed.inject(MemberVoteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('list() sans filtre appelle GET /members/me/votes', async () => {
    const promise = service.list();
    const req = httpMock.expectOne((r) => r.url === BASE && r.method === 'GET');
    expect(req.request.params.has('status')).toBe(false);
    req.flush({ data: [vote()], timestamp: '' });
    expect((await promise).length).toBe(1);
  });

  it('listOpen() ajoute ?status=OPEN', async () => {
    const promise = service.listOpen();
    const req = httpMock.expectOne((r) => r.url === BASE);
    expect(req.request.params.get('status')).toBe('OPEN');
    req.flush({ data: [vote()], timestamp: '' });
    await promise;
  });

  it('getDetail() appelle GET /members/me/votes/:id', async () => {
    const promise = service.getDetail('v1');
    const req = httpMock.expectOne(`${BASE}/v1`);
    expect(req.request.method).toBe('GET');
    req.flush({ data: vote(), timestamp: '' });
    expect((await promise).id).toBe('v1');
  });

  it('cast() POST avec optionId', async () => {
    const promise = service.cast('v1', 'o2');
    const req = httpMock.expectOne(`${BASE}/v1/cast`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ optionId: 'o2' });
    req.flush({
      data: { voteId: 'v1', optionId: 'o2', optionLabel: 'Bob', castAt: '2026-01-02T10:00:00Z' },
      timestamp: '',
    });
    const ballot = await promise;
    expect(ballot.optionId).toBe('o2');
    expect(ballot.optionLabel).toBe('Bob');
  });

  it('hasVoted() retourne le boolean', async () => {
    const promise = service.hasVoted('v1');
    const req = httpMock.expectOne(`${BASE}/v1/ballot-status`);
    req.flush({ data: { hasVoted: true }, timestamp: '' });
    expect(await promise).toBe(true);
  });
});

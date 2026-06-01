import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';

import { NotificationsApiService } from './notifications-api.service';
import { API_CONFIG } from '../../../core/config/api.config';
import type { AppNotification } from '../../../shared/models/entities/notification.model';

const BASE = `${API_CONFIG.baseUrl}/notifications`;

const notif = (overrides: Partial<AppNotification> = {}): AppNotification => ({
  id: 'n1',
  userId: 'u1',
  kind: 'info',
  category: 'GENERAL',
  title: 'Bienvenue',
  message: 'Salut',
  isRead: false,
  createdAt: '2026-01-01T00:00:00Z',
  ...overrides,
});

describe('NotificationsApiService', () => {
  let service: NotificationsApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        NotificationsApiService,
      ],
    });
    service = TestBed.inject(NotificationsApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('GET /notifications retourne la liste paginée', async () => {
    const promise = service.list({ page: 1, pageSize: 10, isRead: false });

    const req = httpMock.expectOne((r) => r.url === BASE && r.method === 'GET');
    expect(req.request.params.get('page')).toBe('1');
    expect(req.request.params.get('pageSize')).toBe('10');
    expect(req.request.params.get('isRead')).toBe('false');

    req.flush({
      data: [notif()],
      meta: { page: 1, pageSize: 10, total: 1, totalPages: 1, hasNext: false, hasPrev: false },
      timestamp: '2026-01-01T00:00:00Z',
    });

    const result = await promise;
    expect(result.items.length).toBe(1);
    expect(result.total).toBe(1);
    expect(result.hasNext).toBe(false);
  });

  it('GET /notifications/unread-count met à jour le signal', async () => {
    const promise = service.fetchUnreadCount();
    const req = httpMock.expectOne(`${BASE}/unread-count`);
    expect(req.request.method).toBe('GET');
    req.flush({ data: { count: 7 }, timestamp: '2026-01-01T00:00:00Z' });

    expect(await promise).toBe(7);
    expect(service.unreadCount()).toBe(7);
    expect(service.hasUnread()).toBe(true);
  });

  it('POST /notifications/:id/read décrémente le compteur', async () => {
    // seed initial counter
    const seed = service.fetchUnreadCount();
    httpMock.expectOne(`${BASE}/unread-count`).flush({ data: { count: 3 }, timestamp: '' });
    await seed;

    const promise = service.markAsRead('n1');
    const req = httpMock.expectOne(`${BASE}/n1/read`);
    expect(req.request.method).toBe('POST');
    req.flush({ data: notif({ id: 'n1', isRead: true }), timestamp: '' });

    await promise;
    expect(service.unreadCount()).toBe(2);
  });

  it('POST /notifications/read-all réinitialise le compteur', async () => {
    const seed = service.fetchUnreadCount();
    httpMock.expectOne(`${BASE}/unread-count`).flush({ data: { count: 9 }, timestamp: '' });
    await seed;

    const promise = service.markAllAsRead();
    const req = httpMock.expectOne(`${BASE}/read-all`);
    expect(req.request.method).toBe('POST');
    req.flush({ data: { updated: 9 }, timestamp: '' });

    expect((await promise).updated).toBe(9);
    expect(service.unreadCount()).toBe(0);
    expect(service.hasUnread()).toBe(false);
  });

  it('DELETE /notifications/:id', async () => {
    const promise = service.delete('n42');
    const req = httpMock.expectOne(`${BASE}/n42`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ data: null, timestamp: '' });
    await promise;
  });
});

import { HttpResponse, http } from 'msw';
import { environment } from '../../environments/environment';
import { db, findMemberByUserId } from '../db';
import type { ApiResponse } from '../../app/core/api/models/api-response.model';

const base = environment.apiUrl;

const wrap = <T>(data: T, message?: string): ApiResponse<T> => ({
  data,
  message,
  timestamp: new Date().toISOString(),
});

const getUserIdFromAuth = (request: Request): string | null => {
  const auth = request.headers.get('Authorization');
  if (!auth) return null;
  const match = auth.match(/^Bearer mock-access-(user-\d+)-\d+$/);
  return match ? match[1] : null;
};

export const memberHandlers = [
  http.get(`${base}/members/me`, ({ request }) => {
    const userId = getUserIdFromAuth(request);
    if (!userId) return new HttpResponse(null, { status: 401 });
    const member = findMemberByUserId(userId);
    if (!member) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(wrap(member));
  }),

  http.get(`${base}/members/me/contributions`, ({ request }) => {
    const userId = getUserIdFromAuth(request);
    if (!userId) return new HttpResponse(null, { status: 401 });
    const member = findMemberByUserId(userId);
    if (!member) return HttpResponse.json(wrap([]));
    const contributions = db.contributions.filter((c) => c.memberId === member.id);
    return HttpResponse.json(wrap(contributions));
  }),

  http.get(`${base}/members/me/loans`, ({ request }) => {
    const userId = getUserIdFromAuth(request);
    if (!userId) return new HttpResponse(null, { status: 401 });
    const member = findMemberByUserId(userId);
    if (!member) return HttpResponse.json(wrap([]));
    const loans = db.loans.filter((l) => l.memberId === member.id);
    return HttpResponse.json(wrap(loans));
  }),

  http.get(`${base}/members/me/planning`, ({ request }) => {
    const userId = getUserIdFromAuth(request);
    if (!userId) return new HttpResponse(null, { status: 401 });
    const member = findMemberByUserId(userId);
    if (!member) return HttpResponse.json(wrap([]));
    const upcomingSessions = db.sessions
      .filter((s) => s.tontineId === member.tontineId)
      .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
    return HttpResponse.json(wrap(upcomingSessions));
  }),

  http.get(`${base}/members/me/summary`, ({ request }) => {
    const userId = getUserIdFromAuth(request);
    if (!userId) return new HttpResponse(null, { status: 401 });
    const member = findMemberByUserId(userId);
    if (!member) return new HttpResponse(null, { status: 404 });
    const tontine = db.tontines.find((t) => t.id === member.tontineId);
    const summary = {
      member,
      tontine,
      totalContributed: member.totalContributed,
      totalArrears: member.totalArrears,
      activeLoans: db.loans.filter((l) => l.memberId === member.id && l.status === 'REPAYING').length,
      nextSession: db.sessions
        .filter((s) => s.tontineId === member.tontineId && s.status === 'SCHEDULED')
        .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())[0],
      tourPosition: member.tourOrder,
    };
    return HttpResponse.json(wrap(summary));
  }),
];

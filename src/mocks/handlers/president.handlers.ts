import { HttpResponse, http } from 'msw';
import { DecisionType, ValidationCategory } from '../../app/core/enums/validation.enum';
import { SanctionStatus } from '../../app/core/enums/sanction-type.enum';
import { environment } from '../../environments/environment';
import { db } from '../db';
import type { ApiResponse } from '../../app/core/api/models/api-response.model';
import type {
  Announcement,
  PresidentDashboard,
} from '../../app/shared/models/entities/announcement.model';

const base = environment.apiUrl;

const wrap = <T>(data: T, message?: string): ApiResponse<T> => ({
  data,
  message,
  timestamp: new Date().toISOString(),
});

const isAuthorized = (request: Request): boolean =>
  !!request.headers.get('Authorization')?.startsWith('Bearer mock-access-');

const buildDashboard = (): PresidentDashboard => {
  const tontine = db.tontines[0];
  const cycle = db.cycles[0];
  const nextSession = db.sessions
    .filter((s) => s.tontineId === tontine.id && s.status === 'SCHEDULED')
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())[0];
  const nextSessionDays = nextSession
    ? Math.max(
        0,
        Math.round((new Date(nextSession.scheduledAt).getTime() - Date.now()) / (24 * 60 * 60 * 1000)),
      )
    : undefined;

  const activeLoans = db.loans.filter((l) => l.status === 'REPAYING' || l.status === 'DISBURSED');
  const activeLoansAmount = activeLoans.reduce((sum, l) => sum + (l.totalDue - l.totalRepaid), 0);
  const pendingSanctions = db.sanctions.filter(
    (s) => s.status === SanctionStatus.PENDING || s.status === SanctionStatus.CONTESTED,
  );

  const cycleProgressPercent = cycle ? (cycle.completedSessions / cycle.totalSessions) * 100 : 0;

  return {
    kpi: {
      totalCashBalance: tontine.totalSaved,
      activeMembersCount: db.members.filter((m) => m.status === 'ACTIVE').length,
      activeLoansCount: activeLoans.length,
      activeLoansAmount,
      pendingSanctionsCount: pendingSanctions.length,
      pendingSanctionsAmount: pendingSanctions.reduce((sum, s) => sum + s.amount, 0),
      nextSessionInDays: nextSessionDays,
      nextSessionNumber: nextSession?.number,
      contributionRate: 0.92,
      pendingValidationsCount: db.validations.length,
      cycleProgressPercent,
      cycleCompletedSessions: cycle?.completedSessions ?? 0,
      cycleTotalSessions: cycle?.totalSessions ?? 0,
    },
    alerts: ([
      {
        id: 'alert-1',
        level: 'CRITICAL' as const,
        message: `${db.validations.filter((v) => v.priority === 'CRITICAL').length} opération(s) financière(s) en attente de validation`,
        link: '/president/validations',
      },
      {
        id: 'alert-2',
        level: 'WARNING' as const,
        message: `${db.sanctions.filter((s) => s.status === SanctionStatus.CONTESTED).length} sanction(s) contestée(s) à arbitrer`,
        link: '/president/sanctions',
      },
    ] satisfies PresidentDashboard['alerts']).filter((a) => !a.message.startsWith('0 ')),
    pendingValidations: db.validations.slice(0, 6).map((v) => ({
      id: v.id,
      title: v.title,
      category: v.category,
      priority: v.priority,
      amount: 'amount' in v ? v.amount : undefined,
    })),
    performance: [
      { label: 'Taux de recouvrement', current: 92, previous: 89, unit: '%', trend: 'UP' as const, positiveTrend: 'UP' as const },
      { label: 'Prêts en retard', current: 2, previous: 3, trend: 'DOWN' as const, positiveTrend: 'DOWN' as const },
      { label: 'Taux de présence', current: 85, previous: 80, unit: '%', trend: 'UP' as const, positiveTrend: 'UP' as const },
      { label: 'Sanctions actives', current: pendingSanctions.length, previous: 8, trend: 'DOWN' as const, positiveTrend: 'DOWN' as const },
    ],
    recentDecisions: db.decisions.slice(-4).reverse().map((d) => {
      const validation = db.validations.find((v) => v.id === d.validationId);
      return {
        id: d.id,
        decidedAt: d.decidedAt,
        decision: d.decision,
        subject: validation?.title ?? d.validationId,
      };
    }),
    agenda: [
      {
        id: 'ag-1',
        when: new Date().toISOString(),
        title: `${db.validations.length} validations en attente`,
        bucket: 'TODAY' as const,
      },
      ...(nextSession
        ? [
            {
              id: 'ag-2',
              when: nextSession.scheduledAt,
              title: `Séance #${nextSession.number} à présider`,
              bucket: 'THIS_WEEK' as const,
            },
          ]
        : []),
      {
        id: 'ag-3',
        when: '2026-07-15T00:00:00.000Z',
        title: 'Fin de cycle — clôture à valider',
        bucket: 'UPCOMING' as const,
      },
    ],
  };
};

export const presidentHandlers = [
  http.get(`${base}/president/dashboard`, ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    return HttpResponse.json(wrap(buildDashboard()));
  }),

  http.get(`${base}/president/validations`, ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    const items = category
      ? db.validations.filter((v) => v.category === category)
      : db.validations;
    return HttpResponse.json(wrap(items));
  }),

  http.get(`${base}/president/validations/:id`, ({ params, request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const validation = db.validations.find((v) => v.id === params['id']);
    if (!validation) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(wrap(validation));
  }),

  http.post(`${base}/president/validations/:id/decide`, async ({ params, request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const validation = db.validations.find((v) => v.id === params['id']);
    if (!validation) return new HttpResponse(null, { status: 404 });

    const body = (await request.json()) as { decision: DecisionType; comment?: string };
    if (
      (body.decision === DecisionType.REJECTED || body.decision === DecisionType.BLOCKED) &&
      !body.comment?.trim()
    ) {
      return HttpResponse.json(
        {
          code: 'COMMENT_REQUIRED',
          message: 'Un commentaire est obligatoire en cas de refus ou de blocage.',
          status: 422,
          timestamp: new Date().toISOString(),
        },
        { status: 422 },
      );
    }

    const decision = {
      id: `dec-${db.decisions.length + 1}`,
      validationId: validation.id,
      decision: body.decision,
      comment: body.comment,
      decidedAt: new Date().toISOString(),
      decidedByUserId: 'user-1',
    };
    db.decisions.push(decision);

    if (body.decision !== DecisionType.BLOCKED) {
      db.validations = db.validations.filter((v) => v.id !== validation.id);
    }

    return HttpResponse.json(wrap(decision, 'Décision enregistrée.'));
  }),

  http.get(`${base}/president/sanctions`, ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    return HttpResponse.json(
      wrap(
        db.sanctions.filter(
          (s) => s.status === SanctionStatus.PENDING || s.status === SanctionStatus.CONTESTED,
        ),
      ),
    );
  }),

  http.post(`${base}/president/sanctions/:id/waive`, async ({ params, request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const sanction = db.sanctions.find((s) => s.id === params['id']);
    if (!sanction) return new HttpResponse(null, { status: 404 });

    const body = (await request.json()) as { reason: string };
    if (!body.reason?.trim()) {
      return HttpResponse.json(
        {
          code: 'REASON_REQUIRED',
          message: 'Un motif est obligatoire pour lever une sanction.',
          status: 422,
          timestamp: new Date().toISOString(),
        },
        { status: 422 },
      );
    }

    sanction.status = SanctionStatus.WAIVED;
    sanction.resolvedByUserId = 'user-1';
    return HttpResponse.json(wrap(sanction, 'Sanction levée.'));
  }),

  http.post(`${base}/president/sanctions/:id/confirm`, ({ params, request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const sanction = db.sanctions.find((s) => s.id === params['id']);
    if (!sanction) return new HttpResponse(null, { status: 404 });
    sanction.status = SanctionStatus.CONFIRMED;
    sanction.resolvedByUserId = 'user-1';
    return HttpResponse.json(wrap(sanction, 'Sanction confirmée.'));
  }),

  http.get(`${base}/president/announcements`, ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const items = [...db.announcements].sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
    return HttpResponse.json(wrap(items));
  }),

  http.post(`${base}/president/announcements`, async ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const body = (await request.json()) as Omit<Announcement, 'id' | 'tontineId' | 'publishedAt' | 'authorUserId' | 'authorFullName'>;
    if (!body.title?.trim() || !body.body?.trim()) {
      return HttpResponse.json(
        {
          code: 'INVALID_PAYLOAD',
          message: 'Titre et message obligatoires.',
          status: 422,
          timestamp: new Date().toISOString(),
        },
        { status: 422 },
      );
    }
    const announcement: Announcement = {
      id: `ann-${db.announcements.length + 1}`,
      tontineId: 'tontine-1',
      authorUserId: 'user-1',
      authorFullName: 'Achille Mbongo',
      title: body.title.trim(),
      body: body.body.trim(),
      audience: body.audience ?? 'ALL',
      channels: body.channels?.length ? body.channels : ['IN_APP'],
      publishedAt: new Date().toISOString(),
    };
    db.announcements.unshift(announcement);
    return HttpResponse.json(wrap(announcement, 'Annonce publiée.'), { status: 201 });
  }),
];

const _categoryUsed: ValidationCategory[] = [
  ValidationCategory.FINANCIAL_OPERATION,
  ValidationCategory.DOCUMENT,
  ValidationCategory.ADHESION,
];
void _categoryUsed;

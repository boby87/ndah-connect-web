import { HttpResponse, http } from 'msw';
import { SanctionStatus, SanctionType } from '../../app/core/enums/sanction-type.enum';
import { environment } from '../../environments/environment';
import { db } from '../db';
import type { ApiResponse } from '../../app/core/api/models/api-response.model';
import type {
  AbsenceJustification,
  AttendanceModificationRequest,
  CensorCommunication,
  CensorReport,
  Sanction,
  SanctionSeverity,
} from '../../app/shared/models/entities/sanction.model';

const base = environment.apiUrl;

const wrap = <T>(data: T, message?: string): ApiResponse<T> => ({
  data,
  message,
  timestamp: new Date().toISOString(),
});

const err = (code: string, message: string, status: number) =>
  HttpResponse.json(
    { code, message, status, timestamp: new Date().toISOString() },
    { status },
  );

const isAuthorized = (request: Request): boolean =>
  !!request.headers.get('Authorization')?.startsWith('Bearer mock-access-');

const memberName = (memberId: string): string => {
  const m = db.members.find((x) => x.id === memberId);
  return m ? `${m.firstName} ${m.lastName}` : memberId;
};

const activeSession = (): typeof db.sessionsLive[number] | undefined =>
  db.sessionsLive.find((s) => s.status === 'IN_PROGRESS');

const linkedAttendanceSanction = (memberId: string, sessionId: string): Sanction | undefined =>
  db.sanctions.find(
    (s) =>
      s.memberId === memberId &&
      s.sessionId === sessionId &&
      (s.type === SanctionType.ABSENCE || s.type === SanctionType.LATENESS) &&
      s.status !== SanctionStatus.CANCELLED &&
      s.status !== SanctionStatus.WAIVED,
  );

const cancelSanction = (
  sanction: Sanction,
  reason: string,
  byRole: 'CENSOR' | 'PRESIDENT' | 'ASSEMBLY',
  byUserId: string,
  byFullName: string,
): void => {
  sanction.status = SanctionStatus.CANCELLED;
  sanction.cancelledAt = new Date().toISOString();
  sanction.cancelReason = reason;
  sanction.cancelledByRole = byRole;
  sanction.cancelledByUserId = byUserId;
  sanction.cancelledByFullName = byFullName;
  if (sanction.paidAt) {
    sanction.refundInitiated = true;
  }
};

export const censorHandlers = [
  // ─── Dashboard ─────────────────────────────────────────────────────────
  http.get(`${base}/censor/dashboard`, ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });

    const unpaid = db.sanctions.filter(
      (s) =>
        s.isFinancial !== false &&
        (s.status === SanctionStatus.PENDING || s.status === SanctionStatus.CONFIRMED),
    );
    const unpaidAmount = unpaid.reduce((sum, s) => sum + s.amount, 0);
    const contestations = db.sanctions.filter((s) => s.status === SanctionStatus.CONTESTED);
    const pendingAttendance = db.attendanceModRequests.filter((r) => r.status === 'PENDING');
    const pendingJustifs = db.absenceJustifications.filter((j) => j.status === 'PENDING_CENSOR');

    // membres les plus sanctionnés (par membre, count + amount payés/impayés)
    const byMember = new Map<string, { count: number; amount: number; name: string }>();
    for (const s of db.sanctions) {
      if (s.status === SanctionStatus.CANCELLED || s.status === SanctionStatus.WAIVED) continue;
      const entry = byMember.get(s.memberId) ?? {
        count: 0,
        amount: 0,
        name: s.memberFullName ?? memberName(s.memberId),
      };
      entry.count += 1;
      entry.amount += s.amount;
      byMember.set(s.memberId, entry);
    }
    const topSanctioned = Array.from(byMember.entries())
      .map(([memberId, v]) => ({ memberId, ...v }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // breakdown par type
    const breakdownMap = new Map<string, { count: number; amount: number }>();
    for (const s of db.sanctions) {
      if (s.status === SanctionStatus.CANCELLED) continue;
      const e = breakdownMap.get(s.type) ?? { count: 0, amount: 0 };
      e.count += 1;
      e.amount += s.amount;
      breakdownMap.set(s.type, e);
    }
    const breakdown = Array.from(breakdownMap.entries()).map(([type, v]) => ({
      type,
      ...v,
    }));

    const totalCollected = db.sanctions
      .filter((s) => s.status === SanctionStatus.PAID)
      .reduce((sum, s) => sum + s.amount, 0);

    const session = activeSession();

    return HttpResponse.json(
      wrap({
        alerts: {
          pendingAttendance: pendingAttendance.length,
          pendingJustifications: pendingJustifs.length,
          pendingContestations: contestations.length,
          unpaidCount: unpaid.length,
          unpaidAmount,
        },
        sanctionsThisPeriod: {
          count: db.sanctions.filter((s) => s.status !== SanctionStatus.CANCELLED).length,
          amount: db.sanctions
            .filter((s) => s.status !== SanctionStatus.CANCELLED)
            .reduce((sum, s) => sum + s.amount, 0),
          collected: totalCollected,
          breakdown,
        },
        topSanctioned,
        session: session
          ? {
              id: session.id,
              number: session.number,
              status: session.status,
              scheduledAt: session.scheduledAt,
            }
          : null,
      }),
    );
  }),

  // ─── Sanctions ─────────────────────────────────────────────────────────
  http.get(`${base}/censor/sanctions`, ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const sessionId = url.searchParams.get('sessionId');
    let list = [...db.sanctions];
    if (status) list = list.filter((s) => s.status === status);
    if (sessionId) list = list.filter((s) => s.sessionId === sessionId);
    list.sort((a, b) => (b.issuedAt > a.issuedAt ? 1 : -1));
    return HttpResponse.json(wrap(list));
  }),

  // RM-AS01 — application d'une sanction (pendant séance)
  http.post(`${base}/censor/sanctions`, async ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const session = activeSession();
    if (!session) {
      return err(
        'RM_AS01_VIOLATION',
        "Les sanctions ne peuvent être appliquées que pendant une séance active.",
        422,
      );
    }
    const body = (await request.json()) as {
      memberId: string;
      type: SanctionType;
      amount?: number;
      reason: string;
      severity?: SanctionSeverity;
      customLabel?: string;
      isFinancial?: boolean;
    };
    if (!body.memberId || !body.reason?.trim()) {
      return err('RM_AS02_VIOLATION', 'Membre et motif obligatoires.', 422);
    }
    const sanction: Sanction = {
      id: `sanc-${db.sanctions.length + 1}-${Date.now()}`,
      tontineId: 'tontine-1',
      memberId: body.memberId,
      memberFullName: memberName(body.memberId),
      sessionId: session.id,
      sessionNumber: session.number,
      type: body.type,
      customLabel: body.customLabel?.trim(),
      amount: body.amount ?? 0,
      isFinancial: body.isFinancial !== false && (body.amount ?? 0) > 0,
      severity: body.severity ?? 'LOW',
      reason: body.reason.trim(),
      status: SanctionStatus.PENDING,
      autoDetected: false,
      issuedByUserId: 'user-5',
      issuedByFullName: 'Désiré Etoa (Censeur)',
      issuedAt: new Date().toISOString(),
    };
    db.sanctions.unshift(sanction);
    return HttpResponse.json(wrap(sanction, 'Sanction appliquée.'), { status: 201 });
  }),

  // RM-SM01 — sanctions multiples
  http.post(`${base}/censor/sanctions/batch`, async ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const session = activeSession();
    if (!session) {
      return err('RM_AS01_VIOLATION', 'Aucune séance active.', 422);
    }
    const body = (await request.json()) as {
      memberId: string;
      sanctions: {
        type: SanctionType;
        amount?: number;
        reason: string;
        severity?: SanctionSeverity;
        customLabel?: string;
        isFinancial?: boolean;
      }[];
    };
    if (!body.memberId || !body.sanctions?.length) {
      return err('INVALID_PAYLOAD', 'Membre et sanctions requis.', 422);
    }
    if (body.sanctions.some((s) => !s.reason?.trim())) {
      return err('RM_SM02_VIOLATION', 'Chaque sanction nécessite son propre motif.', 422);
    }
    const created: Sanction[] = body.sanctions.map((s, i) => ({
      id: `sanc-batch-${Date.now()}-${i}`,
      tontineId: 'tontine-1',
      memberId: body.memberId,
      memberFullName: memberName(body.memberId),
      sessionId: session.id,
      sessionNumber: session.number,
      type: s.type,
      customLabel: s.customLabel?.trim(),
      amount: s.amount ?? 0,
      isFinancial: s.isFinancial !== false && (s.amount ?? 0) > 0,
      severity: s.severity ?? 'LOW',
      reason: s.reason.trim(),
      status: SanctionStatus.PENDING,
      autoDetected: false,
      issuedByUserId: 'user-5',
      issuedByFullName: 'Désiré Etoa (Censeur)',
      issuedAt: new Date().toISOString(),
    }));
    db.sanctions.unshift(...created);
    return HttpResponse.json(wrap(created, `${created.length} sanction(s) appliquée(s).`), {
      status: 201,
    });
  }),

  // RM-CA01..05 — sanctions auto à confirmer
  http.get(`${base}/censor/sanctions/auto-detected`, ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const list = db.sanctions.filter(
      (s) => s.autoDetected === true && s.status === SanctionStatus.PENDING,
    );
    return HttpResponse.json(wrap(list));
  }),

  http.post(`${base}/censor/sanctions/confirm-batch`, async ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const body = (await request.json()) as { sanctionIds: string[] };
    if (!body.sanctionIds?.length) {
      return err('INVALID_PAYLOAD', 'Liste de sanctions requise.', 422);
    }
    const updated: Sanction[] = [];
    for (const id of body.sanctionIds) {
      const s = db.sanctions.find((x) => x.id === id);
      if (s && s.status === SanctionStatus.PENDING) {
        s.status = SanctionStatus.CONFIRMED;
        updated.push(s);
      }
    }
    return HttpResponse.json(wrap(updated, `${updated.length} sanction(s) confirmée(s).`));
  }),

  // RM-AN01..05 — annulation
  http.post(`${base}/censor/sanctions/:id/cancel`, async ({ request, params }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const sanction = db.sanctions.find((s) => s.id === params['id']);
    if (!sanction) return new HttpResponse(null, { status: 404 });
    const body = (await request.json()) as { reason: string };
    if (!body.reason?.trim()) {
      return err('RM_AN02_VIOLATION', "Le motif d'annulation est obligatoire.", 422);
    }
    if (sanction.status === SanctionStatus.CANCELLED) {
      return err('ALREADY_CANCELLED', 'Sanction déjà annulée.', 422);
    }
    cancelSanction(sanction, body.reason.trim(), 'CENSOR', 'user-5', 'Désiré Etoa (Censeur)');
    return HttpResponse.json(wrap(sanction, 'Sanction annulée.'));
  }),

  // RM-CS01..05 — contestations
  http.get(`${base}/censor/contestations`, ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const list = db.sanctions.filter((s) => s.status === SanctionStatus.CONTESTED);
    return HttpResponse.json(wrap(list));
  }),

  http.post(`${base}/censor/contestations/:id/decide`, async ({ request, params }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const sanction = db.sanctions.find((s) => s.id === params['id']);
    if (!sanction) return new HttpResponse(null, { status: 404 });
    if (sanction.status !== SanctionStatus.CONTESTED) {
      return err('INVALID_STATE', 'Sanction non en contestation.', 422);
    }
    const body = (await request.json()) as {
      decision: 'ACCEPT' | 'REJECT' | 'TRANSFER_PRESIDENT';
      comment?: string;
    };
    if (body.decision === 'REJECT' && !body.comment?.trim()) {
      return err('RM_CS03_VIOLATION', 'Le rejet nécessite un commentaire.', 422);
    }
    if (body.decision === 'ACCEPT') {
      cancelSanction(
        sanction,
        body.comment?.trim() ?? 'Contestation acceptée.',
        'CENSOR',
        'user-5',
        'Désiré Etoa (Censeur)',
      );
    } else if (body.decision === 'REJECT') {
      sanction.status = SanctionStatus.CONFIRMED;
      sanction.resolvedByUserId = 'user-5';
    } else {
      sanction.status = SanctionStatus.CONTESTED;
      sanction.resolvedByUserId = 'user-5';
      // create a pending president validation (simplified: just keep status)
    }
    return HttpResponse.json(wrap(sanction, 'Décision enregistrée.'));
  }),

  // ─── Attendance modification requests ──────────────────────────────────
  http.get(`${base}/censor/attendance-modifications`, ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    return HttpResponse.json(wrap(db.attendanceModRequests));
  }),

  http.post(`${base}/censor/attendance-modifications/:id/decide`, async ({ request, params }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const req = db.attendanceModRequests.find((r) => r.id === params['id']);
    if (!req) return new HttpResponse(null, { status: 404 });
    if (req.status !== 'PENDING' && req.status !== 'INFO_REQUESTED') {
      return err('INVALID_STATE', 'Demande déjà traitée.', 422);
    }
    const body = (await request.json()) as {
      decision: 'APPROVE' | 'REJECT' | 'REQUEST_INFO';
      comment?: string;
      infoRequest?: string;
    };
    if (body.decision === 'REJECT' && !body.comment?.trim()) {
      return err('RM_VP03_VIOLATION', 'Le refus nécessite un commentaire.', 422);
    }
    req.decidedAt = new Date().toISOString();
    if (body.decision === 'APPROVE') {
      req.status = 'APPROVED';
      req.decisionComment = body.comment;
      if (req.linkedSanctionId) {
        const linked = db.sanctions.find((s) => s.id === req.linkedSanctionId);
        if (linked) {
          cancelSanction(
            linked,
            `Modification présence approuvée — ${req.fromStatus} → ${req.toStatus}.`,
            'CENSOR',
            'user-5',
            'Désiré Etoa (Censeur)',
          );
        }
      }
    } else if (body.decision === 'REJECT') {
      req.status = 'REJECTED';
      req.decisionComment = body.comment;
    } else {
      req.status = 'INFO_REQUESTED';
      req.infoRequest = body.infoRequest;
    }
    return HttpResponse.json(wrap(req, 'Décision enregistrée.'));
  }),

  // ─── Absence justifications ───────────────────────────────────────────
  http.get(`${base}/censor/justifications`, ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    return HttpResponse.json(wrap(db.absenceJustifications));
  }),

  http.post(`${base}/censor/justifications/:id/decide`, async ({ request, params }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const j = db.absenceJustifications.find((x) => x.id === params['id']);
    if (!j) return new HttpResponse(null, { status: 404 });
    if (j.status !== 'PENDING_CENSOR' && j.status !== 'INFO_REQUESTED') {
      return err('INVALID_STATE', 'Justificatif déjà traité.', 422);
    }
    const body = (await request.json()) as {
      decision: 'VALIDATE' | 'REJECT' | 'REQUEST_INFO';
      comment?: string;
    };
    if (body.decision === 'REJECT' && !body.comment?.trim()) {
      return err('REASON_REQUIRED', 'Le rejet nécessite un commentaire.', 422);
    }
    j.censorDecidedAt = new Date().toISOString();
    j.censorComment = body.comment;
    if (body.decision === 'VALIDATE') {
      j.status = 'PENDING_PRESIDENT';
    } else if (body.decision === 'REJECT') {
      j.status = 'REJECTED_CENSOR';
    } else {
      j.status = 'INFO_REQUESTED';
    }
    return HttpResponse.json(wrap(j, 'Décision enregistrée.'));
  }),

  // simulate president final approval (used by Censor view to see history)
  http.post(`${base}/censor/justifications/:id/president-approve`, async ({ request, params }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const j = db.absenceJustifications.find((x) => x.id === params['id']);
    if (!j) return new HttpResponse(null, { status: 404 });
    if (j.status !== 'PENDING_PRESIDENT') {
      return err('INVALID_STATE', 'Justificatif non transmis au Président.', 422);
    }
    j.status = 'APPROVED';
    j.presidentDecidedAt = new Date().toISOString();
    j.presidentComment = 'Validé.';
    if (j.linkedSanctionId) {
      const linked = db.sanctions.find((s) => s.id === j.linkedSanctionId);
      if (linked) {
        cancelSanction(
          linked,
          'Justificatif validé par Censeur puis Président — RM-VJ06.',
          'PRESIDENT',
          'user-1',
          'Achille Mbongo (Président)',
        );
      }
    }
    return HttpResponse.json(wrap(j, 'Justificatif validé définitivement.'));
  }),

  // ─── Unpaid sanctions & reminders ─────────────────────────────────────
  http.get(`${base}/censor/unpaid-sanctions`, ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const now = Date.now();
    const list = db.sanctions
      .filter(
        (s) =>
          s.isFinancial !== false &&
          (s.status === SanctionStatus.PENDING || s.status === SanctionStatus.CONFIRMED),
      )
      .map((s) => {
        const issued = new Date(s.issuedAt).getTime();
        const daysOpen = Math.floor((now - issued) / (1000 * 60 * 60 * 24));
        return { ...s, daysOpen };
      })
      .sort((a, b) => b.daysOpen - a.daysOpen);
    return HttpResponse.json(wrap(list));
  }),

  // ─── Communications (rappels + avertissements) ─────────────────────────
  http.get(`${base}/censor/communications`, ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    return HttpResponse.json(wrap(db.censorCommunications));
  }),

  http.post(`${base}/censor/communications`, async ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const body = (await request.json()) as {
      kind: 'WARNING' | 'PAYMENT_REMINDER' | 'INFORMATION' | 'CALL_TO_ORDER';
      subject: string;
      body: string;
      channels: ('SMS' | 'EMAIL' | 'PUSH' | 'WHATSAPP')[];
      recipientMemberIds: string[];
      relatedSanctionIds?: string[];
    };
    if (!body.subject?.trim() || !body.body?.trim()) {
      return err('INVALID_PAYLOAD', 'Objet et message obligatoires.', 422);
    }
    if (!body.recipientMemberIds?.length) {
      return err('INVALID_PAYLOAD', 'Au moins un destinataire requis.', 422);
    }
    if (!body.channels?.length) {
      return err('INVALID_PAYLOAD', 'Au moins un canal requis.', 422);
    }
    const comm: CensorCommunication = {
      id: `com-${db.censorCommunications.length + 1}-${Date.now()}`,
      tontineId: 'tontine-1',
      kind: body.kind,
      subject: body.subject.trim(),
      body: body.body.trim(),
      channels: body.channels,
      recipientMemberIds: body.recipientMemberIds,
      recipientLabels: body.recipientMemberIds.map((id) => memberName(id)),
      sentByUserId: 'user-5',
      sentByFullName: 'Désiré Etoa (Censeur)',
      sentAt: new Date().toISOString(),
      relatedSanctionIds: body.relatedSanctionIds,
    };
    db.censorCommunications.unshift(comm);
    return HttpResponse.json(wrap(comm, 'Message envoyé.'), { status: 201 });
  }),

  // ─── Reports ───────────────────────────────────────────────────────────
  http.get(`${base}/censor/reports`, ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    return HttpResponse.json(wrap(db.censorReports));
  }),

  http.post(`${base}/censor/reports/generate`, async ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const body = (await request.json()) as {
      scope: 'LAST_SESSION' | 'CUSTOM_RANGE' | 'CYCLE';
      periodLabel?: string;
      observations?: string;
    };

    const session = db.sessionsLive[0];
    const periodLabel =
      body.periodLabel?.trim() ?? (session ? `Séance #${session.number}` : 'Période');

    const breakdownMap = new Map<string, { count: number; amount: number }>();
    let total = 0;
    let totalAmount = 0;
    for (const s of db.sanctions) {
      if (s.status === SanctionStatus.CANCELLED) continue;
      const e = breakdownMap.get(s.type) ?? { count: 0, amount: 0 };
      e.count += 1;
      e.amount += s.amount;
      breakdownMap.set(s.type, e);
      total += 1;
      totalAmount += s.amount;
    }
    const breakdown = Array.from(breakdownMap.entries()).map(([type, v]) => ({ type, ...v }));

    const unpaid = db.sanctions.filter(
      (s) =>
        s.isFinancial !== false &&
        (s.status === SanctionStatus.PENDING || s.status === SanctionStatus.CONFIRMED),
    );

    const report: CensorReport = {
      id: `cenr-${db.censorReports.length + 1}-${Date.now()}`,
      tontineId: 'tontine-1',
      sessionId: session?.id,
      sessionNumber: session?.number,
      periodLabel,
      scope: body.scope,
      generatedAt: new Date().toISOString(),
      authorFullName: 'Désiré Etoa (Censeur)',
      totalSanctions: total,
      totalAmount,
      breakdown,
      unpaidCount: unpaid.length,
      unpaidAmount: unpaid.reduce((sum, s) => sum + s.amount, 0),
      observations: body.observations?.trim(),
    };
    db.censorReports.unshift(report);
    return HttpResponse.json(wrap(report, 'Rapport généré.'), { status: 201 });
  }),

  http.post(`${base}/censor/reports/:id/observations`, async ({ request, params }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const report = db.censorReports.find((r) => r.id === params['id']);
    if (!report) return new HttpResponse(null, { status: 404 });
    const body = (await request.json()) as { observations: string };
    report.observations = body.observations?.trim();
    return HttpResponse.json(wrap(report, 'Observations mises à jour.'));
  }),

  // ─── Members (for dropdown selection) ──────────────────────────────────
  http.get(`${base}/censor/members`, ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    return HttpResponse.json(wrap(db.members));
  }),
];

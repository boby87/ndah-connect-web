import { HttpResponse, http } from 'msw';
import { SessionStatus } from '../../app/core/enums/session-status.enum';
import { environment } from '../../environments/environment';
import { db } from '../db';
import type { ApiResponse } from '../../app/core/api/models/api-response.model';
import type {
  AgendaDraftItem,
  AgendaDraftStatus,
} from '../../app/shared/models/entities/agenda-draft.model';
import type {
  ArchiveDocumentType,
  ArchiveVisibility,
} from '../../app/shared/models/entities/archive-document.model';
import type { ConvocationChannel } from '../../app/shared/models/entities/convocation.model';
import type { MinutesDraftStatus, MinutesSection } from '../../app/shared/models/entities/minutes-draft.model';
import type { RsvpStatus, SessionRsvpSummary } from '../../app/shared/models/entities/rsvp.model';

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

const computeRsvpSummary = (sessionId: string): SessionRsvpSummary => {
  const session = db.sessionsLive.find((s) => s.id === sessionId) ?? db.sessionsLive[0];
  const tontineMembers = db.members.filter(
    (m) => m.tontineId === session.tontineId && m.status === 'ACTIVE',
  );
  // Make sure every member has an RSVP entry.
  for (const m of tontineMembers) {
    if (!db.rsvps.some((r) => r.sessionId === sessionId && r.memberId === m.id)) {
      db.rsvps.push({
        sessionId,
        memberId: m.id,
        memberFullName: `${m.firstName} ${m.lastName}`,
        status: 'PENDING',
      });
    }
  }
  const rsvps = db.rsvps.filter((r) => r.sessionId === sessionId);
  const confirmed = rsvps.filter((r) => r.status === 'CONFIRMED').length;
  const declined = rsvps.filter((r) => r.status === 'DECLINED').length;
  const tentative = rsvps.filter((r) => r.status === 'TENTATIVE').length;
  const pending = rsvps.filter((r) => r.status === 'PENDING').length;
  const total = tontineMembers.length;
  const quorumPercent = session.quorumThreshold ?? 0.5;
  return {
    sessionId,
    sessionNumber: session.number,
    scheduledAt: session.scheduledAt,
    totalMembers: total,
    confirmed,
    declined,
    tentative,
    pending,
    quorumPercent,
    quorumReached: total > 0 && confirmed / total >= quorumPercent,
    rsvps,
  };
};

export const secretaryHandlers = [
  // ─── Dashboard ─────────────────────────────────────────────────────────
  http.get(`${base}/secretary/dashboard`, ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const nextSession = db.sessionsLive
      .filter((s) => s.status === SessionStatus.SCHEDULED)
      .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())[0];

    const minutesPending = db.minutesDrafts.filter((m) => m.status === 'DRAFT' || m.status === 'CHANGES_REQUESTED').length;
    const agendaPending = db.agendaDrafts.filter((a) => a.status === 'DRAFT' || a.status === 'CHANGES_REQUESTED').length;
    const pendingAdhesions = db.membershipFiles.filter(
      (f) => f.kind === 'ADHESION' && (f.status === 'SUBMITTED' || f.status === 'BUREAU_REVIEW'),
    ).length;
    const pendingResignations = db.membershipFiles.filter(
      (f) => f.kind === 'RESIGNATION' && (f.status === 'SUBMITTED' || f.status === 'BUREAU_REVIEW'),
    ).length;

    let rsvpSummary: SessionRsvpSummary | null = null;
    if (nextSession) {
      rsvpSummary = computeRsvpSummary(nextSession.id);
    }

    return HttpResponse.json(
      wrap({
        nextSession: nextSession
          ? {
              id: nextSession.id,
              number: nextSession.number,
              scheduledAt: nextSession.scheduledAt,
              location: nextSession.location,
              daysUntil: Math.max(
                0,
                Math.round((new Date(nextSession.scheduledAt).getTime() - Date.now()) / 86_400_000),
              ),
            }
          : null,
        rsvpSummary,
        kpi: {
          minutesPending,
          agendaPending,
          pendingAdhesions,
          pendingResignations,
          totalMembers: db.members.filter((m) => m.status === 'ACTIVE').length,
          archivesCount: db.archives.length,
        },
        recentActivity: [
          ...db.minutesDrafts.slice(0, 3).map((m) => ({
            id: m.id,
            label: `PV séance #${m.sessionNumber}`,
            status: m.status,
            updatedAt: m.updatedAt,
          })),
        ],
      }),
    );
  }),

  // ─── Agenda drafts (Flow 2) ────────────────────────────────────────────
  http.get(`${base}/secretary/agendas`, ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    return HttpResponse.json(wrap(db.agendaDrafts));
  }),

  http.get(`${base}/secretary/agendas/:id`, ({ request, params }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const ag = db.agendaDrafts.find((a) => a.id === params['id']);
    if (!ag) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(wrap(ag));
  }),

  http.post(`${base}/secretary/agendas`, async ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const body = (await request.json()) as {
      sessionId: string;
      sessionNumber: number;
      scheduledAt: string;
      location?: string;
      beneficiaryMemberId?: string;
      items: { title: string; description?: string; isStandard: boolean; estimatedDurationMin?: number }[];
    };
    if (!body.scheduledAt || !body.items?.length) {
      return err('INVALID_PAYLOAD', 'Date et au moins un point requis.', 422);
    }
    const beneficiary = body.beneficiaryMemberId
      ? db.members.find((m) => m.id === body.beneficiaryMemberId)
      : undefined;
    const id = `agdraft-${db.agendaDrafts.length + 1}`;
    const items: AgendaDraftItem[] = body.items.map((it, i) => ({
      id: `${id}-i${i + 1}`,
      order: i + 1,
      title: it.title,
      description: it.description,
      isStandard: it.isStandard,
      estimatedDurationMin: it.estimatedDurationMin,
    }));
    const draft = {
      id,
      tontineId: 'tontine-1',
      sessionId: body.sessionId,
      sessionNumber: body.sessionNumber,
      scheduledAt: body.scheduledAt,
      location: body.location,
      beneficiaryMemberId: body.beneficiaryMemberId,
      beneficiaryFullName: beneficiary ? `${beneficiary.firstName} ${beneficiary.lastName}` : undefined,
      items,
      status: 'DRAFT' as AgendaDraftStatus,
      createdAt: new Date().toISOString(),
    };
    db.agendaDrafts.unshift(draft);
    return HttpResponse.json(wrap(draft, 'Ordre du jour créé.'), { status: 201 });
  }),

  http.post(`${base}/secretary/agendas/:id/submit`, ({ request, params }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const ag = db.agendaDrafts.find((a) => a.id === params['id']);
    if (!ag) return new HttpResponse(null, { status: 404 });
    const daysUntil = Math.floor((new Date(ag.scheduledAt).getTime() - Date.now()) / 86_400_000);
    if (daysUntil < 5) {
      return err(
        'RM_OJ01_VIOLATION',
        'L\'ODJ doit être soumis au moins 5 jours avant la séance.',
        422,
      );
    }
    ag.status = 'SUBMITTED_TO_PRESIDENT';
    ag.submittedAt = new Date().toISOString();
    return HttpResponse.json(wrap(ag, 'Soumis au Président.'));
  }),

  // ─── Convocations (Flow 3) ─────────────────────────────────────────────
  http.get(`${base}/secretary/convocations`, ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    return HttpResponse.json(wrap(db.convocations));
  }),

  http.post(`${base}/secretary/convocations`, async ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const body = (await request.json()) as {
      sessionId: string;
      channels: ConvocationChannel[];
      audienceMemberIds: string[];
      includeCandidates?: boolean;
      message: string;
      reminders?: { offsetHoursBefore: number }[];
      scheduledAt?: string;
    };
    const session = db.sessionsLive.find((s) => s.id === body.sessionId);
    if (!session) return err('SESSION_NOT_FOUND', 'Séance introuvable.', 404);
    if (!body.channels?.length || !body.audienceMemberIds?.length || !body.message?.trim()) {
      return err('INVALID_PAYLOAD', 'Canaux, audience et message requis.', 422);
    }
    const linkedAgenda = db.agendaDrafts.find((a) => a.sessionId === body.sessionId);
    if (linkedAgenda && linkedAgenda.status !== 'APPROVED' && linkedAgenda.status !== 'PUBLISHED') {
      return err(
        'RM_CV02_VIOLATION',
        'L\'ordre du jour doit être validé par le Président avant envoi.',
        422,
      );
    }
    const id = `conv-${db.convocations.length + 1}`;
    const now = new Date().toISOString();
    const convocation = {
      id,
      tontineId: 'tontine-1',
      sessionId: session.id,
      sessionNumber: session.number,
      scheduledFor: session.scheduledAt,
      channels: body.channels,
      audienceMemberIds: body.audienceMemberIds,
      includeCandidates: !!body.includeCandidates,
      reminders: body.reminders ?? [{ offsetHoursBefore: 24 }],
      message: body.message,
      status: body.scheduledAt ? ('SCHEDULED' as const) : ('SENT' as const),
      sentAt: body.scheduledAt ? undefined : now,
      scheduledAt: body.scheduledAt,
      totalRecipients: body.audienceMemberIds.length,
      totalDelivered: body.scheduledAt ? 0 : body.audienceMemberIds.length,
      totalFailed: 0,
    };
    db.convocations.unshift(convocation);
    return HttpResponse.json(wrap(convocation, 'Convocation enregistrée.'), { status: 201 });
  }),

  // ─── RSVPs (Flow 4) ────────────────────────────────────────────────────
  http.get(`${base}/secretary/sessions/:id/rsvps`, ({ request, params }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    return HttpResponse.json(wrap(computeRsvpSummary(params['id'] as string)));
  }),

  http.post(`${base}/secretary/sessions/:id/rsvps/:memberId`, async ({ request, params }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const sessionId = params['id'] as string;
    const memberId = params['memberId'] as string;
    const body = (await request.json()) as { status: RsvpStatus; reason?: string };
    let rsvp = db.rsvps.find((r) => r.sessionId === sessionId && r.memberId === memberId);
    if (!rsvp) {
      const member = db.members.find((m) => m.id === memberId);
      if (!member) return new HttpResponse(null, { status: 404 });
      rsvp = {
        sessionId,
        memberId,
        memberFullName: `${member.firstName} ${member.lastName}`,
        status: body.status,
        reason: body.reason,
        respondedAt: new Date().toISOString(),
      };
      db.rsvps.push(rsvp);
    } else {
      rsvp.status = body.status;
      rsvp.reason = body.reason;
      rsvp.respondedAt = new Date().toISOString();
    }
    return HttpResponse.json(wrap(computeRsvpSummary(sessionId)));
  }),

  http.post(`${base}/secretary/sessions/:id/rsvps/remind`, ({ request, params }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const sessionId = params['id'] as string;
    const pending = db.rsvps.filter((r) => r.sessionId === sessionId && r.status === 'PENDING').length;
    return HttpResponse.json(wrap({ remindersSent: pending }, `${pending} rappel(s) envoyé(s).`));
  }),

  // ─── Pointage (Flow 5) ─────────────────────────────────────────────────
  http.post(`${base}/secretary/sessions/:id/attendance/:memberId`, async ({ request, params }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const session = db.sessionsLive.find((s) => s.id === params['id']);
    if (!session) return new HttpResponse(null, { status: 404 });
    const body = (await request.json()) as {
      status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
    };
    const member = db.members.find((m) => m.id === params['memberId']);
    if (!member) return new HttpResponse(null, { status: 404 });
    let entry = session.attendance.find((a) => a.memberId === member.id);
    if (!entry) {
      entry = {
        memberId: member.id,
        fullName: `${member.firstName} ${member.lastName}`,
        status: body.status,
        checkInAt: new Date().toISOString(),
      };
      session.attendance.push(entry);
    } else {
      entry.status = body.status;
      entry.checkInAt = new Date().toISOString();
    }
    return HttpResponse.json(wrap(session));
  }),

  http.post(`${base}/secretary/sessions/:id/attendance/finalize`, ({ request, params }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const session = db.sessionsLive.find((s) => s.id === params['id']);
    if (!session) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(wrap(session, 'Feuille de présence finalisée.'));
  }),

  // ─── Minutes (Flow 6) ──────────────────────────────────────────────────
  http.get(`${base}/secretary/minutes`, ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    return HttpResponse.json(wrap(db.minutesDrafts));
  }),

  http.get(`${base}/secretary/minutes/:id`, ({ request, params }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const draft = db.minutesDrafts.find((m) => m.id === params['id']);
    if (!draft) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(wrap(draft));
  }),

  http.put(`${base}/secretary/minutes/:id`, async ({ request, params }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const draft = db.minutesDrafts.find((m) => m.id === params['id']);
    if (!draft) return new HttpResponse(null, { status: 404 });
    const body = (await request.json()) as { sections: MinutesSection[] };
    if (!body.sections?.length) return err('INVALID_PAYLOAD', 'Au moins une section requise.', 422);
    draft.sections = body.sections;
    draft.updatedAt = new Date().toISOString();
    return HttpResponse.json(wrap(draft, 'PV sauvegardé.'));
  }),

  http.post(`${base}/secretary/minutes/:id/sign`, ({ request, params }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const draft = db.minutesDrafts.find((m) => m.id === params['id']);
    if (!draft) return new HttpResponse(null, { status: 404 });
    const required = draft.sections.filter((s) => s.required);
    const missing = required.filter((s) => !s.content.trim());
    if (missing.length > 0) {
      return err(
        'SECTIONS_INCOMPLETE',
        `Sections obligatoires manquantes : ${missing.map((s) => s.title).join(', ')}.`,
        422,
      );
    }
    draft.status = 'SECRETARY_SIGNED' as MinutesDraftStatus;
    draft.secretarySignedAt = new Date().toISOString();
    draft.updatedAt = draft.secretarySignedAt;
    return HttpResponse.json(wrap(draft, 'PV signé. En attente du Président.'));
  }),

  // ─── Membership reuse (Flows 7 & 8) ────────────────────────────────────
  http.get(`${base}/secretary/membership`, ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const url = new URL(request.url);
    const kind = url.searchParams.get('kind');
    const files = kind ? db.membershipFiles.filter((f) => f.kind === kind) : db.membershipFiles;
    return HttpResponse.json(wrap(files));
  }),

  http.post(`${base}/secretary/membership/:id/review`, async ({ request, params }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const file = db.membershipFiles.find((f) => f.id === params['id']);
    if (!file) return new HttpResponse(null, { status: 404 });
    const body = (await request.json()) as { decision: 'FORWARD' | 'REJECT'; comment?: string };
    if (body.decision === 'REJECT' && !body.comment?.trim()) {
      return err('COMMENT_REQUIRED', 'Commentaire requis pour un rejet.', 422);
    }
    if (file.kind === 'RESIGNATION') {
      const member = db.members.find((m) => m.id === file.memberId);
      if (member && member.totalArrears > 0) {
        return err(
          'RM_DM02_VIOLATION',
          'Les arriérés du membre doivent être régularisés avant démission.',
          422,
        );
      }
      const hasActiveLoan = db.loans.some(
        (l) =>
          l.memberId === file.memberId &&
          (l.status === 'REPAYING' || l.status === 'DISBURSED' || l.status === 'APPROVED'),
      );
      if (hasActiveLoan) {
        return err(
          'RM_DM03_VIOLATION',
          'Le membre a un prêt en cours qui empêche la démission immédiate.',
          422,
        );
      }
    }
    file.bureauReviewedAt = new Date().toISOString();
    file.status =
      body.decision === 'REJECT'
        ? 'REJECTED'
        : file.kind === 'ADHESION'
          ? 'ASSEMBLY_VOTE_PENDING'
          : 'PRESIDENT_REVIEW';
    file.history.push({
      at: file.bureauReviewedAt,
      actor: 'Secrétaire',
      action: body.decision === 'REJECT' ? 'Dossier rejeté' : 'Dossier transmis',
      note: body.comment,
    });
    return HttpResponse.json(wrap(file, 'Dossier traité.'));
  }),

  // ─── Members registry (Flow 9) ─────────────────────────────────────────
  http.get(`${base}/secretary/members`, ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    return HttpResponse.json(wrap(db.members));
  }),

  http.patch(`${base}/secretary/members/:id`, async ({ request, params }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const member = db.members.find((m) => m.id === params['id']);
    if (!member) return new HttpResponse(null, { status: 404 });
    const body = (await request.json()) as Partial<{ phone: string; email: string; matricule: string }>;
    if (body.phone !== undefined) member.phone = body.phone;
    if (body.email !== undefined) member.email = body.email;
    if (body.matricule !== undefined) member.matricule = body.matricule;
    return HttpResponse.json(wrap(member, 'Registre mis à jour.'));
  }),

  // ─── Archives (Flow 10) ────────────────────────────────────────────────
  http.get(`${base}/secretary/archives`, ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const url = new URL(request.url);
    const type = url.searchParams.get('type');
    const cycle = url.searchParams.get('cycle');
    let docs = [...db.archives];
    if (type) docs = docs.filter((d) => d.type === type);
    if (cycle) docs = docs.filter((d) => String(d.cycleNumber) === cycle);
    docs.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
    return HttpResponse.json(wrap(docs));
  }),

  http.post(`${base}/secretary/archives`, async ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const body = (await request.json()) as {
      type: ArchiveDocumentType;
      title: string;
      description?: string;
      fileName: string;
      fileSize: number;
      visibility: ArchiveVisibility;
      cycleNumber?: number;
      sessionNumber?: number;
      tags?: string[];
    };
    if (!body.title?.trim() || !body.fileName?.trim() || !body.type) {
      return err('INVALID_PAYLOAD', 'Type, titre et nom de fichier requis.', 422);
    }
    const doc = {
      id: `arch-${db.archives.length + 1}`,
      tontineId: 'tontine-1',
      cycleNumber: body.cycleNumber,
      sessionNumber: body.sessionNumber,
      type: body.type,
      title: body.title.trim(),
      description: body.description?.trim(),
      fileName: body.fileName.trim(),
      fileSize: body.fileSize ?? 0,
      mimeType: body.fileName.endsWith('.pdf') ? 'application/pdf' : 'application/octet-stream',
      visibility: body.visibility,
      uploadedByFullName: 'Béatrice Nkomo',
      uploadedAt: new Date().toISOString(),
      tags: body.tags ?? [],
    };
    db.archives.unshift(doc);
    return HttpResponse.json(wrap(doc, 'Document archivé.'), { status: 201 });
  }),

  // ─── Announcements (Flow 11) — Secretary's view ────────────────────────
  http.get(`${base}/secretary/announcements`, ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    return HttpResponse.json(
      wrap(
        [...db.announcements].sort(
          (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
        ),
      ),
    );
  }),

  http.post(`${base}/secretary/announcements`, async ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const body = (await request.json()) as {
      title: string;
      body: string;
      audience: 'ALL' | 'BUREAU' | 'MEMBERS';
      channels: ('IN_APP' | 'SMS' | 'EMAIL')[];
    };
    if (!body.title?.trim() || !body.body?.trim()) {
      return err('INVALID_PAYLOAD', 'Titre et message requis.', 422);
    }
    const announcement = {
      id: `ann-${db.announcements.length + 1}`,
      tontineId: 'tontine-1',
      authorUserId: 'user-2',
      authorFullName: 'Béatrice Nkomo (Secrétaire)',
      title: body.title.trim(),
      body: body.body.trim(),
      audience: body.audience ?? 'ALL',
      channels: body.channels?.length ? body.channels : (['IN_APP'] as ('IN_APP' | 'SMS' | 'EMAIL')[]),
      publishedAt: new Date().toISOString(),
    };
    db.announcements.unshift(announcement);
    return HttpResponse.json(wrap(announcement, 'Annonce publiée.'), { status: 201 });
  }),

  // ─── Reports (Flow 12) ─────────────────────────────────────────────────
  http.get(`${base}/secretary/reports`, ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    return HttpResponse.json(wrap(db.reports));
  }),

  http.post(`${base}/secretary/reports/generate`, async ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const body = (await request.json()) as {
      category: 'PERIODIC' | 'CYCLE' | 'ATTENDANCE' | 'MEMBERSHIP';
      periodLabel: string;
    };
    if (!body.category || !body.periodLabel?.trim()) {
      return err('INVALID_PAYLOAD', 'Catégorie et période requises.', 422);
    }
    const report = {
      id: `rep-${db.reports.length + 1}`,
      tontineId: 'tontine-1',
      category: (body.category === 'ATTENDANCE' || body.category === 'MEMBERSHIP'
        ? 'PERIODIC'
        : body.category) as 'PERIODIC' | 'CYCLE',
      title: `${body.category === 'ATTENDANCE' ? 'Rapport de présence' : body.category === 'MEMBERSHIP' ? 'Rapport des membres' : body.category === 'CYCLE' ? 'Rapport de cycle' : 'Rapport périodique'} — ${body.periodLabel.trim()}`,
      periodLabel: body.periodLabel.trim(),
      authorFullName: 'Béatrice Nkomo (Secrétaire)',
      generatedAt: new Date().toISOString(),
      metricsJson: {
        membresActifs: db.members.filter((m) => m.status === 'ACTIVE').length,
        sessionsTenues: db.sessionsLive.filter((s) => s.status === 'COMPLETED').length,
        adhesionsTraitees: db.membershipFiles.filter((f) => f.kind === 'ADHESION').length,
      },
      downloadUrlPdf: '#',
      downloadUrlExcel: '#',
    };
    db.reports.unshift(report);
    return HttpResponse.json(wrap(report, 'Rapport généré.'), { status: 201 });
  }),
];

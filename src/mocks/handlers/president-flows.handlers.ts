import { HttpResponse, http } from 'msw';
import { SessionStatus } from '../../app/core/enums/session-status.enum';
import { environment } from '../../environments/environment';
import { db } from '../db';
import type { ApiResponse } from '../../app/core/api/models/api-response.model';
import type { ConflictDecisionOutcome } from '../../app/shared/models/entities/conflict.model';
import type { Delegation, DelegationPower } from '../../app/shared/models/entities/delegation.model';
import type { EmergencyBlock, EmergencyBlockTarget } from '../../app/shared/models/entities/emergency-block.model';
import type { MembershipFile } from '../../app/shared/models/entities/membership.model';
import type { Vote, VoteAudience, VoteScope } from '../../app/shared/models/entities/vote.model';

const base = environment.apiUrl;

const wrap = <T>(data: T, message?: string): ApiResponse<T> => ({
  data,
  message,
  timestamp: new Date().toISOString(),
});

const isAuthorized = (request: Request): boolean =>
  !!request.headers.get('Authorization')?.startsWith('Bearer mock-access-');

const err = (code: string, message: string, status: number) =>
  HttpResponse.json(
    { code, message, status, timestamp: new Date().toISOString() },
    { status },
  );

export const presidentFlowsHandlers = [
  // ─── Flow 4: Sessions ──────────────────────────────────────────────────
  http.get(`${base}/president/sessions`, ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    return HttpResponse.json(wrap(db.sessionsLive));
  }),

  http.get(`${base}/president/sessions/:id`, ({ request, params }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const session = db.sessionsLive.find((s) => s.id === params['id']);
    if (!session) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(wrap(session));
  }),

  http.post(`${base}/president/sessions/:id/open`, ({ request, params }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const session = db.sessionsLive.find((s) => s.id === params['id']);
    if (!session) return new HttpResponse(null, { status: 404 });
    if (session.status !== SessionStatus.SCHEDULED) {
      return err('INVALID_STATE', 'La séance n\'est pas planifiée.', 422);
    }
    const presentCount = db.members.filter((m) => m.tontineId === session.tontineId && m.status === 'ACTIVE').length;
    if (presentCount === 0) {
      return err('NO_MEMBERS', 'Aucun membre actif.', 422);
    }
    session.status = SessionStatus.IN_PROGRESS;
    session.startedAt = new Date().toISOString();
    return HttpResponse.json(wrap(session, 'Séance ouverte.'));
  }),

  http.post(`${base}/president/sessions/:id/agenda/:agendaId/advance`, ({ request, params }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const session = db.sessionsLive.find((s) => s.id === params['id']);
    if (!session) return new HttpResponse(null, { status: 404 });
    const item = session.agenda.find((a) => a.id === params['agendaId']);
    if (!item) return new HttpResponse(null, { status: 404 });
    item.status = item.status === 'DONE' ? 'DONE' : 'DONE';
    return HttpResponse.json(wrap(session, 'Point traité.'));
  }),

  http.post(`${base}/president/sessions/:id/sign-cagnotte`, async ({ request, params }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const session = db.sessionsLive.find((s) => s.id === params['id']);
    if (!session) return new HttpResponse(null, { status: 404 });
    if (!session.beneficiaryMemberId) return err('NO_BENEFICIARY', 'Aucun bénéficiaire défini.', 422);
    session.cagnotteSignedByPresident = true;
    session.totalDistributed = session.cagnotteAmount ?? session.totalDistributed;
    return HttpResponse.json(wrap(session, 'Cagnotte signée.'));
  }),

  http.post(`${base}/president/sessions/:id/close`, async ({ request, params }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const session = db.sessionsLive.find((s) => s.id === params['id']);
    if (!session) return new HttpResponse(null, { status: 404 });
    if (session.status !== SessionStatus.IN_PROGRESS) {
      return err('INVALID_STATE', 'La séance n\'est pas en cours.', 422);
    }
    const body = (await request.json().catch(() => ({}))) as { nextSessionDate?: string };
    session.status = SessionStatus.COMPLETED;
    session.endedAt = new Date().toISOString();
    if (body.nextSessionDate) {
      // No-op: prochaine séance enregistrée côté serveur (mock).
    }
    return HttpResponse.json(wrap(session, 'Séance clôturée.'));
  }),

  // ─── Flow 5: Membership ────────────────────────────────────────────────
  http.get(`${base}/president/membership`, ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const url = new URL(request.url);
    const kind = url.searchParams.get('kind');
    const files = kind
      ? db.membershipFiles.filter((f) => f.kind === kind)
      : db.membershipFiles;
    return HttpResponse.json(wrap(files));
  }),

  http.get(`${base}/president/membership/:id`, ({ request, params }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const file = db.membershipFiles.find((f) => f.id === params['id']);
    if (!file) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(wrap(file));
  }),

  http.post(`${base}/president/membership/:id/decide`, async ({ request, params }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const file = db.membershipFiles.find((f) => f.id === params['id']);
    if (!file) return new HttpResponse(null, { status: 404 });
    const body = (await request.json()) as { decision: 'APPROVE' | 'REJECT'; comment?: string };
    if (body.decision === 'REJECT' && !body.comment?.trim()) {
      return err('COMMENT_REQUIRED', 'Un commentaire est obligatoire en cas de refus.', 422);
    }
    file.status = body.decision === 'APPROVE' ? 'APPROVED' : 'REJECTED';
    file.presidentDecidedAt = new Date().toISOString();
    file.presidentDecisionComment = body.comment;
    file.history.push({
      at: file.presidentDecidedAt,
      actor: 'Président',
      action: body.decision === 'APPROVE' ? 'Dossier approuvé' : 'Dossier rejeté',
      ...(body.comment ? { note: body.comment } : {}),
    } as MembershipFile['history'][number]);
    return HttpResponse.json(wrap(file, 'Décision enregistrée.'));
  }),

  // ─── Flow 6: Extraordinary Contributions ───────────────────────────────
  http.get(`${base}/president/extraordinary-contributions`, ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    return HttpResponse.json(wrap(db.extraordinaryContributions));
  }),

  http.get(`${base}/president/extraordinary-contributions/:id`, ({ request, params }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const item = db.extraordinaryContributions.find((c) => c.id === params['id']);
    if (!item) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(wrap(item));
  }),

  http.post(`${base}/president/extraordinary-contributions`, async ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const body = (await request.json()) as {
      motive: string;
      beneficiaryMemberId?: string;
      amountPerMember: number;
      dueDate: string;
      exemptBeneficiary: boolean;
    };
    if (!body.motive?.trim() || !body.amountPerMember || !body.dueDate) {
      return err('INVALID_PAYLOAD', 'Motif, montant et échéance obligatoires.', 422);
    }
    const beneficiary = body.beneficiaryMemberId
      ? db.members.find((m) => m.id === body.beneficiaryMemberId)
      : undefined;
    const id = `ec-${db.extraordinaryContributions.length + 1}`;
    const members = db.members
      .filter((m) => m.tontineId === 'tontine-1' && m.status === 'ACTIVE')
      .map((m) => ({
        memberId: m.id,
        fullName: `${m.firstName} ${m.lastName}`,
        expected: body.exemptBeneficiary && m.id === body.beneficiaryMemberId ? 0 : body.amountPerMember,
        paid: 0,
        exempted: body.exemptBeneficiary && m.id === body.beneficiaryMemberId,
      }));
    const totalExpected = members.reduce((sum, m) => sum + m.expected, 0);
    const item = {
      id,
      tontineId: 'tontine-1',
      motive: body.motive,
      beneficiaryMemberId: body.beneficiaryMemberId,
      beneficiaryFullName: beneficiary ? `${beneficiary.firstName} ${beneficiary.lastName}` : undefined,
      amountPerMember: body.amountPerMember,
      dueDate: body.dueDate,
      status: 'COLLECTING' as const,
      exemptBeneficiary: body.exemptBeneficiary,
      totalExpected,
      totalCollected: 0,
      members,
      votedByAssemblyAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    db.extraordinaryContributions.unshift(item);
    return HttpResponse.json(wrap(item, 'Cotisation extraordinaire lancée.'), { status: 201 });
  }),

  http.post(`${base}/president/extraordinary-contributions/:id/close`, ({ request, params }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const item = db.extraordinaryContributions.find((c) => c.id === params['id']);
    if (!item) return new HttpResponse(null, { status: 404 });
    item.status = 'CLOSED';
    item.closedAt = new Date().toISOString();
    return HttpResponse.json(wrap(item, 'Collecte clôturée.'));
  }),

  http.post(`${base}/president/extraordinary-contributions/:id/distribute`, ({ request, params }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const item = db.extraordinaryContributions.find((c) => c.id === params['id']);
    if (!item) return new HttpResponse(null, { status: 404 });
    if (item.status !== 'CLOSED') {
      return err('INVALID_STATE', 'La collecte doit être clôturée.', 422);
    }
    item.status = 'DISTRIBUTED';
    item.distributedAt = new Date().toISOString();
    return HttpResponse.json(wrap(item, 'Distribution effectuée.'));
  }),

  // ─── Flow 7: Conflicts ─────────────────────────────────────────────────
  http.get(`${base}/president/conflicts`, ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    return HttpResponse.json(wrap(db.conflicts));
  }),

  http.get(`${base}/president/conflicts/:id`, ({ request, params }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const conflict = db.conflicts.find((c) => c.id === params['id']);
    if (!conflict) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(wrap(conflict));
  }),

  http.post(`${base}/president/conflicts/:id/schedule-mediation`, async ({ request, params }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const conflict = db.conflicts.find((c) => c.id === params['id']);
    if (!conflict) return new HttpResponse(null, { status: 404 });
    const body = (await request.json()) as { scheduledAt: string; note?: string };
    if (!body.scheduledAt) return err('INVALID_PAYLOAD', 'Date requise.', 422);
    conflict.status = 'MEDIATION_SCHEDULED';
    conflict.mediationScheduledAt = body.scheduledAt;
    conflict.history.push({
      at: new Date().toISOString(),
      actor: 'Président',
      action: 'Médiation programmée',
      note: body.note,
    });
    return HttpResponse.json(wrap(conflict, 'Médiation programmée.'));
  }),

  http.post(`${base}/president/conflicts/:id/decide`, async ({ request, params }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const conflict = db.conflicts.find((c) => c.id === params['id']);
    if (!conflict) return new HttpResponse(null, { status: 404 });
    const body = (await request.json()) as { outcome: ConflictDecisionOutcome; comment: string };
    if (!body.outcome || !body.comment?.trim()) {
      return err('INVALID_PAYLOAD', 'Issue et motivation requises.', 422);
    }
    conflict.status = body.outcome === 'EXCLUSION_PROPOSED' ? 'ESCALATED_TO_ASSEMBLY' : 'DECIDED_BY_PRESIDENT';
    conflict.decisionOutcome = body.outcome;
    conflict.decisionComment = body.comment;
    conflict.decidedAt = new Date().toISOString();
    conflict.history.push({
      at: conflict.decidedAt,
      actor: 'Président',
      action: 'Décision rendue',
      note: `${body.outcome} — ${body.comment}`,
    });
    return HttpResponse.json(wrap(conflict, 'Décision enregistrée.'));
  }),

  // ─── Flow 8: Cycle Close ───────────────────────────────────────────────
  http.get(`${base}/president/cycle-close`, ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    return HttpResponse.json(wrap(db.cycleClose));
  }),

  http.post(`${base}/president/cycle-close/sign`, async ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const body = (await request.json()) as { nextCycleStartDate: string; drawMode: 'RANDOM' | 'SENIORITY' | 'ASSEMBLY_VOTE' };
    const pending = db.cycleClose.checklist.filter((c) => c.status !== 'DONE');
    if (pending.length > 0) {
      return err('CHECKLIST_INCOMPLETE', 'Tous les prérequis ne sont pas remplis.', 422);
    }
    if (!body.nextCycleStartDate || !body.drawMode) {
      return err('INVALID_PAYLOAD', 'Date du prochain cycle et mode de tirage requis.', 422);
    }
    db.cycleClose.status = 'CLOSED';
    db.cycleClose.presidentSignedAt = new Date().toISOString();
    db.cycleClose.closedAt = db.cycleClose.presidentSignedAt;
    db.cycleClose.nextCycleStartDate = body.nextCycleStartDate;
    db.cycleClose.nextCycleDrawMode = body.drawMode;
    return HttpResponse.json(wrap(db.cycleClose, 'Cycle clôturé.'));
  }),

  http.post(`${base}/president/cycle-close/check/:key`, ({ request, params }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const item = db.cycleClose.checklist.find((c) => c.key === params['key']);
    if (!item) return new HttpResponse(null, { status: 404 });
    item.status = 'DONE';
    if (params['key'] === 'auditor') {
      db.cycleClose.status = 'AUDITOR_VALIDATED';
      db.cycleClose.auditorValidatedAt = new Date().toISOString();
    }
    return HttpResponse.json(wrap(db.cycleClose, 'Prérequis marqué comme rempli.'));
  }),

  // ─── Flow 10: Votes ────────────────────────────────────────────────────
  http.get(`${base}/president/votes`, ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    return HttpResponse.json(wrap(db.votes));
  }),

  http.get(`${base}/president/votes/:id`, ({ request, params }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const vote = db.votes.find((v) => v.id === params['id']);
    if (!vote) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(wrap(vote));
  }),

  http.post(`${base}/president/votes`, async ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const body = (await request.json()) as {
      question: string;
      description?: string;
      options: string[];
      isAnonymous: boolean;
      hideResultsUntilClose: boolean;
      scope: VoteScope;
      audience: VoteAudience;
      opensAt: string;
      closesAt: string;
      quorumPercent: number;
    };
    if (!body.question?.trim() || !body.options?.length || body.options.length < 2) {
      return err('INVALID_PAYLOAD', 'Question et au moins 2 options requises.', 422);
    }
    const id = `vote-${db.votes.length + 1}`;
    const vote: Vote = {
      id,
      tontineId: 'tontine-1',
      question: body.question,
      description: body.description,
      options: body.options.map((label, i) => ({ id: `${id}-opt-${i}`, label, count: 0 })),
      isAnonymous: body.isAnonymous,
      hideResultsUntilClose: body.hideResultsUntilClose,
      scope: body.scope,
      audience: body.audience,
      status: 'OPEN',
      opensAt: body.opensAt,
      closesAt: body.closesAt,
      createdByUserId: 'user-1',
      createdByFullName: 'Achille Mbongo',
      createdAt: new Date().toISOString(),
      totalVoters: db.members.filter((m) => m.tontineId === 'tontine-1' && m.status === 'ACTIVE').length,
      totalVoted: 0,
      quorumPercent: body.quorumPercent,
    };
    db.votes.unshift(vote);
    return HttpResponse.json(wrap(vote, 'Vote lancé.'), { status: 201 });
  }),

  http.post(`${base}/president/votes/:id/close`, ({ request, params }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const vote = db.votes.find((v) => v.id === params['id']);
    if (!vote) return new HttpResponse(null, { status: 404 });
    vote.status = 'CLOSED';
    const totalVotes = vote.options.reduce((sum, o) => sum + o.count, 0);
    const quorumReached = totalVotes / vote.totalVoters >= vote.quorumPercent;
    const winning = [...vote.options].sort((a, b) => b.count - a.count)[0];
    const others = vote.options.filter((o) => o.id !== winning.id);
    vote.passed = quorumReached && winning.count > Math.max(0, ...others.map((o) => o.count));
    return HttpResponse.json(wrap(vote, 'Vote clôturé.'));
  }),

  // ─── Flow 12: Delegations ──────────────────────────────────────────────
  http.get(`${base}/president/delegations`, ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    return HttpResponse.json(wrap(db.delegations));
  }),

  http.post(`${base}/president/delegations`, async ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const body = (await request.json()) as {
      delegateeUserId: string;
      powers: DelegationPower[];
      reason: string;
      startsAt: string;
      endsAt: string;
    };
    if (!body.delegateeUserId || !body.powers?.length || !body.reason?.trim()) {
      return err('INVALID_PAYLOAD', 'Délégataire, pouvoirs et motif requis.', 422);
    }
    const user = db.users.find((u) => u.id === body.delegateeUserId);
    if (!user) return err('USER_NOT_FOUND', 'Délégataire introuvable.', 404);
    const isBureau = user.roles.some((r) => r !== 'MEMBER');
    if (!isBureau) {
      return err('NOT_BUREAU', 'Seuls les membres du Bureau peuvent recevoir une délégation.', 422);
    }
    const delegation: Delegation = {
      id: `del-${db.delegations.length + 1}`,
      tontineId: 'tontine-1',
      delegateeUserId: user.id,
      delegateeFullName: `${user.firstName} ${user.lastName}`,
      delegateeRole: user.roles.find((r) => r !== 'MEMBER') ?? user.roles[0],
      powers: body.powers,
      reason: body.reason,
      startsAt: body.startsAt,
      endsAt: body.endsAt,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    };
    db.delegations.unshift(delegation);
    return HttpResponse.json(wrap(delegation, 'Délégation créée.'), { status: 201 });
  }),

  http.post(`${base}/president/delegations/:id/revoke`, async ({ request, params }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const delegation = db.delegations.find((d) => d.id === params['id']);
    if (!delegation) return new HttpResponse(null, { status: 404 });
    const body = (await request.json()) as { reason: string };
    if (!body.reason?.trim()) return err('REASON_REQUIRED', 'Motif obligatoire.', 422);
    delegation.status = 'REVOKED';
    delegation.revokedAt = new Date().toISOString();
    delegation.revokedReason = body.reason;
    return HttpResponse.json(wrap(delegation, 'Délégation révoquée.'));
  }),

  // ─── Flow 13: Emergency Blocks ─────────────────────────────────────────
  http.get(`${base}/president/emergency-blocks`, ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    return HttpResponse.json(wrap(db.emergencyBlocks));
  }),

  http.post(`${base}/president/emergency-blocks`, async ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const body = (await request.json()) as {
      target: EmergencyBlockTarget;
      targetRef?: string;
      reason: string;
    };
    if (!body.target || !body.reason?.trim()) {
      return err('INVALID_PAYLOAD', 'Cible et motif obligatoires.', 422);
    }
    const block: EmergencyBlock = {
      id: `eb-${db.emergencyBlocks.length + 1}`,
      tontineId: 'tontine-1',
      target: body.target,
      targetRef: body.targetRef,
      reason: body.reason,
      status: 'ACTIVE',
      activatedByUserId: 'user-1',
      activatedByFullName: 'Achille Mbongo',
      activatedAt: new Date().toISOString(),
    };
    db.emergencyBlocks.unshift(block);
    return HttpResponse.json(wrap(block, 'Blocage d\'urgence activé.'), { status: 201 });
  }),

  http.post(`${base}/president/emergency-blocks/:id/lift`, async ({ request, params }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const block = db.emergencyBlocks.find((b) => b.id === params['id']);
    if (!block) return new HttpResponse(null, { status: 404 });
    const body = (await request.json()) as { reason: string };
    if (!body.reason?.trim()) return err('REASON_REQUIRED', 'Motif obligatoire.', 422);
    block.status = 'LIFTED';
    block.liftedByUserId = 'user-1';
    block.liftedAt = new Date().toISOString();
    block.liftReason = body.reason;
    return HttpResponse.json(wrap(block, 'Blocage levé.'));
  }),

  // ─── Flow 14: Reports ──────────────────────────────────────────────────
  http.get(`${base}/president/reports`, ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    const reports = category ? db.reports.filter((r) => r.category === category) : db.reports;
    return HttpResponse.json(wrap(reports));
  }),

  http.get(`${base}/president/reports/:id`, ({ request, params }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const report = db.reports.find((r) => r.id === params['id']);
    if (!report) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(wrap(report));
  }),
];

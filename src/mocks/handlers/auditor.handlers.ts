import { HttpResponse, http } from 'msw';
import { LoanStatus } from '../../app/core/enums/loan-status.enum';
import { SanctionStatus } from '../../app/core/enums/sanction-type.enum';
import {
  FinancialOperationType,
  ValidationCategory,
} from '../../app/core/enums/validation.enum';
import { environment } from '../../environments/environment';
import { db } from '../db';
import type { ApiResponse } from '../../app/core/api/models/api-response.model';
import type {
  AnomalyAudience,
  AnomalyCategory,
  AnomalySeverity,
  AuditFinding,
  AuditScope,
  AuditorAnomaly,
  AuditorAudit,
  AuditorCertification,
  AuditorClarification,
  AuditorControl,
  AuditorRecommendation,
  AuditorReport,
  CertificationDecision,
  CertificationScope,
  ControlCheckpoint,
  ControlKind,
  RecommendationOrigin,
  RecommendationPriority,
  RecommendationStatus,
  SessionBalanceReview,
  SessionBalanceReviewDecision,
} from '../../app/shared/models/entities/auditor.model';
import type { AuditorOpinion } from '../../app/shared/models/entities/validation.model';

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

const refSeq = (prefix: string, length: number) =>
  `${prefix}-${String(length + 1).padStart(3, '0')}`;

export const auditorHandlers = [
  // ─── Dashboard ─────────────────────────────────────────────────────────
  http.get(`${base}/auditor/dashboard`, ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });

    const totalBalance = db.cashBoxes.reduce((sum, b) => sum + b.balance, 0);
    const pendingFinancial = db.validations.filter(
      (v) => v.category === ValidationCategory.FINANCIAL_OPERATION,
    );
    const noOpinionYet = pendingFinancial.filter((v) => !v.auditorOpinion);

    const openAnomalies = db.auditorAnomalies.filter(
      (a) => a.status !== 'CLOSED' && a.status !== 'RESOLVED',
    );
    const plannedControls = db.auditorControls.filter((c) => c.status === 'PLANNED');
    const activeRecommendations = db.auditorRecommendations.filter(
      (r) => r.status !== 'IMPLEMENTED' && r.status !== 'CLOSED',
    );

    const unpaidLoans = db.loans.filter(
      (l) => l.status === LoanStatus.REPAYING && l.totalRepaid < l.totalDue,
    );

    return HttpResponse.json(
      wrap({
        cashBoxes: db.cashBoxes,
        totalBalance,
        validations: {
          financialPending: pendingFinancial.length,
          opinionPending: noOpinionYet.length,
        },
        anomalies: {
          open: openAnomalies.length,
          severityHigh: openAnomalies.filter((a) => a.severity === 'HIGH').length,
        },
        controls: {
          planned: plannedControls.length,
          nextDue: plannedControls[0]?.dueDate,
        },
        recommendations: {
          active: activeRecommendations.length,
          implementedRate: db.auditorRecommendations.length
            ? Math.round(
                (db.auditorRecommendations.filter((r) => r.status === 'IMPLEMENTED').length /
                  db.auditorRecommendations.length) *
                  100,
              )
            : 0,
        },
        loans: {
          active: db.loans.filter((l) => l.status === LoanStatus.REPAYING || l.status === LoanStatus.DISBURSED).length,
          overdue: 0,
          totalOutstanding: unpaidLoans.reduce((s, l) => s + (l.totalDue - l.totalRepaid), 0),
        },
        recentMovements: db.cashMovements.slice(0, 5),
      }),
    );
  }),

  // ─── Financial data (consultation) ─────────────────────────────────────
  http.get(`${base}/auditor/financial-data`, ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });

    return HttpResponse.json(
      wrap({
        cashBoxes: db.cashBoxes,
        movements: db.cashMovements,
        contributions: db.contributions,
        loans: db.loans,
        expenses: db.expenses,
        distributions: db.distributions,
        sanctions: db.sanctions,
        totals: {
          totalBalance: db.cashBoxes.reduce((s, b) => s + b.balance, 0),
          contributions: db.contributions.reduce((s, c) => s + c.paidAmount, 0),
          expenses: db.expenses.reduce((s, e) => s + (e.status === 'PAID' ? e.amount : 0), 0),
          distributions: db.distributions.reduce((s, d) => s + d.netAmount, 0),
        },
      }),
    );
  }),

  // ─── Validations (with auditor opinion) ───────────────────────────────
  http.get(`${base}/auditor/validations`, ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const url = new URL(request.url);
    const opType = url.searchParams.get('type');
    let list = db.validations.filter(
      (v) => v.category === ValidationCategory.FINANCIAL_OPERATION,
    );
    if (opType) {
      list = list.filter(
        (v) =>
          v.category === ValidationCategory.FINANCIAL_OPERATION && v.operationType === opType,
      );
    }
    return HttpResponse.json(wrap(list));
  }),

  http.post(`${base}/auditor/validations/:id/opinion`, async ({ request, params }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const validation = db.validations.find((v) => v.id === params['id']);
    if (!validation) return new HttpResponse(null, { status: 404 });
    const body = (await request.json()) as {
      status: 'FAVORABLE' | 'RESERVED' | 'UNFAVORABLE';
      comment?: string;
    };
    if ((body.status === 'RESERVED' || body.status === 'UNFAVORABLE') && !body.comment?.trim()) {
      return err('COMMENT_REQUIRED', 'Un commentaire est obligatoire pour réserves ou refus.', 422);
    }
    const opinion: AuditorOpinion = {
      status: body.status,
      comment: body.comment?.trim(),
      userId: 'user-6',
      userFullName: 'Christine Mballa (Commissaire)',
      emittedAt: new Date().toISOString(),
    };
    validation.auditorOpinion = opinion;
    return HttpResponse.json(wrap(validation, 'Opinion émise.'));
  }),

  // ─── Session balance reviews ──────────────────────────────────────────
  http.get(`${base}/auditor/balance-reviews`, ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    return HttpResponse.json(wrap(db.sessionBalanceReviews));
  }),

  http.post(`${base}/auditor/balance-reviews`, async ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const body = (await request.json()) as {
      sessionId: string;
      decision: SessionBalanceReviewDecision;
      observations?: string;
      reserves?: string;
    };
    const session = db.sessionsLive.find((s) => s.id === body.sessionId);
    if (!session) return new HttpResponse(null, { status: 404 });
    if (
      (body.decision === 'WITH_RESERVES' || body.decision === 'REJECTED') &&
      !body.reserves?.trim()
    ) {
      return err('RM_VB03_VIOLATION', 'Les réserves et rejets doivent être justifiés.', 422);
    }
    const review: SessionBalanceReview = {
      id: `sbr-${db.sessionBalanceReviews.length + 1}-${Date.now()}`,
      tontineId: 'tontine-1',
      sessionId: session.id,
      sessionNumber: session.number,
      reviewedAt: new Date().toISOString(),
      reviewedByFullName: 'Christine Mballa (Commissaire)',
      decision: body.decision,
      observations: body.observations?.trim(),
      reserves: body.reserves?.trim(),
    };
    db.sessionBalanceReviews.unshift(review);
    return HttpResponse.json(wrap(review, 'Bilan revu.'), { status: 201 });
  }),

  // ─── Periodic controls ────────────────────────────────────────────────
  http.get(`${base}/auditor/controls`, ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    return HttpResponse.json(wrap(db.auditorControls));
  }),

  http.post(`${base}/auditor/controls`, async ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const body = (await request.json()) as {
      kind: ControlKind;
      periodFrom: string;
      periodTo: string;
    };
    const control: AuditorControl = {
      id: `ctrl-${db.auditorControls.length + 1}-${Date.now()}`,
      tontineId: 'tontine-1',
      reference: refSeq('CTRL-2026', db.auditorControls.length),
      kind: body.kind,
      status: 'IN_PROGRESS',
      periodFrom: body.periodFrom,
      periodTo: body.periodTo,
      startedAt: new Date().toISOString(),
      authorFullName: 'Christine Mballa (Commissaire)',
      checkpoints: db.cashBoxes.map((cb, i) => ({
        id: `cp-new-${i}`,
        label: cb.name,
        category: 'CASH',
        expectedValue: cb.balance,
        observedValue: undefined,
        conform: undefined,
      })),
      conformCount: 0,
      anomaliesCount: 0,
      generatedAnomalyIds: [],
    };
    db.auditorControls.unshift(control);
    return HttpResponse.json(wrap(control, 'Contrôle créé.'), { status: 201 });
  }),

  http.post(`${base}/auditor/controls/:id/complete`, async ({ request, params }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const control = db.auditorControls.find((c) => c.id === params['id']);
    if (!control) return new HttpResponse(null, { status: 404 });
    const body = (await request.json()) as {
      checkpoints: ControlCheckpoint[];
      observations?: string;
    };
    control.checkpoints = body.checkpoints.map((cp) => ({
      ...cp,
      variance:
        cp.expectedValue != null && cp.observedValue != null
          ? cp.observedValue - cp.expectedValue
          : undefined,
      conform:
        cp.expectedValue != null && cp.observedValue != null
          ? cp.observedValue === cp.expectedValue
          : cp.conform,
    }));
    control.observations = body.observations?.trim();
    control.conformCount = control.checkpoints.filter((c) => c.conform === true).length;
    control.anomaliesCount = control.checkpoints.filter((c) => c.conform === false).length;
    control.status = 'COMPLETED';
    control.completedAt = new Date().toISOString();
    return HttpResponse.json(wrap(control, 'Contrôle clôturé.'));
  }),

  // ─── Audits ───────────────────────────────────────────────────────────
  http.get(`${base}/auditor/audits`, ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    return HttpResponse.json(wrap(db.auditorAudits));
  }),

  http.post(`${base}/auditor/audits`, async ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const body = (await request.json()) as {
      scope: AuditScope;
      periodFrom: string;
      periodTo: string;
      findings: { area: string; finding: AuditFinding; description: string }[];
      observations?: string;
      overallFinding: AuditFinding;
    };
    if (!body.findings?.length) {
      return err('INVALID_PAYLOAD', 'Au moins un constat est requis.', 422);
    }
    const audit: AuditorAudit = {
      id: `aud-${db.auditorAudits.length + 1}-${Date.now()}`,
      tontineId: 'tontine-1',
      reference: refSeq('AUD-2026', db.auditorAudits.length),
      scope: body.scope,
      status: 'COMPLETED',
      periodFrom: body.periodFrom,
      periodTo: body.periodTo,
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      authorFullName: 'Christine Mballa (Commissaire)',
      overallFinding: body.overallFinding,
      findings: body.findings.map((f, i) => ({
        id: `f-${Date.now()}-${i}`,
        area: f.area,
        finding: f.finding,
        description: f.description,
      })),
      observations: body.observations?.trim(),
      generatedRecommendationIds: [],
    };
    db.auditorAudits.unshift(audit);
    return HttpResponse.json(wrap(audit, 'Audit clôturé.'), { status: 201 });
  }),

  // ─── Anomalies (signalements) ─────────────────────────────────────────
  http.get(`${base}/auditor/anomalies`, ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    return HttpResponse.json(wrap(db.auditorAnomalies));
  }),

  http.post(`${base}/auditor/anomalies`, async ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const body = (await request.json()) as {
      category: AnomalyCategory;
      severity: AnomalySeverity;
      title: string;
      description: string;
      audience: AnomalyAudience;
      requestsResponse?: boolean;
      copyToTreasurer?: boolean;
    };
    if (!body.title?.trim() || !body.description?.trim()) {
      return err('INVALID_PAYLOAD', 'Titre et description obligatoires.', 422);
    }
    const now = new Date().toISOString();
    const anomaly: AuditorAnomaly = {
      id: `anom-${db.auditorAnomalies.length + 1}-${Date.now()}`,
      tontineId: 'tontine-1',
      reference: refSeq('SIG-2026', db.auditorAnomalies.length),
      category: body.category,
      severity: body.severity,
      title: body.title.trim(),
      description: body.description.trim(),
      audience: body.audience,
      status: 'OPEN',
      raisedAt: now,
      raisedByUserId: 'user-6',
      raisedByFullName: 'Christine Mballa (Commissaire)',
      detectedAt: now,
      requestsResponse: !!body.requestsResponse,
      copyToTreasurer: !!body.copyToTreasurer,
      history: [
        { at: now, actor: 'Commissaire', action: 'Signalement créé' },
        { at: now, actor: 'Système', action: `Notification envoyée au ${body.audience}` },
      ],
    };
    db.auditorAnomalies.unshift(anomaly);
    return HttpResponse.json(wrap(anomaly, 'Signalement envoyé.'), { status: 201 });
  }),

  http.post(`${base}/auditor/anomalies/:id/close`, async ({ request, params }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const anomaly = db.auditorAnomalies.find((a) => a.id === params['id']);
    if (!anomaly) return new HttpResponse(null, { status: 404 });
    const body = (await request.json()) as { resolutionComment?: string };
    anomaly.status = 'CLOSED';
    anomaly.closedAt = new Date().toISOString();
    anomaly.resolutionComment = body.resolutionComment?.trim();
    anomaly.history.push({
      at: anomaly.closedAt,
      actor: 'Commissaire',
      action: 'Signalement clôturé',
    });
    return HttpResponse.json(wrap(anomaly, 'Signalement clôturé.'));
  }),

  http.post(`${base}/auditor/anomalies/:id/reopen`, ({ request, params }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const anomaly = db.auditorAnomalies.find((a) => a.id === params['id']);
    if (!anomaly) return new HttpResponse(null, { status: 404 });
    anomaly.status = 'OPEN';
    anomaly.closedAt = undefined;
    anomaly.history.push({
      at: new Date().toISOString(),
      actor: 'Commissaire',
      action: 'Signalement rouvert',
    });
    return HttpResponse.json(wrap(anomaly, 'Signalement rouvert.'));
  }),

  // ─── Clarifications ────────────────────────────────────────────────────
  http.get(`${base}/auditor/clarifications`, ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    return HttpResponse.json(wrap(db.auditorClarifications));
  }),

  http.post(`${base}/auditor/clarifications`, async ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const body = (await request.json()) as {
      subject: string;
      question: string;
      targetRole: 'TREASURER' | 'SECRETARY' | 'CENSOR';
      dueWithinHours: number;
    };
    if (!body.subject?.trim() || !body.question?.trim()) {
      return err('INVALID_PAYLOAD', 'Objet et question obligatoires.', 422);
    }
    const clar: AuditorClarification = {
      id: `clar-${db.auditorClarifications.length + 1}-${Date.now()}`,
      tontineId: 'tontine-1',
      reference: refSeq('ECL-2026', db.auditorClarifications.length),
      subject: body.subject.trim(),
      question: body.question.trim(),
      targetRole: body.targetRole,
      dueWithinHours: body.dueWithinHours,
      status: 'PENDING',
      raisedAt: new Date().toISOString(),
      raisedByFullName: 'Christine Mballa (Commissaire)',
    };
    db.auditorClarifications.unshift(clar);
    return HttpResponse.json(wrap(clar, 'Demande envoyée.'), { status: 201 });
  }),

  http.post(`${base}/auditor/clarifications/:id/simulate-response`, async ({ request, params }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const clar = db.auditorClarifications.find((c) => c.id === params['id']);
    if (!clar) return new HttpResponse(null, { status: 404 });
    if (clar.status !== 'PENDING') {
      return err('INVALID_STATE', 'Demande déjà répondue.', 422);
    }
    const body = (await request.json().catch(() => ({}))) as { response?: string };
    clar.status = 'RESPONDED';
    clar.response = body.response?.trim() ?? 'Réponse simulée.';
    clar.respondedAt = new Date().toISOString();
    clar.respondedByFullName = 'Yvonne Fopa (Trésorier)';
    return HttpResponse.json(wrap(clar, 'Réponse reçue.'));
  }),

  http.post(`${base}/auditor/clarifications/:id/evaluate`, async ({ request, params }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const clar = db.auditorClarifications.find((c) => c.id === params['id']);
    if (!clar) return new HttpResponse(null, { status: 404 });
    if (clar.status !== 'RESPONDED') {
      return err('INVALID_STATE', 'Aucune réponse à évaluer.', 422);
    }
    const body = (await request.json()) as {
      evaluation: 'SATISFACTORY' | 'PARTIAL' | 'UNSATISFACTORY';
    };
    clar.evaluation = body.evaluation;
    if (body.evaluation === 'SATISFACTORY') {
      clar.status = 'CLOSED';
      clar.closedAt = new Date().toISOString();
    } else if (body.evaluation === 'UNSATISFACTORY') {
      clar.status = 'ESCALATED';
    }
    return HttpResponse.json(wrap(clar, 'Évaluation enregistrée.'));
  }),

  // ─── Recommendations ──────────────────────────────────────────────────
  http.get(`${base}/auditor/recommendations`, ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    return HttpResponse.json(wrap(db.auditorRecommendations));
  }),

  http.post(`${base}/auditor/recommendations`, async ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const body = (await request.json()) as {
      origin: RecommendationOrigin;
      originId?: string;
      title: string;
      description: string;
      priority: RecommendationPriority;
      recipient: 'BUREAU' | 'PRESIDENT' | 'TREASURER';
      dueDate?: string;
    };
    if (!body.title?.trim() || !body.description?.trim()) {
      return err('INVALID_PAYLOAD', 'Titre et description obligatoires.', 422);
    }
    const reco: AuditorRecommendation = {
      id: `reco-${db.auditorRecommendations.length + 1}-${Date.now()}`,
      tontineId: 'tontine-1',
      reference: refSeq('REC-2026', db.auditorRecommendations.length),
      origin: body.origin,
      originId: body.originId,
      title: body.title.trim(),
      description: body.description.trim(),
      priority: body.priority,
      recipient: body.recipient,
      dueDate: body.dueDate,
      status: 'PENDING',
      emittedAt: new Date().toISOString(),
      emittedByFullName: 'Christine Mballa (Commissaire)',
      implementationProgress: 0,
    };
    db.auditorRecommendations.unshift(reco);
    return HttpResponse.json(wrap(reco, 'Recommandation émise.'), { status: 201 });
  }),

  http.post(`${base}/auditor/recommendations/:id/status`, async ({ request, params }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const reco = db.auditorRecommendations.find((r) => r.id === params['id']);
    if (!reco) return new HttpResponse(null, { status: 404 });
    const body = (await request.json()) as {
      status: RecommendationStatus;
      progress?: number;
      closeNote?: string;
    };
    reco.status = body.status;
    if (body.progress != null) reco.implementationProgress = body.progress;
    if (body.status === 'IMPLEMENTED') {
      reco.implementedAt = new Date().toISOString();
      reco.implementationProgress = 100;
    }
    if (body.status === 'CLOSED') {
      reco.closeNote = body.closeNote?.trim();
    }
    return HttpResponse.json(wrap(reco, 'Statut mis à jour.'));
  }),

  // ─── Certifications ───────────────────────────────────────────────────
  http.get(`${base}/auditor/certifications`, ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    return HttpResponse.json(wrap(db.auditorCertifications));
  }),

  http.post(`${base}/auditor/certifications`, async ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const body = (await request.json()) as {
      scope: CertificationScope;
      periodLabel: string;
      decision: CertificationDecision;
      reserves?: string;
      otp: string;
    };
    if (!body.otp || body.otp.length < 4) {
      return err('OTP_REQUIRED', 'Code OTP requis pour la signature.', 422);
    }
    if (body.decision !== 'CERTIFIED' && !body.reserves?.trim()) {
      return err('RESERVES_REQUIRED', 'Réserves ou motif de refus requis.', 422);
    }

    const totalAssets = db.cashBoxes.reduce((s, b) => s + b.balance, 0);
    const loansOutstanding = db.loans
      .filter((l) => l.status === LoanStatus.REPAYING || l.status === LoanStatus.DISBURSED)
      .reduce((s, l) => s + (l.totalDue - l.totalRepaid), 0);

    const cert: AuditorCertification = {
      id: `cert-${db.auditorCertifications.length + 1}-${Date.now()}`,
      tontineId: 'tontine-1',
      reference: refSeq('CERT-2026', db.auditorCertifications.length),
      scope: body.scope,
      periodLabel: body.periodLabel.trim(),
      emittedAt: new Date().toISOString(),
      emittedByFullName: 'Christine Mballa (Commissaire)',
      decision: body.decision,
      reserves: body.reserves?.trim(),
      assets: [
        ...db.cashBoxes.map((b) => ({ label: b.name, amount: b.balance })),
        { label: 'Prêts en cours', amount: loansOutstanding },
      ],
      liabilities: [
        {
          label: 'Cotisations collectées',
          amount: db.contributions.reduce((s, c) => s + c.paidAmount, 0),
        },
        {
          label: 'Sanctions encaissées',
          amount: db.sanctions
            .filter((s) => s.status === SanctionStatus.PAID)
            .reduce((s, sanction) => s + sanction.amount, 0),
        },
        { label: 'Report cycle précédent', amount: totalAssets + loansOutstanding - 0 },
      ],
      totalAssets: totalAssets + loansOutstanding,
      totalLiabilities: totalAssets + loansOutstanding,
      balanced: true,
      signedDigitally: true,
      downloadUrl: '#',
    };
    db.auditorCertifications.unshift(cert);
    return HttpResponse.json(wrap(cert, 'Comptes certifiés.'), { status: 201 });
  }),

  // ─── Reports ──────────────────────────────────────────────────────────
  http.get(`${base}/auditor/reports`, ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    return HttpResponse.json(wrap(db.auditorReports));
  }),

  http.post(`${base}/auditor/reports/generate`, async ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const body = (await request.json()) as {
      scope: 'LAST_SESSION' | 'PERIOD' | 'CYCLE';
      periodLabel: string;
      observations?: string;
    };
    const session = db.sessionsLive[0];
    const totalBalance = db.cashBoxes.reduce((s, b) => s + b.balance, 0);
    const report: AuditorReport = {
      id: `audrep-${db.auditorReports.length + 1}-${Date.now()}`,
      tontineId: 'tontine-1',
      reference: refSeq('AUD-RPT-2026', db.auditorReports.length),
      scope: body.scope,
      periodLabel: body.periodLabel.trim() || `Période ${new Date().toISOString().slice(0, 10)}`,
      sessionId: body.scope === 'LAST_SESSION' ? session?.id : undefined,
      sessionNumber: body.scope === 'LAST_SESSION' ? session?.number : undefined,
      generatedAt: new Date().toISOString(),
      authorFullName: 'Christine Mballa (Commissaire)',
      totalBalance,
      cashBoxSnapshot: db.cashBoxes.map((b) => ({ name: b.name, balance: b.balance })),
      validationsCount: db.validations.filter((v) => v.auditorOpinion).length,
      anomaliesCount: db.auditorAnomalies.length,
      recommendationsCount: db.auditorRecommendations.length,
      observations: body.observations?.trim(),
    };
    db.auditorReports.unshift(report);
    return HttpResponse.json(wrap(report, 'Rapport généré.'), { status: 201 });
  }),

  // ─── Export ───────────────────────────────────────────────────────────
  http.get(`${base}/auditor/export`, ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const url = new URL(request.url);
    const datasetParam = url.searchParams.get('dataset') ?? 'all';
    return HttpResponse.json(
      wrap({
        dataset: datasetParam,
        generatedAt: new Date().toISOString(),
        downloadUrlExcel: '#',
        downloadUrlCsv: '#',
        downloadUrlPdf: '#',
        recordCount:
          datasetParam === 'movements'
            ? db.cashMovements.length
            : datasetParam === 'expenses'
              ? db.expenses.length
              : db.contributions.length + db.expenses.length + db.cashMovements.length,
      }),
    );
  }),

  // ─── Sessions (read-only) ─────────────────────────────────────────────
  http.get(`${base}/auditor/sessions`, ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    return HttpResponse.json(wrap(db.sessionsLive));
  }),

  // Reference loans/expenses helpers used to populate validation context (already exposed via /auditor/validations)
  // The shared FinancialOperationType matters for filtering — we re-export it via the validations endpoint.
  http.get(`${base}/auditor/operation-types`, ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    return HttpResponse.json(wrap(Object.values(FinancialOperationType)));
  }),
];

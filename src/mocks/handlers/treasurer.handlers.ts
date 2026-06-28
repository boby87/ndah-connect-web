import { HttpResponse, http } from 'msw';
import { ContributionStatus } from '../../app/core/enums/contribution-status.enum';
import { ContributionType } from '../../app/core/enums/contribution-type.enum';
import { LoanStatus } from '../../app/core/enums/loan-status.enum';
import { PaymentMethod } from '../../app/core/enums/payment-method.enum';
import { SanctionStatus } from '../../app/core/enums/sanction-type.enum';
import { environment } from '../../environments/environment';
import { db } from '../db';
import type { ApiResponse } from '../../app/core/api/models/api-response.model';
import type {
  CashBoxTransferStatus,
  ExpenseCategory,
  MobileMoneyTransaction,
  SessionFinancialReport,
} from '../../app/shared/models/entities/treasury.model';

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

const recordMovement = (
  cashBoxId: string,
  direction: 'IN' | 'OUT',
  amount: number,
  kind: Parameters<typeof db.cashMovements.push>[0]['kind'],
  description: string,
  reference?: string,
): void => {
  const box = db.cashBoxes.find((b) => b.id === cashBoxId);
  if (!box) return;
  if (direction === 'IN') {
    box.balance += amount;
  } else {
    box.balance -= amount;
  }
  db.cashMovements.unshift({
    id: `mv-${db.cashMovements.length + 1}`,
    tontineId: box.tontineId,
    cashBoxId: box.id,
    cashBoxName: box.name,
    kind,
    amount,
    direction,
    description,
    reference,
    balanceAfter: box.balance,
    recordedByFullName: 'Yvonne Fopa',
    recordedAt: new Date().toISOString(),
  });
};

const computeSessionReport = (sessionId: string): SessionFinancialReport => {
  const session = db.sessionsLive.find((s) => s.id === sessionId);
  if (!session) {
    throw new Error('Session not found');
  }
  const contributionsTotal = db.contributions
    .filter((c) => c.sessionId === sessionId)
    .reduce((sum, c) => sum + c.paidAmount, 0);
  const distribution = db.distributions.find((d) => d.sessionId === sessionId);
  return {
    sessionId,
    sessionNumber: session.number,
    sessionDate: session.scheduledAt,
    totalContributions: contributionsTotal,
    totalExtraContributions: 0,
    totalSanctions: 0,
    totalRepayments: 0,
    totalIncome: contributionsTotal,
    totalDistribution: distribution?.netAmount ?? session.totalDistributed,
    totalExpenses: 0,
    totalDisbursements: 0,
    totalOutflows: distribution?.netAmount ?? session.totalDistributed,
    netResult: contributionsTotal - (distribution?.netAmount ?? session.totalDistributed),
    cashBoxBalances: db.cashBoxes.map((b) => ({ name: b.name, balance: b.balance })),
    signedByTreasurer: !!session.endedAt,
    signedByPresident: session.cagnotteSignedByPresident,
    treasurerSignedAt: session.endedAt,
    presidentSignedAt: session.cagnotteSignedByPresident ? session.endedAt : undefined,
  };
};

export const treasurerHandlers = [
  // ─── Dashboard ─────────────────────────────────────────────────────────
  http.get(`${base}/treasurer/dashboard`, ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const totalBalance = db.cashBoxes.reduce((sum, b) => sum + b.balance, 0);
    return HttpResponse.json(
      wrap({
        totalBalance,
        cashBoxes: db.cashBoxes,
        pendingMobileMoney: db.mobileMoneyTx.filter((t) => t.status === 'PENDING_APPROVAL').length,
        pendingTransfers: db.cashBoxTransfers.filter(
          (t) => t.status === 'PENDING_PRESIDENT' || t.status === 'PENDING_AUDITOR',
        ).length,
        pendingExpenses: db.expenses.filter((e) => e.status === 'PENDING_VALIDATION').length,
        pendingDistributions: db.sessionsLive.filter(
          (s) => s.status === 'IN_PROGRESS' && !s.cagnotteSignedByPresident,
        ).length,
        sanctionsToCollect: db.sanctions.filter(
          (s) => s.status === SanctionStatus.PENDING || s.status === SanctionStatus.CONFIRMED,
        ).length,
        upcomingRepayments: db.loans.filter(
          (l) => l.status === LoanStatus.REPAYING && l.totalRepaid < l.totalDue,
        ).length,
        recentMovements: db.cashMovements.slice(0, 5),
      }),
    );
  }),

  // ─── Flow 1: Contributions ─────────────────────────────────────────────
  http.get(`${base}/treasurer/contributions`, ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const url = new URL(request.url);
    const sessionId = url.searchParams.get('sessionId');
    const type = url.searchParams.get('type') as ContributionType | null;
    let list = sessionId ? db.contributions.filter((c) => c.sessionId === sessionId) : db.contributions;
    if (type) list = list.filter((c) => c.contributionType === type);
    return HttpResponse.json(wrap(list));
  }),

  http.post(`${base}/treasurer/contributions/record`, async ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const body = (await request.json()) as {
      memberId: string;
      contributionType: ContributionType;
      sessionId: string;
      amount: number;
      paymentMethod: PaymentMethod;
      reference?: string;
      note?: string;
    };
    if (!body.memberId || !body.sessionId || !body.amount || body.amount <= 0) {
      return err('INVALID_PAYLOAD', 'Champs requis manquants.', 422);
    }
    let contribution = db.contributions.find(
      (c) => c.sessionId === body.sessionId && c.memberId === body.memberId && c.contributionType === body.contributionType,
    );
    if (contribution) {
      if (contribution.status === ContributionStatus.PAID || (contribution.status as string) === 'EXEMPTED') {
        return err('CONTRIBUTION_ALREADY_SETTLED', 'Cette cotisation est déjà réglée.', 409);
      }
      contribution.paidAmount = (contribution.paidAmount ?? 0) + body.amount;
    } else {
      contribution = {
        id: `contrib-${Date.now()}`,
        tontineId: 'tontine-1',
        sessionId: body.sessionId,
        memberId: body.memberId,
        contributionType: body.contributionType,
        expectedAmount: body.amount,
        paidAmount: body.amount,
        status: ContributionStatus.PAID,
        paidAt: new Date().toISOString(),
        paymentMethod: body.paymentMethod,
        reference: body.reference,
      };
      db.contributions.push(contribution);
    }
    contribution.expectedAmount = contribution.paidAmount;
    contribution.status = ContributionStatus.PAID;
    contribution.paidAt = new Date().toISOString();
    contribution.paymentMethod = body.paymentMethod;
    if (body.reference) contribution.reference = body.reference;
    recordMovement('cb-1', 'IN', body.amount, 'CONTRIBUTION_IN',
      `Cotisation ${body.contributionType} membre ${body.memberId}`, contribution.id);
    return HttpResponse.json(wrap(contribution, 'Cotisation enregistrée.'), { status: 201 });
  }),

  http.post(`${base}/treasurer/contributions/:id/pay`, async ({ request, params }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const contribution = db.contributions.find((c) => c.id === params['id']);
    if (!contribution) return new HttpResponse(null, { status: 404 });
    const body = (await request.json()) as {
      amount: number;
      paymentMethod: PaymentMethod;
      reference?: string;
      note?: string;
    };
    if (!body.amount || body.amount <= 0) {
      return err('INVALID_AMOUNT', 'Montant invalide.', 422);
    }
    contribution.paidAmount += body.amount;
    contribution.paymentMethod = body.paymentMethod;
    contribution.reference = body.reference;
    contribution.note = body.note;
    contribution.paidAt = new Date().toISOString();
    if (contribution.paidAmount >= contribution.expectedAmount) {
      contribution.status = ContributionStatus.PAID;
    } else if (contribution.paidAmount > 0) {
      contribution.status = ContributionStatus.PARTIAL;
    }
    recordMovement(
      'cb-1',
      'IN',
      body.amount,
      'CONTRIBUTION_IN',
      `Cotisation ${contribution.memberId}`,
      contribution.id,
    );
    return HttpResponse.json(wrap(contribution, 'Cotisation encaissée.'));
  }),

  http.post(`${base}/treasurer/contributions/advance`, async ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const body = (await request.json()) as {
      memberId: string;
      sessionIds: string[];
      amount: number;
      paymentMethod: PaymentMethod;
    };
    if (!body.memberId || !body.sessionIds?.length || !body.amount) {
      return err('INVALID_PAYLOAD', 'Champs requis manquants.', 422);
    }
    const created = body.sessionIds.map((sessionId, i) => {
      const id = `contrib-adv-${db.contributions.length + i + 1}`;
      const c = {
        id,
        tontineId: 'tontine-1',
        sessionId,
        memberId: body.memberId,
        contributionType: ContributionType.ORDINARY,
        expectedAmount: 50000,
        paidAmount: 50000,
        status: ContributionStatus.PAID,
        paidAt: new Date().toISOString(),
        paymentMethod: body.paymentMethod,
        reference: `ADV-${id}`,
      };
      db.contributions.push(c);
      return c;
    });
    recordMovement(
      'cb-1',
      'IN',
      body.amount,
      'CONTRIBUTION_IN',
      `Paiement en avance ${body.sessionIds.length} séance(s) — membre ${body.memberId}`,
    );
    return HttpResponse.json(wrap(created, 'Paiement en avance enregistré.'), { status: 201 });
  }),

  // ─── Flow 2: Mobile Money ──────────────────────────────────────────────
  http.get(`${base}/treasurer/mobile-money`, ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    return HttpResponse.json(wrap(db.mobileMoneyTx));
  }),

  http.post(`${base}/treasurer/mobile-money/:id/approve`, async ({ request, params }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const tx = db.mobileMoneyTx.find((t) => t.id === params['id']);
    if (!tx) return new HttpResponse(null, { status: 404 });
    if (tx.status !== 'PENDING_APPROVAL') {
      return err('INVALID_STATE', 'Transaction déjà traitée.', 422);
    }
    const body = (await request.json().catch(() => ({}))) as { contributionId?: string };
    tx.status = 'COMPLETED';
    tx.reviewedAt = new Date().toISOString();
    tx.reviewedByFullName = 'Yvonne Fopa';
    if (body.contributionId) {
      tx.contributionId = body.contributionId;
    }
    recordMovement(
      'cb-1',
      'IN',
      tx.amount,
      'MOBILE_MONEY_IN',
      `Mobile Money de ${tx.matchedMemberFullName ?? tx.fromPhone}`,
      tx.externalReference,
    );
    return HttpResponse.json(wrap(tx, 'Transaction approuvée.'));
  }),

  http.post(`${base}/treasurer/mobile-money/:id/reject`, async ({ request, params }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const tx = db.mobileMoneyTx.find((t) => t.id === params['id']);
    if (!tx) return new HttpResponse(null, { status: 404 });
    const body = (await request.json()) as { reason: string };
    if (!body.reason?.trim()) return err('REASON_REQUIRED', 'Motif obligatoire.', 422);
    tx.status = 'REJECTED';
    tx.rejectionReason = body.reason;
    tx.reviewedAt = new Date().toISOString();
    tx.reviewedByFullName = 'Yvonne Fopa';
    return HttpResponse.json(wrap(tx, 'Transaction rejetée.'));
  }),

  http.post(`${base}/treasurer/mobile-money/send`, async ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const body = (await request.json()) as {
      provider: 'MTN_MOMO' | 'ORANGE_MONEY';
      toPhone: string;
      amount: number;
      purpose: string;
      pin: string;
    };
    if (!body.pin || body.pin.length < 4) {
      return err('INVALID_PIN', 'PIN invalide.', 422);
    }
    if (!body.toPhone || !body.amount || body.amount <= 0) {
      return err('INVALID_PAYLOAD', 'Téléphone et montant requis.', 422);
    }
    const tx: MobileMoneyTransaction = {
      id: `mm-out-${db.mobileMoneyTx.length + 1}`,
      tontineId: 'tontine-1',
      provider: body.provider,
      direction: 'OUT',
      amount: body.amount,
      toPhone: body.toPhone,
      externalReference: `OUT-${Date.now()}`,
      status: 'COMPLETED',
      receivedAt: new Date().toISOString(),
      reviewedAt: new Date().toISOString(),
      reviewedByFullName: 'Yvonne Fopa',
    };
    db.mobileMoneyTx.unshift(tx);
    return HttpResponse.json(wrap(tx, 'Paiement envoyé.'), { status: 201 });
  }),

  http.get(`${base}/treasurer/mobile-money/reconciliation`, ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const unmatched = db.mobileMoneyTx.filter((t) => !t.matchedMemberId && t.direction === 'IN');
    return HttpResponse.json(
      wrap({
        id: `rec-${Date.now()}`,
        tontineId: 'tontine-1',
        generatedAt: new Date().toISOString(),
        periodLabel: 'Mai 2026',
        apiTransactionsCount: db.mobileMoneyTx.length,
        recordedCount: db.contributions.filter((c) => c.reference?.startsWith('MTN-') || c.reference?.startsWith('OM-')).length,
        unmatchedApi: unmatched,
        unmatchedRecorded: [],
      }),
    );
  }),

  // ─── Flow 5+6: Cash boxes & transfers ──────────────────────────────────
  http.get(`${base}/treasurer/cashboxes`, ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    return HttpResponse.json(wrap(db.cashBoxes));
  }),

  http.get(`${base}/treasurer/cashboxes/:id/movements`, ({ request, params }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const moves = db.cashMovements.filter((m) => m.cashBoxId === params['id']);
    return HttpResponse.json(wrap(moves));
  }),

  http.get(`${base}/treasurer/transfers`, ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    return HttpResponse.json(wrap(db.cashBoxTransfers));
  }),

  http.post(`${base}/treasurer/transfers`, async ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const body = (await request.json()) as {
      fromCashBoxId: string;
      toCashBoxId: string;
      amount: number;
      justification: string;
    };
    if (!body.justification?.trim()) {
      return err('JUSTIFICATION_REQUIRED', 'Justification obligatoire.', 422);
    }
    if (!body.amount || body.amount <= 0) {
      return err('INVALID_AMOUNT', 'Montant invalide.', 422);
    }
    if (body.fromCashBoxId === body.toCashBoxId) {
      return err('SAME_CASHBOX', 'Caisse source et destination identiques.', 422);
    }
    const from = db.cashBoxes.find((b) => b.id === body.fromCashBoxId);
    const to = db.cashBoxes.find((b) => b.id === body.toCashBoxId);
    if (!from || !to) return new HttpResponse(null, { status: 404 });
    if (from.balance < body.amount) {
      return err('INSUFFICIENT_FUNDS', 'Solde insuffisant.', 422);
    }
    const transfer = {
      id: `trf-${db.cashBoxTransfers.length + 1}`,
      tontineId: 'tontine-1',
      fromCashBoxId: from.id,
      fromCashBoxName: from.name,
      toCashBoxId: to.id,
      toCashBoxName: to.name,
      amount: body.amount,
      justification: body.justification,
      status: 'PENDING_PRESIDENT' as CashBoxTransferStatus,
      requestedByFullName: 'Yvonne Fopa',
      requestedAt: new Date().toISOString(),
    };
    db.cashBoxTransfers.unshift(transfer);
    return HttpResponse.json(wrap(transfer, 'Demande de transfert créée.'), { status: 201 });
  }),

  // ─── Flow 7: Expenses ──────────────────────────────────────────────────
  http.get(`${base}/treasurer/expenses`, ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    return HttpResponse.json(wrap(db.expenses));
  }),

  http.post(`${base}/treasurer/expenses`, async ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const body = (await request.json()) as {
      category: ExpenseCategory;
      amount: number;
      description: string;
      vendor?: string;
      receiptFileName?: string;
      cashBoxId: string;
    };
    if (!body.category || !body.amount || !body.description?.trim() || !body.receiptFileName?.trim()) {
      return err('INVALID_PAYLOAD', 'Justificatif et description obligatoires (RM-DE01).', 422);
    }
    const cap = 100000;
    const needsValidation = body.amount > cap;
    const expense = {
      id: `exp-${db.expenses.length + 1}`,
      tontineId: 'tontine-1',
      cashBoxId: body.cashBoxId,
      category: body.category,
      amount: body.amount,
      description: body.description.trim(),
      vendor: body.vendor?.trim(),
      receiptFileName: body.receiptFileName,
      status: needsValidation
        ? ('PENDING_VALIDATION' as const)
        : ('PAID' as const),
      needsValidation,
      cap,
      paidAt: needsValidation ? undefined : new Date().toISOString(),
      paymentMethod: needsValidation ? undefined : PaymentMethod.CASH,
      createdByFullName: 'Yvonne Fopa',
      createdAt: new Date().toISOString(),
    };
    db.expenses.unshift(expense);
    if (!needsValidation) {
      recordMovement(body.cashBoxId, 'OUT', body.amount, 'EXPENSE_OUT', expense.description, expense.id);
    }
    return HttpResponse.json(wrap(expense, 'Dépense enregistrée.'), { status: 201 });
  }),

  // ─── Flow 8: Cagnotte distribution ─────────────────────────────────────
  http.get(`${base}/treasurer/distributions`, ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    return HttpResponse.json(wrap(db.distributions));
  }),

  http.post(`${base}/treasurer/distributions`, async ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const body = (await request.json()) as {
      sessionId: string;
      paymentMethod: PaymentMethod;
      otp: string;
    };
    const session = db.sessionsLive.find((s) => s.id === body.sessionId);
    if (!session) return new HttpResponse(null, { status: 404 });
    if (session.status !== 'IN_PROGRESS' && session.status !== 'COMPLETED') {
      return err('RM_DC01_VIOLATION', 'La distribution n\'est possible que pendant une séance.', 422);
    }
    if (!body.otp || body.otp.length < 4) {
      return err('OTP_REQUIRED', 'OTP du bénéficiaire requis.', 422);
    }
    const beneficiary = db.members.find((m) => m.id === session.beneficiaryMemberId);
    if (!beneficiary) return err('NO_BENEFICIARY', 'Aucun bénéficiaire défini.', 422);
    const gross = session.cagnotteAmount ?? 0;
    const deductionEmergency = Math.round(gross * 0.05);
    const deductionOperations = Math.round(gross * 0.03);
    const net = gross - deductionEmergency - deductionOperations;
    const distribution = {
      id: `dist-${db.distributions.length + 1}`,
      sessionId: session.id,
      sessionNumber: session.number,
      tontineId: session.tontineId,
      beneficiaryMemberId: beneficiary.id,
      beneficiaryFullName: `${beneficiary.firstName} ${beneficiary.lastName}`,
      beneficiaryPhone: beneficiary.phone,
      grossAmount: gross,
      deductionEmergency,
      deductionOperations,
      netAmount: net,
      paymentMethod: body.paymentMethod,
      beneficiaryConfirmed: true,
      beneficiaryConfirmedAt: new Date().toISOString(),
      treasurerPaidAt: new Date().toISOString(),
    };
    db.distributions.unshift(distribution);
    recordMovement('cb-1', 'OUT', net, 'CAGNOTTE_OUT', `Cagnotte → ${distribution.beneficiaryFullName}`, distribution.id);
    recordMovement('cb-2', 'IN', deductionEmergency, 'TRANSFER_IN', `Prélèvement secours séance #${session.number}`, distribution.id);
    recordMovement('cb-3', 'IN', deductionOperations, 'TRANSFER_IN', `Prélèvement fonctionnement séance #${session.number}`, distribution.id);
    session.totalDistributed = net;
    return HttpResponse.json(wrap(distribution, 'Distribution effectuée.'), { status: 201 });
  }),

  // ─── Flow 9+10: Loans ──────────────────────────────────────────────────
  http.get(`${base}/treasurer/loans`, ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    return HttpResponse.json(wrap(db.loans));
  }),

  http.post(`${base}/treasurer/loans/:id/disburse`, async ({ request, params }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const loan = db.loans.find((l) => l.id === params['id']);
    if (!loan) return new HttpResponse(null, { status: 404 });
    if (loan.status !== LoanStatus.APPROVED) {
      return err('NOT_APPROVED', 'Le prêt doit être approuvé par Président + Commissaire (RM-DP01).', 422);
    }
    const body = (await request.json().catch(() => ({}))) as {
      paymentMethod?: PaymentMethod;
    };
    loan.status = LoanStatus.DISBURSED;
    loan.disbursedAt = new Date().toISOString();
    recordMovement(
      'cb-1',
      'OUT',
      loan.principal,
      'LOAN_DISBURSEMENT_OUT',
      `Décaissement prêt ${loan.id}`,
      loan.id,
    );
    void body.paymentMethod;
    return HttpResponse.json(wrap(loan, 'Prêt décaissé.'));
  }),

  http.post(`${base}/treasurer/loans/:id/repay`, async ({ request, params }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const loan = db.loans.find((l) => l.id === params['id']);
    if (!loan) return new HttpResponse(null, { status: 404 });
    const body = (await request.json()) as { amount: number; paymentMethod: PaymentMethod };
    if (!body.amount || body.amount <= 0) {
      return err('INVALID_AMOUNT', 'Montant invalide.', 422);
    }
    loan.totalRepaid += body.amount;
    if (loan.totalRepaid >= loan.totalDue) {
      loan.status = LoanStatus.REPAID;
    } else if (loan.status === LoanStatus.DISBURSED) {
      loan.status = LoanStatus.REPAYING;
    }
    recordMovement(
      'cb-1',
      'IN',
      body.amount,
      'LOAN_REPAYMENT_IN',
      `Remboursement prêt ${loan.id}`,
      loan.id,
    );
    return HttpResponse.json(wrap(loan, 'Remboursement enregistré.'));
  }),

  // ─── Flow 11+12: Sanctions ─────────────────────────────────────────────
  http.get(`${base}/treasurer/sanctions`, ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    return HttpResponse.json(wrap(db.sanctions));
  }),

  http.post(`${base}/treasurer/sanctions/:id/collect`, async ({ request, params }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const sanction = db.sanctions.find((s) => s.id === params['id']);
    if (!sanction) return new HttpResponse(null, { status: 404 });
    const body = (await request.json()) as { paymentMethod: PaymentMethod };
    sanction.status = SanctionStatus.PAID;
    sanction.paidAt = new Date().toISOString();
    recordMovement(
      'cb-1',
      'IN',
      sanction.amount,
      'SANCTION_IN',
      `Sanction encaissée — ${sanction.reason.slice(0, 50)}`,
      sanction.id,
    );
    void body.paymentMethod;
    return HttpResponse.json(wrap(sanction, 'Sanction encaissée.'));
  }),

  http.post(`${base}/treasurer/sanctions/:id/refund`, ({ request, params }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const sanction = db.sanctions.find((s) => s.id === params['id']);
    if (!sanction) return new HttpResponse(null, { status: 404 });
    if (sanction.status !== SanctionStatus.WAIVED) {
      return err('NOT_WAIVED', 'La sanction doit être annulée par le Président.', 422);
    }
    recordMovement(
      'cb-1',
      'OUT',
      sanction.amount,
      'SANCTION_REFUND_OUT',
      `Remboursement sanction annulée`,
      sanction.id,
    );
    return HttpResponse.json(wrap(sanction, 'Sanction remboursée.'));
  }),

  // ─── Flow 14: Session bilan ────────────────────────────────────────────
  http.get(`${base}/treasurer/sessions/:id/bilan`, ({ request, params }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    try {
      const report = computeSessionReport(params['id'] as string);
      return HttpResponse.json(wrap(report));
    } catch {
      return new HttpResponse(null, { status: 404 });
    }
  }),

  http.get(`${base}/treasurer/sessions`, ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    return HttpResponse.json(wrap(db.sessionsLive));
  }),

  // ─── Flow 13: Extra contributions (read-only view) ─────────────────────
  http.get(`${base}/treasurer/extra-contributions`, ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    return HttpResponse.json(wrap(db.extraordinaryContributions));
  }),

  http.post(
    `${base}/treasurer/extra-contributions/:id/collect`,
    async ({ request, params }) => {
      if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
      const ec = db.extraordinaryContributions.find((c) => c.id === params['id']);
      if (!ec) return new HttpResponse(null, { status: 404 });
      const body = (await request.json()) as {
        memberId: string;
        amount: number;
        paymentMethod: PaymentMethod;
      };
      const m = ec.members.find((x) => x.memberId === body.memberId);
      if (!m) return new HttpResponse(null, { status: 404 });
      m.paid += body.amount;
      m.paidAt = new Date().toISOString();
      ec.totalCollected += body.amount;
      recordMovement(
        'cb-1',
        'IN',
        body.amount,
        'EXTRA_CONTRIBUTION_IN',
        `Cotisation extra — ${ec.motive}`,
        ec.id,
      );
      void body.paymentMethod;
      return HttpResponse.json(wrap(ec, 'Cotisation extra encaissée.'));
    },
  ),

  // ─── Flow 15: Reports ──────────────────────────────────────────────────
  http.get(`${base}/treasurer/reports`, ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const treasuryReports = db.reports.filter((r) => r.category === 'TREASURY');
    return HttpResponse.json(wrap(treasuryReports));
  }),

  http.post(`${base}/treasurer/reports/generate`, async ({ request }) => {
    if (!isAuthorized(request)) return new HttpResponse(null, { status: 401 });
    const body = (await request.json()) as { periodLabel: string; type: string };
    if (!body.periodLabel?.trim()) {
      return err('INVALID_PAYLOAD', 'Période requise.', 422);
    }
    const totalBalance = db.cashBoxes.reduce((sum, b) => sum + b.balance, 0);
    const report = {
      id: `rep-${db.reports.length + 1}`,
      tontineId: 'tontine-1',
      category: 'TREASURY' as const,
      title: `${body.type === 'DETAILED' ? 'Rapport détaillé' : 'Bilan financier'} — ${body.periodLabel.trim()}`,
      periodLabel: body.periodLabel.trim(),
      authorFullName: 'Yvonne Fopa (Trésorier)',
      generatedAt: new Date().toISOString(),
      metricsJson: {
        soldeGlobal: totalBalance,
        nbCotisations: db.contributions.filter((c) => c.status === ContributionStatus.PAID).length,
        nbDepenses: db.expenses.filter((e) => e.status === 'PAID').length,
        nbDistributions: db.distributions.length,
      },
      downloadUrlPdf: '#',
      downloadUrlExcel: '#',
    };
    db.reports.unshift(report);
    return HttpResponse.json(wrap(report, 'Rapport généré.'), { status: 201 });
  }),
];

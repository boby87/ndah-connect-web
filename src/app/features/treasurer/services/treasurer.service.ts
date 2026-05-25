import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { API_CONFIG } from '../../../core/config/api.config';
import type { ApiResponse } from '../../../core/api/models/api-response.model';
import type { PaymentMethod } from '../../../core/enums/payment-method.enum';
import type { Contribution } from '../../../shared/models/entities/contribution.model';
import type {
  ExtraordinaryContribution,
} from '../../../shared/models/entities/extraordinary-contribution.model';
import type { Loan } from '../../../shared/models/entities/loan.model';
import type { ReportEntry } from '../../../shared/models/entities/report.model';
import type { Sanction } from '../../../shared/models/entities/sanction.model';
import type { SessionLive } from '../../../shared/models/entities/session-live.model';
import type {
  CagnotteDistribution,
  CashBox,
  CashBoxTransfer,
  CashMovement,
  Expense,
  ExpenseCategory,
  MobileMoneyProvider,
  MobileMoneyReconciliationReport,
  MobileMoneyTransaction,
  SessionFinancialReport,
} from '../../../shared/models/entities/treasury.model';

export interface TreasurerDashboard {
  totalBalance: number;
  cashBoxes: CashBox[];
  pendingMobileMoney: number;
  pendingTransfers: number;
  pendingExpenses: number;
  pendingDistributions: number;
  sanctionsToCollect: number;
  upcomingRepayments: number;
  recentMovements: CashMovement[];
}

export interface PayContributionPayload {
  amount: number;
  paymentMethod: PaymentMethod;
  reference?: string;
  note?: string;
}

export interface AdvancePaymentPayload {
  memberId: string;
  sessionIds: string[];
  amount: number;
  paymentMethod: PaymentMethod;
}

export interface CreateTransferPayload {
  fromCashBoxId: string;
  toCashBoxId: string;
  amount: number;
  justification: string;
}

export interface CreateExpensePayload {
  category: ExpenseCategory;
  amount: number;
  description: string;
  vendor?: string;
  receiptFileName?: string;
  cashBoxId: string;
}

export interface CreateDistributionPayload {
  sessionId: string;
  paymentMethod: PaymentMethod;
  otp: string;
}

export interface MobileMoneySendPayload {
  provider: MobileMoneyProvider;
  toPhone: string;
  amount: number;
  purpose: string;
  pin: string;
}

@Injectable({ providedIn: 'root' })
export class TreasurerService {
  private readonly http = inject(HttpClient);
  private readonly base = `${API_CONFIG.baseUrl}/treasurer`;

  // ─── Dashboard ─────────────────────────────────────────────────────────
  async getDashboard(): Promise<TreasurerDashboard> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<TreasurerDashboard>>(`${this.base}/dashboard`),
    );
    return response.data;
  }

  // ─── Contributions ─────────────────────────────────────────────────────
  async getContributions(sessionId?: string): Promise<Contribution[]> {
    const params: Record<string, string> = sessionId ? { sessionId } : {};
    const response = await firstValueFrom(
      this.http.get<ApiResponse<Contribution[]>>(`${this.base}/contributions`, { params }),
    );
    return response.data;
  }

  async payContribution(id: string, payload: PayContributionPayload): Promise<Contribution> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<Contribution>>(`${this.base}/contributions/${id}/pay`, payload),
    );
    return response.data;
  }

  async payAdvance(payload: AdvancePaymentPayload): Promise<Contribution[]> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<Contribution[]>>(`${this.base}/contributions/advance`, payload),
    );
    return response.data;
  }

  // ─── Mobile Money ──────────────────────────────────────────────────────
  async getMobileMoney(): Promise<MobileMoneyTransaction[]> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<MobileMoneyTransaction[]>>(`${this.base}/mobile-money`),
    );
    return response.data;
  }

  async approveMobileMoney(id: string, contributionId?: string): Promise<MobileMoneyTransaction> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<MobileMoneyTransaction>>(
        `${this.base}/mobile-money/${id}/approve`,
        { contributionId },
      ),
    );
    return response.data;
  }

  async rejectMobileMoney(id: string, reason: string): Promise<MobileMoneyTransaction> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<MobileMoneyTransaction>>(
        `${this.base}/mobile-money/${id}/reject`,
        { reason },
      ),
    );
    return response.data;
  }

  async sendMobileMoney(payload: MobileMoneySendPayload): Promise<MobileMoneyTransaction> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<MobileMoneyTransaction>>(`${this.base}/mobile-money/send`, payload),
    );
    return response.data;
  }

  async getReconciliation(): Promise<MobileMoneyReconciliationReport> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<MobileMoneyReconciliationReport>>(
        `${this.base}/mobile-money/reconciliation`,
      ),
    );
    return response.data;
  }

  // ─── Cash boxes ────────────────────────────────────────────────────────
  async getCashBoxes(): Promise<CashBox[]> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<CashBox[]>>(`${this.base}/cashboxes`),
    );
    return response.data;
  }

  async getCashBoxMovements(id: string): Promise<CashMovement[]> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<CashMovement[]>>(`${this.base}/cashboxes/${id}/movements`),
    );
    return response.data;
  }

  async getTransfers(): Promise<CashBoxTransfer[]> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<CashBoxTransfer[]>>(`${this.base}/transfers`),
    );
    return response.data;
  }

  async createTransfer(payload: CreateTransferPayload): Promise<CashBoxTransfer> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<CashBoxTransfer>>(`${this.base}/transfers`, payload),
    );
    return response.data;
  }

  // ─── Expenses ──────────────────────────────────────────────────────────
  async getExpenses(): Promise<Expense[]> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<Expense[]>>(`${this.base}/expenses`),
    );
    return response.data;
  }

  async createExpense(payload: CreateExpensePayload): Promise<Expense> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<Expense>>(`${this.base}/expenses`, payload),
    );
    return response.data;
  }

  // ─── Distributions ─────────────────────────────────────────────────────
  async getDistributions(): Promise<CagnotteDistribution[]> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<CagnotteDistribution[]>>(`${this.base}/distributions`),
    );
    return response.data;
  }

  async createDistribution(payload: CreateDistributionPayload): Promise<CagnotteDistribution> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<CagnotteDistribution>>(`${this.base}/distributions`, payload),
    );
    return response.data;
  }

  // ─── Loans ─────────────────────────────────────────────────────────────
  async getLoans(): Promise<Loan[]> {
    const response = await firstValueFrom(this.http.get<ApiResponse<Loan[]>>(`${this.base}/loans`));
    return response.data;
  }

  async disburseLoan(id: string, paymentMethod?: PaymentMethod): Promise<Loan> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<Loan>>(`${this.base}/loans/${id}/disburse`, { paymentMethod }),
    );
    return response.data;
  }

  async repayLoan(id: string, amount: number, paymentMethod: PaymentMethod): Promise<Loan> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<Loan>>(`${this.base}/loans/${id}/repay`, { amount, paymentMethod }),
    );
    return response.data;
  }

  // ─── Sanctions ─────────────────────────────────────────────────────────
  async getSanctions(): Promise<Sanction[]> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<Sanction[]>>(`${this.base}/sanctions`),
    );
    return response.data;
  }

  async collectSanction(id: string, paymentMethod: PaymentMethod): Promise<Sanction> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<Sanction>>(`${this.base}/sanctions/${id}/collect`, {
        paymentMethod,
      }),
    );
    return response.data;
  }

  async refundSanction(id: string): Promise<Sanction> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<Sanction>>(`${this.base}/sanctions/${id}/refund`, {}),
    );
    return response.data;
  }

  // ─── Sessions & Bilan ──────────────────────────────────────────────────
  async getSessions(): Promise<SessionLive[]> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<SessionLive[]>>(`${this.base}/sessions`),
    );
    return response.data;
  }

  async getSessionReport(id: string): Promise<SessionFinancialReport> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<SessionFinancialReport>>(`${this.base}/sessions/${id}/bilan`),
    );
    return response.data;
  }

  // ─── Extra contributions ───────────────────────────────────────────────
  async getExtraContributions(): Promise<ExtraordinaryContribution[]> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<ExtraordinaryContribution[]>>(`${this.base}/extra-contributions`),
    );
    return response.data;
  }

  async collectExtraContribution(
    id: string,
    memberId: string,
    amount: number,
    paymentMethod: PaymentMethod,
  ): Promise<ExtraordinaryContribution> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<ExtraordinaryContribution>>(
        `${this.base}/extra-contributions/${id}/collect`,
        { memberId, amount, paymentMethod },
      ),
    );
    return response.data;
  }

  // ─── Reports ───────────────────────────────────────────────────────────
  async getReports(): Promise<ReportEntry[]> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<ReportEntry[]>>(`${this.base}/reports`),
    );
    return response.data;
  }

  async generateReport(periodLabel: string, type: 'SUMMARY' | 'DETAILED'): Promise<ReportEntry> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<ReportEntry>>(`${this.base}/reports/generate`, {
        periodLabel,
        type,
      }),
    );
    return response.data;
  }
}

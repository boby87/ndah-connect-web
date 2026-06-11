import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, resource, signal } from '@angular/core';
import { AlertComponent } from '../../../../shared/components/ui/alert/alert.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { EmptyStateComponent } from '../../../../shared/components/ui/empty-state/empty-state.component';
import { InputComponent } from '../../../../shared/components/ui/input/input.component';
import { CurrencyXafPipe } from '../../../../shared/pipes/currency-xaf.pipe';
import { StatusLabelPipe } from '../../../../shared/pipes/status-label.pipe';
import { NotificationService } from '../../../../core/services/notification.service';
import { LoanStatus } from '../../../../core/enums/loan-status.enum';
import { PAYMENT_METHOD_LABELS, PaymentMethod } from '../../../../core/enums/payment-method.enum';
import type { Loan } from '../../../../shared/models/entities/loan.model';
import { TreasurerService } from '../../services/treasurer.service';
import { formatApiError } from '../../../../core/utils';

@Component({
  selector: 'tc-treasurer-loans',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DecimalPipe,
    AlertComponent,
    BadgeComponent,
    ButtonComponent,
    CardComponent,
    EmptyStateComponent,
    InputComponent,
    CurrencyXafPipe,
    StatusLabelPipe,
  ],
  template: `
    <div class="space-y-6">
      <header>
        <h1 class="text-2xl font-bold text-gray-900">Prêts — Décaissements & Remboursements</h1>
        <p class="text-sm text-gray-500">
          Décaissez les prêts approuvés par Président + Commissaire (RM-DP01). Les remboursements partiels sont autorisés (RM-RP01).
        </p>
      </header>

      @if (errorMessage(); as err) {
        <tc-alert kind="error">{{ err }}</tc-alert>
      }

      @if (resource.isLoading()) {
        <p class="text-sm text-gray-500">Chargement…</p>
      } @else if (loans().length === 0) {
        <tc-card>
          <tc-empty-state title="Aucun prêt" icon="💳" />
        </tc-card>
      } @else {
        <ul class="space-y-3">
          @for (loan of loans(); track loan.id) {
            <li>
              <tc-card>
                <div class="flex flex-wrap items-start justify-between gap-3">
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-2 flex-wrap">
                      <p class="font-semibold text-gray-900">Prêt {{ loan.id }} — {{ loan.memberId }}</p>
                      <tc-badge [kind]="statusKind(loan.status)">{{ loan.status | statusLabel: 'loan' }}</tc-badge>
                    </div>
                    <p class="text-sm text-gray-600 mt-1">{{ loan.purpose }}</p>
                    <dl class="mt-3 grid gap-2 text-xs sm:grid-cols-4">
                      <div>
                        <dt class="text-gray-500">Principal</dt>
                        <dd class="font-semibold text-gray-900">{{ loan.principal | xaf }}</dd>
                      </div>
                      <div>
                        <dt class="text-gray-500">Mensualité</dt>
                        <dd class="font-semibold text-gray-900">{{ loan.monthlyPayment | xaf }}</dd>
                      </div>
                      <div>
                        <dt class="text-gray-500">Remboursé</dt>
                        <dd class="font-semibold text-green-600">{{ loan.totalRepaid | xaf }}</dd>
                      </div>
                      <div>
                        <dt class="text-gray-500">Restant</dt>
                        <dd class="font-semibold text-amber-600">{{ remaining(loan) | xaf }}</dd>
                      </div>
                    </dl>
                    <div class="mt-3 h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                      <div class="h-full bg-green-500" [style.width.%]="progress(loan)"></div>
                    </div>
                    <p class="mt-1 text-xs text-gray-500">{{ progress(loan) | number: '1.0-0' }}% remboursé</p>
                  </div>

                  <div class="flex flex-col gap-2 shrink-0">
                    @if (loan.status === 'APPROVED') {
                      <tc-button variant="primary" size="sm" [loading]="acting() === loan.id + ':disburse'" (clicked)="disburse(loan.id)">
                        Décaisser
                      </tc-button>
                    }
                    @if (loan.status === 'REPAYING' || loan.status === 'DISBURSED') {
                      <tc-button variant="success" size="sm" (clicked)="openRepay(loan)">
                        Enregistrer un remboursement
                      </tc-button>
                    }
                  </div>
                </div>

                @if (repaying() === loan.id) {
                  <form class="mt-4 border-t border-gray-100 pt-4 space-y-3" (submit)="onRepay($event, loan)">
                    <tc-input
                      label="Montant remboursé (XAF)"
                      type="number"
                      [(value)]="repayAmount"
                      [(touched)]="repayAmountTouched"
                      [error]="repayAmountError(loan)"
                      hint="Remboursement partiel autorisé."
                      [required]="true"
                    />
                    <div>
                      <p class="text-sm font-medium text-gray-700 mb-1">Méthode</p>
                      <div class="space-y-1 text-sm">
                        @for (m of methods; track m) {
                          <label class="flex items-center gap-2">
                            <input type="radio" name="repayMethod" [checked]="repayMethod() === m" (change)="repayMethod.set(m)" />
                            {{ methodLabel(m) }}
                          </label>
                        }
                      </div>
                    </div>
                    <div class="flex gap-2">
                      <tc-button type="submit" variant="success" [loading]="acting() === loan.id + ':repay'">
                        ✓ Enregistrer
                      </tc-button>
                      <tc-button variant="outline" (clicked)="cancel()">Annuler</tc-button>
                    </div>
                  </form>
                }
              </tc-card>
            </li>
          }
        </ul>
      }
    </div>
  `,
})
export class TreasurerLoansPageComponent {
  private readonly service = inject(TreasurerService);
  private readonly notifications = inject(NotificationService);

  protected readonly methods: PaymentMethod[] = [PaymentMethod.CASH, PaymentMethod.MOBILE_MONEY, PaymentMethod.ORANGE_MONEY, PaymentMethod.BANK_TRANSFER];

  readonly resource = resource({
    loader: () => this.service.getLoans(),
  });

  readonly loans = computed(() => this.resource.value() ?? []);

  readonly repaying = signal<string | null>(null);
  readonly repayAmount = signal('');
  readonly repayAmountTouched = signal(false);
  readonly repayMethod = signal<PaymentMethod>(PaymentMethod.MOBILE_MONEY);
  readonly acting = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);

  repayAmountError(loan: Loan): string {
    const n = Number(this.repayAmount());
    if (!Number.isFinite(n) || n <= 0) return 'Montant invalide.';
    const remaining = loan.totalDue - loan.totalRepaid;
    if (n > remaining) return `Supérieur au reste dû (${remaining}).`;
    return '';
  }

  remaining(loan: Loan): number {
    return Math.max(0, loan.totalDue - loan.totalRepaid);
  }

  progress(loan: Loan): number {
    if (loan.totalDue <= 0) return 0;
    return Math.min(100, (loan.totalRepaid / loan.totalDue) * 100);
  }

  statusKind(s: Loan['status']): 'success' | 'warning' | 'danger' | 'info' | 'neutral' {
    if (s === LoanStatus.REPAID || s === LoanStatus.APPROVED) return 'success';
    if (s === LoanStatus.REPAYING || s === LoanStatus.DISBURSED) return 'info';
    if (s === LoanStatus.REJECTED || s === LoanStatus.DEFAULTED) return 'danger';
    if (s === LoanStatus.REQUESTED || s === LoanStatus.COMMITTEE_REVIEW) return 'warning';
    return 'neutral';
  }

  methodLabel(m: PaymentMethod): string {
    return PAYMENT_METHOD_LABELS[m];
  }

  async disburse(id: string): Promise<void> {
    this.acting.set(`${id}:disburse`);
    this.errorMessage.set(null);
    try {
      await this.service.disburseLoan(id);
      this.notifications.success('Prêt décaissé.');
      this.resource.reload();
    } catch (e: unknown) {
      this.errorMessage.set(formatApiError(e, 'Erreur.'));
    } finally {
      this.acting.set(null);
    }
  }

  openRepay(loan: Loan): void {
    this.repaying.set(loan.id);
    this.repayAmount.set(String(Math.min(loan.monthlyPayment, this.remaining(loan))));
    this.repayAmountTouched.set(false);
  }

  cancel(): void {
    this.repaying.set(null);
  }

  async onRepay(event: Event, loan: Loan): Promise<void> {
    event.preventDefault();
    this.repayAmountTouched.set(true);
    this.errorMessage.set(null);
    if (this.repayAmountError(loan)) return;

    this.acting.set(`${loan.id}:repay`);
    try {
      await this.service.repayLoan(loan.id, Number(this.repayAmount()), this.repayMethod());
      this.notifications.success('Remboursement enregistré.');
      this.repaying.set(null);
      this.resource.reload();
    } catch (e: unknown) {
      this.errorMessage.set(formatApiError(e, 'Erreur.'));
    } finally {
      this.acting.set(null);
    }
  }
}

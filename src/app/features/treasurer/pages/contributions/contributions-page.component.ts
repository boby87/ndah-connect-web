import { ChangeDetectionStrategy, Component, computed, inject, resource, signal } from '@angular/core';
import { AlertComponent } from '../../../../shared/components/ui/alert/alert.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { EmptyStateComponent } from '../../../../shared/components/ui/empty-state/empty-state.component';
import { InputComponent } from '../../../../shared/components/ui/input/input.component';
import { TextareaComponent } from '../../../../shared/components/ui/textarea/textarea.component';
import { CurrencyXafPipe } from '../../../../shared/pipes/currency-xaf.pipe';
import { StatusLabelPipe } from '../../../../shared/pipes/status-label.pipe';
import { NotificationService } from '../../../../core/services/notification.service';
import {
  PAYMENT_METHOD_LABELS,
  PaymentMethod,
} from '../../../../core/enums/payment-method.enum';
import { ContributionStatus } from '../../../../core/enums/contribution-status.enum';
import { TreasurerService } from '../../services/treasurer.service';
import type { Contribution } from '../../../../shared/models/entities/contribution.model';

const PAYMENT_METHODS: PaymentMethod[] = [
  PaymentMethod.CASH,
  PaymentMethod.MOBILE_MONEY,
  PaymentMethod.ORANGE_MONEY,
  PaymentMethod.BANK_TRANSFER,
];

@Component({
  selector: 'tc-contributions-collect',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AlertComponent,
    BadgeComponent,
    ButtonComponent,
    CardComponent,
    EmptyStateComponent,
    InputComponent,
    TextareaComponent,
    CurrencyXafPipe,
    StatusLabelPipe,
  ],
  template: `
    <div class="space-y-6">
      <header>
        <h1 class="text-2xl font-bold text-gray-900">Encaissement des cotisations</h1>
        <p class="text-sm text-gray-500">
          Enregistrez les paiements (complets ou partiels), ou un paiement en avance pour plusieurs séances.
        </p>
      </header>

      @if (errorMessage(); as err) {
        <tc-alert kind="error">{{ err }}</tc-alert>
      }

      <div class="grid gap-6 lg:grid-cols-3">
        <div class="lg:col-span-2 space-y-3">
          @if (resource.isLoading()) {
            <p class="text-sm text-gray-500">Chargement…</p>
          } @else if (contributions().length === 0) {
            <tc-card>
              <tc-empty-state title="Aucune cotisation" icon="💰" />
            </tc-card>
          } @else {
            @for (c of contributions(); track c.id) {
              <tc-card>
                <div class="flex flex-wrap items-start justify-between gap-3">
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-2 flex-wrap">
                      <p class="font-semibold text-gray-900">Cotisation {{ c.memberId }}</p>
                      <tc-badge [kind]="statusKind(c.status)">{{ c.status | statusLabel: 'contribution' }}</tc-badge>
                    </div>
                    <p class="text-sm text-gray-600 mt-1">
                      Séance {{ c.sessionId }} · Attendu : <span class="font-medium">{{ c.expectedAmount | xaf }}</span>
                      · Payé : <span class="font-medium">{{ c.paidAmount | xaf }}</span>
                    </p>
                  </div>
                  @if (c.status !== 'PAID' && c.status !== 'EXEMPTED') {
                    <tc-button variant="primary" size="sm" (clicked)="openPay(c)">
                      Encaisser
                    </tc-button>
                  }
                </div>

                @if (paying() === c.id) {
                  <form class="mt-4 border-t border-gray-100 pt-4 space-y-3" (submit)="onPay($event, c)">
                    <tc-input
                      label="Montant à encaisser (XAF)"
                      type="number"
                      [(value)]="amount"
                      [(touched)]="amountTouched"
                      [error]="amountError(c)"
                      hint="Pour paiement partiel, saisissez un montant inférieur."
                      [required]="true"
                    />
                    <div>
                      <p class="text-sm font-medium text-gray-700 mb-1">Méthode de paiement</p>
                      <div class="space-y-1 text-sm">
                        @for (m of methods; track m) {
                          <label class="flex items-center gap-2">
                            <input type="radio" name="method" [checked]="method() === m" (change)="method.set(m)" />
                            {{ methodLabel(m) }}
                          </label>
                        }
                      </div>
                    </div>
                    <tc-input label="Référence (optionnel)" [(value)]="reference" />
                    <tc-textarea label="Note" [(value)]="note" [rows]="2" />
                    <div class="flex gap-2">
                      <tc-button type="submit" variant="success" [loading]="submitting()">
                        ✓ Valider l'encaissement
                      </tc-button>
                      <tc-button variant="outline" (clicked)="cancel()">Annuler</tc-button>
                    </div>
                  </form>
                }
              </tc-card>
            }
          }
        </div>

        <aside>
          <tc-card title="Paiement en avance">
            <p class="text-xs text-gray-500 mb-3">
              Enregistre un règlement anticipé pour plusieurs séances à venir.
            </p>
            <form class="space-y-3" (submit)="onAdvance($event)">
              <tc-input
                label="ID membre"
                [(value)]="advanceMemberId"
                [(touched)]="advanceMemberTouched"
                [error]="advanceMemberError()"
                hint="ex: member-3"
                [required]="true"
              />
              <tc-input
                label="IDs séances (séparés par virgule)"
                [(value)]="advanceSessionIds"
                [(touched)]="advanceSessionsTouched"
                [error]="advanceSessionsError()"
                hint="ex: session-2, session-3"
                [required]="true"
              />
              <tc-input
                label="Montant total"
                type="number"
                [(value)]="advanceAmount"
                [(touched)]="advanceAmountTouched"
                [error]="advanceAmountError()"
                [required]="true"
              />
              <div>
                <p class="text-sm font-medium text-gray-700 mb-1">Méthode</p>
                <div class="space-y-1 text-sm">
                  @for (m of methods; track m) {
                    <label class="flex items-center gap-2">
                      <input type="radio" name="advanceMethod" [checked]="advanceMethod() === m" (change)="advanceMethod.set(m)" />
                      {{ methodLabel(m) }}
                    </label>
                  }
                </div>
              </div>
              <tc-button type="submit" variant="primary" [fullWidth]="true" [loading]="advanceSubmitting()">
                Enregistrer
              </tc-button>
            </form>
          </tc-card>
        </aside>
      </div>
    </div>
  `,
})
export class ContributionsCollectComponent {
  private readonly service = inject(TreasurerService);
  private readonly notifications = inject(NotificationService);

  protected readonly methods = PAYMENT_METHODS;

  readonly resource = resource({
    loader: () => this.service.getContributions(),
  });

  readonly contributions = computed(() =>
    [...(this.resource.value() ?? [])].sort((a, b) => a.sessionId.localeCompare(b.sessionId)),
  );

  // Inline payment
  readonly paying = signal<string | null>(null);
  readonly amount = signal('');
  readonly amountTouched = signal(false);
  readonly method = signal<PaymentMethod>(PaymentMethod.CASH);
  readonly reference = signal('');
  readonly note = signal('');
  readonly submitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  // Advance payment
  readonly advanceMemberId = signal('');
  readonly advanceMemberTouched = signal(false);
  readonly advanceSessionIds = signal('');
  readonly advanceSessionsTouched = signal(false);
  readonly advanceAmount = signal('');
  readonly advanceAmountTouched = signal(false);
  readonly advanceMethod = signal<PaymentMethod>(PaymentMethod.MOBILE_MONEY);
  readonly advanceSubmitting = signal(false);

  amountError(c: Contribution): string {
    const n = Number(this.amount());
    if (!Number.isFinite(n) || n <= 0) return 'Montant invalide.';
    const remaining = c.expectedAmount - c.paidAmount;
    if (n > remaining) return `Montant supérieur au reste dû (${remaining}).`;
    return '';
  }

  readonly advanceMemberError = computed(() =>
    this.advanceMemberId().trim() ? '' : 'ID membre requis.',
  );
  readonly advanceSessionsError = computed(() =>
    this.advanceSessionIds().trim() ? '' : 'Au moins une séance requise.',
  );
  readonly advanceAmountError = computed(() => {
    const n = Number(this.advanceAmount());
    return Number.isFinite(n) && n > 0 ? '' : 'Montant invalide.';
  });

  statusKind(s: Contribution['status']): 'success' | 'warning' | 'danger' | 'neutral' {
    if (s === ContributionStatus.PAID) return 'success';
    if (s === ContributionStatus.PARTIAL || s === ContributionStatus.PENDING) return 'warning';
    if (s === ContributionStatus.LATE) return 'danger';
    return 'neutral';
  }

  methodLabel(m: PaymentMethod): string {
    return PAYMENT_METHOD_LABELS[m];
  }

  openPay(c: Contribution): void {
    this.paying.set(c.id);
    this.amount.set(String(c.expectedAmount - c.paidAmount));
    this.amountTouched.set(false);
    this.method.set(PaymentMethod.CASH);
    this.reference.set('');
    this.note.set('');
  }

  cancel(): void {
    this.paying.set(null);
  }

  async onPay(event: Event, c: Contribution): Promise<void> {
    event.preventDefault();
    this.amountTouched.set(true);
    this.errorMessage.set(null);
    if (this.amountError(c)) return;

    this.submitting.set(true);
    try {
      await this.service.payContribution(c.id, {
        amount: Number(this.amount()),
        paymentMethod: this.method(),
        reference: this.reference().trim() || undefined,
        note: this.note().trim() || undefined,
      });
      this.notifications.success('Cotisation encaissée.');
      this.paying.set(null);
      this.resource.reload();
    } catch (e: unknown) {
      this.errorMessage.set((e as { error?: { message?: string } })?.error?.message ?? 'Erreur.');
    } finally {
      this.submitting.set(false);
    }
  }

  async onAdvance(event: Event): Promise<void> {
    event.preventDefault();
    this.advanceMemberTouched.set(true);
    this.advanceSessionsTouched.set(true);
    this.advanceAmountTouched.set(true);
    this.errorMessage.set(null);
    if (this.advanceMemberError() || this.advanceSessionsError() || this.advanceAmountError()) return;

    const ids = this.advanceSessionIds()
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    this.advanceSubmitting.set(true);
    try {
      await this.service.payAdvance({
        memberId: this.advanceMemberId().trim(),
        sessionIds: ids,
        amount: Number(this.advanceAmount()),
        paymentMethod: this.advanceMethod(),
      });
      this.notifications.success(`${ids.length} séance(s) payée(s) en avance.`);
      this.advanceMemberId.set('');
      this.advanceSessionIds.set('');
      this.advanceAmount.set('');
      this.advanceMemberTouched.set(false);
      this.advanceSessionsTouched.set(false);
      this.advanceAmountTouched.set(false);
      this.resource.reload();
    } catch (e: unknown) {
      this.errorMessage.set((e as { error?: { message?: string } })?.error?.message ?? 'Erreur.');
    } finally {
      this.advanceSubmitting.set(false);
    }
  }
}

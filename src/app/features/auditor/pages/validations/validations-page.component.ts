import { ChangeDetectionStrategy, Component, computed, inject, resource, signal } from '@angular/core';
import { AlertComponent } from '../../../../shared/components/ui/alert/alert.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { EmptyStateComponent } from '../../../../shared/components/ui/empty-state/empty-state.component';
import { CurrencyXafPipe } from '../../../../shared/pipes/currency-xaf.pipe';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { NotificationService } from '../../../../core/services/notification.service';
import {
  FINANCIAL_OPERATION_TYPE_LABELS,
  FinancialOperationType,
  ValidationCategory,
} from '../../../../core/enums/validation.enum';
import type { PendingValidation, FinancialOperationValidation } from '../../../../shared/models/entities/validation.model';
import { AuditorService } from '../../services/auditor.service';
import { formatApiError } from '../../../../core/utils';

type OpinionStatus = 'FAVORABLE' | 'RESERVED' | 'UNFAVORABLE';

@Component({
  selector: 'tc-auditor-validations',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AlertComponent,
    BadgeComponent,
    ButtonComponent,
    CardComponent,
    EmptyStateComponent,
    CurrencyXafPipe,
    DateFormatPipe,
  ],
  template: `
    <div class="space-y-6">
      <header>
        <h1 class="text-2xl font-bold text-gray-900">Validations financières</h1>
        <p class="text-sm text-gray-500">
          Émettez votre opinion (favorable / réservée / défavorable) sur les opérations financières
          avant la décision du Président (RM-VT01, RM-VD01, RM-VP01).
        </p>
      </header>

      @if (errorMessage(); as err) {
        <tc-alert kind="error">{{ err }}</tc-alert>
      }

      <div class="flex flex-wrap gap-2 text-sm">
        <button
          class="rounded-lg px-3 py-1.5 border"
          [class.border-blue-500]="filter() === 'ALL'"
          [class.bg-blue-50]="filter() === 'ALL'"
          [class.border-gray-200]="filter() !== 'ALL'"
          (click)="filter.set('ALL')"
        >
          Toutes
        </button>
        @for (t of types; track t) {
          <button
            class="rounded-lg px-3 py-1.5 border"
            [class.border-blue-500]="filter() === t"
            [class.bg-blue-50]="filter() === t"
            [class.border-gray-200]="filter() !== t"
            (click)="filter.set(t)"
          >
            {{ TYPE_LABELS[t] }}
          </button>
        }
      </div>

      @if (resource.isLoading()) {
        <p class="text-sm text-gray-500">Chargement…</p>
      } @else if (filtered().length === 0) {
        <tc-card>
          <tc-empty-state title="Aucune validation" icon="✅" />
        </tc-card>
      } @else {
        <ul class="space-y-3">
          @for (v of filtered(); track v.id) {
            <li>
              <tc-card>
                <div class="space-y-3">
                  <div class="flex flex-wrap items-start justify-between gap-3">
                    <div class="min-w-0 flex-1">
                      <div class="flex items-center gap-2 flex-wrap">
                        <p class="font-semibold text-gray-900">{{ v.title }}</p>
                        <tc-badge kind="info">{{ TYPE_LABELS[v.operationType] }}</tc-badge>
                        @if (v.auditorOpinion) {
                          <tc-badge [kind]="opinionBadge(v.auditorOpinion.status)">
                            Opinion : {{ opinionLabel(v.auditorOpinion.status) }}
                          </tc-badge>
                        } @else {
                          <tc-badge kind="warning">À examiner</tc-badge>
                        }
                      </div>
                      <p class="text-sm text-gray-700 mt-1">{{ v.description }}</p>
                      <p class="text-xs text-gray-500 mt-1">
                        Réf : {{ v.reference }} · Soumis par {{ v.submittedByFullName }} le {{ v.submittedAt | tcDate: true }}
                      </p>
                    </div>
                    <div class="text-right shrink-0">
                      @if (v.amount) {
                        <p class="text-lg font-bold text-gray-900">{{ v.amount | xaf }}</p>
                      }
                    </div>
                  </div>

                  @if (v.cashBox) {
                    <div class="rounded-lg border border-gray-100 bg-gray-50 p-3">
                      <p class="text-xs font-medium text-gray-700">Impact caisse</p>
                      <p class="text-sm text-gray-700">
                        {{ v.cashBox.name }} : {{ v.cashBox.balanceBefore | xaf }} → {{ v.cashBox.balanceAfter | xaf }}
                        @if (v.cashBox.isSufficient) {
                          <span class="text-green-600">✓ suffisant</span>
                        } @else {
                          <span class="text-red-600">⚠ insuffisant</span>
                        }
                      </p>
                    </div>
                  }

                  @if (v.borrowerProfile) {
                    <div class="rounded-lg border border-gray-100 bg-gray-50 p-3">
                      <p class="text-xs font-medium text-gray-700">Profil emprunteur</p>
                      <p class="text-sm text-gray-700">
                        {{ v.borrowerProfile.fullName }} — membre depuis {{ v.borrowerProfile.memberSince | tcDate }}
                      </p>
                      <p class="text-xs text-gray-600 mt-1">
                        Cotisations à jour : {{ v.borrowerProfile.contributionsUpToDate ? '✓' : '✗' }} ·
                        Prêts précédents : {{ v.borrowerProfile.previousLoansCount }} ·
                        Sanctions impayées : {{ v.borrowerProfile.unpaidSanctionsCount }} ·
                        Assiduité : {{ (v.borrowerProfile.attendanceRate * 100).toFixed(0) }}%
                      </p>
                    </div>
                  }

                  @if (v.auditorOpinion) {
                    <div class="rounded-lg border p-3"
                      [class.border-green-200]="v.auditorOpinion.status === 'FAVORABLE'"
                      [class.bg-green-50]="v.auditorOpinion.status === 'FAVORABLE'"
                      [class.border-amber-200]="v.auditorOpinion.status === 'RESERVED'"
                      [class.bg-amber-50]="v.auditorOpinion.status === 'RESERVED'"
                      [class.border-red-200]="v.auditorOpinion.status === 'UNFAVORABLE'"
                      [class.bg-red-50]="v.auditorOpinion.status === 'UNFAVORABLE'"
                    >
                      <p class="text-xs font-medium text-gray-700">Votre opinion — {{ v.auditorOpinion.emittedAt | tcDate: true }}</p>
                      @if (v.auditorOpinion.comment) {
                        <p class="text-sm text-gray-700 mt-1">{{ v.auditorOpinion.comment }}</p>
                      }
                    </div>
                  } @else {
                    @if (openId() === v.id) {
                      <div class="space-y-2 rounded-lg border border-blue-200 bg-blue-50 p-3">
                        <p class="text-sm font-medium text-blue-900">Votre opinion</p>
                        <div class="space-y-1 text-sm">
                          <label class="flex items-center gap-2">
                            <input type="radio" name="op-{{ v.id }}" [checked]="opinion() === 'FAVORABLE'" (change)="opinion.set('FAVORABLE')" />
                            ✅ Favorable
                          </label>
                          <label class="flex items-center gap-2">
                            <input type="radio" name="op-{{ v.id }}" [checked]="opinion() === 'RESERVED'" (change)="opinion.set('RESERVED')" />
                            ⚠ Avec réserves
                          </label>
                          <label class="flex items-center gap-2">
                            <input type="radio" name="op-{{ v.id }}" [checked]="opinion() === 'UNFAVORABLE'" (change)="opinion.set('UNFAVORABLE')" />
                            ❌ Défavorable
                          </label>
                        </div>
                        <textarea
                          class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                          rows="3"
                          placeholder="Commentaire (obligatoire si réserves ou refus)"
                          [value]="comment()"
                          (input)="comment.set($any($event.target).value)"
                        ></textarea>
                        <div class="flex gap-2">
                          <tc-button variant="primary" size="sm" [loading]="acting() === v.id" (clicked)="submit(v)">
                            ✓ Émettre l'opinion
                          </tc-button>
                          <tc-button variant="ghost" size="sm" (clicked)="close()">Annuler</tc-button>
                        </div>
                      </div>
                    } @else {
                      <tc-button variant="primary" size="sm" (clicked)="open(v)">
                        Émettre une opinion
                      </tc-button>
                    }
                  }
                </div>
              </tc-card>
            </li>
          }
        </ul>
      }
    </div>
  `,
})
export class AuditorValidationsPageComponent {
  private readonly service = inject(AuditorService);
  private readonly notifications = inject(NotificationService);

  protected readonly TYPE_LABELS = FINANCIAL_OPERATION_TYPE_LABELS;
  protected readonly types: FinancialOperationType[] = [
    FinancialOperationType.LOAN_DISBURSEMENT,
    FinancialOperationType.FUND_TRANSFER,
    FinancialOperationType.EXPENSE_ABOVE_CAP,
  ];

  readonly resource = resource({
    loader: () => this.service.getValidations(),
  });

  readonly filter = signal<'ALL' | FinancialOperationType>('ALL');

  readonly filtered = computed(() => {
    const all = (this.resource.value() ?? []).filter(
      (v): v is FinancialOperationValidation => v.category === ValidationCategory.FINANCIAL_OPERATION,
    );
    const f = this.filter();
    return f === 'ALL' ? all : all.filter((v) => v.operationType === f);
  });

  readonly openId = signal<string | null>(null);
  readonly opinion = signal<OpinionStatus>('FAVORABLE');
  readonly comment = signal('');
  readonly acting = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);

  opinionBadge(s: OpinionStatus): 'success' | 'warning' | 'danger' {
    if (s === 'FAVORABLE') return 'success';
    if (s === 'RESERVED') return 'warning';
    return 'danger';
  }

  opinionLabel(s: OpinionStatus): string {
    const map = { FAVORABLE: 'Favorable', RESERVED: 'Réservée', UNFAVORABLE: 'Défavorable' };
    return map[s];
  }

  open(v: PendingValidation): void {
    this.openId.set(v.id);
    this.opinion.set('FAVORABLE');
    this.comment.set('');
  }

  close(): void {
    this.openId.set(null);
  }

  async submit(v: PendingValidation): Promise<void> {
    if ((this.opinion() === 'RESERVED' || this.opinion() === 'UNFAVORABLE') && !this.comment().trim()) {
      this.errorMessage.set('Un commentaire est requis pour réserves ou refus.');
      return;
    }
    this.acting.set(v.id);
    this.errorMessage.set(null);
    try {
      await this.service.emitOpinion(v.id, {
        status: this.opinion(),
        comment: this.comment().trim(),
      });
      this.notifications.success('Opinion émise.');
      this.openId.set(null);
      this.resource.reload();
    } catch (e: unknown) {
      this.errorMessage.set(formatApiError(e, 'Erreur.'));
    } finally {
      this.acting.set(null);
    }
  }
}

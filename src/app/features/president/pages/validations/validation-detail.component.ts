import { DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  resource,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AlertComponent } from '../../../../shared/components/ui/alert/alert.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { SpinnerComponent } from '../../../../shared/components/ui/spinner/spinner.component';
import { TextareaComponent } from '../../../../shared/components/ui/textarea/textarea.component';
import { CurrencyXafPipe } from '../../../../shared/pipes/currency-xaf.pipe';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { NotificationService } from '../../../../core/services/notification.service';
import {
  DECISION_TYPE_LABELS,
  DecisionType,
  FINANCIAL_OPERATION_TYPE_LABELS,
  ValidationCategory,
} from '../../../../core/enums/validation.enum';
import { PresidentService } from '../../services/president.service';
import type {
  AdhesionValidation,
  DocumentValidation,
  FinancialOperationValidation,
  PendingValidation,
} from '../../../../shared/models/entities/validation.model';

@Component({
  selector: 'tc-validation-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DecimalPipe,
    RouterLink,
    AlertComponent,
    BadgeComponent,
    ButtonComponent,
    CardComponent,
    SpinnerComponent,
    TextareaComponent,
    CurrencyXafPipe,
    DateFormatPipe,
  ],
  template: `
    <div class="space-y-6">
      <a routerLink="/president/validations" class="inline-flex items-center text-sm text-blue-600 hover:underline">
        ← Retour aux validations
      </a>

      @if (validationResource.isLoading()) {
        <div class="flex justify-center py-12"><tc-spinner size="lg" /></div>
      } @else if (validation(); as v) {
        <header class="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">{{ v.title }}</h1>
            <p class="text-sm text-gray-500">
              Soumis par {{ v.submittedByFullName }} · {{ v.submittedAt | tcDate: true }}
            </p>
          </div>
          <div class="flex gap-2">
            <tc-badge [kind]="priorityKind(v.priority)">{{ priorityLabel(v.priority) }}</tc-badge>
            <tc-badge kind="neutral">{{ categoryLabel(v.category) }}</tc-badge>
          </div>
        </header>

        @if (errorMessage(); as err) {
          <tc-alert kind="error">{{ err }}</tc-alert>
        }

        <div class="grid gap-6 lg:grid-cols-3">
          <div class="lg:col-span-2 space-y-6">
            @switch (v.category) {
              @case ('FINANCIAL_OPERATION') {
                @if (asFinancial(v); as op) {
                  <tc-card title="Opération" [subtitle]="financialSubtitle(op)">
                    <dl class="grid gap-3 text-sm sm:grid-cols-2">
                      <div>
                        <dt class="text-gray-500">Référence</dt>
                        <dd class="font-mono text-gray-900">{{ op.reference }}</dd>
                      </div>
                      <div>
                        <dt class="text-gray-500">Montant</dt>
                        <dd class="font-semibold text-gray-900">{{ op.amount | xaf }}</dd>
                      </div>
                      @if (op.durationMonths) {
                        <div>
                          <dt class="text-gray-500">Durée</dt>
                          <dd class="text-gray-900">{{ op.durationMonths }} mois</dd>
                        </div>
                      }
                      @if (op.interestRate !== undefined) {
                        <div>
                          <dt class="text-gray-500">Taux d'intérêt</dt>
                          <dd class="text-gray-900">{{ (op.interestRate * 100 | number: '1.0-2') }}%</dd>
                        </div>
                      }
                      @if (op.totalDue) {
                        <div>
                          <dt class="text-gray-500">Total à rembourser</dt>
                          <dd class="font-semibold text-gray-900">{{ op.totalDue | xaf }}</dd>
                        </div>
                      }
                    </dl>
                    <p class="mt-4 text-sm text-gray-600">{{ op.description }}</p>
                  </tc-card>

                  @if (op.borrowerProfile; as bp) {
                    <tc-card title="Profil de l'emprunteur">
                      <dl class="grid gap-3 text-sm sm:grid-cols-2">
                        <div>
                          <dt class="text-gray-500">Membre</dt>
                          <dd class="font-semibold text-gray-900">{{ bp.fullName }}</dd>
                        </div>
                        <div>
                          <dt class="text-gray-500">Membre depuis</dt>
                          <dd>{{ bp.memberSince | tcDate }}</dd>
                        </div>
                        <div>
                          <dt class="text-gray-500">Cotisations à jour</dt>
                          <dd [class]="bp.contributionsUpToDate ? 'text-green-600' : 'text-red-600'">
                            {{ bp.contributionsUpToDate ? '✓ À jour' : '✗ En retard' }}
                          </dd>
                        </div>
                        <div>
                          <dt class="text-gray-500">Prêts précédents</dt>
                          <dd>
                            {{ bp.previousLoansCount }}
                            ({{ bp.previousLoansRepaidOnTime }} remboursé(s) à temps)
                          </dd>
                        </div>
                        <div>
                          <dt class="text-gray-500">Sanctions impayées</dt>
                          <dd [class]="bp.unpaidSanctionsCount === 0 ? 'text-green-600' : 'text-red-600'">
                            {{ bp.unpaidSanctionsCount }}
                          </dd>
                        </div>
                        <div>
                          <dt class="text-gray-500">Taux de présence</dt>
                          <dd>{{ (bp.attendanceRate * 100 | number: '1.0-0') }}%</dd>
                        </div>
                      </dl>
                    </tc-card>
                  }

                  @if (op.guarantors?.length) {
                    <tc-card title="Garants">
                      <ul class="space-y-2 text-sm">
                        @for (g of op.guarantors; track g.memberId) {
                          <li class="flex items-center justify-between">
                            <span class="font-medium text-gray-900">{{ g.fullName }}</span>
                            <span [class]="g.approved ? 'text-green-600' : 'text-amber-600'">
                              {{ g.approved ? '✓ Accepté' : '⏳ En attente' }}
                            </span>
                          </li>
                        }
                      </ul>
                    </tc-card>
                  }

                  @if (op.cashBox; as cb) {
                    <tc-card title="Impact sur la caisse">
                      <dl class="grid gap-3 text-sm sm:grid-cols-3">
                        <div>
                          <dt class="text-gray-500">Caisse</dt>
                          <dd class="font-semibold text-gray-900">{{ cb.name }}</dd>
                        </div>
                        <div>
                          <dt class="text-gray-500">Avant opération</dt>
                          <dd>{{ cb.balanceBefore | xaf }}</dd>
                        </div>
                        <div>
                          <dt class="text-gray-500">Après opération</dt>
                          <dd class="font-semibold" [class]="cb.isSufficient ? 'text-green-600' : 'text-red-600'">
                            {{ cb.balanceAfter | xaf }}
                          </dd>
                        </div>
                      </dl>
                      @if (!cb.isSufficient) {
                        <tc-alert kind="warning" title="Marge insuffisante">
                          La caisse passera sous le seuil de sécurité.
                        </tc-alert>
                      }
                    </tc-card>
                  }
                }
              }
              @case ('DOCUMENT') {
                @if (asDocument(v); as doc) {
                  <tc-card [title]="documentKindLabel(doc.documentKind)">
                    <dl class="grid gap-3 text-sm sm:grid-cols-2">
                      @if (doc.sessionNumber) {
                        <div>
                          <dt class="text-gray-500">Séance</dt>
                          <dd class="font-semibold text-gray-900">#{{ doc.sessionNumber }}</dd>
                        </div>
                      }
                      @if (doc.sessionDate) {
                        <div>
                          <dt class="text-gray-500">Date</dt>
                          <dd>{{ doc.sessionDate | tcDate: true }}</dd>
                        </div>
                      }
                      @if (doc.location) {
                        <div>
                          <dt class="text-gray-500">Lieu</dt>
                          <dd>{{ doc.location }}</dd>
                        </div>
                      }
                      @if (doc.beneficiary) {
                        <div>
                          <dt class="text-gray-500">Bénéficiaire de la cagnotte</dt>
                          <dd class="font-semibold text-gray-900">{{ doc.beneficiary }}</dd>
                        </div>
                      }
                    </dl>
                    <p class="mt-4 text-sm text-gray-600">{{ doc.description }}</p>
                  </tc-card>

                  @if (doc.agendaPoints?.length) {
                    <tc-card title="Contenu de l'ordre du jour">
                      <ol class="list-decimal pl-5 space-y-1 text-sm text-gray-700">
                        @for (point of doc.agendaPoints; track point.order) {
                          <li>{{ point.title }}</li>
                        }
                      </ol>
                    </tc-card>
                  }

                  @if (doc.previewSnippet) {
                    <tc-card title="Aperçu">
                      <p class="text-sm text-gray-700 italic">{{ doc.previewSnippet }}</p>
                      @if (doc.signedBySecretary) {
                        <p class="mt-3 text-xs text-green-600">
                          ✓ Signé par le Secrétaire le {{ doc.signedBySecretaryAt | tcDate: true }}
                        </p>
                      }
                    </tc-card>
                  }

                  @if (doc.attachments?.length) {
                    <tc-card title="Pièces jointes">
                      <ul class="space-y-1 text-sm">
                        @for (att of doc.attachments; track att.id) {
                          <li class="flex items-center gap-2 text-gray-700">📎 {{ att.name }}</li>
                        }
                      </ul>
                    </tc-card>
                  }
                }
              }
              @case ('ADHESION') {
                @if (asAdhesion(v); as ad) {
                  <tc-card title="Candidat">
                    <dl class="grid gap-3 text-sm sm:grid-cols-2">
                      <div>
                        <dt class="text-gray-500">Nom complet</dt>
                        <dd class="font-semibold text-gray-900">{{ ad.candidateFullName }}</dd>
                      </div>
                      <div>
                        <dt class="text-gray-500">Téléphone</dt>
                        <dd>{{ ad.candidatePhone }}</dd>
                      </div>
                      <div>
                        <dt class="text-gray-500">Email</dt>
                        <dd>{{ ad.candidateEmail }}</dd>
                      </div>
                      @if (ad.sponsorFullName) {
                        <div>
                          <dt class="text-gray-500">Parrain</dt>
                          <dd>{{ ad.sponsorFullName }}</dd>
                        </div>
                      }
                      <div>
                        <dt class="text-gray-500">Vote de l'assemblée</dt>
                        <dd>
                          @if (ad.votedByAssembly) {
                            <span [class]="ad.voteResult === 'APPROVED' ? 'text-green-600' : 'text-red-600'">
                              {{ ad.voteResult === 'APPROVED' ? '✓ Approuvé' : '✗ Refusé' }}
                            </span>
                          } @else {
                            <span class="text-amber-600">⏳ En attente</span>
                          }
                        </dd>
                      </div>
                    </dl>
                  </tc-card>
                }
              }
            }

            @if (isFinancialOrDocument(v) && opinionOf(v); as op) {
              <tc-card title="Avis du Commissaire aux Comptes">
                <div class="flex items-start gap-3">
                  <span class="inline-flex h-8 w-8 items-center justify-center rounded-full text-lg"
                    [class]="opinionBadgeClass(op.status)">
                    {{ op.status === 'FAVORABLE' ? '✓' : op.status === 'RESERVED' ? '⚠' : '✗' }}
                  </span>
                  <div>
                    <p class="font-semibold" [class]="opinionTextClass(op.status)">
                      {{ opinionLabel(op.status) }}
                    </p>
                    <p class="text-xs text-gray-500">
                      {{ op.userFullName }} · {{ op.emittedAt | tcDate: true }}
                    </p>
                    @if (op.comment) {
                      <p class="mt-2 text-sm text-gray-700 italic">« {{ op.comment }} »</p>
                    }
                  </div>
                </div>
              </tc-card>
            }
          </div>

          <aside class="space-y-4">
            <tc-card title="Votre décision">
              <div class="space-y-3">
                @for (opt of decisionOptions; track opt.value) {
                  <label class="flex items-start gap-3 cursor-pointer rounded-lg border p-3 hover:bg-gray-50"
                    [class.border-blue-500]="decision() === opt.value"
                    [class.bg-blue-50]="decision() === opt.value"
                    [class.border-gray-200]="decision() !== opt.value">
                    <input
                      type="radio"
                      name="decision"
                      class="mt-1"
                      [checked]="decision() === opt.value"
                      (change)="decision.set(opt.value)"
                    />
                    <span>
                      <span class="block text-sm font-semibold text-gray-900">{{ opt.label }}</span>
                      <span class="block text-xs text-gray-500">{{ opt.hint }}</span>
                    </span>
                  </label>
                }
              </div>

              <div class="mt-4">
                <tc-textarea
                  label="Commentaire"
                  [hint]="commentRequired() ? 'Obligatoire pour un refus ou un blocage.' : 'Optionnel.'"
                  [(value)]="comment"
                  [(touched)]="commentTouched"
                  [error]="commentError()"
                />
              </div>

              <div class="mt-4">
                <tc-button
                  variant="primary"
                  [fullWidth]="true"
                  [loading]="submitting()"
                  [disabled]="!decision()"
                  (clicked)="onSubmit()"
                >
                  Valider ma décision
                </tc-button>
              </div>
            </tc-card>
          </aside>
        </div>
      } @else {
        <tc-card>Validation introuvable.</tc-card>
      }
    </div>
  `,
})
export class ValidationDetailComponent {
  readonly id = input.required<string>();

  private readonly service = inject(PresidentService);
  private readonly notifications = inject(NotificationService);
  private readonly router = inject(Router);

  readonly validationResource = resource({
    params: () => this.id(),
    loader: ({ params }) => this.service.getValidation(params),
  });

  readonly validation = computed(() => this.validationResource.value());

  readonly decision = signal<DecisionType | null>(null);
  readonly comment = signal('');
  readonly commentTouched = signal(false);
  readonly submitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly decisionOptions: { value: DecisionType; label: string; hint: string }[] = [
    {
      value: DecisionType.APPROVED,
      label: '✓ Approuver',
      hint: "Autoriser l'opération / publier le document.",
    },
    {
      value: DecisionType.REJECTED,
      label: '✗ Refuser',
      hint: 'Rejeter définitivement (commentaire requis).',
    },
    {
      value: DecisionType.BLOCKED,
      label: '⛔ Bloquer',
      hint: 'Demander des informations complémentaires (commentaire requis).',
    },
  ];

  readonly commentRequired = computed(
    () => this.decision() === DecisionType.REJECTED || this.decision() === DecisionType.BLOCKED,
  );

  readonly commentError = computed(() =>
    this.commentRequired() && this.comment().trim().length === 0
      ? 'Un commentaire est requis pour cette décision.'
      : '',
  );

  asFinancial(v: PendingValidation): FinancialOperationValidation | null {
    return v.category === ValidationCategory.FINANCIAL_OPERATION ? v : null;
  }
  asDocument(v: PendingValidation): DocumentValidation | null {
    return v.category === ValidationCategory.DOCUMENT ? v : null;
  }
  asAdhesion(v: PendingValidation): AdhesionValidation | null {
    return v.category === ValidationCategory.ADHESION ? v : null;
  }

  isFinancialOrDocument(v: PendingValidation): boolean {
    return (
      v.category === ValidationCategory.FINANCIAL_OPERATION ||
      v.category === ValidationCategory.DOCUMENT
    );
  }

  opinionOf(v: PendingValidation) {
    return 'auditorOpinion' in v ? v.auditorOpinion : undefined;
  }

  opinionLabel(status: 'FAVORABLE' | 'RESERVED' | 'UNFAVORABLE'): string {
    return { FAVORABLE: 'Avis favorable', RESERVED: 'Avec réserves', UNFAVORABLE: 'Défavorable' }[status];
  }

  opinionBadgeClass(status: 'FAVORABLE' | 'RESERVED' | 'UNFAVORABLE'): string {
    return {
      FAVORABLE: 'bg-green-100 text-green-700',
      RESERVED: 'bg-amber-100 text-amber-700',
      UNFAVORABLE: 'bg-red-100 text-red-700',
    }[status];
  }

  opinionTextClass(status: 'FAVORABLE' | 'RESERVED' | 'UNFAVORABLE'): string {
    return {
      FAVORABLE: 'text-green-700',
      RESERVED: 'text-amber-700',
      UNFAVORABLE: 'text-red-700',
    }[status];
  }

  documentKindLabel(kind: 'AGENDA' | 'MINUTES' | 'ADHESION_FILE'): string {
    return { AGENDA: "Ordre du jour", MINUTES: 'Procès-verbal', ADHESION_FILE: 'Dossier adhésion' }[kind];
  }

  financialSubtitle(op: FinancialOperationValidation): string {
    return FINANCIAL_OPERATION_TYPE_LABELS[op.operationType];
  }

  categoryLabel(category: PendingValidation['category']): string {
    return {
      FINANCIAL_OPERATION: 'Opération financière',
      DOCUMENT: 'Document',
      ADHESION: 'Adhésion',
      RESIGNATION: 'Démission',
    }[category];
  }

  priorityKind(priority: PendingValidation['priority']): 'danger' | 'warning' | 'info' | 'neutral' {
    return ({
      CRITICAL: 'danger',
      HIGH: 'warning',
      NORMAL: 'info',
      LOW: 'neutral',
    } as const)[priority];
  }

  priorityLabel(priority: PendingValidation['priority']): string {
    return { CRITICAL: 'Critique', HIGH: 'Haute', NORMAL: 'Normale', LOW: 'Basse' }[priority];
  }

  async onSubmit(): Promise<void> {
    this.commentTouched.set(true);
    this.errorMessage.set(null);

    const decision = this.decision();
    if (!decision) return;

    if (this.commentError()) {
      return;
    }

    this.submitting.set(true);
    try {
      await this.service.decideValidation(this.id(), {
        decision,
        comment: this.comment().trim() || undefined,
      });
      this.notifications.success(
        `Décision « ${DECISION_TYPE_LABELS[decision]} » enregistrée.`,
        'Validation traitée',
      );
      await this.router.navigateByUrl('/president/validations');
    } catch (error: unknown) {
      const message =
        (error as { error?: { message?: string } })?.error?.message ?? "Erreur lors de l'enregistrement.";
      this.errorMessage.set(message);
    } finally {
      this.submitting.set(false);
    }
  }
}

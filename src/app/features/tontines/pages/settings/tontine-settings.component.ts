import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  resource,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';

import { AlertComponent } from '../../../../shared/components/ui/alert/alert.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { EmptyStateComponent } from '../../../../shared/components/ui/empty-state/empty-state.component';
import { InputComponent } from '../../../../shared/components/ui/input/input.component';
import { SpinnerComponent } from '../../../../shared/components/ui/spinner/spinner.component';
import { TextareaComponent } from '../../../../shared/components/ui/textarea/textarea.component';
import { CurrencyXafPipe } from '../../../../shared/pipes/currency-xaf.pipe';
import { NotificationService } from '../../../../core/services/notification.service';
import { formatApiError } from '../../../../core/utils';
import {
  TONTINE_STATUS_LABELS,
  TontineStatus,
} from '../../../../core/enums/tontine-status.enum';
import type {
  ContributionFrequency,
  Tontine,
  TontineRules,
} from '../../../../shared/models/entities/tontine.model';
import { TontineService } from '../../services/tontine.service';

@Component({
  selector: 'tc-tontine-settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AlertComponent,
    BadgeComponent,
    ButtonComponent,
    CardComponent,
    EmptyStateComponent,
    InputComponent,
    SpinnerComponent,
    TextareaComponent,
    CurrencyXafPipe,
  ],
  template: `
    <div class="mx-auto max-w-4xl space-y-6">
      <header>
        <h1 class="text-2xl font-bold text-gray-900">Paramètres de la tontine</h1>
        <p class="text-sm text-gray-500">
          Modifiez les informations, les paramètres financiers et le règlement intérieur.
        </p>
      </header>

      @if (resource.isLoading()) {
        <div class="flex justify-center py-12"><tc-spinner size="lg" /></div>
      } @else if (resource.error()) {
        <tc-alert kind="error">{{ loadError() }}</tc-alert>
      } @else if (!tontine()) {
        <tc-card>
          <tc-empty-state
            title="Aucune tontine à modifier"
            icon="🏦"
            description="Vous ne présidez aucune tontine pour le moment."
          />
        </tc-card>
      } @else {
        @if (errorMessage(); as err) {
          <tc-alert kind="error">{{ err }}</tc-alert>
        }

        <form class="space-y-6" (submit)="onSubmit($event)">
          <!-- Informations générales -->
          <tc-card title="Informations générales" subtitle="Identité publique de la tontine">
            <div class="space-y-4">
              <div class="flex flex-wrap items-center gap-2">
                <span class="text-sm text-gray-500">Statut actuel :</span>
                <tc-badge [kind]="statusBadge()">{{ statusLabel() }}</tc-badge>
              </div>

              <tc-input
                label="Nom de la tontine"
                [(value)]="name"
                [(touched)]="nameTouched"
                [error]="nameError()"
                [required]="true"
              />

              <tc-textarea
                label="Description"
                placeholder="Objectif et contexte de la tontine"
                [(value)]="description"
                [rows]="3"
              />

              <div>
                <label class="mb-1 block text-sm font-medium text-gray-700">Date de démarrage</label>
                <input
                  type="date"
                  class="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  [value]="startDate()"
                  (change)="startDate.set($any($event.target).value)"
                />
              </div>
            </div>
          </tc-card>

          <!-- Paramètres financiers -->
          <tc-card title="Paramètres financiers" subtitle="Montant, rythme et taille du groupe">
            <div class="space-y-4">
              <tc-input
                label="Montant de cotisation (XAF)"
                type="number"
                [(value)]="contributionAmountStr"
                [(touched)]="contributionAmountTouched"
                [error]="contributionAmountError()"
                [required]="true"
              />

              <div>
                <p class="mb-1 text-sm font-medium text-gray-700">Fréquence des cotisations</p>
                <div class="flex flex-wrap gap-4 text-sm">
                  <label class="flex items-center gap-2">
                    <input type="radio" name="freq" [checked]="frequency() === 'WEEKLY'" (change)="frequency.set('WEEKLY')" />
                    Hebdomadaire
                  </label>
                  <label class="flex items-center gap-2">
                    <input type="radio" name="freq" [checked]="frequency() === 'BIWEEKLY'" (change)="frequency.set('BIWEEKLY')" />
                    Bimensuelle
                  </label>
                  <label class="flex items-center gap-2">
                    <input type="radio" name="freq" [checked]="frequency() === 'MONTHLY'" (change)="frequency.set('MONTHLY')" />
                    Mensuelle
                  </label>
                </div>
              </div>

              <tc-input
                label="Nombre maximum de membres"
                type="number"
                [(value)]="maxMembersStr"
                [(touched)]="maxMembersTouched"
                [error]="maxMembersError()"
                [required]="true"
              />

              @if (maxMembersBelowCurrent()) {
                <tc-alert kind="warning">
                  La tontine compte déjà <strong>{{ tontine()!.memberCount }}</strong> membre(s).
                  Le maximum ne peut être inférieur.
                </tc-alert>
              }

              <tc-alert kind="info">
                Cagnotte estimée par tour : <strong>{{ cagnotteEstimate() | xaf }}</strong>
              </tc-alert>
            </div>
          </tc-card>

          <!-- Règlement intérieur -->
          <tc-card title="Règlement intérieur" subtitle="Sanctions, prêts et prélèvements">
            <div class="space-y-6">
              <section>
                <h3 class="mb-2 text-sm font-semibold text-gray-700">Sanctions</h3>
                <div class="grid gap-4 sm:grid-cols-3">
                  <tc-input label="Retard (XAF)" type="number" [(value)]="latePenaltyStr" />
                  <tc-input label="Absence (XAF)" type="number" [(value)]="absencePenaltyStr" />
                  <tc-input label="Cotisation tardive (XAF)" type="number" [(value)]="contributionLatePenaltyStr" />
                </div>
              </section>

              <section>
                <h3 class="mb-2 text-sm font-semibold text-gray-700">Prêts</h3>
                <div class="grid gap-4 sm:grid-cols-3">
                  <tc-input label="Plafond prêt (XAF)" type="number" [(value)]="loanMaxAmountStr" />
                  <tc-input label="Taux d'intérêt (%)" type="number" [(value)]="loanInterestRateStr" />
                  <tc-input label="Durée max (mois)" type="number" [(value)]="loanMaxDurationStr" />
                </div>
              </section>

              <section>
                <h3 class="mb-2 text-sm font-semibold text-gray-700">Caisses & dépenses</h3>
                <div class="grid gap-4 sm:grid-cols-3">
                  <tc-input label="Plafond dépense sans validation (XAF)" type="number" [(value)]="expenseCapStr" />
                  <tc-input label="Prélèvement secours (%)" type="number" [(value)]="emergencyDeductionStr" />
                  <tc-input label="Prélèvement fonctionnement (%)" type="number" [(value)]="operationsDeductionStr" />
                </div>
                @if (deductionsTotalError()) {
                  <p class="mt-2 text-xs text-red-600">
                    La somme des prélèvements ne peut dépasser 100% (actuel : {{ totalDeductions() }}%).
                  </p>
                }
              </section>
            </div>
          </tc-card>

          <div class="flex justify-end gap-3">
            <tc-button variant="ghost" type="button" (clicked)="cancel()">Annuler</tc-button>
            <tc-button
              type="submit"
              variant="primary"
              [loading]="submitting()"
              [disabled]="!canSubmit()"
            >
              Enregistrer les modifications
            </tc-button>
          </div>
        </form>
      }
    </div>
  `,
})
export class TontineSettingsComponent {
  private readonly service = inject(TontineService);
  private readonly notifications = inject(NotificationService);
  private readonly router = inject(Router);

  /** Charge la tontine présidée par l'utilisateur (la première de la liste `mine()`). */
  readonly resource = resource({
    loader: async () => {
      const mine = await this.service.mine();
      return mine[0] ?? null;
    },
  });

  readonly tontine = computed<Tontine | null>(() => this.resource.value() ?? null);
  readonly loadError = computed(() =>
    formatApiError(this.resource.error(), 'Impossible de charger la tontine.'),
  );

  // ── Form state ────────────────────────────────────────────────────────────
  readonly name = signal('');
  readonly nameTouched = signal(false);
  readonly description = signal('');
  readonly startDate = signal('');

  readonly contributionAmountStr = signal('0');
  readonly contributionAmountTouched = signal(false);
  readonly frequency = signal<ContributionFrequency>('MONTHLY');
  readonly maxMembersStr = signal('0');
  readonly maxMembersTouched = signal(false);

  readonly latePenaltyStr = signal('0');
  readonly absencePenaltyStr = signal('0');
  readonly contributionLatePenaltyStr = signal('0');
  readonly loanMaxAmountStr = signal('0');
  readonly loanInterestRateStr = signal('0');
  readonly loanMaxDurationStr = signal('0');
  readonly expenseCapStr = signal('0');
  readonly emergencyDeductionStr = signal('0');
  readonly operationsDeductionStr = signal('0');

  readonly submitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  constructor() {
    // Pré-remplit le formulaire dès que la tontine est chargée.
    effect(() => {
      const t = this.tontine();
      if (!t) return;
      this.name.set(t.name);
      this.description.set(t.description ?? '');
      this.startDate.set(t.startDate?.slice(0, 10) ?? '');
      this.contributionAmountStr.set(String(t.contributionAmount));
      this.frequency.set(t.frequency);
      this.maxMembersStr.set(String(t.maxMembers));
      const r = t.rules;
      if (r) {
        this.latePenaltyStr.set(String(r.latePenaltyAmount));
        this.absencePenaltyStr.set(String(r.absencePenaltyAmount));
        this.contributionLatePenaltyStr.set(String(r.contributionLatePenaltyAmount));
        this.loanMaxAmountStr.set(String(r.loanMaxAmount));
        this.loanInterestRateStr.set(String(r.loanInterestRatePercent));
        this.loanMaxDurationStr.set(String(r.loanMaxDurationMonths));
        this.expenseCapStr.set(String(r.expenseCapWithoutValidation));
        this.emergencyDeductionStr.set(String(r.emergencyDeductionPercent));
        this.operationsDeductionStr.set(String(r.operationsDeductionPercent));
      }
    });
  }

  // ── Derived numbers ─────────────────────────────────────────────────────────
  readonly contributionAmount = computed(() => Number(this.contributionAmountStr()) || 0);
  readonly maxMembers = computed(() => Number(this.maxMembersStr()) || 0);
  readonly emergencyDeduction = computed(() => Number(this.emergencyDeductionStr()) || 0);
  readonly operationsDeduction = computed(() => Number(this.operationsDeductionStr()) || 0);

  readonly totalDeductions = computed(
    () => this.emergencyDeduction() + this.operationsDeduction(),
  );
  readonly deductionsTotalError = computed(() => this.totalDeductions() > 100);

  readonly cagnotteEstimate = computed(() => this.contributionAmount() * this.maxMembers());

  // ── Validation ──────────────────────────────────────────────────────────────
  readonly nameError = computed(() => (this.name().trim() ? '' : 'Nom requis.'));
  readonly contributionAmountError = computed(() =>
    this.contributionAmount() > 0 ? '' : 'Montant requis.',
  );
  readonly maxMembersBelowCurrent = computed(() => {
    const t = this.tontine();
    return !!t && this.maxMembers() < t.memberCount;
  });
  readonly maxMembersError = computed(() => {
    if (this.maxMembers() < 3) return 'Au moins 3 membres.';
    if (this.maxMembersBelowCurrent()) return 'Inférieur au nombre de membres actuels.';
    return '';
  });

  readonly canSubmit = computed(
    () =>
      !this.nameError() &&
      !this.contributionAmountError() &&
      !this.maxMembersError() &&
      !this.deductionsTotalError(),
  );

  // ── Display helpers ──────────────────────────────────────────────────────────
  statusLabel(): string {
    const t = this.tontine();
    return t ? TONTINE_STATUS_LABELS[t.status] : '';
  }

  statusBadge(): 'success' | 'warning' | 'info' | 'danger' | 'neutral' {
    const s = this.tontine()?.status;
    if (s === TontineStatus.ACTIVE) return 'success';
    if (s === TontineStatus.DRAFT) return 'info';
    if (s === TontineStatus.PAUSED) return 'warning';
    if (s === TontineStatus.CLOSED || s === TontineStatus.COMPLETED) return 'neutral';
    return 'neutral';
  }

  // ── Actions ──────────────────────────────────────────────────────────────────
  cancel(): void {
    void this.router.navigateByUrl('/president/dashboard');
  }

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.nameTouched.set(true);
    this.contributionAmountTouched.set(true);
    this.maxMembersTouched.set(true);
    this.errorMessage.set(null);

    const t = this.tontine();
    if (!t || !this.canSubmit()) return;

    this.submitting.set(true);
    try {
      const rules: TontineRules = {
        latePenaltyAmount: Number(this.latePenaltyStr()) || 0,
        absencePenaltyAmount: Number(this.absencePenaltyStr()) || 0,
        contributionLatePenaltyAmount: Number(this.contributionLatePenaltyStr()) || 0,
        loanMaxAmount: Number(this.loanMaxAmountStr()) || 0,
        loanInterestRatePercent: Number(this.loanInterestRateStr()) || 0,
        loanMaxDurationMonths: Number(this.loanMaxDurationStr()) || 0,
        expenseCapWithoutValidation: Number(this.expenseCapStr()) || 0,
        emergencyDeductionPercent: this.emergencyDeduction(),
        operationsDeductionPercent: this.operationsDeduction(),
      };
      const updated = await this.service.update(t.id, {
        name: this.name().trim(),
        description: this.description().trim() || undefined,
        startDate: this.startDate(),
        contributionAmount: this.contributionAmount(),
        frequency: this.frequency(),
        maxMembers: this.maxMembers(),
        rules,
      });
      this.notifications.success(`Tontine "${updated.name}" mise à jour.`);
      this.resource.reload();
    } catch (e: unknown) {
      this.errorMessage.set(formatApiError(e, 'Erreur lors de la mise à jour.'));
    } finally {
      this.submitting.set(false);
    }
  }
}

import { ChangeDetectionStrategy, Component, computed, inject, resource, signal } from '@angular/core';
import { AlertComponent } from '../../../../shared/components/ui/alert/alert.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { EmptyStateComponent } from '../../../../shared/components/ui/empty-state/empty-state.component';
import { InputComponent } from '../../../../shared/components/ui/input/input.component';
import { CurrencyXafPipe } from '../../../../shared/pipes/currency-xaf.pipe';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { StatusLabelPipe } from '../../../../shared/pipes/status-label.pipe';
import { NotificationService } from '../../../../core/services/notification.service';
import {
  SANCTION_TYPE_LABELS,
  SanctionStatus,
  SanctionType,
} from '../../../../core/enums/sanction-type.enum';
import type {
  Sanction,
  SanctionSeverity,
} from '../../../../shared/models/entities/sanction.model';
import { CensorService } from '../../services/censor.service';
import { formatApiError } from '../../../../core/utils';

interface SanctionDraft {
  type: SanctionType;
  amount: number;
  reason: string;
  severity: SanctionSeverity;
  customLabel: string;
  isFinancial: boolean;
}

const PRESET_TYPES: { type: SanctionType; label: string; amount: number; isFinancial: boolean }[] = [
  { type: SanctionType.LATENESS, label: 'Retard', amount: 500, isFinancial: true },
  { type: SanctionType.ABSENCE, label: 'Absence non justifiée', amount: 1000, isFinancial: true },
  { type: SanctionType.DISCIPLINE, label: "Trouble à l'ordre", amount: 2000, isFinancial: true },
  { type: SanctionType.CONTRIBUTION_LATE, label: 'Retard cotisation', amount: 1500, isFinancial: true },
  { type: SanctionType.OTHER, label: 'Avertissement verbal', amount: 0, isFinancial: false },
  { type: SanctionType.OTHER, label: 'Blâme', amount: 0, isFinancial: false },
];

@Component({
  selector: 'tc-censor-sanctions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AlertComponent,
    BadgeComponent,
    ButtonComponent,
    CardComponent,
    EmptyStateComponent,
    InputComponent,
    CurrencyXafPipe,
    DateFormatPipe,
    StatusLabelPipe,
  ],
  template: `
    <div class="space-y-6">
      <header>
        <h1 class="text-2xl font-bold text-gray-900">Sanctions</h1>
        <p class="text-sm text-gray-500">
          Appliquez des sanctions pendant la séance active (RM-AS01). Le motif est obligatoire (RM-AS02).
        </p>
      </header>

      @if (errorMessage(); as err) {
        <tc-alert kind="error">{{ err }}</tc-alert>
      }

      <div class="grid gap-6 lg:grid-cols-3">
        <aside class="space-y-3">
          <tc-card title="Appliquer une sanction">
            <form class="space-y-3" (submit)="onSubmit($event)">
              <div>
                <label class="text-sm font-medium text-gray-700">Membre</label>
                <select
                  class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  [value]="selectedMemberId()"
                  (change)="selectedMemberId.set($any($event.target).value)"
                >
                  <option value="">— Sélectionner —</option>
                  @for (m of members(); track m.id) {
                    <option [value]="m.id">{{ m.firstName }} {{ m.lastName }}</option>
                  }
                </select>
              </div>

              <div>
                <p class="text-sm font-medium text-gray-700 mb-1">Type de sanction</p>
                <div class="space-y-1 text-sm">
                  @for (p of PRESET_TYPES; track $index) {
                    <label class="flex items-center justify-between gap-2">
                      <span class="flex items-center gap-2">
                        <input
                          type="radio"
                          name="preset"
                          [checked]="presetIndex() === $index"
                          (change)="selectPreset($index)"
                        />
                        {{ p.label }}
                      </span>
                      <span class="text-xs text-gray-500">{{ p.amount }} XAF</span>
                    </label>
                  }
                </div>
              </div>

              @if (currentDraft().isFinancial) {
                <tc-input
                  label="Montant (XAF)"
                  type="number"
                  [(value)]="amountStr"
                  [(touched)]="amountTouched"
                  [error]="amountError()"
                  [required]="true"
                />
              }

              <div>
                <p class="text-sm font-medium text-gray-700 mb-1">Gravité</p>
                <div class="flex gap-3 text-sm">
                  <label class="flex items-center gap-1">
                    <input type="radio" name="severity" [checked]="severity() === 'LOW'" (change)="severity.set('LOW')" />
                    Léger
                  </label>
                  <label class="flex items-center gap-1">
                    <input type="radio" name="severity" [checked]="severity() === 'MEDIUM'" (change)="severity.set('MEDIUM')" />
                    Moyen
                  </label>
                  <label class="flex items-center gap-1">
                    <input type="radio" name="severity" [checked]="severity() === 'HIGH'" (change)="severity.set('HIGH')" />
                    Grave
                  </label>
                </div>
              </div>

              <div>
                <label class="text-sm font-medium text-gray-700">Motif (obligatoire)</label>
                <textarea
                  class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  rows="3"
                  [value]="reason()"
                  (input)="reason.set($any($event.target).value); reasonTouched.set(true)"
                ></textarea>
                @if (reasonTouched() && !reason().trim()) {
                  <p class="text-xs text-red-600 mt-1">Motif requis (RM-AS02).</p>
                }
              </div>

              <tc-button type="submit" variant="primary" [fullWidth]="true" [loading]="submitting()">
                ⚖ Appliquer la sanction
              </tc-button>
              <p class="text-xs text-gray-500">
                Le membre sera notifié immédiatement (SMS, Push, Email).
              </p>
            </form>
          </tc-card>

          <tc-card title="Sanctions multiples">
            <p class="text-sm text-gray-600 mb-3">
              Pour appliquer plusieurs sanctions au même membre lors de la même séance (RM-SM01).
            </p>
            <a
              href="/censor/sanctions/multiple"
              class="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50"
            >
              ➕ Sanctions multiples
            </a>
          </tc-card>
        </aside>

        <div class="lg:col-span-2 space-y-3">
          <tc-card title="Historique des sanctions">
            @if (resource.isLoading()) {
              <p class="text-sm text-gray-500">Chargement…</p>
            } @else if (sanctions().length === 0) {
              <tc-empty-state title="Aucune sanction" icon="⚖" />
            } @else {
              <ul class="divide-y divide-gray-100">
                @for (s of sanctions(); track s.id) {
                  <li class="py-3 first:pt-0 last:pb-0">
                    <div class="flex flex-wrap items-start justify-between gap-3">
                      <div class="min-w-0 flex-1">
                        <div class="flex items-center gap-2 flex-wrap">
                          <p class="font-semibold text-gray-900">
                            {{ s.memberFullName ?? s.memberId }} — {{ s.customLabel ?? SANCTION_TYPE_LABELS[s.type] }}
                          </p>
                          <tc-badge [kind]="statusKind(s.status)">{{ s.status | statusLabel: 'sanction' }}</tc-badge>
                          @if (s.autoDetected) {
                            <tc-badge kind="neutral">Auto-détecté</tc-badge>
                          }
                          @if (s.severity) {
                            <span class="text-xs text-gray-500">[{{ severityLabel(s.severity) }}]</span>
                          }
                        </div>
                        <p class="text-sm text-gray-700 mt-1">{{ s.reason }}</p>
                        <p class="text-xs text-gray-500 mt-1">
                          Séance #{{ s.sessionNumber ?? '—' }} · Émise le {{ s.issuedAt | tcDate: true }}
                          @if (s.cancelledAt) {
                            · Annulée le {{ s.cancelledAt | tcDate }} par {{ s.cancelledByRole }}
                          }
                        </p>
                      </div>
                      <div class="text-right shrink-0">
                        @if (s.isFinancial !== false && s.amount > 0) {
                          <p class="text-lg font-bold text-gray-900">{{ s.amount | xaf }}</p>
                        } @else {
                          <tc-badge kind="neutral">Non financière</tc-badge>
                        }
                        @if (s.status !== 'CANCELLED' && s.status !== 'WAIVED' && !s.cancelledAt) {
                          <tc-button
                            variant="outline"
                            size="sm"
                            class="mt-2 block"
                            (clicked)="openCancel(s)"
                          >
                            🗑 Annuler
                          </tc-button>
                        }
                      </div>
                    </div>

                    @if (cancelling() === s.id) {
                      <div class="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 space-y-2">
                        <p class="text-sm font-medium text-amber-900">
                          Annuler cette sanction — un motif est obligatoire (RM-AN02).
                        </p>
                        <textarea
                          class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                          rows="2"
                          [value]="cancelReason()"
                          (input)="cancelReason.set($any($event.target).value)"
                          placeholder="Erreur de saisie, contestation acceptée, justificatif validé, etc."
                        ></textarea>
                        <div class="flex gap-2">
                          <tc-button
                            variant="danger"
                            size="sm"
                            [loading]="acting() === s.id + ':cancel'"
                            (clicked)="confirmCancel(s)"
                          >
                            ✓ Confirmer l'annulation
                          </tc-button>
                          <tc-button variant="ghost" size="sm" (clicked)="closeCancel()">
                            Annuler
                          </tc-button>
                        </div>
                      </div>
                    }
                  </li>
                }
              </ul>
            }
          </tc-card>
        </div>
      </div>
    </div>
  `,
})
export class CensorSanctionsPageComponent {
  private readonly service = inject(CensorService);
  private readonly notifications = inject(NotificationService);

  protected readonly SANCTION_TYPE_LABELS = SANCTION_TYPE_LABELS;
  protected readonly PRESET_TYPES = PRESET_TYPES;

  readonly resource = resource({
    loader: () => this.service.getSanctions(),
  });
  readonly sanctions = computed(() => this.resource.value() ?? []);

  readonly membersResource = resource({
    loader: () => this.service.getMembers(),
  });
  readonly members = computed(() => this.membersResource.value() ?? []);

  readonly selectedMemberId = signal('');
  readonly presetIndex = signal(0);
  readonly amountStr = signal('500');
  readonly amountTouched = signal(false);
  readonly reason = signal('');
  readonly reasonTouched = signal(false);
  readonly severity = signal<SanctionSeverity>('LOW');

  readonly submitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly cancelling = signal<string | null>(null);
  readonly cancelReason = signal('');
  readonly acting = signal<string | null>(null);

  readonly currentDraft = computed<SanctionDraft>(() => {
    const p = PRESET_TYPES[this.presetIndex()];
    return {
      type: p.type,
      amount: p.amount,
      reason: '',
      severity: this.severity(),
      customLabel: p.label,
      isFinancial: p.isFinancial,
    };
  });

  readonly amountError = computed(() => {
    const n = Number(this.amountStr());
    if (!Number.isFinite(n) || n < 0) return 'Montant invalide.';
    return '';
  });

  selectPreset(i: number): void {
    this.presetIndex.set(i);
    const p = PRESET_TYPES[i];
    this.amountStr.set(String(p.amount));
  }

  severityLabel(s: SanctionSeverity): string {
    return s === 'LOW' ? 'Léger' : s === 'MEDIUM' ? 'Moyen' : 'Grave';
  }

  statusKind(s: Sanction['status']): 'success' | 'warning' | 'danger' | 'info' | 'neutral' {
    if (s === SanctionStatus.PAID) return 'success';
    if (s === SanctionStatus.CONFIRMED) return 'info';
    if (s === SanctionStatus.PENDING) return 'warning';
    if (s === SanctionStatus.CONTESTED) return 'warning';
    if (s === SanctionStatus.WAIVED || s === SanctionStatus.CANCELLED) return 'neutral';
    return 'neutral';
  }

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.reasonTouched.set(true);
    this.amountTouched.set(true);
    this.errorMessage.set(null);
    if (!this.selectedMemberId()) {
      this.errorMessage.set('Sélectionnez un membre.');
      return;
    }
    if (!this.reason().trim()) return;
    const draft = this.currentDraft();
    if (draft.isFinancial && this.amountError()) return;

    this.submitting.set(true);
    try {
      await this.service.applySanction({
        memberId: this.selectedMemberId(),
        type: draft.type,
        amount: draft.isFinancial ? Number(this.amountStr()) : 0,
        reason: this.reason().trim(),
        severity: this.severity(),
        customLabel: draft.customLabel,
        isFinancial: draft.isFinancial,
      });
      this.notifications.success('Sanction appliquée.');
      this.reason.set('');
      this.reasonTouched.set(false);
      this.resource.reload();
    } catch (e: unknown) {
      this.errorMessage.set(formatApiError(e, 'Erreur.'));
    } finally {
      this.submitting.set(false);
    }
  }

  openCancel(s: Sanction): void {
    this.cancelling.set(s.id);
    this.cancelReason.set('');
  }

  closeCancel(): void {
    this.cancelling.set(null);
  }

  async confirmCancel(s: Sanction): Promise<void> {
    if (!this.cancelReason().trim()) {
      this.errorMessage.set("Motif d'annulation requis (RM-AN02).");
      return;
    }
    this.acting.set(`${s.id}:cancel`);
    this.errorMessage.set(null);
    try {
      await this.service.cancelSanction(s.id, this.cancelReason().trim());
      this.notifications.success('Sanction annulée.');
      this.cancelling.set(null);
      this.resource.reload();
    } catch (e: unknown) {
      this.errorMessage.set(formatApiError(e, 'Erreur.'));
    } finally {
      this.acting.set(null);
    }
  }
}

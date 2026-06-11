import { ChangeDetectionStrategy, Component, computed, inject, resource, signal } from '@angular/core';
import { AlertComponent } from '../../../../shared/components/ui/alert/alert.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { EmptyStateComponent } from '../../../../shared/components/ui/empty-state/empty-state.component';
import { InputComponent } from '../../../../shared/components/ui/input/input.component';
import { CurrencyXafPipe } from '../../../../shared/pipes/currency-xaf.pipe';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { NotificationService } from '../../../../core/services/notification.service';
import type { CensorReport } from '../../../../shared/models/entities/sanction.model';
import { CensorService } from '../../services/censor.service';
import { formatApiError } from '../../../../core/utils';

type Scope = 'LAST_SESSION' | 'CUSTOM_RANGE' | 'CYCLE';

@Component({
  selector: 'tc-censor-reports',
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
  ],
  template: `
    <div class="space-y-6">
      <header>
        <h1 class="text-2xl font-bold text-gray-900">Rapports du Censeur</h1>
        <p class="text-sm text-gray-500">
          Le rapport est généré automatiquement (RM-RC01). Vous pouvez ajouter des observations
          manuelles (RM-RC02). Exportable en PDF/Excel (RM-RC03).
        </p>
      </header>

      @if (errorMessage(); as err) {
        <tc-alert kind="error">{{ err }}</tc-alert>
      }

      <div class="grid gap-6 lg:grid-cols-3">
        <aside>
          <tc-card title="Générer un rapport">
            <form class="space-y-3" (submit)="onSubmit($event)">
              <div>
                <p class="text-sm font-medium text-gray-700 mb-1">Période</p>
                <div class="space-y-1 text-sm">
                  <label class="flex items-center gap-2">
                    <input type="radio" name="scope" [checked]="scope() === 'LAST_SESSION'" (change)="scope.set('LAST_SESSION')" />
                    Dernière séance
                  </label>
                  <label class="flex items-center gap-2">
                    <input type="radio" name="scope" [checked]="scope() === 'CUSTOM_RANGE'" (change)="scope.set('CUSTOM_RANGE')" />
                    Période personnalisée
                  </label>
                  <label class="flex items-center gap-2">
                    <input type="radio" name="scope" [checked]="scope() === 'CYCLE'" (change)="scope.set('CYCLE')" />
                    Cycle complet
                  </label>
                </div>
              </div>

              <tc-input
                label="Libellé période"
                [(value)]="periodLabel"
                hint="ex: Séance #6 — 25 mai 2026"
              />

              <div>
                <label class="text-sm font-medium text-gray-700">Observations</label>
                <textarea
                  class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  rows="4"
                  placeholder="Vos observations sur la discipline générale"
                  [value]="observations()"
                  (input)="observations.set($any($event.target).value)"
                ></textarea>
              </div>

              <tc-button type="submit" variant="primary" [fullWidth]="true" [loading]="submitting()">
                📄 Générer le rapport
              </tc-button>
            </form>
          </tc-card>
        </aside>

        <div class="lg:col-span-2 space-y-3">
          @if (resource.isLoading()) {
            <p class="text-sm text-gray-500">Chargement…</p>
          } @else if (reports().length === 0) {
            <tc-card>
              <tc-empty-state title="Aucun rapport" icon="📑" />
            </tc-card>
          } @else {
            @for (r of reports(); track r.id) {
              <tc-card>
                <div class="space-y-3">
                  <div class="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p class="font-semibold text-gray-900">{{ r.periodLabel }}</p>
                      <p class="text-xs text-gray-500 mt-1">
                        Généré le {{ r.generatedAt | tcDate: true }} · {{ r.authorFullName }}
                      </p>
                    </div>
                    <div class="flex gap-1">
                      <button type="button" class="rounded-lg border border-gray-200 px-2 py-1 text-xs hover:bg-gray-50">
                        📄 PDF
                      </button>
                      <button type="button" class="rounded-lg border border-gray-200 px-2 py-1 text-xs hover:bg-gray-50">
                        📊 Excel
                      </button>
                    </div>
                  </div>

                  <div class="grid gap-3 sm:grid-cols-3 text-sm">
                    <div class="rounded-lg border border-gray-100 p-3">
                      <p class="text-xs text-gray-500">Sanctions appliquées</p>
                      <p class="text-xl font-bold text-gray-900">{{ r.totalSanctions }}</p>
                      <p class="text-xs text-gray-500">Total : {{ r.totalAmount | xaf }}</p>
                    </div>
                    <div class="rounded-lg border border-gray-100 p-3">
                      <p class="text-xs text-gray-500">Impayées</p>
                      <p class="text-xl font-bold text-amber-600">{{ r.unpaidCount }}</p>
                      <p class="text-xs text-gray-500">{{ r.unpaidAmount | xaf }}</p>
                    </div>
                    <div class="rounded-lg border border-gray-100 p-3">
                      <p class="text-xs text-gray-500">Catégories</p>
                      <p class="text-xl font-bold text-gray-900">{{ r.breakdown.length }}</p>
                    </div>
                  </div>

                  @if (r.breakdown.length > 0) {
                    <div>
                      <p class="text-xs font-medium text-gray-700 mb-1">Répartition</p>
                      <ul class="space-y-1">
                        @for (b of r.breakdown; track b.type) {
                          <li class="flex items-center justify-between text-sm">
                            <span class="text-gray-700">{{ b.type }}</span>
                            <span>
                              <tc-badge kind="neutral">{{ b.count }}</tc-badge>
                              <span class="ml-2 font-semibold text-gray-900">{{ b.amount | xaf }}</span>
                            </span>
                          </li>
                        }
                      </ul>
                    </div>
                  }

                  <div>
                    <div class="flex items-center justify-between">
                      <p class="text-xs font-medium text-gray-700">Observations</p>
                      @if (editingId() !== r.id) {
                        <button class="text-xs text-blue-600 hover:underline" (click)="openEdit(r)">
                          ✏️ Modifier
                        </button>
                      }
                    </div>
                    @if (editingId() === r.id) {
                      <textarea
                        class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        rows="3"
                        [value]="editObservations()"
                        (input)="editObservations.set($any($event.target).value)"
                      ></textarea>
                      <div class="mt-2 flex gap-2">
                        <tc-button variant="primary" size="sm" [loading]="acting() === r.id" (clicked)="saveObs(r)">
                          ✓ Enregistrer
                        </tc-button>
                        <tc-button variant="ghost" size="sm" (clicked)="closeEdit()">Annuler</tc-button>
                      </div>
                    } @else {
                      <p class="text-sm text-gray-700 mt-1 whitespace-pre-wrap">
                        {{ r.observations || '—' }}
                      </p>
                    }
                  </div>
                </div>
              </tc-card>
            }
          }
        </div>
      </div>
    </div>
  `,
})
export class CensorReportsPageComponent {
  private readonly service = inject(CensorService);
  private readonly notifications = inject(NotificationService);

  readonly resource = resource({
    loader: () => this.service.getReports(),
  });
  readonly reports = computed(() =>
    [...(this.resource.value() ?? [])].sort(
      (a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime(),
    ),
  );

  readonly scope = signal<Scope>('LAST_SESSION');
  readonly periodLabel = signal('');
  readonly observations = signal('');
  readonly submitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly editingId = signal<string | null>(null);
  readonly editObservations = signal('');
  readonly acting = signal<string | null>(null);

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.errorMessage.set(null);
    this.submitting.set(true);
    try {
      await this.service.generateReport(
        this.scope(),
        this.periodLabel().trim() || undefined,
        this.observations().trim() || undefined,
      );
      this.notifications.success('Rapport généré.');
      this.periodLabel.set('');
      this.observations.set('');
      this.resource.reload();
    } catch (e: unknown) {
      this.errorMessage.set(formatApiError(e, 'Erreur.'));
    } finally {
      this.submitting.set(false);
    }
  }

  openEdit(r: CensorReport): void {
    this.editingId.set(r.id);
    this.editObservations.set(r.observations ?? '');
  }

  closeEdit(): void {
    this.editingId.set(null);
  }

  async saveObs(r: CensorReport): Promise<void> {
    this.acting.set(r.id);
    this.errorMessage.set(null);
    try {
      await this.service.updateReportObservations(r.id, this.editObservations());
      this.notifications.success('Observations mises à jour.');
      this.editingId.set(null);
      this.resource.reload();
    } catch (e: unknown) {
      this.errorMessage.set(formatApiError(e, 'Erreur.'));
    } finally {
      this.acting.set(null);
    }
  }
}

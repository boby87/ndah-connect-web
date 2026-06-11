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
import { AuditorService } from '../../services/auditor.service';
import { formatApiError } from '../../../../core/utils';

type Scope = 'LAST_SESSION' | 'PERIOD' | 'CYCLE';

@Component({
  selector: 'tc-auditor-reports',
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
        <h1 class="text-2xl font-bold text-gray-900">Rapports du Commissaire</h1>
        <p class="text-sm text-gray-500">
          Générez vos rapports de séance, période ou cycle. Intégrés au PV de la séance.
        </p>
      </header>

      @if (errorMessage(); as err) {
        <tc-alert kind="error">{{ err }}</tc-alert>
      }

      <div class="grid gap-6 lg:grid-cols-3">
        <aside>
          <tc-card title="Nouveau rapport">
            <form class="space-y-3" (submit)="onSubmit($event)">
              <div>
                <label class="text-xs font-medium text-gray-700">Périmètre</label>
                <select
                  class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  [value]="scope()"
                  (change)="scope.set($any($event.target).value)"
                >
                  <option value="LAST_SESSION">Dernière séance</option>
                  <option value="PERIOD">Période personnalisée</option>
                  <option value="CYCLE">Cycle complet</option>
                </select>
              </div>

              <tc-input
                label="Libellé période"
                [(value)]="periodLabel"
                hint="ex: Séance #6 — 25 mai 2026"
              />

              <div>
                <label class="text-xs font-medium text-gray-700">Observations</label>
                <textarea
                  class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  rows="4"
                  [value]="observations()"
                  (input)="observations.set($any($event.target).value)"
                ></textarea>
              </div>

              <tc-button type="submit" variant="primary" [fullWidth]="true" [loading]="submitting()">
                📄 Générer
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
                      <p class="font-semibold text-gray-900">{{ r.reference }}</p>
                      <p class="text-xs text-gray-500 mt-1">
                        {{ r.periodLabel }} · généré le {{ r.generatedAt | tcDate: true }}
                      </p>
                      <tc-badge kind="info" class="mt-1">{{ r.scope }}</tc-badge>
                    </div>
                    <div class="flex gap-1">
                      <button class="text-xs rounded-lg border border-gray-200 px-2 py-1 hover:bg-gray-50">📄 PDF</button>
                      <button class="text-xs rounded-lg border border-gray-200 px-2 py-1 hover:bg-gray-50">📊 Excel</button>
                    </div>
                  </div>

                  <div class="grid gap-3 sm:grid-cols-3 text-sm">
                    <div class="rounded-lg border border-gray-100 p-3">
                      <p class="text-xs text-gray-500">Solde total</p>
                      <p class="text-lg font-bold text-gray-900">{{ r.totalBalance | xaf }}</p>
                    </div>
                    <div class="rounded-lg border border-gray-100 p-3">
                      <p class="text-xs text-gray-500">Validations</p>
                      <p class="text-lg font-bold text-blue-600">{{ r.validationsCount }}</p>
                    </div>
                    <div class="rounded-lg border border-gray-100 p-3">
                      <p class="text-xs text-gray-500">Anomalies / Reco</p>
                      <p class="text-lg font-bold text-amber-600">{{ r.anomaliesCount }} / {{ r.recommendationsCount }}</p>
                    </div>
                  </div>

                  <div>
                    <p class="text-xs font-medium text-gray-700 mb-1">État des caisses</p>
                    <ul class="space-y-1">
                      @for (cb of r.cashBoxSnapshot; track cb.name) {
                        <li class="flex justify-between text-sm">
                          <span class="text-gray-700">{{ cb.name }}</span>
                          <span class="font-semibold text-gray-900">{{ cb.balance | xaf }}</span>
                        </li>
                      }
                    </ul>
                  </div>

                  @if (r.observations) {
                    <div class="rounded-lg border border-gray-100 bg-gray-50 p-3">
                      <p class="text-xs font-medium text-gray-700">Observations</p>
                      <p class="text-sm text-gray-700 mt-1 whitespace-pre-wrap">{{ r.observations }}</p>
                    </div>
                  }
                </div>
              </tc-card>
            }
          }
        </div>
      </div>
    </div>
  `,
})
export class AuditorReportsPageComponent {
  private readonly service = inject(AuditorService);
  private readonly notifications = inject(NotificationService);

  readonly resource = resource({
    loader: () => this.service.getReports(),
  });
  readonly reports = computed(() => this.resource.value() ?? []);

  readonly scope = signal<Scope>('LAST_SESSION');
  readonly periodLabel = signal('');
  readonly observations = signal('');
  readonly submitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.errorMessage.set(null);
    this.submitting.set(true);
    try {
      await this.service.generateReport(
        this.scope(),
        this.periodLabel().trim() || 'Période',
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
}

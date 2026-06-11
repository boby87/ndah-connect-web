import { ChangeDetectionStrategy, Component, computed, inject, resource, signal } from '@angular/core';
import { AlertComponent } from '../../../../shared/components/ui/alert/alert.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { EmptyStateComponent } from '../../../../shared/components/ui/empty-state/empty-state.component';
import { InputComponent } from '../../../../shared/components/ui/input/input.component';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { NotificationService } from '../../../../core/services/notification.service';
import { TreasurerService } from '../../services/treasurer.service';
import { formatApiError } from '../../../../core/utils';

@Component({
  selector: 'tc-treasurer-reports',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AlertComponent,
    BadgeComponent,
    ButtonComponent,
    CardComponent,
    EmptyStateComponent,
    InputComponent,
    DateFormatPipe,
  ],
  template: `
    <div class="space-y-6">
      <header>
        <h1 class="text-2xl font-bold text-gray-900">Rapports financiers</h1>
        <p class="text-sm text-gray-500">
          Générez et consultez les rapports de trésorerie (exportables en PDF et Excel).
        </p>
      </header>

      @if (errorMessage(); as err) {
        <tc-alert kind="error">{{ err }}</tc-alert>
      }

      <div class="grid gap-6 lg:grid-cols-3">
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
                <div class="flex flex-wrap items-start justify-between gap-3">
                  <div class="min-w-0 flex-1">
                    <p class="font-semibold text-gray-900">{{ r.title }}</p>
                    <p class="text-xs text-gray-500 mt-1">
                      Par {{ r.authorFullName }} · {{ r.generatedAt | tcDate: true }}
                    </p>
                    <tc-badge kind="info" class="mt-1">{{ r.periodLabel }}</tc-badge>
                  </div>
                  <div class="flex gap-2 shrink-0">
                    @if (r.downloadUrlPdf) {
                      <button type="button" class="rounded-lg border border-gray-200 px-3 py-1.5 text-sm hover:bg-gray-50" (click)="download(r.id, 'pdf')">
                        📄 PDF
                      </button>
                    }
                    @if (r.downloadUrlExcel) {
                      <button type="button" class="rounded-lg border border-gray-200 px-3 py-1.5 text-sm hover:bg-gray-50" (click)="download(r.id, 'excel')">
                        📊 Excel
                      </button>
                    }
                  </div>
                </div>
              </tc-card>
            }
          }
        </div>

        <aside>
          <tc-card title="Générer un rapport">
            <form class="space-y-3" (submit)="onSubmit($event)">
              <tc-input
                label="Période"
                [(value)]="period"
                [(touched)]="periodTouched"
                [error]="periodError()"
                hint="ex: Mai 2026"
                [required]="true"
              />
              <div>
                <p class="text-sm font-medium text-gray-700 mb-1">Type</p>
                <div class="space-y-1 text-sm">
                  <label class="flex items-center gap-2">
                    <input type="radio" name="type" [checked]="type() === 'SUMMARY'" (change)="type.set('SUMMARY')" />
                    Bilan synthétique
                  </label>
                  <label class="flex items-center gap-2">
                    <input type="radio" name="type" [checked]="type() === 'DETAILED'" (change)="type.set('DETAILED')" />
                    Rapport détaillé
                  </label>
                </div>
              </div>
              <tc-button type="submit" variant="primary" [fullWidth]="true" [loading]="submitting()">
                Générer
              </tc-button>
            </form>
          </tc-card>
        </aside>
      </div>
    </div>
  `,
})
export class TreasurerReportsPageComponent {
  private readonly service = inject(TreasurerService);
  private readonly notifications = inject(NotificationService);

  readonly resource = resource({
    loader: () => this.service.getReports(),
  });

  readonly reports = computed(() =>
    [...(this.resource.value() ?? [])].sort(
      (a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime(),
    ),
  );

  readonly period = signal('');
  readonly periodTouched = signal(false);
  readonly type = signal<'SUMMARY' | 'DETAILED'>('SUMMARY');

  readonly submitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly periodError = computed(() => (this.period().trim() ? '' : 'Période requise.'));

  download(id: string, kind: 'pdf' | 'excel'): void {
    this.notifications.info(`Téléchargement ${kind.toUpperCase()} du rapport ${id} simulé.`);
  }

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.periodTouched.set(true);
    this.errorMessage.set(null);
    if (this.periodError()) return;

    this.submitting.set(true);
    try {
      await this.service.generateReport(this.period().trim(), this.type());
      this.notifications.success('Rapport généré.');
      this.period.set('');
      this.periodTouched.set(false);
      this.resource.reload();
    } catch (e: unknown) {
      this.errorMessage.set(formatApiError(e, 'Erreur.'));
    } finally {
      this.submitting.set(false);
    }
  }
}

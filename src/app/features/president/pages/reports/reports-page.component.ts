import { ChangeDetectionStrategy, Component, computed, inject, resource, signal } from '@angular/core';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { EmptyStateComponent } from '../../../../shared/components/ui/empty-state/empty-state.component';
import { SpinnerComponent } from '../../../../shared/components/ui/spinner/spinner.component';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { NotificationService } from '../../../../core/services/notification.service';
import {
  REPORT_CATEGORY_LABELS,
  type ReportCategory,
  type ReportEntry,
} from '../../../../shared/models/entities/report.model';
import { PresidentService } from '../../services/president.service';

type Filter = 'ALL' | ReportCategory;

@Component({
  selector: 'tc-reports-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BadgeComponent,
    CardComponent,
    EmptyStateComponent,
    SpinnerComponent,
    DateFormatPipe,
  ],
  template: `
    <div class="space-y-6">
      <header>
        <h1 class="text-2xl font-bold text-gray-900">Rapports</h1>
        <p class="text-sm text-gray-500">
          Consultez tous les rapports disponibles : trésorerie, audit, censeur, périodiques.
        </p>
      </header>

      <div class="flex flex-wrap gap-2">
        @for (opt of filterOptions; track opt.value) {
          <button
            type="button"
            [class]="filterClass(opt.value)"
            (click)="filter.set(opt.value)"
          >
            {{ opt.label }}
            <span class="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white/20 px-1.5 text-xs">
              {{ countFor(opt.value) }}
            </span>
          </button>
        }
      </div>

      @if (resource.isLoading()) {
        <div class="flex justify-center py-12"><tc-spinner size="lg" /></div>
      } @else if (visibleReports().length === 0) {
        <tc-card>
          <tc-empty-state title="Aucun rapport" icon="📊" />
        </tc-card>
      } @else {
        <ul class="space-y-3">
          @for (r of visibleReports(); track r.id) {
            <li>
              <tc-card>
                <div class="flex flex-wrap items-start justify-between gap-3">
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-2 flex-wrap">
                      <p class="font-semibold text-gray-900">{{ r.title }}</p>
                      <tc-badge kind="info">{{ categoryLabel(r.category) }}</tc-badge>
                      <tc-badge kind="neutral">{{ r.periodLabel }}</tc-badge>
                    </div>
                    @if (r.description) {
                      <p class="mt-1 text-sm text-gray-700">{{ r.description }}</p>
                    }
                    <p class="text-xs text-gray-500 mt-1">
                      Par {{ r.authorFullName }} · {{ r.generatedAt | tcDate: true }}
                    </p>

                    @if (r.metricsJson) {
                      <details class="mt-3">
                        <summary class="text-sm text-blue-600 cursor-pointer">Voir les métriques</summary>
                        <dl class="mt-2 grid gap-2 sm:grid-cols-3 text-sm">
                          @for (entry of metricsEntries(r); track entry[0]) {
                            <div>
                              <dt class="text-xs text-gray-500">{{ entry[0] }}</dt>
                              <dd class="font-medium text-gray-900">{{ entry[1] }}</dd>
                            </div>
                          }
                        </dl>
                      </details>
                    }
                  </div>
                  <div class="flex gap-2 shrink-0">
                    @if (r.downloadUrlPdf) {
                      <button type="button" class="rounded-lg border border-gray-200 px-3 py-1.5 text-sm hover:bg-gray-50" (click)="exportPdf(r)">
                        📄 PDF
                      </button>
                    }
                    @if (r.downloadUrlExcel) {
                      <button type="button" class="rounded-lg border border-gray-200 px-3 py-1.5 text-sm hover:bg-gray-50" (click)="exportExcel(r)">
                        📊 Excel
                      </button>
                    }
                  </div>
                </div>
              </tc-card>
            </li>
          }
        </ul>
      }
    </div>
  `,
})
export class ReportsPageComponent {
  private readonly service = inject(PresidentService);
  private readonly notifications = inject(NotificationService);

  readonly filter = signal<Filter>('ALL');

  readonly filterOptions: { label: string; value: Filter }[] = [
    { label: 'Tout', value: 'ALL' },
    { label: 'Trésorerie', value: 'TREASURY' },
    { label: 'Audit', value: 'AUDIT' },
    { label: 'Censeur', value: 'CENSOR' },
    { label: 'Périodiques', value: 'PERIODIC' },
  ];

  readonly resource = resource({
    loader: () => this.service.getReports(),
  });

  readonly reports = computed(() => this.resource.value() ?? []);

  readonly visibleReports = computed(() => {
    const f = this.filter();
    if (f === 'ALL') return this.reports();
    return this.reports().filter((r) => r.category === f);
  });

  countFor(value: Filter): number {
    if (value === 'ALL') return this.reports().length;
    return this.reports().filter((r) => r.category === value).length;
  }

  filterClass(value: Filter): string {
    const base = 'inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium border';
    return `${base} ${this.filter() === value ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`;
  }

  categoryLabel(c: ReportCategory): string {
    return REPORT_CATEGORY_LABELS[c];
  }

  metricsEntries(r: ReportEntry): [string, string | number][] {
    return Object.entries(r.metricsJson ?? {});
  }

  exportPdf(r: ReportEntry): void {
    this.notifications.info(`Téléchargement PDF de « ${r.title} » simulé.`, 'Export');
  }

  exportExcel(r: ReportEntry): void {
    this.notifications.info(`Téléchargement Excel de « ${r.title} » simulé.`, 'Export');
  }
}

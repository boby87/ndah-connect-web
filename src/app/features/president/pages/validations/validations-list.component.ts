import { ChangeDetectionStrategy, Component, computed, inject, resource, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { EmptyStateComponent } from '../../../../shared/components/ui/empty-state/empty-state.component';
import { SpinnerComponent } from '../../../../shared/components/ui/spinner/spinner.component';
import { CurrencyXafPipe } from '../../../../shared/pipes/currency-xaf.pipe';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import {
  FINANCIAL_OPERATION_TYPE_LABELS,
  VALIDATION_CATEGORY_LABELS,
  ValidationCategory,
} from '../../../../core/enums/validation.enum';
import { PresidentService } from '../../services/president.service';
import type { PendingValidation } from '../../../../shared/models/entities/validation.model';

type Filter = 'ALL' | ValidationCategory;

@Component({
  selector: 'tc-validations-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    BadgeComponent,
    CardComponent,
    EmptyStateComponent,
    SpinnerComponent,
    CurrencyXafPipe,
    DateFormatPipe,
  ],
  template: `
    <div class="space-y-6">
      <header>
        <h1 class="text-2xl font-bold text-gray-900">Validations en attente</h1>
        <p class="text-sm text-gray-500">
          Examinez et décidez des opérations financières, documents et adhésions.
        </p>
      </header>

      <div class="flex flex-wrap gap-2">
        @for (option of filterOptions; track option.value) {
          <button
            type="button"
            [class]="filterButtonClass(option.value)"
            (click)="filter.set(option.value)"
          >
            {{ option.label }}
            <span class="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white/20 px-1.5 text-xs">
              {{ countFor(option.value) }}
            </span>
          </button>
        }
      </div>

      @if (resource.isLoading()) {
        <div class="flex justify-center py-12"><tc-spinner size="lg" /></div>
      } @else if (visibleItems().length === 0) {
        <tc-card>
          <tc-empty-state title="Aucune validation en attente" icon="✓" description="Tout est à jour pour cette catégorie." />
        </tc-card>
      } @else {
        <ul class="space-y-3">
          @for (item of visibleItems(); track item.id) {
            <li>
              <a
                [routerLink]="['/president/validations', item.id]"
                class="block rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:border-blue-300 hover:shadow"
              >
                <div class="flex items-start justify-between gap-4">
                  <div class="min-w-0 flex-1">
                    <div class="flex flex-wrap items-center gap-2">
                      <p class="font-semibold text-gray-900">{{ item.title }}</p>
                      <tc-badge [kind]="priorityKind(item.priority)">
                        {{ priorityLabel(item.priority) }}
                      </tc-badge>
                      <tc-badge kind="neutral">{{ categoryLabel(item.category) }}</tc-badge>
                      @if (subtypeLabel(item); as st) {
                        <tc-badge kind="info">{{ st }}</tc-badge>
                      }
                    </div>
                    <p class="mt-1 text-sm text-gray-600">{{ item.description }}</p>
                    <p class="mt-2 text-xs text-gray-500">
                      Soumis par {{ item.submittedByFullName }} · {{ item.submittedAt | tcDate: true }}
                    </p>
                  </div>
                  <div class="text-right shrink-0">
                    @if (amountFor(item); as a) {
                      <p class="text-lg font-bold text-gray-900">{{ a | xaf }}</p>
                    }
                    @if (auditorBadge(item); as ab) {
                      <p class="mt-1 text-xs" [class]="ab.classes">
                        Commissaire : {{ ab.label }}
                      </p>
                    }
                    <span class="mt-2 inline-block text-blue-600 text-sm font-medium">Examiner →</span>
                  </div>
                </div>
              </a>
            </li>
          }
        </ul>
      }
    </div>
  `,
})
export class ValidationsListComponent {
  private readonly service = inject(PresidentService);

  readonly filter = signal<Filter>('ALL');

  readonly filterOptions: { label: string; value: Filter }[] = [
    { label: 'Tout', value: 'ALL' },
    { label: 'Opérations financières', value: ValidationCategory.FINANCIAL_OPERATION },
    { label: 'Documents', value: ValidationCategory.DOCUMENT },
    { label: 'Adhésions', value: ValidationCategory.ADHESION },
  ];

  readonly resource = resource({
    loader: () => this.service.getValidations(),
  });

  readonly items = computed<PendingValidation[]>(() => this.resource.value() ?? []);

  readonly visibleItems = computed(() => {
    const f = this.filter();
    if (f === 'ALL') return this.items();
    return this.items().filter((i) => i.category === f);
  });

  countFor(value: Filter): number {
    if (value === 'ALL') return this.items().length;
    return this.items().filter((i) => i.category === value).length;
  }

  filterButtonClass(value: Filter): string {
    const base = 'inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium border transition-colors';
    const active = 'bg-blue-600 text-white border-blue-600';
    const inactive = 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50';
    return `${base} ${this.filter() === value ? active : inactive}`;
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

  categoryLabel(category: ValidationCategory): string {
    return VALIDATION_CATEGORY_LABELS[category];
  }

  subtypeLabel(item: PendingValidation): string | null {
    if (item.category === ValidationCategory.FINANCIAL_OPERATION) {
      return FINANCIAL_OPERATION_TYPE_LABELS[item.operationType];
    }
    if (item.category === ValidationCategory.DOCUMENT) {
      return { AGENDA: 'Ordre du jour', MINUTES: 'PV', ADHESION_FILE: 'Dossier' }[item.documentKind];
    }
    return null;
  }

  amountFor(item: PendingValidation): number | null {
    return 'amount' in item ? item.amount ?? null : null;
  }

  auditorBadge(item: PendingValidation): { label: string; classes: string } | null {
    if (!('auditorOpinion' in item) || !item.auditorOpinion) return null;
    const map = {
      FAVORABLE: { label: 'Favorable ✓', classes: 'text-green-600' },
      RESERVED: { label: 'Réserves ⚠', classes: 'text-amber-600' },
      UNFAVORABLE: { label: 'Défavorable ✗', classes: 'text-red-600' },
    } as const;
    return map[item.auditorOpinion.status];
  }
}

import { ChangeDetectionStrategy, Component, computed, inject, resource } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { EmptyStateComponent } from '../../../../shared/components/ui/empty-state/empty-state.component';
import { CurrencyXafPipe } from '../../../../shared/pipes/currency-xaf.pipe';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { SANCTION_TYPE_LABELS } from '../../../../core/enums/sanction-type.enum';
import { CensorService } from '../../services/censor.service';

@Component({
  selector: 'tc-censor-unpaid',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
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
        <h1 class="text-2xl font-bold text-gray-900">Sanctions impayées</h1>
        <p class="text-sm text-gray-500">
          Classées par ancienneté (RM-SI01). Les sanctions de plus de 60 jours sont marquées comme
          critiques (RM-SI02).
        </p>
      </header>

      @if (resource.isLoading()) {
        <p class="text-sm text-gray-500">Chargement…</p>
      } @else if (sanctions().length === 0) {
        <tc-card>
          <tc-empty-state title="Aucune sanction impayée" icon="✅" />
        </tc-card>
      } @else {
        <section class="grid gap-4 sm:grid-cols-3">
          <tc-card>
            <p class="text-xs text-gray-500">Total impayé</p>
            <p class="text-2xl font-bold text-amber-600 mt-1">{{ totalAmount() | xaf }}</p>
            <p class="text-xs text-gray-500 mt-1">{{ sanctions().length }} sanction(s)</p>
          </tc-card>
          <tc-card>
            <p class="text-xs text-gray-500">&lt; 30 jours</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">
              {{ ranges().lt30.count }} ({{ ranges().lt30.amount | xaf }})
            </p>
          </tc-card>
          <tc-card>
            <p class="text-xs text-gray-500">&gt; 60 jours ⚠️</p>
            <p class="text-2xl font-bold text-red-600 mt-1">
              {{ ranges().gt60.count }} ({{ ranges().gt60.amount | xaf }})
            </p>
          </tc-card>
        </section>

        <tc-card title="Liste détaillée">
          <ul class="divide-y divide-gray-100">
            @for (s of sanctions(); track s.id) {
              <li class="py-3 first:pt-0 last:pb-0">
                <div class="flex flex-wrap items-center justify-between gap-3">
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-2 flex-wrap">
                      <p class="font-medium text-gray-900">
                        @if (s.daysOpen > 60) {
                          ⚠️
                        }
                        {{ s.memberFullName }}
                      </p>
                      <tc-badge kind="neutral">Séance #{{ s.sessionNumber }}</tc-badge>
                      <tc-badge [kind]="s.daysOpen > 60 ? 'danger' : s.daysOpen > 30 ? 'warning' : 'neutral'">
                        {{ s.daysOpen }} jours
                      </tc-badge>
                    </div>
                    <p class="text-xs text-gray-500 mt-1">
                      {{ SANCTION_TYPE_LABELS[s.type] }} — émise le {{ s.issuedAt | tcDate }}
                    </p>
                  </div>
                  <div class="text-right shrink-0">
                    <p class="text-lg font-bold text-amber-600">{{ s.amount | xaf }}</p>
                  </div>
                </div>
              </li>
            }
          </ul>

          <div class="mt-4 flex justify-end gap-2">
            <a routerLink="/censor/communications">
              <tc-button variant="primary" size="sm">📧 Envoyer rappels</tc-button>
            </a>
          </div>
        </tc-card>
      }
    </div>
  `,
})
export class CensorUnpaidPageComponent {
  private readonly service = inject(CensorService);

  protected readonly SANCTION_TYPE_LABELS = SANCTION_TYPE_LABELS;

  readonly resource = resource({
    loader: () => this.service.getUnpaidSanctions(),
  });
  readonly sanctions = computed(() => this.resource.value() ?? []);

  readonly totalAmount = computed(() =>
    this.sanctions().reduce((sum, s) => sum + s.amount, 0),
  );

  readonly ranges = computed(() => {
    const lt30 = { count: 0, amount: 0 };
    const between = { count: 0, amount: 0 };
    const gt60 = { count: 0, amount: 0 };
    for (const s of this.sanctions()) {
      if (s.daysOpen < 30) {
        lt30.count++;
        lt30.amount += s.amount;
      } else if (s.daysOpen <= 60) {
        between.count++;
        between.amount += s.amount;
      } else {
        gt60.count++;
        gt60.amount += s.amount;
      }
    }
    return { lt30, between, gt60 };
  });
}

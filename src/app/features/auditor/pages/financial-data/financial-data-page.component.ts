import { ChangeDetectionStrategy, Component, computed, inject, resource, signal } from '@angular/core';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { EmptyStateComponent } from '../../../../shared/components/ui/empty-state/empty-state.component';
import { CurrencyXafPipe } from '../../../../shared/pipes/currency-xaf.pipe';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { AuditorService } from '../../services/auditor.service';

type Tab = 'cashboxes' | 'movements' | 'contributions' | 'loans' | 'expenses' | 'distributions' | 'sanctions';

@Component({
  selector: 'tc-auditor-financial-data',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BadgeComponent, CardComponent, EmptyStateComponent, CurrencyXafPipe, DateFormatPipe],
  template: `
    <div class="space-y-6">
      <header>
        <h1 class="text-2xl font-bold text-gray-900">Données financières (lecture seule)</h1>
        <p class="text-sm text-gray-500">
          Accès temps réel à toutes les données financières (RM-CD01). Lecture seule (RM-CD03).
        </p>
      </header>

      @if (resource.isLoading()) {
        <p class="text-sm text-gray-500">Chargement…</p>
      } @else if (data(); as d) {
        <section class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <tc-card>
            <p class="text-xs text-gray-500">Solde total</p>
            <p class="text-xl font-bold text-gray-900 mt-1">{{ d.totals.totalBalance | xaf }}</p>
          </tc-card>
          <tc-card>
            <p class="text-xs text-gray-500">Cotisations</p>
            <p class="text-xl font-bold text-green-600 mt-1">{{ d.totals.contributions | xaf }}</p>
          </tc-card>
          <tc-card>
            <p class="text-xs text-gray-500">Dépenses payées</p>
            <p class="text-xl font-bold text-amber-600 mt-1">{{ d.totals.expenses | xaf }}</p>
          </tc-card>
          <tc-card>
            <p class="text-xs text-gray-500">Distributions</p>
            <p class="text-xl font-bold text-blue-600 mt-1">{{ d.totals.distributions | xaf }}</p>
          </tc-card>
        </section>

        <div class="flex flex-wrap gap-2 text-sm">
          @for (t of tabs; track t.key) {
            <button
              class="rounded-lg px-3 py-1.5 border"
              [class.border-blue-500]="tab() === t.key"
              [class.bg-blue-50]="tab() === t.key"
              [class.border-gray-200]="tab() !== t.key"
              (click)="tab.set(t.key)"
            >
              {{ t.label }}
            </button>
          }
        </div>

        <tc-card>
          @switch (tab()) {
            @case ('cashboxes') {
              <ul class="divide-y divide-gray-100">
                @for (cb of d.cashBoxes; track cb.id) {
                  <li class="py-3 first:pt-0 last:pb-0 flex items-center justify-between">
                    <div>
                      <p class="font-medium text-gray-900">{{ cb.name }}</p>
                      <p class="text-xs text-gray-500">{{ cb.type }}</p>
                    </div>
                    <p class="font-bold text-gray-900">{{ cb.balance | xaf }}</p>
                  </li>
                }
              </ul>
            }
            @case ('movements') {
              @if (d.movements.length === 0) {
                <tc-empty-state title="Aucun mouvement" icon="📊" />
              } @else {
                <ul class="divide-y divide-gray-100">
                  @for (mv of d.movements; track mv.id) {
                    <li class="py-2 first:pt-0 last:pb-0 flex items-center justify-between gap-2 text-sm">
                      <div class="min-w-0 flex-1">
                        <p class="text-gray-900 truncate">{{ mv.description }}</p>
                        <p class="text-xs text-gray-500">{{ mv.recordedAt | tcDate: true }} · {{ mv.cashBoxName }}</p>
                      </div>
                      <span [class]="mv.direction === 'IN' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'">
                        {{ mv.direction === 'IN' ? '+' : '-' }}{{ mv.amount | xaf }}
                      </span>
                    </li>
                  }
                </ul>
              }
            }
            @case ('contributions') {
              <ul class="divide-y divide-gray-100">
                @for (c of d.contributions; track c.id) {
                  <li class="py-2 first:pt-0 last:pb-0 flex items-center justify-between gap-2 text-sm">
                    <div>
                      <p class="text-gray-900">Membre {{ c.memberId }} · {{ c.sessionId }}</p>
                      <tc-badge [kind]="c.status === 'PAID' ? 'success' : c.status === 'PARTIAL' ? 'warning' : 'neutral'">
                        {{ c.status }}
                      </tc-badge>
                    </div>
                    <span class="font-semibold text-gray-900">{{ c.paidAmount | xaf }} / {{ c.expectedAmount | xaf }}</span>
                  </li>
                }
              </ul>
            }
            @case ('loans') {
              <ul class="divide-y divide-gray-100">
                @for (l of d.loans; track l.id) {
                  <li class="py-2 first:pt-0 last:pb-0">
                    <div class="flex items-center justify-between gap-2 text-sm">
                      <div>
                        <p class="text-gray-900 font-medium">{{ l.id }} — {{ l.memberId }}</p>
                        <p class="text-xs text-gray-500">{{ l.purpose }}</p>
                      </div>
                      <span class="font-semibold text-gray-900">{{ l.principal | xaf }}</span>
                    </div>
                    <p class="text-xs text-gray-500 mt-1">
                      Remboursé : {{ l.totalRepaid | xaf }} / {{ l.totalDue | xaf }} ·
                      <tc-badge kind="info">{{ l.status }}</tc-badge>
                    </p>
                  </li>
                }
              </ul>
            }
            @case ('expenses') {
              <ul class="divide-y divide-gray-100">
                @for (e of d.expenses; track e.id) {
                  <li class="py-2 first:pt-0 last:pb-0 flex items-center justify-between text-sm">
                    <div>
                      <p class="text-gray-900 font-medium">{{ e.description }}</p>
                      <p class="text-xs text-gray-500">{{ e.category }} · {{ e.createdAt | tcDate }}</p>
                    </div>
                    <span class="font-semibold text-gray-900">{{ e.amount | xaf }}</span>
                  </li>
                }
              </ul>
            }
            @case ('distributions') {
              <ul class="divide-y divide-gray-100">
                @for (di of d.distributions; track di.id) {
                  <li class="py-2 first:pt-0 last:pb-0 text-sm">
                    <p class="text-gray-900">Séance #{{ di.sessionNumber }} → {{ di.beneficiaryFullName }}</p>
                    <p class="text-xs text-gray-500">Net {{ di.netAmount | xaf }} · brut {{ di.grossAmount | xaf }}</p>
                  </li>
                }
              </ul>
            }
            @case ('sanctions') {
              <ul class="divide-y divide-gray-100">
                @for (s of d.sanctions; track s.id) {
                  <li class="py-2 first:pt-0 last:pb-0 flex items-center justify-between text-sm">
                    <div>
                      <p class="text-gray-900">{{ s.memberFullName ?? s.memberId }} — {{ s.type }}</p>
                      <p class="text-xs text-gray-500">{{ s.reason }}</p>
                    </div>
                    <span class="font-semibold text-gray-900">{{ s.amount | xaf }}</span>
                  </li>
                }
              </ul>
            }
          }
        </tc-card>
      }
    </div>
  `,
})
export class AuditorFinancialDataPageComponent {
  private readonly service = inject(AuditorService);

  protected readonly tabs: { key: Tab; label: string }[] = [
    { key: 'cashboxes', label: '🏦 Caisses' },
    { key: 'movements', label: '📊 Mouvements' },
    { key: 'contributions', label: '💵 Cotisations' },
    { key: 'loans', label: '💳 Prêts' },
    { key: 'expenses', label: '📝 Dépenses' },
    { key: 'distributions', label: '🎁 Distributions' },
    { key: 'sanctions', label: '⚖ Sanctions' },
  ];

  readonly resource = resource({
    loader: () => this.service.getFinancialData(),
  });
  readonly data = computed(() => this.resource.value());

  readonly tab = signal<Tab>('cashboxes');
}

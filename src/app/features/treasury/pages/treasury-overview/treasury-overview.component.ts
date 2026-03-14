import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PageHeaderComponent } from '../../../../shared/components/layout/page-header/page-header.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { MockDataService } from '../../../../core/services/mock-data.service';
import { CurrencyXafPipe } from '../../../../shared/pipes/currency-xaf.pipe';

@Component({
  selector: 'app-treasury-overview',
  standalone: true,
  imports: [PageHeaderComponent, CardComponent, BadgeComponent, CurrencyXafPipe],
  template: `
    <app-page-header title="Trésorerie" />

    <div class="treasury-layout">
      <!-- Total balance -->
      <div class="total-card">
        <span class="total-label">Solde total</span>
        <span class="total-value">{{ mock.totalBalance() | currencyXaf }}</span>
      </div>

      <!-- Cash boxes -->
      <div class="cashbox-grid">
        @for (cb of mock.cashBoxes(); track cb.id) {
          <app-card>
            <div class="cashbox-body">
              <span class="cashbox-icon">{{ getCashBoxIcon(cb.type) }}</span>
              <div class="cashbox-info">
                <h3 class="cashbox-name">{{ cb.name }}</h3>
                <span class="cashbox-balance">{{ cb.balance | currencyXaf }}</span>
              </div>
              <app-badge [variant]="cb.type === 'main' ? 'primary' : cb.type === 'emergency' ? 'warning' : 'secondary'" size="sm">
                {{ getCashBoxLabel(cb.type) }}
              </app-badge>
            </div>
          </app-card>
        }
      </div>

      <!-- Recent transactions -->
      <app-card>
        <div class="section">
          <h3 class="section-title">📜 Dernières transactions</h3>
          <div class="transaction-list">
            @for (tx of mock.transactions(); track tx.id) {
              <div class="tx-item">
                <div class="tx-icon" [class.credit]="tx.type === 'credit'" [class.debit]="tx.type === 'debit'">
                  {{ tx.type === 'credit' ? '↗' : '↙' }}
                </div>
                <div class="tx-info">
                  <span class="tx-desc">{{ tx.description }}</span>
                  <span class="tx-meta">{{ tx.category }} · {{ tx.createdAt }}</span>
                </div>
                <span class="tx-amount" [class.credit]="tx.type === 'credit'" [class.debit]="tx.type === 'debit'">
                  {{ tx.type === 'credit' ? '+' : '-' }}{{ tx.amount | currencyXaf }}
                </span>
              </div>
            }
          </div>
        </div>
      </app-card>
    </div>
  `,
  styles: `@reference "tailwindcss";
    .treasury-layout { @apply flex flex-col gap-6; }
    .total-card { @apply bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl p-6 flex flex-col items-center gap-2; }
    .total-label { @apply text-sm text-blue-200; }
    .total-value { @apply text-3xl font-bold; }
    .cashbox-grid { @apply grid grid-cols-1 md:grid-cols-3 gap-4; }
    .cashbox-body { @apply p-3 flex items-center gap-3; }
    .cashbox-icon { @apply text-2xl; }
    .cashbox-info { @apply flex-1; }
    .cashbox-name { @apply text-sm font-medium text-slate-700; }
    .cashbox-balance { @apply text-lg font-bold text-slate-900; }
    .section { @apply p-4 flex flex-col gap-3; }
    .section-title { @apply text-base font-semibold text-slate-900; }
    .transaction-list { @apply flex flex-col divide-y divide-slate-100; }
    .tx-item { @apply flex items-center gap-3 py-3; }
    .tx-icon { @apply w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold; }
    .tx-icon.credit { @apply bg-green-100 text-green-600; }
    .tx-icon.debit { @apply bg-red-100 text-red-600; }
    .tx-info { @apply flex-1 flex flex-col; }
    .tx-desc { @apply text-sm text-slate-800; }
    .tx-meta { @apply text-xs text-slate-400; }
    .tx-amount { @apply font-semibold text-sm; }
    .tx-amount.credit { @apply text-green-600; }
    .tx-amount.debit { @apply text-red-600; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreasuryOverviewComponent {
  protected readonly router = inject(Router);
  protected readonly mock = inject(MockDataService);

  getCashBoxIcon(type: string): string {
    const map: Record<string, string> = { main: '🏦', emergency: '🚨', operational: '⚙️' };
    return map[type] ?? '💰';
  }

  getCashBoxLabel(type: string): string {
    const map: Record<string, string> = { main: 'Principale', emergency: 'Secours', operational: 'Fonctionnement' };
    return map[type] ?? type;
  }
}

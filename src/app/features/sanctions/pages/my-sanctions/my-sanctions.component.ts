import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { PageHeaderComponent } from '../../../../shared/components/layout/page-header/page-header.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { MockDataService } from '../../../../core/services/mock-data.service';
import { CurrencyXafPipe } from '../../../../shared/pipes/currency-xaf.pipe';
import { AuthStore } from '../../../../store/auth/auth.store';

@Component({
  selector: 'app-my-sanctions',
  standalone: true,
  imports: [PageHeaderComponent, CardComponent, BadgeComponent, CurrencyXafPipe],
  template: `
    <app-page-header title="Mes sanctions" backLink="/sanctions" />

    <div class="my-sanctions-container">
      <!-- Summary -->
      <div class="summary-cards">
        <app-card class="summary-card">
          <div class="summary-content">
            <span class="summary-icon">⚖️</span>
            <div class="summary-info">
              <span class="summary-label">Total</span>
              <span class="summary-value">{{ mySanctions().length }}</span>
            </div>
          </div>
        </app-card>
        <app-card class="summary-card">
          <div class="summary-content">
            <span class="summary-icon">🚫</span>
            <div class="summary-info">
              <span class="summary-label">Impayées</span>
              <span class="summary-value">{{ unpaidCount() }}</span>
            </div>
          </div>
        </app-card>
        <app-card class="summary-card">
          <div class="summary-content">
            <span class="summary-icon">💰</span>
            <div class="summary-info">
              <span class="summary-label">Montant dû</span>
              <span class="summary-value">{{ unpaidAmount() | currencyXaf }}</span>
            </div>
          </div>
        </app-card>
      </div>

      <!-- Filter -->
      <div class="filter-tabs">
        <button [class]="'tab' + (filter() === 'all' ? ' active' : '')" (click)="filter.set('all')" type="button">Toutes ({{ mySanctions().length }})</button>
        <button [class]="'tab' + (filter() === 'pending' ? ' active' : '')" (click)="filter.set('pending')" type="button">Impayées ({{ unpaidCount() }})</button>
        <button [class]="'tab' + (filter() === 'paid' ? ' active' : '')" (click)="filter.set('paid')" type="button">Payées</button>
        <button [class]="'tab' + (filter() === 'contested' ? ' active' : '')" (click)="filter.set('contested')" type="button">Contestées</button>
      </div>

      <!-- List -->
      @for (s of filteredSanctions(); track s.id) {
        <app-card>
          <div class="sanction-item" (click)="navigate('/sanctions/' + s.id)">
            <div class="item-header">
              <span class="item-type">{{ getTypeLabel(s.type) }}</span>
              <app-badge [variant]="statusVariant(s)" size="sm">{{ statusLabel(s) }}</app-badge>
            </div>
            <p class="item-reason">{{ s.reason }}</p>
            <div class="item-footer">
              <span class="item-amount">{{ s.amount | currencyXaf }}</span>
              <span class="item-date">{{ s.appliedAt }}</span>
            </div>
          </div>
        </app-card>
      } @empty {
        <app-card>
          <div class="empty-state">
            <span class="empty-icon">✅</span>
            <p class="empty-text">Aucune sanction</p>
          </div>
        </app-card>
      }
    </div>
  `,
  styles: `
    @reference "tailwindcss";
    .my-sanctions-container { @apply space-y-4; }
    .summary-cards { @apply grid grid-cols-3 gap-4 mb-2; }
    .summary-content { @apply flex items-center gap-3 p-1; }
    .summary-icon { @apply text-2xl; }
    .summary-label { @apply text-xs text-slate-500 uppercase tracking-wide; }
    .summary-value { @apply text-lg font-bold text-slate-900; }
    .filter-tabs { @apply flex gap-2 mb-4; }
    .tab { @apply px-4 py-2 text-sm rounded-lg border border-slate-200 bg-white cursor-pointer hover:bg-slate-50; }
    .tab.active { @apply bg-blue-50 border-blue-300 text-blue-700 font-medium; }
    .sanction-item { @apply space-y-2 cursor-pointer; }
    .item-header { @apply flex items-center justify-between; }
    .item-type { @apply text-sm font-semibold text-slate-900; }
    .item-reason { @apply text-sm text-slate-600; }
    .item-footer { @apply flex items-center justify-between pt-2 border-t border-slate-100; }
    .item-amount { @apply text-base font-bold text-slate-900; }
    .item-date { @apply text-xs text-slate-400; }
    .empty-state { @apply flex flex-col items-center gap-2 py-8; }
    .empty-icon { @apply text-4xl; }
    .empty-text { @apply text-sm text-slate-500; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MySanctionsComponent {
  private readonly mock = inject(MockDataService);
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  readonly filter = signal<'all' | 'pending' | 'paid' | 'contested'>('all');

  mySanctions() {
    const userId = this.authStore.user()?.id;
    if (!userId) return [];
    const member = this.mock.members().find(m => m.userId === userId);
    if (!member) return this.mock.sanctions();
    return this.mock.sanctions().filter(s => s.memberId === member.id);
  }

  unpaidCount() { return this.mySanctions().filter(s => s.status === 'pending').length; }
  unpaidAmount() { return this.mySanctions().filter(s => s.status === 'pending').reduce((sum, s) => sum + s.amount, 0); }

  filteredSanctions() {
    const all = this.mySanctions();
    switch (this.filter()) {
      case 'pending': return all.filter(s => s.status === 'pending');
      case 'paid': return all.filter(s => s.status === 'paid');
      case 'contested': return all.filter(s => s.contested);
      default: return all;
    }
  }

  getTypeLabel(type: string): string {
    const map: Record<string, string> = { absence: 'Absence', late: 'Retard', contribution_late: 'Cotisation en retard', other: 'Autre' };
    return map[type] ?? type;
  }

  statusVariant(s: { status: string; contested: boolean }): 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' {
    if (s.contested) return 'warning';
    return s.status === 'paid' ? 'success' : s.status === 'cancelled' ? 'info' : 'danger';
  }

  statusLabel(s: { status: string; contested: boolean }): string {
    if (s.contested) return 'Contestée';
    return s.status === 'paid' ? 'Payée' : s.status === 'cancelled' ? 'Annulée' : 'En attente';
  }

  navigate(path: string): void { this.router.navigate([path]); }
}

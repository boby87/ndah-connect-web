import { ChangeDetectionStrategy, Component, inject, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { PageHeaderComponent } from '../../../../shared/components/layout/page-header/page-header.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { MockDataService } from '../../../../core/services/mock-data.service';
import { CurrencyXafPipe } from '../../../../shared/pipes/currency-xaf.pipe';

@Component({
  selector: 'app-sanction-list',
  standalone: true,
  imports: [PageHeaderComponent, CardComponent, BadgeComponent, ButtonComponent, CurrencyXafPipe],
  template: `
    <app-page-header title="Sanctions">
      <app-button variant="outline" (clicked)="router.navigate(['/sanctions/contestations'])">
        🔴 Contestations ({{ mock.contestedSanctions().length }})
      </app-button>
    </app-page-header>

    <div class="filter-tabs">
      <button [class]="'tab' + (filter() === 'all' ? ' active' : '')" (click)="filter.set('all')">Toutes ({{ mock.sanctions().length }})</button>
      <button [class]="'tab' + (filter() === 'pending' ? ' active' : '')" (click)="filter.set('pending')">En attente ({{ mock.pendingSanctions().length }})</button>
      <button [class]="'tab' + (filter() === 'contested' ? ' active' : '')" (click)="filter.set('contested')">Contestées ({{ mock.contestedSanctions().length }})</button>
      <button [class]="'tab' + (filter() === 'paid' ? ' active' : '')" (click)="filter.set('paid')">Payées</button>
    </div>

    <div class="sanction-list">
      @for (s of filteredSanctions(); track s.id) {
        <app-card class="sanction-card" (click)="router.navigate(['/sanctions', s.id])">
          <div class="card-body">
            <div class="card-top">
              <div>
                <h3 class="member-name">{{ s.member.user.firstName }} {{ s.member.user.lastName }}</h3>
                <p class="sanction-reason">{{ s.reason }}</p>
              </div>
              <div class="card-right">
                <span class="amount">{{ s.amount | currencyXaf }}</span>
                <app-badge [variant]="getStatusVariant(s.status, s.contested)" size="sm">
                  {{ getStatusLabel(s.status, s.contested) }}
                </app-badge>
              </div>
            </div>
            <div class="card-meta">
              <app-badge variant="secondary" size="sm">{{ getTypeLabel(s.type) }}</app-badge>
              <span class="meta-text">Appliquée le {{ s.appliedAt }}</span>
            </div>
            @if (s.contested && s.contestReason) {
              <div class="contest-box">
                <span class="contest-label">⚠️ Contestation:</span> {{ s.contestReason }}
              </div>
            }
          </div>
        </app-card>
      } @empty {
        <div class="empty-state">Aucune sanction dans cette catégorie</div>
      }
    </div>
  `,
  styles: `@reference "tailwindcss";
    .filter-tabs { @apply flex gap-2 mb-6 flex-wrap; }
    .tab { @apply px-3 py-1.5 rounded-lg text-sm font-medium bg-white border border-slate-200 text-slate-600 cursor-pointer hover:bg-slate-50; }
    .tab.active { @apply bg-blue-600 text-white border-blue-600; }
    .sanction-list { @apply flex flex-col gap-4; }
    .sanction-card { @apply cursor-pointer; }
    .card-body { @apply p-2 flex flex-col gap-2; }
    .card-top { @apply flex justify-between items-start; }
    .member-name { @apply font-semibold text-slate-900; }
    .sanction-reason { @apply text-sm text-slate-500 mt-0.5; }
    .card-right { @apply flex flex-col items-end gap-1; }
    .amount { @apply font-bold text-slate-900; }
    .card-meta { @apply flex items-center gap-3; }
    .meta-text { @apply text-xs text-slate-400; }
    .contest-box { @apply bg-amber-50 text-amber-800 rounded-lg p-2 text-xs; }
    .contest-label { @apply font-medium; }
    .empty-state { @apply text-center py-12 text-slate-400; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SanctionListComponent {
  protected readonly router = inject(Router);
  protected readonly mock = inject(MockDataService);

  readonly filter = signal<'all' | 'pending' | 'contested' | 'paid'>('all');

  readonly filteredSanctions = computed(() => {
    const f = this.filter();
    const sanctions = this.mock.sanctions();
    switch (f) {
      case 'pending': return sanctions.filter(s => s.status === 'pending');
      case 'contested': return sanctions.filter(s => s.contested && !s.contestResult);
      case 'paid': return sanctions.filter(s => s.status === 'paid');
      default: return sanctions;
    }
  });

  getStatusVariant(status: string, contested: boolean): 'primary' | 'secondary' | 'warning' | 'info' | 'success' | 'danger' {
    if (contested) return 'warning';
    const map: Record<string, 'danger' | 'success' | 'secondary'> = { pending: 'danger', paid: 'success', cancelled: 'secondary' };
    return map[status] ?? 'secondary';
  }

  getStatusLabel(status: string, contested: boolean): string {
    if (contested && status !== 'paid') return '⚠️ Contestée';
    const map: Record<string, string> = { pending: 'En attente', paid: 'Payée', cancelled: 'Annulée' };
    return map[status] ?? status;
  }

  getTypeLabel(type: string): string {
    const map: Record<string, string> = { absence: 'Absence', late: 'Retard', contribution_late: 'Cotisation en retard', other: 'Autre' };
    return map[type] ?? type;
  }
}

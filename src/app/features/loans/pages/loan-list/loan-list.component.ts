import { ChangeDetectionStrategy, Component, inject, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { PageHeaderComponent } from '../../../../shared/components/layout/page-header/page-header.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { MockDataService } from '../../../../core/services/mock-data.service';
import { CurrencyXafPipe } from '../../../../shared/pipes/currency-xaf.pipe';
import { LoanStatus } from '../../../../core/enums/loan-status.enum';

@Component({
  selector: 'app-loan-list',
  standalone: true,
  imports: [PageHeaderComponent, ButtonComponent, CardComponent, BadgeComponent, CurrencyXafPipe],
  template: `
    <app-page-header title="Gestion des Prêts" />

    <!-- Filter tabs -->
    <div class="filter-tabs">
      <button [class]="'tab' + (filter() === 'all' ? ' active' : '')" (click)="filter.set('all')">
        Tous ({{ mock.loans().length }})
      </button>
      <button [class]="'tab' + (filter() === 'pending' ? ' active' : '')" (click)="filter.set('pending')">
        🔴 À valider ({{ mock.pendingLoans().length }})
      </button>
      <button [class]="'tab' + (filter() === 'active' ? ' active' : '')" (click)="filter.set('active')">
        En cours ({{ mock.activeLoans().length }})
      </button>
      <button [class]="'tab' + (filter() === 'completed' ? ' active' : '')" (click)="filter.set('completed')">
        Terminés
      </button>
    </div>

    <div class="loan-grid">
      @for (loan of filteredLoans(); track loan.id) {
        <app-card class="loan-card" (click)="router.navigate(['/loans', loan.id])">
          <div class="card-body">
            <div class="card-header">
              <div>
                <h3 class="member-name">{{ loan.member.user.firstName }} {{ loan.member.user.lastName }}</h3>
                <p class="loan-reason">{{ loan.requestReason }}</p>
              </div>
              <app-badge [variant]="getStatusVariant(loan.status)">{{ getStatusLabel(loan.status) }}</app-badge>
            </div>
            <div class="card-amounts">
              <div class="amount-item">
                <span class="amount-label">Montant</span>
                <span class="amount-value">{{ loan.amount | currencyXaf }}</span>
              </div>
              <div class="amount-item">
                <span class="amount-label">Taux</span>
                <span class="amount-value">{{ loan.interestRate }}%</span>
              </div>
              <div class="amount-item">
                <span class="amount-label">Durée</span>
                <span class="amount-value">{{ loan.durationMonths }} mois</span>
              </div>
              <div class="amount-item">
                <span class="amount-label">Mensualité</span>
                <span class="amount-value">{{ loan.monthlyPayment | currencyXaf }}</span>
              </div>
            </div>
            @if (loan.status === 'president_review') {
              <div class="card-review">
                <span class="review-icon">🔍</span>
                <span>Avis CAC: {{ loan.auditorComment }}</span>
              </div>
              <div class="card-actions">
                <app-button variant="primary" size="sm" (clicked)="router.navigate(['/loans', loan.id]); $event.stopPropagation()">
                  Examiner
                </app-button>
              </div>
            }
            @if (loan.status === 'repaying') {
              <div class="progress-bar-container">
                <div class="progress-label">Remboursement: {{ getRepaymentPercent(loan) }}%</div>
                <div class="progress-track">
                  <div class="progress-fill" [style.width.%]="getRepaymentPercent(loan)"></div>
                </div>
              </div>
            }
          </div>
        </app-card>
      } @empty {
        <div class="empty-state">Aucun prêt dans cette catégorie</div>
      }
    </div>
  `,
  styles: `@reference "tailwindcss";
    .filter-tabs { @apply flex gap-2 mb-6 flex-wrap; }
    .tab { @apply px-4 py-2 rounded-lg text-sm font-medium bg-white border border-slate-200 text-slate-600 cursor-pointer transition-colors hover:bg-slate-50; }
    .tab.active { @apply bg-blue-600 text-white border-blue-600; }
    .loan-grid { @apply grid grid-cols-1 lg:grid-cols-2 gap-4; }
    .loan-card { @apply cursor-pointer; }
    .card-body { @apply p-2 flex flex-col gap-3; }
    .card-header { @apply flex justify-between items-start gap-2; }
    .member-name { @apply font-semibold text-slate-900; }
    .loan-reason { @apply text-sm text-slate-500 mt-0.5; }
    .card-amounts { @apply grid grid-cols-4 gap-2 bg-slate-50 rounded-lg p-3; }
    .amount-item { @apply flex flex-col; }
    .amount-label { @apply text-xs text-slate-500; }
    .amount-value { @apply text-sm font-semibold text-slate-900; }
    .card-review { @apply flex items-start gap-2 text-xs text-slate-600 bg-blue-50 rounded-lg p-2; }
    .review-icon { @apply flex-shrink-0; }
    .card-actions { @apply flex justify-end; }
    .progress-bar-container { @apply flex flex-col gap-1; }
    .progress-label { @apply text-xs text-slate-500; }
    .progress-track { @apply h-2 bg-slate-200 rounded-full overflow-hidden; }
    .progress-fill { @apply h-full bg-green-500 rounded-full transition-all; }
    .empty-state { @apply col-span-full text-center py-12 text-slate-400; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoanListComponent {
  protected readonly router = inject(Router);
  protected readonly mock = inject(MockDataService);

  readonly filter = signal<'all' | 'pending' | 'active' | 'completed'>('all');

  readonly filteredLoans = computed(() => {
    const f = this.filter();
    const loans = this.mock.loans();
    switch (f) {
      case 'pending': return loans.filter(l => l.status === LoanStatus.PRESIDENT_REVIEW);
      case 'active': return loans.filter(l => [LoanStatus.DISBURSED, LoanStatus.REPAYING].includes(l.status));
      case 'completed': return loans.filter(l => l.status === LoanStatus.COMPLETED);
      default: return loans;
    }
  });

  getStatusVariant(status: string): 'primary' | 'secondary' | 'warning' | 'info' | 'success' | 'danger' {
    const map: Record<string, 'warning' | 'info' | 'success' | 'danger'> = { president_review: 'warning', repaying: 'info', completed: 'success', disbursed: 'info', approved: 'success', defaulted: 'danger' };
    return map[status] ?? 'secondary';
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = { president_review: 'À valider', repaying: 'En remboursement', completed: 'Terminé', disbursed: 'Décaissé', approved: 'Approuvé', defaulted: 'Défaillant', requested: 'Demandé' };
    return map[status] ?? status;
  }

  getRepaymentPercent(loan: any): number {
    if (loan.totalToRepay === 0) return 100;
    return Math.round(((loan.totalToRepay - loan.remainingAmount) / loan.totalToRepay) * 100);
  }
}

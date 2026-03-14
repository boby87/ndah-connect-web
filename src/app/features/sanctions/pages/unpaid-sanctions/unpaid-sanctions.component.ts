import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MockDataService } from '../../../../core/services/mock-data.service';
import { PageHeaderComponent } from '../../../../shared/components/layout/page-header/page-header.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CurrencyXafPipe } from '../../../../shared/pipes/currency-xaf.pipe';

@Component({
  selector: 'app-unpaid-sanctions',
  standalone: true,
  imports: [PageHeaderComponent, CardComponent, BadgeComponent, ButtonComponent, CurrencyXafPipe, DatePipe],
  template: `
    <app-page-header title="Sanctions impayées" subtitle="Suivi des sanctions non payées" backLink="/sanctions" />

    <div class="unpaid-container">
      <!-- Summary cards -->
      <div class="summary-cards">
        <app-card class="summary-card">
          <div class="summary-content">
            <span class="summary-icon">🚫</span>
            <div class="summary-info">
              <span class="summary-label">Total impayées</span>
              <span class="summary-value">{{ unpaidSanctions().length }}</span>
            </div>
          </div>
        </app-card>
        <app-card class="summary-card">
          <div class="summary-content">
            <span class="summary-icon">💰</span>
            <div class="summary-info">
              <span class="summary-label">Montant total</span>
              <span class="summary-value">{{ totalUnpaid() | currencyXaf }}</span>
            </div>
          </div>
        </app-card>
      </div>

      <!-- Unpaid list -->
      @for (sanction of unpaidSanctions(); track sanction.id) {
        <app-card>
          <div class="sanction-item" (click)="navigate('/sanctions/' + sanction.id)">
            <div class="item-header">
              <span class="item-name">{{ sanction.member.user.firstName }} {{ sanction.member.user.lastName }}</span>
              <app-badge variant="danger" size="sm">Impayée</app-badge>
            </div>
            <div class="item-details">
              <span class="item-type">{{ sanction.type }} — {{ sanction.reason }}</span>
              <span class="item-date">Appliquée le {{ sanction.appliedAt | date:'dd/MM/yyyy' }}</span>
            </div>
            <div class="item-footer">
              <span class="item-amount">{{ sanction.amount | currencyXaf }}</span>
              <div class="item-actions">
                <app-button variant="outline" size="sm" (clicked)="sendReminder(sanction.memberId, sanction.member.user.firstName + ' ' + sanction.member.user.lastName, sanction.amount); $event.stopPropagation()">📨 Rappel</app-button>
                <app-button variant="outline" size="sm" (clicked)="navigate('/sanctions/' + sanction.id); $event.stopPropagation()">Voir</app-button>
              </div>
            </div>
          </div>
        </app-card>
      } @empty {
        <app-card>
          <div class="empty-state">
            <span class="empty-icon">✅</span>
            <p class="empty-text">Aucune sanction impayée</p>
          </div>
        </app-card>
      }

      @if (unpaidSanctions().length > 0) {
        <div class="bulk-actions">
          <app-button variant="primary" (clicked)="sendBulkReminders()">📨 Envoyer rappels groupés ({{ unpaidSanctions().length }})</app-button>
        </div>
      }
    </div>
  `,
  styles: `
    @reference "tailwindcss";
    .unpaid-container { @apply space-y-4; }
    .summary-cards { @apply grid grid-cols-2 gap-4 mb-2; }
    .summary-content { @apply flex items-center gap-3 p-1; }
    .summary-icon { @apply text-2xl; }
    .summary-label { @apply text-xs text-slate-500 uppercase tracking-wide; }
    .summary-value { @apply text-lg font-bold text-slate-900; }
    .sanction-item { @apply space-y-2 cursor-pointer; }
    .item-header { @apply flex items-center justify-between; }
    .item-name { @apply text-sm font-semibold text-slate-900; }
    .item-details { @apply flex flex-col gap-0.5; }
    .item-type { @apply text-sm text-slate-700; }
    .item-date { @apply text-xs text-slate-500; }
    .item-footer { @apply flex items-center justify-between pt-2 border-t border-slate-100; }
    .item-amount { @apply text-base font-bold text-red-600; }
    .item-actions { @apply flex gap-2; }
    .empty-state { @apply flex flex-col items-center py-8 gap-2; }
    .empty-icon { @apply text-4xl; }
    .empty-text { @apply text-sm text-slate-500; }
    .bulk-actions { @apply flex justify-end; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnpaidSanctionsComponent {
  private readonly mock = inject(MockDataService);
  private readonly router = inject(Router);

  unpaidSanctions() {
    return this.mock.sanctions().filter(s => s.status === 'pending');
  }

  totalUnpaid() {
    return this.unpaidSanctions().reduce((sum, s) => sum + s.amount, 0);
  }

  sendReminder(memberId: string, memberName: string, amount: number): void {
    this.mock.sendCensorCommunication('reminder', 'individual', [{ memberId, memberName }], 'Rappel: Sanction impayée', `Rappel de paiement de sanction: ${amount} XAF. Merci de régulariser.`, ['sms', 'push']);
  }

  sendBulkReminders(): void {
    const recipients = this.unpaidSanctions().map(s => ({ memberId: s.memberId, memberName: `${s.member.user.firstName} ${s.member.user.lastName}` }));
    this.mock.sendCensorCommunication('reminder', 'group', recipients, 'Rappel: Sanctions impayées', 'Rappel groupé de paiement de sanctions impayées. Veuillez régulariser.', ['sms', 'push']);
  }

  navigate(path: string): void { this.router.navigate([path]); }
}

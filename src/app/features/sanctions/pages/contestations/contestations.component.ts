import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PageHeaderComponent } from '../../../../shared/components/layout/page-header/page-header.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { MockDataService } from '../../../../core/services/mock-data.service';
import { CurrencyXafPipe } from '../../../../shared/pipes/currency-xaf.pipe';

@Component({
  selector: 'app-contestations',
  standalone: true,
  imports: [PageHeaderComponent, CardComponent, BadgeComponent, ButtonComponent, CurrencyXafPipe],
  template: `
    <app-page-header title="Contestations en attente" backLink="/sanctions" />

    <div class="contest-list">
      @for (s of mock.contestedSanctions(); track s.id) {
        <app-card>
          <div class="card-body">
            <div class="card-top">
              <div>
                <h3 class="member-name">{{ s.member.user.firstName }} {{ s.member.user.lastName }}</h3>
                <p class="sanction-reason">{{ s.reason }}</p>
              </div>
              <span class="amount">{{ s.amount | currencyXaf }}</span>
            </div>

            <div class="contest-box">
              <span class="contest-label">Contestation:</span>
              <p class="contest-text">{{ s.contestReason }}</p>
            </div>

            <div class="actions">
              <app-button variant="primary" size="sm" (clicked)="accept(s.id)">
                ✅ Accepter (annuler la sanction)
              </app-button>
              <app-button variant="danger" size="sm" (clicked)="reject(s.id)">
                ❌ Rejeter (maintenir la sanction)
              </app-button>
              <app-button variant="outline" size="sm" (clicked)="router.navigate(['/sanctions', s.id])">
                Voir détails
              </app-button>
            </div>
          </div>
        </app-card>
      } @empty {
        <div class="empty-state">
          <p>🎉 Aucune contestation en attente</p>
        </div>
      }
    </div>
  `,
  styles: `@reference "tailwindcss";
    .contest-list { @apply flex flex-col gap-4; }
    .card-body { @apply p-2 flex flex-col gap-3; }
    .card-top { @apply flex justify-between items-start; }
    .member-name { @apply font-semibold text-slate-900; }
    .sanction-reason { @apply text-sm text-slate-500 mt-0.5; }
    .amount { @apply font-bold text-slate-900; }
    .contest-box { @apply bg-amber-50 rounded-lg p-3; }
    .contest-label { @apply font-medium text-amber-700 text-sm; }
    .contest-text { @apply text-sm text-amber-800 mt-1; }
    .actions { @apply flex gap-2 flex-wrap; }
    .empty-state { @apply text-center py-12 text-slate-400; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContestationsComponent {
  protected readonly router = inject(Router);
  protected readonly mock = inject(MockDataService);

  accept(sanctionId: string): void {
    this.mock.resolveContestation(sanctionId, true, 'Contestation acceptée par le Président');
  }

  reject(sanctionId: string): void {
    this.mock.resolveContestation(sanctionId, false, 'Contestation rejetée par le Président');
  }
}

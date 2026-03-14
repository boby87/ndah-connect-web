import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MockDataService } from '../../../../core/services/mock-data.service';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';

@Component({
  selector: 'app-confirmations',
  standalone: true,
  imports: [CardComponent, BadgeComponent, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page-header">
      <div>
        <h1 class="page-title">✅ Suivi des confirmations</h1>
        <p class="page-subtitle">Séance #9 — 22 mars 2026</p>
      </div>
      <div class="header-actions">
        @if (mock.noResponseCount() > 0) {
          <app-button variant="primary" (clicked)="relanceAll()">📤 Relancer tous ({{ mock.noResponseCount() }})</app-button>
        }
      </div>
    </div>

    <!-- Summary -->
    <div class="summary-grid">
      <div class="summary-card confirmed">
        <span class="summary-count">{{ mock.confirmedCount() }}</span>
        <span class="summary-label">✅ Confirmés</span>
      </div>
      <div class="summary-card declined">
        <span class="summary-count">{{ mock.declinedCount() }}</span>
        <span class="summary-label">❌ Déclinés</span>
      </div>
      <div class="summary-card pending">
        <span class="summary-count">{{ mock.noResponseCount() }}</span>
        <span class="summary-label">⏳ Sans réponse</span>
      </div>
      <div class="summary-card quorum">
        <span class="summary-count">{{ mock.quorumRequired() }}</span>
        <span class="summary-label">🎯 Quorum requis</span>
      </div>
    </div>

    <!-- Quorum Bar -->
    <div class="quorum-section">
      <div class="quorum-bar">
        <div class="quorum-fill" [style.width.%]="Math.min(100, (mock.confirmedCount() / mock.quorumRequired()) * 100)"></div>
      </div>
      <p class="quorum-text">
        {{ mock.confirmedCount() >= mock.quorumRequired() ? '✅ Quorum atteint ! La séance peut se tenir.' : '⚠️ ' + (mock.quorumRequired() - mock.confirmedCount()) + ' confirmation(s) encore nécessaire(s) pour le quorum.' }}
      </p>
    </div>

    <!-- Confirmed Members -->
    <app-card>
      <div class="card-body">
        <h2 class="section-title">✅ Confirmés ({{ mock.confirmedCount() }})</h2>
        <div class="members-list">
          @for (c of confirmedMembers(); track c.memberId) {
            <div class="member-row">
              <div class="member-info">
                <span class="member-name">{{ c.memberName }}</span>
                @if (c.memberRole !== 'member') {
                  <app-badge variant="primary" size="sm">{{ c.memberRole }}</app-badge>
                }
              </div>
              <span class="member-date">{{ c.respondedAt ? formatDate(c.respondedAt) : '' }}</span>
            </div>
          }
        </div>
      </div>
    </app-card>

    <!-- Declined -->
    @if (mock.declinedCount() > 0) {
      <app-card>
        <div class="card-body">
          <h2 class="section-title">❌ Déclinés ({{ mock.declinedCount() }})</h2>
          <div class="members-list">
            @for (c of declinedMembers(); track c.memberId) {
              <div class="member-row declined-row">
                <div class="member-info">
                  <span class="member-name">{{ c.memberName }}</span>
                  <span class="decline-reason">Motif : {{ c.declineReason }}</span>
                </div>
                <span class="member-date">{{ c.respondedAt ? formatDate(c.respondedAt) : '' }}</span>
              </div>
            }
          </div>
        </div>
      </app-card>
    }

    <!-- No Response -->
    @if (mock.noResponseCount() > 0) {
      <app-card>
        <div class="card-body">
          <h2 class="section-title">⏳ Sans réponse ({{ mock.noResponseCount() }})</h2>
          <div class="members-list">
            @for (c of noResponseMembers(); track c.memberId) {
              <div class="member-row">
                <div class="member-info">
                  <span class="member-name">{{ c.memberName }}</span>
                </div>
                <app-button variant="outline" size="sm" (clicked)="relance(c.memberId)">📲 Relancer</app-button>
              </div>
            }
          </div>
        </div>
      </app-card>
    }
  `,
  styles: [`
    @reference "tailwindcss";
    .page-header { @apply flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6; }
    .page-title { @apply text-2xl font-bold text-slate-900; }
    .page-subtitle { @apply text-sm text-slate-500 mt-1; }
    .header-actions { @apply flex items-center gap-3; }

    .summary-grid { @apply grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6; }
    .summary-card { @apply flex flex-col items-center p-4 rounded-xl; }
    .summary-count { @apply text-3xl font-bold; }
    .summary-label { @apply text-sm mt-1; }
    .confirmed { @apply bg-green-50; }
    .confirmed .summary-count { @apply text-green-700; }
    .declined { @apply bg-red-50; }
    .declined .summary-count { @apply text-red-700; }
    .pending { @apply bg-amber-50; }
    .pending .summary-count { @apply text-amber-700; }
    .quorum { @apply bg-blue-50; }
    .quorum .summary-count { @apply text-blue-700; }

    .quorum-section { @apply mb-6; }
    .quorum-bar { @apply w-full h-3 bg-slate-200 rounded-full overflow-hidden; }
    .quorum-fill { @apply h-full bg-green-500 rounded-full transition-all duration-500; }
    .quorum-text { @apply text-sm text-slate-600 mt-2 text-center; }

    .card-body { @apply p-2; }
    .section-title { @apply text-base font-semibold text-slate-900 mb-3; }

    .members-list { @apply space-y-1; }
    .member-row { @apply flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 border-b border-slate-100 last:border-none; }
    .declined-row { @apply bg-red-50/50; }
    .member-info { @apply flex flex-col gap-0.5; }
    .member-name { @apply text-sm font-medium text-slate-800; }
    .member-date { @apply text-xs text-slate-400; }
    .decline-reason { @apply text-xs text-red-600; }
  `],
})
export class ConfirmationsComponent {
  protected readonly mock = inject(MockDataService);
  protected readonly Math = Math;

  confirmedMembers() {
    return this.mock.confirmations().filter(c => c.status === 'confirmed');
  }

  declinedMembers() {
    return this.mock.confirmations().filter(c => c.status === 'declined');
  }

  noResponseMembers() {
    return this.mock.confirmations().filter(c => c.status === 'no_response');
  }

  relance(memberId: string): void {
    this.mock.relanceConfirmation(memberId);
  }

  relanceAll(): void {
    this.mock.relanceAllNoResponse();
  }

  formatDate(isoDate: string): string {
    return new Date(isoDate).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
  }
}

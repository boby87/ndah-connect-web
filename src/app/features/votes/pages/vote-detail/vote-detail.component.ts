import { ChangeDetectionStrategy, Component, inject, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageHeaderComponent } from '../../../../shared/components/layout/page-header/page-header.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { MockDataService } from '../../../../core/services/mock-data.service';

@Component({
  selector: 'app-vote-detail',
  standalone: true,
  imports: [PageHeaderComponent, CardComponent, BadgeComponent, ButtonComponent],
  template: `
    <app-page-header title="Détail du vote" backLink="/votes" />

    @if (vote(); as v) {
      <div class="detail-layout">
        <div class="detail-header">
          <div>
            <h2 class="vote-title">{{ v.title }}</h2>
            <p class="vote-desc">{{ v.description }}</p>
          </div>
          <app-badge [variant]="v.status === 'open' ? 'success' : v.status === 'draft' ? 'warning' : 'secondary'">
            {{ v.status === 'open' ? '🟢 En cours' : v.status === 'draft' ? '📝 Brouillon' : '✅ Clôturé' }}
          </app-badge>
        </div>

        <div class="detail-grid">
          <app-card>
            <div class="section">
              <h3 class="section-title">📊 Résultats</h3>
              @for (opt of v.options; track opt.id) {
                <div class="result-row">
                  <div class="result-header">
                    <span class="result-label">{{ opt.label }}</span>
                    <span class="result-pct">{{ getPercent(opt.votes, totalVotes()) }}%</span>
                  </div>
                  <div class="result-bar-track">
                    <div class="result-bar-fill" [style.width.%]="getPercent(opt.votes, totalVotes())"
                         [class.winner]="isWinner(opt, v)"></div>
                  </div>
                  <span class="result-count">{{ opt.votes }} voix</span>
                </div>
              }
              <div class="total-votes">Total: {{ totalVotes() }} votes</div>
            </div>
          </app-card>

          <app-card>
            <div class="section">
              <h3 class="section-title">ℹ️ Informations</h3>
              <div class="info-grid">
                <div class="info-item"><span class="info-label">Type de majorité</span><span class="info-value">{{ getTypeLabel(v.type) }}</span></div>
                <div class="info-item"><span class="info-label">Créé par</span><span class="info-value">{{ v.createdBy }}</span></div>
                @if (v.startedAt) { <div class="info-item"><span class="info-label">Démarré le</span><span class="info-value">{{ v.startedAt }}</span></div> }
                @if (v.closedAt) { <div class="info-item"><span class="info-label">Clôturé le</span><span class="info-value">{{ v.closedAt }}</span></div> }
              </div>
            </div>
          </app-card>

          @if (v.status === 'open') {
            <app-card>
              <div class="section">
                <h3 class="section-title">⚡ Actions</h3>
                <div class="actions">
                  <app-button variant="primary" (clicked)="closeVote(v.id)">⏹️ Clôturer le vote</app-button>
                  <app-button variant="outline" (clicked)="router.navigate(['/votes', v.id, 'results'])">📊 Résultats détaillés</app-button>
                </div>
              </div>
            </app-card>
          }

          @if (v.status === 'draft') {
            <app-card>
              <div class="section">
                <h3 class="section-title">⚡ Actions</h3>
                <app-button variant="primary" (clicked)="launchVote(v.id)">🗳️ Lancer le vote</app-button>
              </div>
            </app-card>
          }
        </div>
      </div>
    } @else {
      <div class="not-found">Vote non trouvé</div>
    }
  `,
  styles: `@reference "tailwindcss";
    .detail-layout { @apply flex flex-col gap-6; }
    .detail-header { @apply flex justify-between items-start bg-white rounded-xl p-4 shadow-sm border; }
    .vote-title { @apply text-xl font-bold text-slate-900; }
    .vote-desc { @apply text-sm text-slate-500 mt-1; }
    .detail-grid { @apply grid grid-cols-1 lg:grid-cols-2 gap-6; }
    .section { @apply p-2 flex flex-col gap-3; }
    .section-title { @apply text-base font-semibold text-slate-900; }
    .result-row { @apply flex flex-col gap-1; }
    .result-header { @apply flex justify-between; }
    .result-label { @apply text-sm font-medium text-slate-700; }
    .result-pct { @apply text-sm font-bold text-slate-900; }
    .result-bar-track { @apply h-4 bg-slate-100 rounded-full overflow-hidden; }
    .result-bar-fill { @apply h-full bg-blue-500 rounded-full transition-all; }
    .result-bar-fill.winner { @apply bg-green-500; }
    .result-count { @apply text-xs text-slate-500; }
    .total-votes { @apply text-sm text-slate-500 pt-2 border-t; }
    .info-grid { @apply grid grid-cols-2 gap-3; }
    .info-item { @apply flex flex-col; }
    .info-label { @apply text-xs text-slate-500; }
    .info-value { @apply text-sm font-semibold text-slate-900; }
    .actions { @apply flex flex-col gap-2; }
    .not-found { @apply text-center py-12 text-slate-400; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VoteDetailComponent {
  private readonly route = inject(ActivatedRoute);
  protected readonly router = inject(Router);
  protected readonly mock = inject(MockDataService);

  readonly vote = computed(() => {
    const id = this.route.snapshot.paramMap.get('id');
    return this.mock.votes().find(v => v.id === id) ?? null;
  });

  readonly totalVotes = computed(() => {
    const v = this.vote();
    return v ? v.options.reduce((s, o) => s + o.votes, 0) : 0;
  });

  getPercent(votes: number, total: number): number {
    return total === 0 ? 0 : Math.round((votes / total) * 100);
  }

  getTypeLabel(type: string): string {
    const map: Record<string, string> = { majority: 'Majorité simple', two_thirds: 'Deux tiers', unanimous: 'Unanimité' };
    return map[type] ?? type;
  }

  isWinner(opt: any, vote: any): boolean {
    const max = Math.max(...vote.options.map((o: any) => o.votes));
    return opt.votes === max && max > 0;
  }

  closeVote(voteId: string): void {
    this.mock._votes.update(votes => votes.map(v =>
      v.id === voteId ? { ...v, status: 'closed' as const, closedAt: new Date().toISOString() } : v
    ));
  }

  launchVote(voteId: string): void {
    this.mock._votes.update(votes => votes.map(v =>
      v.id === voteId ? { ...v, status: 'open' as const, startedAt: new Date().toISOString() } : v
    ));
  }
}

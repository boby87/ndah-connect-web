import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PageHeaderComponent } from '../../../../shared/components/layout/page-header/page-header.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { MockDataService } from '../../../../core/services/mock-data.service';

@Component({
  selector: 'app-vote-list',
  standalone: true,
  imports: [PageHeaderComponent, ButtonComponent, CardComponent, BadgeComponent],
  template: `
    <app-page-header title="Votes">
      <app-button variant="primary" (clicked)="router.navigate(['/votes/create'])">
        🗳️ Nouveau vote
      </app-button>
    </app-page-header>

    <div class="vote-list">
      @for (vote of mock.votes(); track vote.id) {
        <app-card class="vote-card" (click)="router.navigate(['/votes', vote.id])">
          <div class="card-body">
            <div class="card-top">
              <div>
                <h3 class="vote-title">{{ vote.title }}</h3>
                <p class="vote-desc">{{ vote.description }}</p>
              </div>
              <app-badge [variant]="getStatusVariant(vote.status)">{{ getStatusLabel(vote.status) }}</app-badge>
            </div>

            <div class="vote-meta">
              <app-badge variant="secondary" size="sm">{{ getTypeLabel(vote.type) }}</app-badge>
              @if (vote.startedAt) { <span class="meta-text">Débuté: {{ vote.startedAt }}</span> }
              @if (vote.closedAt) { <span class="meta-text">Clôturé: {{ vote.closedAt }}</span> }
            </div>

            @if (vote.status !== 'draft') {
              <div class="vote-results-preview">
                @for (opt of vote.options; track opt.id) {
                  <div class="result-row">
                    <span class="result-label">{{ opt.label }}</span>
                    <div class="result-bar-track">
                      <div class="result-bar-fill" [style.width.%]="getPercent(opt.votes, getTotalVotes(vote))"></div>
                    </div>
                    <span class="result-count">{{ opt.votes }}</span>
                  </div>
                }
              </div>
            }

            @if (vote.status === 'open') {
              <div class="card-actions">
                <app-button variant="outline" size="sm" (clicked)="router.navigate(['/votes', vote.id, 'results']); $event.stopPropagation()">
                  📊 Voir résultats
                </app-button>
              </div>
            }
          </div>
        </app-card>
      } @empty {
        <div class="empty-state">Aucun vote créé</div>
      }
    </div>
  `,
  styles: `@reference "tailwindcss";
    .vote-list { @apply flex flex-col gap-4; }
    .vote-card { @apply cursor-pointer; }
    .card-body { @apply p-2 flex flex-col gap-3; }
    .card-top { @apply flex justify-between items-start gap-2; }
    .vote-title { @apply font-semibold text-slate-900; }
    .vote-desc { @apply text-sm text-slate-500 mt-0.5; }
    .vote-meta { @apply flex items-center gap-3 flex-wrap; }
    .meta-text { @apply text-xs text-slate-400; }
    .vote-results-preview { @apply flex flex-col gap-2 bg-slate-50 rounded-lg p-3; }
    .result-row { @apply flex items-center gap-2; }
    .result-label { @apply text-xs text-slate-600 w-24; }
    .result-bar-track { @apply flex-1 h-2 bg-slate-200 rounded-full overflow-hidden; }
    .result-bar-fill { @apply h-full bg-blue-500 rounded-full transition-all; }
    .result-count { @apply text-xs font-medium text-slate-700 w-8 text-right; }
    .card-actions { @apply flex justify-end; }
    .empty-state { @apply text-center py-12 text-slate-400; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VoteListComponent {
  protected readonly router = inject(Router);
  protected readonly mock = inject(MockDataService);

  getStatusVariant(status: string): 'primary' | 'secondary' | 'warning' | 'info' | 'success' | 'danger' {
    const map: Record<string, 'success' | 'secondary' | 'warning'> = { open: 'success', closed: 'secondary', draft: 'warning' };
    return map[status] ?? 'secondary';
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = { open: '🟢 En cours', closed: '✅ Clôturé', draft: '📝 Brouillon' };
    return map[status] ?? status;
  }

  getTypeLabel(type: string): string {
    const map: Record<string, string> = { majority: 'Majorité simple', two_thirds: 'Deux tiers', unanimous: 'Unanimité' };
    return map[type] ?? type;
  }

  getTotalVotes(vote: any): number {
    return vote.options.reduce((s: number, o: any) => s + o.votes, 0);
  }

  getPercent(votes: number, total: number): number {
    return total === 0 ? 0 : Math.round((votes / total) * 100);
  }
}

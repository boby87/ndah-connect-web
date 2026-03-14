import { ChangeDetectionStrategy, Component, inject, computed, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageHeaderComponent } from '../../../../shared/components/layout/page-header/page-header.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { MockDataService } from '../../../../core/services/mock-data.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-vote-results',
  standalone: true,
  imports: [PageHeaderComponent, CardComponent, BadgeComponent, ButtonComponent, FormsModule],
  template: `
    <app-page-header title="Résultats du vote" backLink="/votes" />

    @if (vote(); as v) {
      <div class="results-layout">
        <h2 class="vote-title">{{ v.title }}</h2>

        <app-card>
          <div class="section">
            <h3 class="section-title">📊 Résultats détaillés</h3>
            @for (opt of v.options; track opt.id) {
              <div class="result-row">
                <div class="result-info">
                  <span class="result-label">{{ opt.label }}</span>
                  <span class="result-votes">{{ opt.votes }} voix ({{ getPercent(opt.votes, totalVotes()) }}%)</span>
                </div>
                <div class="bar-track">
                  <div class="bar-fill" [style.width.%]="getPercent(opt.votes, totalVotes())"
                       [class.winner]="isWinner(opt, v)"></div>
                </div>
              </div>
            }

            <div class="summary">
              <p>Total: <strong>{{ totalVotes() }}</strong> votes sur {{ mock.activeMembers().length }} membres actifs</p>
              <p>Participation: <strong>{{ getPercent(totalVotes(), mock.activeMembers().length) }}%</strong></p>
              @if (getDecision(v); as d) {
                <div class="decision-box" [class.approved]="d.approved" [class.rejected]="!d.approved">
                  <span>{{ d.approved ? '✅ ADOPTÉ' : '❌ REJETÉ' }} - {{ d.reason }}</span>
                </div>
              }
            </div>

            @if (v.status === 'open' && !recorded()) {
              <div class="record-section">
                <h4 class="record-title">Enregistrer les résultats finaux</h4>
                @for (opt of v.options; track opt.id; let i = $index) {
                  <div class="record-row">
                    <span class="record-label">{{ opt.label }}</span>
                    <input type="number" class="record-input" [ngModel]="opt.votes" (ngModelChange)="updateVotes(v.id, opt.id, $event)" min="0" />
                  </div>
                }
                <app-button variant="primary" (clicked)="recordResults(v.id)">💾 Enregistrer et clôturer</app-button>
              </div>
            }
            @if (recorded()) {
              <p class="recorded-text">✅ Résultats enregistrés avec succès</p>
            }
          </div>
        </app-card>
      </div>
    } @else {
      <div class="not-found">Vote non trouvé</div>
    }
  `,
  styles: `@reference "tailwindcss";
    .results-layout { @apply flex flex-col gap-6 max-w-2xl; }
    .vote-title { @apply text-xl font-bold text-slate-900; }
    .section { @apply p-4 flex flex-col gap-4; }
    .section-title { @apply text-base font-semibold text-slate-900; }
    .result-row { @apply flex flex-col gap-1; }
    .result-info { @apply flex justify-between; }
    .result-label { @apply text-sm font-medium text-slate-700; }
    .result-votes { @apply text-sm text-slate-500; }
    .bar-track { @apply h-6 bg-slate-100 rounded-full overflow-hidden; }
    .bar-fill { @apply h-full bg-blue-500 rounded-full transition-all; }
    .bar-fill.winner { @apply bg-green-500; }
    .summary { @apply text-sm text-slate-600 pt-3 border-t flex flex-col gap-1; }
    .decision-box { @apply rounded-lg p-3 mt-2 font-medium; }
    .decision-box.approved { @apply bg-green-50 text-green-700; }
    .decision-box.rejected { @apply bg-red-50 text-red-700; }
    .record-section { @apply flex flex-col gap-3 pt-3 border-t; }
    .record-title { @apply text-sm font-semibold text-slate-800; }
    .record-row { @apply flex items-center gap-3; }
    .record-label { @apply text-sm text-slate-600 w-32; }
    .record-input { @apply border border-slate-300 rounded-lg px-3 py-1.5 text-sm w-20; }
    .recorded-text { @apply text-green-600 font-medium; }
    .not-found { @apply text-center py-12 text-slate-400; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VoteResultsComponent {
  private readonly route = inject(ActivatedRoute);
  protected readonly router = inject(Router);
  protected readonly mock = inject(MockDataService);

  readonly recorded = signal(false);

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

  isWinner(opt: any, vote: any): boolean {
    const max = Math.max(...vote.options.map((o: any) => o.votes));
    return opt.votes === max && max > 0;
  }

  getDecision(v: any): { approved: boolean; reason: string } | null {
    if (v.status !== 'closed') return null;
    const total = v.options.reduce((s: number, o: any) => s + o.votes, 0);
    const forVotes = v.options[0]?.votes ?? 0;
    const threshold = v.type === 'two_thirds' ? 0.67 : v.type === 'unanimous' ? 1.0 : 0.5;
    const approved = total > 0 && (forVotes / total) > threshold;
    return { approved, reason: `${forVotes}/${total} (${this.getPercent(forVotes, total)}%) - seuil requis ${Math.round(threshold * 100)}%` };
  }

  updateVotes(voteId: string, optionId: string, value: number): void {
    this.mock._votes.update(votes => votes.map(v =>
      v.id === voteId ? { ...v, options: v.options.map(o => o.id === optionId ? { ...o, votes: value } : o) } : v
    ));
  }

  recordResults(voteId: string): void {
    this.mock._votes.update(votes => votes.map(v =>
      v.id === voteId ? { ...v, status: 'closed' as const, closedAt: new Date().toISOString() } : v
    ));
    this.recorded.set(true);
  }
}

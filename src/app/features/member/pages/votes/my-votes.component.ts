import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, resource, signal } from '@angular/core';

import { AlertComponent } from '../../../../shared/components/ui/alert/alert.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { EmptyStateComponent } from '../../../../shared/components/ui/empty-state/empty-state.component';
import { SpinnerComponent } from '../../../../shared/components/ui/spinner/spinner.component';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { NotificationService } from '../../../../core/services/notification.service';
import { MemberVoteService } from '../../services/vote.service';
import type { Vote, VoteOption } from '../../../../shared/models/entities/vote.model';
import { formatApiError } from '../../../../core/utils';

interface VoteSelectionState {
  selectedOptionId: string | null;
  hasVoted: boolean;
  submitting: boolean;
}

@Component({
  selector: 'tc-my-votes',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DecimalPipe,
    AlertComponent,
    BadgeComponent,
    ButtonComponent,
    CardComponent,
    EmptyStateComponent,
    SpinnerComponent,
    DateFormatPipe,
  ],
  template: `
    <div class="space-y-6">
      <header>
        <h1 class="text-2xl font-bold text-gray-900">Mes votes</h1>
        <p class="text-sm text-gray-500">
          Exprimez votre voix sur les motions et décisions de la tontine.
        </p>
      </header>

      @if (errorMessage(); as err) {
        <tc-alert kind="error">{{ err }}</tc-alert>
      }

      @if (resource.isLoading()) {
        <div class="flex justify-center py-12"><tc-spinner size="lg" /></div>
      } @else if (votes().length === 0) {
        <tc-card>
          <tc-empty-state
            title="Aucun vote en cours"
            icon="🗳"
            description="Vous serez notifié dès qu'un nouveau vote sera ouvert."
          />
        </tc-card>
      } @else {
        <section class="space-y-4">
          @for (v of votes(); track v.id) {
            <tc-card>
              <div class="flex flex-wrap items-start justify-between gap-3">
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-2 flex-wrap">
                    <p class="font-semibold text-gray-900">{{ v.question }}</p>
                    <tc-badge [kind]="statusKind(v.status)">{{ statusLabel(v.status) }}</tc-badge>
                    <tc-badge kind="neutral">{{ v.scope === 'ASSEMBLY' ? 'Assemblée Générale' : 'Standard' }}</tc-badge>
                    @if (v.isAnonymous) {
                      <tc-badge kind="info">Anonyme</tc-badge>
                    }
                  </div>
                  @if (v.description) {
                    <p class="mt-1 text-sm text-gray-600">{{ v.description }}</p>
                  }
                  <p class="text-xs text-gray-500 mt-1">
                    Du {{ v.opensAt | tcDate: true }} au {{ v.closesAt | tcDate: true }}
                  </p>
                </div>
                <div class="text-right text-sm">
                  <p class="text-gray-500">Participation</p>
                  <p class="font-semibold text-gray-900">{{ v.totalVoted }} / {{ v.totalVoters }}</p>
                  <p class="text-xs text-gray-500">
                    {{ participation(v) | number: '1.0-0' }}%
                  </p>
                </div>
              </div>

              @if (hasVoted(v.id)) {
                <tc-alert kind="success" class="mt-4">
                  ✓ Vous avez voté pour cette motion. Merci pour votre participation.
                </tc-alert>
              }

              @if (v.status === 'OPEN' && !hasVoted(v.id)) {
                <ul class="mt-4 space-y-2" role="radiogroup" [attr.aria-label]="v.question">
                  @for (opt of v.options; track opt.id) {
                    <li>
                      <label
                        class="flex items-center gap-3 px-3 py-2 border rounded-lg cursor-pointer hover:bg-gray-50 transition"
                        [class.border-blue-500]="selectedOption(v.id) === opt.id"
                        [class.bg-blue-50]="selectedOption(v.id) === opt.id"
                        [class.border-gray-200]="selectedOption(v.id) !== opt.id"
                      >
                        <input
                          type="radio"
                          [name]="'vote-' + v.id"
                          [value]="opt.id"
                          [checked]="selectedOption(v.id) === opt.id"
                          (change)="selectOption(v.id, opt.id)"
                          class="text-blue-600"
                        />
                        <span class="flex-1 text-sm text-gray-900">{{ opt.label }}</span>
                      </label>
                    </li>
                  }
                </ul>

                <div class="mt-4 flex justify-end">
                  <tc-button
                    variant="primary"
                    [disabled]="!selectedOption(v.id)"
                    [loading]="isSubmitting(v.id)"
                    (clicked)="onCast(v)"
                  >
                    Soumettre mon vote
                  </tc-button>
                </div>
              } @else if (!v.hideResultsUntilClose || v.status === 'CLOSED') {
                <ul class="mt-4 space-y-2">
                  @for (opt of v.options; track opt.id) {
                    <li>
                      <div class="flex items-center justify-between text-sm">
                        <span class="text-gray-900">{{ opt.label }}</span>
                        <span class="font-medium text-gray-700">
                          {{ opt.count }} ({{ percent(v, opt.count) | number: '1.0-0' }}%)
                        </span>
                      </div>
                      <div class="mt-1 h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                        <div class="h-full bg-blue-500" [style.width.%]="percent(v, opt.count)"></div>
                      </div>
                    </li>
                  }
                </ul>
              } @else {
                <p class="mt-4 text-sm text-amber-600">
                  🔒 Résultats masqués jusqu'à la clôture du vote.
                </p>
              }

              @if (v.status === 'CLOSED' && v.passed !== undefined) {
                <div
                  class="mt-3 rounded-lg px-3 py-2"
                  [class.bg-green-50]="v.passed"
                  [class.text-green-700]="v.passed"
                  [class.bg-red-50]="!v.passed"
                  [class.text-red-700]="!v.passed"
                >
                  <p class="text-sm font-medium">
                    {{ v.passed ? '✓ Motion adoptée' : '✗ Motion rejetée' }}
                    (quorum {{ (v.quorumPercent * 100 | number: '1.0-0') }}% requis)
                  </p>
                </div>
              }
            </tc-card>
          }
        </section>
      }
    </div>
  `,
})
export class MyVotesComponent {
  private readonly service = inject(MemberVoteService);
  private readonly notifications = inject(NotificationService);

  readonly resource = resource({
    loader: () => this.service.list(),
  });

  readonly votes = computed(() => this.resource.value() ?? []);
  readonly errorMessage = signal<string | null>(null);

  private readonly selections = signal<Record<string, VoteSelectionState>>({});

  selectedOption(voteId: string): string | null {
    return this.selections()[voteId]?.selectedOptionId ?? null;
  }

  hasVoted(voteId: string): boolean {
    return this.selections()[voteId]?.hasVoted ?? false;
  }

  isSubmitting(voteId: string): boolean {
    return this.selections()[voteId]?.submitting ?? false;
  }

  selectOption(voteId: string, optionId: string): void {
    this.selections.update((map) => ({
      ...map,
      [voteId]: {
        selectedOptionId: optionId,
        hasVoted: map[voteId]?.hasVoted ?? false,
        submitting: false,
      },
    }));
  }

  async onCast(vote: Vote): Promise<void> {
    const optionId = this.selectedOption(vote.id);
    if (!optionId) return;

    this.errorMessage.set(null);
    this.patchSelection(vote.id, { submitting: true });

    try {
      await this.service.cast(vote.id, optionId);
      this.patchSelection(vote.id, { hasVoted: true, submitting: false });
      this.notifications.success('Vote enregistré. Merci pour votre participation.');
      this.resource.reload();
    } catch (error: unknown) {
      const msg =
        formatApiError(error, 'Impossible d\'enregistrer votre vote.');
      this.errorMessage.set(msg);
      this.patchSelection(vote.id, { submitting: false });
    }
  }

  participation(v: Vote): number {
    return v.totalVoters === 0 ? 0 : (v.totalVoted / v.totalVoters) * 100;
  }

  percent(v: Vote, count: number): number {
    const total = v.options.reduce((sum, o: VoteOption) => sum + o.count, 0);
    return total === 0 ? 0 : (count / total) * 100;
  }

  statusLabel(s: Vote['status']): string {
    return { DRAFT: 'Brouillon', OPEN: 'En cours', CLOSED: 'Clôturé', CANCELLED: 'Annulé' }[s];
  }

  statusKind(s: Vote['status']): 'info' | 'success' | 'neutral' | 'danger' {
    return ({ DRAFT: 'neutral', OPEN: 'info', CLOSED: 'success', CANCELLED: 'danger' } as const)[s];
  }

  private patchSelection(voteId: string, patch: Partial<VoteSelectionState>): void {
    this.selections.update((map) => ({
      ...map,
      [voteId]: {
        selectedOptionId: map[voteId]?.selectedOptionId ?? null,
        hasVoted: map[voteId]?.hasVoted ?? false,
        submitting: map[voteId]?.submitting ?? false,
        ...patch,
      },
    }));
  }
}

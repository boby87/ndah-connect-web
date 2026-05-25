import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, resource, signal } from '@angular/core';
import { AlertComponent } from '../../../../shared/components/ui/alert/alert.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { EmptyStateComponent } from '../../../../shared/components/ui/empty-state/empty-state.component';
import { InputComponent } from '../../../../shared/components/ui/input/input.component';
import { TextareaComponent } from '../../../../shared/components/ui/textarea/textarea.component';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { NotificationService } from '../../../../core/services/notification.service';
import { PresidentService } from '../../services/president.service';
import type { Vote, VoteAudience, VoteScope } from '../../../../shared/models/entities/vote.model';

@Component({
  selector: 'tc-votes-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DecimalPipe,
    AlertComponent,
    BadgeComponent,
    ButtonComponent,
    CardComponent,
    EmptyStateComponent,
    InputComponent,
    TextareaComponent,
    DateFormatPipe,
  ],
  template: `
    <div class="space-y-6">
      <header>
        <h1 class="text-2xl font-bold text-gray-900">Votes en ligne</h1>
        <p class="text-sm text-gray-500">Lancez des votes anonymes ou nominatifs et suivez les résultats.</p>
      </header>

      @if (errorMessage(); as err) {
        <tc-alert kind="error">{{ err }}</tc-alert>
      }

      <div class="grid gap-6 lg:grid-cols-3">
        <div class="lg:col-span-2 space-y-4">
          @if (resource.isLoading()) {
            <p class="text-sm text-gray-500">Chargement…</p>
          } @else if (votes().length === 0) {
            <tc-card>
              <tc-empty-state title="Aucun vote" icon="🗳" description="Lancez votre premier vote en ligne." />
            </tc-card>
          } @else {
            @for (v of votes(); track v.id) {
              <tc-card>
                <div class="flex flex-wrap items-start justify-between gap-3">
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-2 flex-wrap">
                      <p class="font-semibold text-gray-900">{{ v.question }}</p>
                      <tc-badge [kind]="statusKind(v.status)">{{ statusLabel(v.status) }}</tc-badge>
                      <tc-badge kind="neutral">{{ v.scope === 'ASSEMBLY' ? 'AG' : 'Standard' }}</tc-badge>
                      @if (v.isAnonymous) {
                        <tc-badge kind="info">Anonyme</tc-badge>
                      }
                    </div>
                    @if (v.description) {
                      <p class="mt-1 text-sm text-gray-600">{{ v.description }}</p>
                    }
                    <p class="text-xs text-gray-500 mt-1">
                      Ouvert du {{ v.opensAt | tcDate: true }} au {{ v.closesAt | tcDate: true }}
                    </p>
                  </div>
                  <div class="text-right text-sm">
                    <p class="text-gray-500">Participation</p>
                    <p class="font-semibold text-gray-900">{{ v.totalVoted }} / {{ v.totalVoters }}</p>
                    <p class="text-xs text-gray-500">{{ participation(v) | number: '1.0-0' }}%</p>
                  </div>
                </div>

                @if (!v.hideResultsUntilClose || v.status === 'CLOSED') {
                  <ul class="mt-4 space-y-2">
                    @for (opt of v.options; track opt.id) {
                      <li>
                        <div class="flex items-center justify-between text-sm">
                          <span class="text-gray-900">{{ opt.label }}</span>
                          <span class="font-medium text-gray-700">{{ opt.count }} ({{ percent(v, opt.count) | number: '1.0-0' }}%)</span>
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
                  <div class="mt-3 rounded-lg px-3 py-2"
                    [class.bg-green-50]="v.passed" [class.text-green-700]="v.passed"
                    [class.bg-red-50]="!v.passed" [class.text-red-700]="!v.passed">
                    <p class="text-sm font-medium">
                      {{ v.passed ? '✓ Motion adoptée' : '✗ Motion rejetée' }}
                      (quorum {{ (v.quorumPercent * 100 | number: '1.0-0') }}% requis)
                    </p>
                  </div>
                }

                @if (v.status === 'OPEN') {
                  <div class="mt-4 flex justify-end">
                    <tc-button variant="primary" size="sm" [loading]="closingId() === v.id" (clicked)="close(v.id)">
                      Clôturer
                    </tc-button>
                  </div>
                }
              </tc-card>
            }
          }
        </div>

        <aside>
          <tc-card title="Lancer un vote">
            <form class="space-y-4" (submit)="onSubmit($event)">
              <tc-input
                label="Question"
                [(value)]="question"
                [(touched)]="questionTouched"
                [error]="questionError()"
                [required]="true"
              />
              <tc-textarea
                label="Description (optionnel)"
                [(value)]="description"
                [rows]="2"
              />
              <tc-textarea
                label="Options (une par ligne)"
                [(value)]="optionsText"
                [(touched)]="optionsTouched"
                [error]="optionsError()"
                [rows]="3"
                hint="Minimum 2 options."
                [required]="true"
              />
              <div>
                <p class="text-sm font-medium text-gray-700 mb-1">Portée</p>
                <div class="flex flex-col gap-1 text-sm">
                  <label><input type="radio" name="scope" [checked]="scope() === 'STANDARD'" (change)="scope.set('STANDARD')" /> Standard</label>
                  <label><input type="radio" name="scope" [checked]="scope() === 'ASSEMBLY'" (change)="scope.set('ASSEMBLY')" /> Assemblée Générale</label>
                </div>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-700 mb-1">Audience</p>
                <div class="flex flex-col gap-1 text-sm">
                  <label><input type="radio" name="audience" [checked]="audience() === 'ALL'" (change)="audience.set('ALL')" /> Tous</label>
                  <label><input type="radio" name="audience" [checked]="audience() === 'BUREAU'" (change)="audience.set('BUREAU')" /> Bureau</label>
                  <label><input type="radio" name="audience" [checked]="audience() === 'MEMBERS_ACTIVE'" (change)="audience.set('MEMBERS_ACTIVE')" /> Membres actifs</label>
                </div>
              </div>
              <label class="flex items-center gap-2 text-sm">
                <input type="checkbox" [checked]="isAnonymous()" (change)="isAnonymous.set(checked($event))" />
                Vote anonyme
              </label>
              <label class="flex items-center gap-2 text-sm">
                <input type="checkbox" [checked]="hideResults()" (change)="hideResults.set(checked($event))" />
                Cacher les résultats jusqu'à la clôture
              </label>
              <tc-input label="Ouverture (YYYY-MM-DDTHH:mm)" [(value)]="opensAt" [required]="true" />
              <tc-input label="Clôture (YYYY-MM-DDTHH:mm)" [(value)]="closesAt" [required]="true" />
              <tc-input label="Quorum requis (%)" type="number" [(value)]="quorum" />
              <tc-button type="submit" variant="primary" [fullWidth]="true" [loading]="submitting()">
                Lancer le vote
              </tc-button>
            </form>
          </tc-card>
        </aside>
      </div>
    </div>
  `,
})
export class VotesPageComponent {
  private readonly service = inject(PresidentService);
  private readonly notifications = inject(NotificationService);

  readonly resource = resource({
    loader: () => this.service.getVotes(),
  });

  readonly votes = computed(() => this.resource.value() ?? []);

  readonly question = signal('');
  readonly questionTouched = signal(false);
  readonly description = signal('');
  readonly optionsText = signal('');
  readonly optionsTouched = signal(false);
  readonly scope = signal<VoteScope>('STANDARD');
  readonly audience = signal<VoteAudience>('MEMBERS_ACTIVE');
  readonly isAnonymous = signal(true);
  readonly hideResults = signal(false);
  readonly opensAt = signal('');
  readonly closesAt = signal('');
  readonly quorum = signal('50');

  readonly submitting = signal(false);
  readonly closingId = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);

  readonly questionError = computed(() => (this.question().trim() ? '' : 'Question requise.'));
  readonly optionsError = computed(() => {
    const list = this.optionsText().split('\n').map((s) => s.trim()).filter(Boolean);
    return list.length >= 2 ? '' : 'Au moins 2 options requises.';
  });

  checked(event: Event): boolean {
    return (event.target as HTMLInputElement).checked;
  }

  statusLabel(s: Vote['status']): string {
    return { DRAFT: 'Brouillon', OPEN: 'En cours', CLOSED: 'Clôturé', CANCELLED: 'Annulé' }[s];
  }

  statusKind(s: Vote['status']): 'info' | 'success' | 'neutral' | 'danger' {
    return ({ DRAFT: 'neutral', OPEN: 'info', CLOSED: 'success', CANCELLED: 'danger' } as const)[s];
  }

  participation(v: Vote): number {
    if (v.totalVoters === 0) return 0;
    return (v.totalVoted / v.totalVoters) * 100;
  }

  percent(v: Vote, count: number): number {
    const total = v.options.reduce((sum, o) => sum + o.count, 0);
    return total === 0 ? 0 : (count / total) * 100;
  }

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.questionTouched.set(true);
    this.optionsTouched.set(true);
    this.errorMessage.set(null);

    if (this.questionError() || this.optionsError()) return;

    const options = this.optionsText().split('\n').map((s) => s.trim()).filter(Boolean);

    this.submitting.set(true);
    try {
      await this.service.createVote({
        question: this.question().trim(),
        description: this.description().trim() || undefined,
        options,
        isAnonymous: this.isAnonymous(),
        hideResultsUntilClose: this.hideResults(),
        scope: this.scope(),
        audience: this.audience(),
        opensAt: this.opensAt() ? new Date(this.opensAt()).toISOString() : new Date().toISOString(),
        closesAt: this.closesAt()
          ? new Date(this.closesAt()).toISOString()
          : new Date(Date.now() + 7 * 24 * 3600_000).toISOString(),
        quorumPercent: (Number(this.quorum()) || 50) / 100,
      });
      this.notifications.success('Vote lancé.');
      this.question.set('');
      this.optionsText.set('');
      this.questionTouched.set(false);
      this.optionsTouched.set(false);
      this.resource.reload();
    } catch (e: unknown) {
      this.errorMessage.set((e as { error?: { message?: string } })?.error?.message ?? 'Erreur.');
    } finally {
      this.submitting.set(false);
    }
  }

  async close(id: string): Promise<void> {
    this.closingId.set(id);
    try {
      await this.service.closeVote(id);
      this.notifications.success('Vote clôturé.');
      this.resource.reload();
    } catch (e: unknown) {
      this.errorMessage.set((e as { error?: { message?: string } })?.error?.message ?? 'Erreur.');
    } finally {
      this.closingId.set(null);
    }
  }
}

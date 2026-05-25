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
import type { Conflict, ConflictDecisionOutcome } from '../../../../shared/models/entities/conflict.model';

const OUTCOME_OPTIONS: { value: ConflictDecisionOutcome; label: string; hint: string }[] = [
  { value: 'MEDIATION', label: 'Conciliation actée', hint: 'Les parties acceptent la médiation.' },
  { value: 'WARNING', label: 'Avertissement', hint: 'Avertissement formel sans sanction.' },
  { value: 'SANCTION', label: 'Sanction infligée', hint: 'Sanction disciplinaire à l\'encontre d\'une partie.' },
  { value: 'EXCLUSION_PROPOSED', label: 'Radiation proposée', hint: 'Escalade à l\'Assemblée pour vote.' },
  { value: 'CASE_CLOSED', label: 'Dossier clos', hint: 'Sans suite.' },
];

@Component({
  selector: 'tc-conflicts',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
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
        <h1 class="text-2xl font-bold text-gray-900">Médiation des conflits</h1>
        <p class="text-sm text-gray-500">
          Conflits escaladés par le Censeur. Vous pouvez programmer une médiation ou rendre une décision.
        </p>
      </header>

      @if (errorMessage(); as err) {
        <tc-alert kind="error">{{ err }}</tc-alert>
      }

      @if (resource.isLoading()) {
        <p class="text-sm text-gray-500">Chargement…</p>
      } @else if (conflicts().length === 0) {
        <tc-card>
          <tc-empty-state title="Aucun conflit en cours" icon="🤝" description="Tous les différends sont résolus." />
        </tc-card>
      } @else {
        @for (c of conflicts(); track c.id) {
          <tc-card>
            <div class="flex flex-wrap items-start justify-between gap-3">
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-2 flex-wrap">
                  <p class="font-semibold text-gray-900">{{ c.subject }}</p>
                  <tc-badge [kind]="severityKind(c.severity)">Sévérité {{ severityLabel(c.severity) }}</tc-badge>
                  <tc-badge [kind]="statusKind(c.status)">{{ statusLabel(c.status) }}</tc-badge>
                </div>
                <p class="mt-1 text-sm text-gray-700">{{ c.description }}</p>
                <p class="mt-2 text-xs text-gray-500">
                  Escaladé par {{ c.escalatedByFullName }} le {{ c.escalatedAt | tcDate: true }}
                </p>
              </div>
            </div>

            <div class="mt-4 flex flex-wrap gap-2 text-xs">
              @for (p of c.parties; track p.memberId) {
                <span class="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1">
                  {{ p.fullName }} <span class="text-gray-500">({{ partyRole(p.role) }})</span>
                </span>
              }
            </div>

            <details class="mt-3">
              <summary class="text-sm text-blue-600 cursor-pointer">Historique</summary>
              <ul class="mt-2 space-y-1 text-xs">
                @for (entry of c.history; track entry.at) {
                  <li>
                    <span class="text-gray-500">{{ entry.at | tcDate: true }}</span> —
                    <span class="font-medium">{{ entry.actor }}</span> : {{ entry.action }}
                    @if (entry.note) { <span class="text-gray-600 italic">— « {{ entry.note }} »</span> }
                  </li>
                }
              </ul>
            </details>

            @if (c.status === 'OPEN' || c.status === 'MEDIATION_SCHEDULED') {
              <div class="mt-4 border-t border-gray-100 pt-4">
                @if (active() === c.id + ':mediation') {
                  <div class="space-y-3">
                    <p class="text-sm font-medium text-gray-700">Programmer une médiation</p>
                    <tc-input
                      label="Date (YYYY-MM-DDTHH:mm)"
                      [(value)]="mediationAt"
                    />
                    <tc-textarea label="Note (optionnel)" [(value)]="mediationNote" [rows]="2" />
                    <div class="flex gap-2">
                      <tc-button variant="primary" [loading]="acting() === c.id + ':med'" (clicked)="scheduleMediation(c.id)">
                        Programmer
                      </tc-button>
                      <tc-button variant="outline" (clicked)="cancel()">Annuler</tc-button>
                    </div>
                  </div>
                } @else if (active() === c.id + ':decide') {
                  <div class="space-y-3">
                    <p class="text-sm font-medium text-gray-700">Rendre une décision</p>
                    <div class="space-y-2">
                      @for (opt of outcomeOptions; track opt.value) {
                        <label class="flex items-start gap-2 cursor-pointer rounded border p-2 hover:bg-gray-50"
                          [class.border-blue-500]="outcome() === opt.value"
                          [class.bg-blue-50]="outcome() === opt.value"
                          [class.border-gray-200]="outcome() !== opt.value">
                          <input type="radio" name="outcome" [checked]="outcome() === opt.value" (change)="outcome.set(opt.value)" />
                          <span>
                            <span class="block text-sm font-medium text-gray-900">{{ opt.label }}</span>
                            <span class="block text-xs text-gray-500">{{ opt.hint }}</span>
                          </span>
                        </label>
                      }
                    </div>
                    <tc-textarea label="Motivation" [(value)]="decisionComment" [(touched)]="decisionTouched"
                      [error]="decisionError()" [rows]="3" [required]="true" />
                    <div class="flex gap-2">
                      <tc-button variant="primary" [loading]="acting() === c.id + ':dec'" (clicked)="decide(c.id)">
                        Valider la décision
                      </tc-button>
                      <tc-button variant="outline" (clicked)="cancel()">Annuler</tc-button>
                    </div>
                  </div>
                } @else {
                  <div class="flex flex-wrap gap-2">
                    <tc-button variant="primary" (clicked)="openMediation(c.id)">Programmer médiation</tc-button>
                    <tc-button variant="success" (clicked)="openDecision(c.id)">Rendre décision</tc-button>
                  </div>
                }
              </div>
            } @else if (c.decisionOutcome) {
              <div class="mt-4 rounded-lg bg-gray-50 px-3 py-2">
                <p class="text-xs font-semibold text-gray-700">Décision rendue</p>
                <p class="text-sm text-gray-900">{{ outcomeLabel(c.decisionOutcome) }}</p>
                @if (c.decisionComment) {
                  <p class="mt-1 text-xs text-gray-600 italic">« {{ c.decisionComment }} »</p>
                }
              </div>
            }
          </tc-card>
        }
      }
    </div>
  `,
})
export class ConflictsComponent {
  private readonly service = inject(PresidentService);
  private readonly notifications = inject(NotificationService);

  protected readonly outcomeOptions = OUTCOME_OPTIONS;

  readonly resource = resource({
    loader: () => this.service.getConflicts(),
  });

  readonly conflicts = computed(() => this.resource.value() ?? []);

  readonly active = signal<string | null>(null);
  readonly acting = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);

  readonly mediationAt = signal('');
  readonly mediationNote = signal('');

  readonly outcome = signal<ConflictDecisionOutcome | null>(null);
  readonly decisionComment = signal('');
  readonly decisionTouched = signal(false);
  readonly decisionError = computed(() =>
    this.decisionComment().trim().length === 0 ? 'Motivation requise.' : '',
  );

  partyRole(role?: 'INITIATOR' | 'RESPONDENT' | 'WITNESS'): string {
    return role ? { INITIATOR: 'Plaignant', RESPONDENT: 'Mis en cause', WITNESS: 'Témoin' }[role] : 'Partie';
  }

  severityLabel(s: Conflict['severity']): string {
    return { LOW: 'Faible', MEDIUM: 'Moyenne', HIGH: 'Élevée' }[s];
  }
  severityKind(s: Conflict['severity']): 'success' | 'warning' | 'danger' {
    return { LOW: 'success', MEDIUM: 'warning', HIGH: 'danger' }[s] as 'success' | 'warning' | 'danger';
  }

  statusLabel(s: Conflict['status']): string {
    return {
      OPEN: 'Ouvert',
      MEDIATION_SCHEDULED: 'Médiation programmée',
      MEDIATED: 'Médié',
      DECIDED_BY_PRESIDENT: 'Décidé',
      ESCALATED_TO_ASSEMBLY: 'Renvoyé en AG',
      CLOSED: 'Clos',
    }[s];
  }
  statusKind(s: Conflict['status']): 'success' | 'warning' | 'danger' | 'info' | 'neutral' {
    if (s === 'CLOSED' || s === 'DECIDED_BY_PRESIDENT' || s === 'MEDIATED') return 'success';
    if (s === 'OPEN') return 'danger';
    return 'warning';
  }

  outcomeLabel(o: ConflictDecisionOutcome): string {
    return OUTCOME_OPTIONS.find((opt) => opt.value === o)?.label ?? o;
  }

  openMediation(id: string): void {
    this.active.set(`${id}:mediation`);
    this.mediationAt.set('');
    this.mediationNote.set('');
  }

  openDecision(id: string): void {
    this.active.set(`${id}:decide`);
    this.outcome.set(null);
    this.decisionComment.set('');
    this.decisionTouched.set(false);
  }

  cancel(): void {
    this.active.set(null);
  }

  async scheduleMediation(id: string): Promise<void> {
    if (!this.mediationAt()) return;
    this.acting.set(`${id}:med`);
    this.errorMessage.set(null);
    try {
      await this.service.scheduleConflictMediation(
        id,
        new Date(this.mediationAt()).toISOString(),
        this.mediationNote() || undefined,
      );
      this.notifications.success('Médiation programmée.');
      this.active.set(null);
      this.resource.reload();
    } catch (e: unknown) {
      this.errorMessage.set((e as { error?: { message?: string } })?.error?.message ?? 'Erreur.');
    } finally {
      this.acting.set(null);
    }
  }

  async decide(id: string): Promise<void> {
    this.decisionTouched.set(true);
    if (!this.outcome() || this.decisionError()) return;
    this.acting.set(`${id}:dec`);
    this.errorMessage.set(null);
    try {
      await this.service.decideConflict(id, this.outcome()!, this.decisionComment().trim());
      this.notifications.success('Décision enregistrée.');
      this.active.set(null);
      this.resource.reload();
    } catch (e: unknown) {
      this.errorMessage.set((e as { error?: { message?: string } })?.error?.message ?? 'Erreur.');
    } finally {
      this.acting.set(null);
    }
  }
}

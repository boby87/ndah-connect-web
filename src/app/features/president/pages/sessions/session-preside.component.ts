import { DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  resource,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AlertComponent } from '../../../../shared/components/ui/alert/alert.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { SpinnerComponent } from '../../../../shared/components/ui/spinner/spinner.component';
import { CurrencyXafPipe } from '../../../../shared/pipes/currency-xaf.pipe';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { StatusLabelPipe } from '../../../../shared/pipes/status-label.pipe';
import { NotificationService } from '../../../../core/services/notification.service';
import { SessionStatus } from '../../../../core/enums/session-status.enum';
import { PresidentService } from '../../services/president.service';
import { formatApiError } from '../../../../core/utils';
import type { AgendaDraft } from '../../../../shared/models/entities/agenda-draft.model';

@Component({
  selector: 'tc-session-preside',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DecimalPipe,
    RouterLink,
    AlertComponent,
    BadgeComponent,
    ButtonComponent,
    CardComponent,
    SpinnerComponent,
    CurrencyXafPipe,
    DateFormatPipe,
    StatusLabelPipe,
  ],
  template: `
    <div class="space-y-6">
      <a routerLink="/president/sessions" class="inline-flex items-center text-sm text-blue-600 hover:underline">
        ← Retour aux séances
      </a>

      @if (resource.isLoading()) {
        <div class="flex justify-center py-12"><tc-spinner size="lg" /></div>
      } @else if (session(); as s) {
        <header class="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Séance #{{ s.number }}</h1>
            <p class="text-sm text-gray-500">
              {{ s.scheduledAt | tcDate: true }}
              @if (s.location) { · 📍 {{ s.location }} }
            </p>
          </div>
          <tc-badge [kind]="statusKind(s.status)">
            {{ s.status | statusLabel: 'session' }}
          </tc-badge>
        </header>

        @if (errorMessage(); as err) {
          <tc-alert kind="error">{{ err }}</tc-alert>
        }

        <div class="grid gap-6 lg:grid-cols-3">
          <div class="lg:col-span-2 space-y-6">
            <tc-card title="Présences" [subtitle]="quorumLabel(s)">
              <div class="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p class="text-2xl font-bold text-green-600">{{ presentCount() }}</p>
                  <p class="text-xs text-gray-500">Présents</p>
                </div>
                <div>
                  <p class="text-2xl font-bold text-amber-600">{{ lateCount() }}</p>
                  <p class="text-xs text-gray-500">Retards</p>
                </div>
                <div>
                  <p class="text-2xl font-bold text-red-600">{{ absentCount() }}</p>
                  <p class="text-xs text-gray-500">Absents</p>
                </div>
              </div>
              @if (s.attendance.length > 0) {
                <ul class="mt-4 space-y-1 text-sm">
                  @for (entry of s.attendance; track entry.memberId) {
                    <li class="flex items-center justify-between">
                      <span>{{ entry.fullName }}</span>
                      <span [class]="attendanceBadgeClass(entry.status)">
                        {{ attendanceLabel(entry.status) }}
                      </span>
                    </li>
                  }
                </ul>
              } @else {
                <p class="mt-4 text-sm text-gray-500 italic">
                  Le pointage sera saisi par le Secrétaire à l'ouverture de la séance.
                </p>
              }
            </tc-card>

            <tc-card title="Ordre du jour">
              <ol class="space-y-2">
                @for (item of s.agenda; track item.id) {
                  <li class="flex items-center justify-between gap-3 rounded-lg border border-gray-100 px-3 py-2">
                    <div class="flex items-center gap-3">
                      <span class="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold">
                        {{ item.order }}
                      </span>
                      <span class="text-sm text-gray-900">{{ item.title }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <tc-badge [kind]="agendaKind(item.status)">{{ agendaLabel(item.status) }}</tc-badge>
                      @if (s.status === 'IN_PROGRESS' && item.status !== 'DONE') {
                        <tc-button variant="ghost" size="sm" (clicked)="advance(s.id, item.id)">
                          Marquer fait
                        </tc-button>
                      }
                    </div>
                  </li>
                }
              </ol>
            </tc-card>

            @if (s.beneficiaryFullName) {
              <tc-card title="Distribution de la cagnotte">
                <dl class="grid gap-3 text-sm sm:grid-cols-3">
                  <div>
                    <dt class="text-gray-500">Bénéficiaire</dt>
                    <dd class="font-semibold text-gray-900">{{ s.beneficiaryFullName }}</dd>
                  </div>
                  <div>
                    <dt class="text-gray-500">Montant</dt>
                    <dd class="font-semibold text-gray-900">{{ s.cagnotteAmount | xaf }}</dd>
                  </div>
                  <div>
                    <dt class="text-gray-500">Signature Président</dt>
                    <dd>
                      @if (s.cagnotteSignedByPresident) {
                        <span class="text-green-600 font-medium">✓ Signé</span>
                      } @else {
                        <span class="text-amber-600 font-medium">⏳ À signer</span>
                      }
                    </dd>
                  </div>
                </dl>
                @if (!s.cagnotteSignedByPresident && s.status === 'IN_PROGRESS') {
                  <div class="mt-4">
                    <tc-button variant="primary" [loading]="acting() === 'sign'" (clicked)="signCagnotte(s.id)">
                      Signer la distribution
                    </tc-button>
                  </div>
                }
              </tc-card>
            }
          </div>

          <aside class="space-y-4">
            @if (pendingAgendas().length > 0) {
              <tc-card title="Ordres du jour en attente">
                <div class="space-y-4">
                  @for (agenda of pendingAgendas(); track agenda.id) {
                    <div class="rounded-lg border border-amber-200 bg-amber-50 p-3">
                      <div class="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <p class="text-sm font-semibold text-gray-900">
                            Séance #{{ agenda.sessionNumber }}
                          </p>
                          <p class="text-xs text-gray-500">{{ agenda.items?.length ?? 0 }} point(s)</p>
                        </div>
                        <tc-badge kind="warning">À approuver</tc-badge>
                      </div>
                      @if (agenda.items && agenda.items.length > 0) {
                        <ol class="mb-3 space-y-1">
                          @for (item of agenda.items; track item.id) {
                            <li class="flex gap-2 text-xs text-gray-700">
                              <span class="shrink-0 font-medium text-gray-400">{{ item.order }}.</span>
                              <span>{{ item.title }}</span>
                            </li>
                          }
                        </ol>
                      }
                      @if (requestingChangesId() === agenda.id) {
                        <div class="space-y-2">
                          <textarea
                            class="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                            rows="3"
                            placeholder="Commentaire au Secrétaire…"
                            [value]="changesComment()"
                            (input)="changesComment.set($any($event.target).value)"
                          ></textarea>
                          <div class="flex gap-2">
                            <tc-button
                              variant="secondary"
                              size="sm"
                              [loading]="agendaActing() === agenda.id"
                              (clicked)="submitRequestChanges(agenda)">
                              Envoyer
                            </tc-button>
                            <tc-button variant="ghost" size="sm" (clicked)="cancelRequestChanges()">
                              Annuler
                            </tc-button>
                          </div>
                        </div>
                      } @else {
                        <div class="flex gap-2">
                          <tc-button
                            variant="success"
                            size="sm"
                            [loading]="agendaActing() === agenda.id"
                            (clicked)="approveAgenda(agenda)">
                            ✓ Approuver
                          </tc-button>
                          <tc-button
                            variant="secondary"
                            size="sm"
                            [disabled]="agendaActing() !== null"
                            (clicked)="startRequestChanges(agenda.id)">
                            ↩ Renvoyer
                          </tc-button>
                        </div>
                      }
                    </div>
                  }
                </div>
              </tc-card>
            }

            <tc-card title="Actions du Président">
              @switch (s.status) {
                @case ('SCHEDULED') {
                  <p class="text-sm text-gray-600 mb-3">
                    Vérifiez le quorum avant d'ouvrir la séance ({{ (s.quorumThreshold * 100 | number: '1.0-0') }}% requis).
                  </p>
                  <tc-button variant="primary" [fullWidth]="true" [loading]="acting() === 'open'" (clicked)="openSession(s.id)">
                    Ouvrir la séance
                  </tc-button>
                }
                @case ('IN_PROGRESS') {
                  <p class="text-sm text-gray-600 mb-3">
                    Une fois tous les points traités, vous pouvez clôturer la séance.
                  </p>
                  <tc-button variant="success" [fullWidth]="true" [loading]="acting() === 'close'" (clicked)="closeSession(s.id)">
                    Clôturer la séance
                  </tc-button>
                  <p class="text-xs text-gray-500 mt-2">
                    Le PV sera ensuite rédigé par le Secrétaire, puis soumis à votre signature dans Validations.
                  </p>
                }
                @case ('COMPLETED') {
                  <p class="text-sm text-gray-600">
                    Séance terminée le {{ s.endedAt | tcDate: true }}. Le PV sera soumis prochainement par le Secrétaire.
                  </p>
                }
                @default {
                  <p class="text-sm text-gray-600">Aucune action disponible pour le moment.</p>
                }
              }
            </tc-card>

            <tc-card title="Indicateurs">
              <dl class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <dt class="text-gray-500">Cotisations collectées</dt>
                  <dd class="font-semibold text-gray-900">{{ s.totalCollected | xaf }}</dd>
                </div>
                <div class="flex justify-between">
                  <dt class="text-gray-500">Distribution</dt>
                  <dd class="font-semibold text-gray-900">{{ s.totalDistributed | xaf }}</dd>
                </div>
                <div class="flex justify-between">
                  <dt class="text-gray-500">Quorum requis</dt>
                  <dd>{{ (s.quorumThreshold * 100 | number: '1.0-0') }}%</dd>
                </div>
              </dl>
            </tc-card>
          </aside>
        </div>
      } @else {
        <tc-card>Séance introuvable.</tc-card>
      }
    </div>
  `,
})
export class SessionPresideComponent {
  readonly id = input.required<string>();

  private readonly service = inject(PresidentService);
  private readonly notifications = inject(NotificationService);
  protected readonly router = inject(Router);

  readonly resource = resource({
    params: () => this.id(),
    loader: ({ params }) => this.service.getSession(params),
  });

  readonly agendasResource = resource({
    params: () => this.id(),
    loader: ({ params }) => this.service.getPendingAgendas(params),
  });

  readonly session = computed(() => this.resource.value());
  readonly pendingAgendas = computed(() => this.agendasResource.value() ?? []);

  readonly acting = signal<'open' | 'sign' | 'close' | null>(null);
  readonly agendaActing = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);

  // Request-changes inline form
  readonly requestingChangesId = signal<string | null>(null);
  readonly changesComment = signal('');

  readonly presentCount = computed(
    () => this.session()?.attendance.filter((a) => a.status === 'PRESENT').length ?? 0,
  );
  readonly lateCount = computed(
    () => this.session()?.attendance.filter((a) => a.status === 'LATE').length ?? 0,
  );
  readonly absentCount = computed(
    () => this.session()?.attendance.filter((a) => a.status === 'ABSENT' || a.status === 'EXCUSED').length ?? 0,
  );

  quorumLabel(s: ReturnType<typeof this.session>): string {
    if (!s) return '';
    const total = s.attendance.length;
    const reached = (this.presentCount() + this.lateCount()) / Math.max(1, total) >= s.quorumThreshold;
    return total > 0
      ? reached
        ? 'Quorum atteint'
        : 'Quorum non atteint'
      : 'Quorum à confirmer';
  }

  statusKind(status: SessionStatus): 'success' | 'warning' | 'info' | 'neutral' {
    switch (status) {
      case SessionStatus.COMPLETED:
      case SessionStatus.VALIDATED:
        return 'success';
      case SessionStatus.IN_PROGRESS:
        return 'warning';
      case SessionStatus.SCHEDULED:
        return 'info';
      default:
        return 'neutral';
    }
  }

  attendanceLabel(status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED'): string {
    return { PRESENT: 'Présent', LATE: 'Retard', ABSENT: 'Absent', EXCUSED: 'Excusé' }[status];
  }

  attendanceBadgeClass(status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED'): string {
    return {
      PRESENT: 'text-green-600 font-medium',
      LATE: 'text-amber-600 font-medium',
      ABSENT: 'text-red-600 font-medium',
      EXCUSED: 'text-gray-500',
    }[status];
  }

  agendaKind(status: 'PENDING' | 'IN_PROGRESS' | 'DONE' | 'SKIPPED'): 'success' | 'info' | 'neutral' | 'warning' {
    return { PENDING: 'neutral', IN_PROGRESS: 'warning', DONE: 'success', SKIPPED: 'info' }[status] as 'success' | 'info' | 'neutral' | 'warning';
  }

  agendaLabel(status: 'PENDING' | 'IN_PROGRESS' | 'DONE' | 'SKIPPED'): string {
    return { PENDING: 'À traiter', IN_PROGRESS: 'En cours', DONE: 'Traité', SKIPPED: 'Passé' }[status];
  }

  async openSession(id: string): Promise<void> {
    this.acting.set('open');
    this.errorMessage.set(null);
    try {
      await this.service.openSession(id);
      this.notifications.success('Séance ouverte.');
      this.resource.reload();
    } catch (e: unknown) {
      this.errorMessage.set(formatApiError(e, 'Erreur.'));
    } finally {
      this.acting.set(null);
    }
  }

  async advance(sessionId: string, agendaId: string): Promise<void> {
    try {
      await this.service.advanceAgenda(sessionId, agendaId);
      this.resource.reload();
    } catch (e: unknown) {
      this.errorMessage.set(formatApiError(e, 'Erreur.'));
    }
  }

  async signCagnotte(id: string): Promise<void> {
    this.acting.set('sign');
    this.errorMessage.set(null);
    try {
      await this.service.signCagnotte(id);
      this.notifications.success('Cagnotte signée.');
      this.resource.reload();
    } catch (e: unknown) {
      this.errorMessage.set(formatApiError(e, 'Erreur.'));
    } finally {
      this.acting.set(null);
    }
  }

  async closeSession(id: string): Promise<void> {
    this.acting.set('close');
    this.errorMessage.set(null);
    try {
      await this.service.closeSession(id);
      this.notifications.success('Séance clôturée.');
      this.resource.reload();
    } catch (e: unknown) {
      this.errorMessage.set(formatApiError(e, 'Erreur.'));
    } finally {
      this.acting.set(null);
    }
  }

  async approveAgenda(agenda: AgendaDraft): Promise<void> {
    this.agendaActing.set(agenda.id);
    this.errorMessage.set(null);
    try {
      await this.service.approveAgenda(agenda.id);
      this.notifications.success("Ordre du jour de la Séance #" + agenda.sessionNumber + " approuvé.");
      this.agendasResource.reload();
    } catch (e: unknown) {
      this.errorMessage.set(formatApiError(e, "Erreur lors de l'approbation."));
    } finally {
      this.agendaActing.set(null);
    }
  }

  startRequestChanges(agendaId: string): void {
    this.requestingChangesId.set(agendaId);
    this.changesComment.set('');
    this.errorMessage.set(null);
  }

  cancelRequestChanges(): void {
    this.requestingChangesId.set(null);
    this.changesComment.set('');
  }

  async submitRequestChanges(agenda: AgendaDraft): Promise<void> {
    const comment = this.changesComment().trim();
    if (!comment) {
      this.errorMessage.set('Veuillez saisir un commentaire.');
      return;
    }
    this.agendaActing.set(agenda.id);
    this.errorMessage.set(null);
    try {
      await this.service.requestAgendaChanges(agenda.id, comment);
      this.notifications.success('Modifications demandées au Secrétaire.');
      this.requestingChangesId.set(null);
      this.changesComment.set('');
      this.agendasResource.reload();
    } catch (e: unknown) {
      this.errorMessage.set(formatApiError(e, 'Erreur.'));
    } finally {
      this.agendaActing.set(null);
    }
  }
}

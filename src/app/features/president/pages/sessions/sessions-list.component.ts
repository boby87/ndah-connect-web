import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  resource,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { AlertComponent } from '../../../../shared/components/ui/alert/alert.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { EmptyStateComponent } from '../../../../shared/components/ui/empty-state/empty-state.component';
import { SpinnerComponent } from '../../../../shared/components/ui/spinner/spinner.component';
import { CurrencyXafPipe } from '../../../../shared/pipes/currency-xaf.pipe';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { StatusLabelPipe } from '../../../../shared/pipes/status-label.pipe';
import { SessionStatus } from '../../../../core/enums/session-status.enum';
import { NotificationService } from '../../../../core/services/notification.service';
import { formatApiError } from '../../../../core/utils';
import { PresidentService } from '../../services/president.service';
import type { Cycle } from '../../../../shared/models/entities/cycle.model';
import type { SessionLive } from '../../../../shared/models/entities/session-live.model';

@Component({
  selector: 'tc-sessions-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    AlertComponent,
    BadgeComponent,
    ButtonComponent,
    CardComponent,
    EmptyStateComponent,
    SpinnerComponent,
    CurrencyXafPipe,
    DateFormatPipe,
    StatusLabelPipe,
  ],
  template: `
    <div class="space-y-6">
      <header>
        <h1 class="text-2xl font-bold text-gray-900">Mes séances</h1>
        <p class="text-sm text-gray-500">
          Ouvrez, présidez et clôturez les séances. Les présences et la cagnotte sont gérées en live.
        </p>
      </header>

      <!-- ── Demandes de clôture en attente ─────────────────────────────── -->
      @if (pendingClosures().length > 0) {
        <section class="space-y-3">
          <h2 class="flex items-center gap-2 text-base font-semibold text-amber-800">
            <span class="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-sm">⏳</span>
            Demandes de clôture ({{ pendingClosures().length }})
          </h2>
          @if (closureError()) {
            <tc-alert kind="error">{{ closureError() }}</tc-alert>
          }
          @for (cycle of pendingClosures(); track cycle.id) {
            <div class="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
              <div>
                <p class="font-semibold text-amber-900">Cycle {{ cycle.number }}</p>
                <p class="text-sm text-amber-700">
                  Démarré le {{ cycle.startDate }}
                  · {{ cycle.completedSessions }}/{{ cycle.totalSessions }} séances terminées
                </p>
                <p class="mt-1 text-xs text-amber-600">
                  Le Secrétaire demande la clôture de ce cycle.
                </p>
              </div>
              <tc-button
                variant="primary"
                [loading]="closingCycleId() === cycle.id"
                (clicked)="onCloseCycle(cycle.id)"
              >
                Clôturer
              </tc-button>
            </div>
          }
        </section>
      }

      @if (resource.isLoading()) {
        <div class="flex justify-center py-12"><tc-spinner size="lg" /></div>
      } @else if (sessions().length === 0) {
        <tc-card>
          <tc-empty-state title="Aucune séance" icon="📅" description="Aucune séance enregistrée pour le moment." />
        </tc-card>
      } @else {
        <section class="space-y-3">
          @for (session of sessions(); track session.id) {
            <a
              [routerLink]="['/president/sessions', session.id]"
              class="block rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:border-blue-300"
            >
              <div class="flex flex-wrap items-start justify-between gap-3">
                <div class="min-w-0">
                  <div class="flex items-center gap-2">
                    <p class="font-semibold text-gray-900">Séance #{{ session.number }}</p>
                    <tc-badge [kind]="statusKind(session.status)">
                      {{ session.status | statusLabel: 'session' }}
                    </tc-badge>
                  </div>
                  <p class="text-sm text-gray-500 mt-0.5">
                    {{ session.scheduledAt | tcDate: true }}
                    @if (session.location) { · 📍 {{ session.location }} }
                  </p>
                  @if (session.beneficiaryFullName) {
                    <p class="text-xs text-gray-500 mt-1">
                      Cagnotte de <span class="font-semibold">{{ session.cagnotteAmount | xaf }}</span>
                      destinée à <span class="font-semibold">{{ session.beneficiaryFullName }}</span>
                    </p>
                  }
                </div>
                <div class="text-right text-sm">
                  <p class="text-gray-500">Collecté</p>
                  <p class="font-semibold text-gray-900">{{ session.totalCollected | xaf }}</p>
                </div>
              </div>
            </a>
          }
        </section>
      }
    </div>
  `,
})
export class SessionsListComponent {
  private readonly service = inject(PresidentService);
  private readonly notifications = inject(NotificationService);

  readonly resource = resource({ loader: () => this.service.getSessions() });
  readonly pendingClosuresResource = resource({ loader: () => this.service.getCyclesPendingClosure() });

  readonly sessions = computed(() =>
    [...(this.resource.value() ?? [])].sort(
      (a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime(),
    ),
  );
  readonly pendingClosures = computed<Cycle[]>(() => this.pendingClosuresResource.value() ?? []);

  readonly closingCycleId = signal<string | null>(null);
  readonly closureError = signal<string | null>(null);

  async onCloseCycle(cycleId: string): Promise<void> {
    this.closingCycleId.set(cycleId);
    this.closureError.set(null);
    try {
      await this.service.closeCycle(cycleId);
      this.notifications.success('Cycle clôturé avec succès.');
      this.pendingClosuresResource.reload();
    } catch (e: unknown) {
      this.closureError.set(formatApiError(e, 'Erreur lors de la clôture du cycle.'));
    } finally {
      this.closingCycleId.set(null);
    }
  }

  statusKind(status: SessionLive['status']): 'success' | 'warning' | 'info' | 'neutral' {
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
}

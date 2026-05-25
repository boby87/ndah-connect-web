import { ChangeDetectionStrategy, Component, computed, inject, resource } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { EmptyStateComponent } from '../../../../shared/components/ui/empty-state/empty-state.component';
import { SpinnerComponent } from '../../../../shared/components/ui/spinner/spinner.component';
import { CurrencyXafPipe } from '../../../../shared/pipes/currency-xaf.pipe';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { StatusLabelPipe } from '../../../../shared/pipes/status-label.pipe';
import { SessionStatus } from '../../../../core/enums/session-status.enum';
import { PresidentService } from '../../services/president.service';
import type { SessionLive } from '../../../../shared/models/entities/session-live.model';

@Component({
  selector: 'tc-sessions-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    BadgeComponent,
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

  readonly resource = resource({
    loader: () => this.service.getSessions(),
  });

  readonly sessions = computed(() =>
    [...(this.resource.value() ?? [])].sort(
      (a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime(),
    ),
  );

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

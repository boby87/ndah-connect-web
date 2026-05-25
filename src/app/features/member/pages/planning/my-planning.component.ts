import { ChangeDetectionStrategy, Component, computed, inject, resource } from '@angular/core';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { SpinnerComponent } from '../../../../shared/components/ui/spinner/spinner.component';
import { CurrencyXafPipe } from '../../../../shared/pipes/currency-xaf.pipe';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { StatusLabelPipe } from '../../../../shared/pipes/status-label.pipe';
import { SessionStatus } from '../../../../core/enums/session-status.enum';
import { MemberService } from '../../services/member.service';
import type { Session } from '../../../../shared/models/entities/session.model';

@Component({
  selector: 'tc-my-planning',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BadgeComponent, CardComponent, SpinnerComponent, CurrencyXafPipe, DateFormatPipe, StatusLabelPipe],
  template: `
    <div class="space-y-6">
      <header>
        <h1 class="text-2xl font-bold text-gray-900">Mon planning</h1>
        <p class="text-sm text-gray-500">Calendrier des séances et tours de bénéfice.</p>
      </header>

      @if (resource.isLoading()) {
        <div class="flex justify-center py-12"><tc-spinner size="lg" /></div>
      } @else {
        <tc-card title="Sessions">
          @if (sessions().length === 0) {
            <p class="text-sm text-gray-500">Aucune session prévue.</p>
          } @else {
            <ul class="divide-y divide-gray-100">
              @for (session of sessions(); track session.id) {
                <li class="py-4 first:pt-0 last:pb-0">
                  <div class="flex items-start justify-between gap-4">
                    <div>
                      <div class="flex items-center gap-2">
                        <p class="font-semibold text-gray-900">Session #{{ session.number }}</p>
                        <tc-badge [kind]="badgeKind(session.status)">
                          {{ session.status | statusLabel: 'session' }}
                        </tc-badge>
                      </div>
                      <p class="text-sm text-gray-500 mt-0.5">
                        {{ session.scheduledAt | tcDate: true }}
                        @if (session.location) { · 📍 {{ session.location }} }
                      </p>
                    </div>
                    <div class="text-right text-sm">
                      <p class="text-gray-500">Collecté</p>
                      <p class="font-semibold text-gray-900">{{ session.totalCollected | xaf }}</p>
                    </div>
                  </div>
                </li>
              }
            </ul>
          }
        </tc-card>
      }
    </div>
  `,
})
export class MyPlanningComponent {
  private readonly memberService = inject(MemberService);

  readonly resource = resource({
    loader: () => this.memberService.getPlanning(),
  });

  readonly sessions = computed(() => this.resource.value() ?? []);

  badgeKind(status: Session['status']): 'success' | 'warning' | 'info' | 'neutral' {
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

import { ChangeDetectionStrategy, Component, computed, inject, resource, signal } from '@angular/core';
import { AlertComponent } from '../../../../shared/components/ui/alert/alert.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { EmptyStateComponent } from '../../../../shared/components/ui/empty-state/empty-state.component';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { NotificationService } from '../../../../core/services/notification.service';
import type { SessionBalanceReviewDecision } from '../../../../shared/models/entities/auditor.model';
import { AuditorService } from '../../services/auditor.service';
import { formatApiError } from '../../../../core/utils';

@Component({
  selector: 'tc-auditor-balance-reviews',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AlertComponent,
    BadgeComponent,
    ButtonComponent,
    CardComponent,
    EmptyStateComponent,
    DateFormatPipe,
  ],
  templateUrl: './balance-reviews-page.component.html',
})
export class AuditorBalanceReviewsPageComponent {
  private readonly service = inject(AuditorService);
  private readonly notifications = inject(NotificationService);

  readonly resource = resource({
    loader: () => this.service.getBalanceReviews(),
  });
  readonly reviews = computed(() => this.resource.value() ?? []);

  readonly sessionsResource = resource({
    loader: () => this.service.getSessions(),
  });
  readonly sessions = computed(() => this.sessionsResource.value() ?? []);

  readonly sessionId = signal('');
  readonly decision = signal<SessionBalanceReviewDecision>('CONFORM');
  readonly observations = signal('');
  readonly reserves = signal('');
  readonly submitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  decisionBadge(d: SessionBalanceReviewDecision): 'success' | 'warning' | 'danger' {
    if (d === 'CONFORM') return 'success';
    if (d === 'WITH_RESERVES') return 'warning';
    return 'danger';
  }

  decisionLabel(d: SessionBalanceReviewDecision): string {
    const map = { CONFORM: 'Conforme', WITH_RESERVES: 'Avec réserves', REJECTED: 'Rejeté' };
    return map[d];
  }

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.errorMessage.set(null);
    if (!this.sessionId()) {
      this.errorMessage.set('Sélectionnez une séance.');
      return;
    }
    if (this.decision() !== 'CONFORM' && !this.reserves().trim()) {
      this.errorMessage.set('Réserves obligatoires en cas de réserves ou rejet (RM-VB03).');
      return;
    }

    this.submitting.set(true);
    try {
      await this.service.reviewBalance({
        sessionId: this.sessionId(),
        decision: this.decision(),
        observations: this.observations().trim() || undefined,
        reserves: this.reserves().trim() || undefined,
      });
      this.notifications.success('Bilan vérifié.');
      this.sessionId.set('');
      this.observations.set('');
      this.reserves.set('');
      this.resource.reload();
    } catch (e: unknown) {
      this.errorMessage.set(formatApiError(e, 'Erreur.'));
    } finally {
      this.submitting.set(false);
    }
  }
}

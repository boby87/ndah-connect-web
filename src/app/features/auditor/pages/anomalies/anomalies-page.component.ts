import { ChangeDetectionStrategy, Component, computed, inject, resource, signal } from '@angular/core';
import { AlertComponent } from '../../../../shared/components/ui/alert/alert.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { EmptyStateComponent } from '../../../../shared/components/ui/empty-state/empty-state.component';
import { InputComponent } from '../../../../shared/components/ui/input/input.component';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { NotificationService } from '../../../../core/services/notification.service';
import type {
  AnomalyAudience,
  AnomalyCategory,
  AnomalySeverity,
  AnomalyStatus,
  AuditorAnomaly,
} from '../../../../shared/models/entities/auditor.model';
import { AuditorService } from '../../services/auditor.service';

@Component({
  selector: 'tc-auditor-anomalies',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AlertComponent,
    BadgeComponent,
    ButtonComponent,
    CardComponent,
    EmptyStateComponent,
    InputComponent,
    DateFormatPipe,
  ],
  templateUrl: './anomalies-page.component.html',
})
export class AuditorAnomaliesPageComponent {
  private readonly service = inject(AuditorService);
  private readonly notifications = inject(NotificationService);

  readonly resource = resource({
    loader: () => this.service.getAnomalies(),
  });
  readonly anomalies = computed(() => this.resource.value() ?? []);

  readonly category = signal<AnomalyCategory>('CASH_DISCREPANCY');
  readonly severity = signal<AnomalySeverity>('MEDIUM');
  readonly title = signal('');
  readonly description = signal('');
  readonly audience = signal<AnomalyAudience>('PRESIDENT');
  readonly requestsResponse = signal(true);
  readonly copyToTreasurer = signal(true);
  readonly submitting = signal(false);

  readonly acting = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);

  severityBadge(s: AnomalySeverity): 'success' | 'warning' | 'danger' {
    if (s === 'LOW') return 'success';
    if (s === 'MEDIUM') return 'warning';
    return 'danger';
  }

  severityLabel(s: AnomalySeverity): string {
    return s === 'LOW' ? 'Faible' : s === 'MEDIUM' ? 'Moyenne' : 'Élevée';
  }

  statusBadge(s: AnomalyStatus): 'info' | 'warning' | 'success' | 'neutral' {
    if (s === 'CLOSED') return 'neutral';
    if (s === 'RESOLVED') return 'success';
    if (s === 'IN_RESPONSE') return 'info';
    return 'warning';
  }

  statusLabel(s: AnomalyStatus): string {
    const map = { OPEN: 'Ouvert', IN_RESPONSE: 'En réponse', RESOLVED: 'Résolu', CLOSED: 'Clôturé' };
    return map[s];
  }

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.errorMessage.set(null);
    if (!this.title().trim() || !this.description().trim()) {
      this.errorMessage.set('Titre et description obligatoires.');
      return;
    }
    this.submitting.set(true);
    try {
      await this.service.createAnomaly({
        category: this.category(),
        severity: this.severity(),
        title: this.title().trim(),
        description: this.description().trim(),
        audience: this.audience(),
        requestsResponse: this.requestsResponse(),
        copyToTreasurer: this.copyToTreasurer(),
      });
      this.notifications.success('Signalement envoyé.');
      this.title.set('');
      this.description.set('');
      this.resource.reload();
    } catch (e: unknown) {
      this.errorMessage.set((e as { error?: { message?: string } })?.error?.message ?? 'Erreur.');
    } finally {
      this.submitting.set(false);
    }
  }

  async close(a: AuditorAnomaly): Promise<void> {
    this.acting.set(`${a.id}:close`);
    this.errorMessage.set(null);
    try {
      await this.service.closeAnomaly(a.id);
      this.notifications.success('Signalement clôturé.');
      this.resource.reload();
    } catch (e: unknown) {
      this.errorMessage.set((e as { error?: { message?: string } })?.error?.message ?? 'Erreur.');
    } finally {
      this.acting.set(null);
    }
  }

  async reopen(a: AuditorAnomaly): Promise<void> {
    this.acting.set(`${a.id}:reopen`);
    this.errorMessage.set(null);
    try {
      await this.service.reopenAnomaly(a.id);
      this.notifications.success('Signalement rouvert.');
      this.resource.reload();
    } catch (e: unknown) {
      this.errorMessage.set((e as { error?: { message?: string } })?.error?.message ?? 'Erreur.');
    } finally {
      this.acting.set(null);
    }
  }
}

import { ChangeDetectionStrategy, Component, computed, inject, resource, signal } from '@angular/core';
import { AlertComponent } from '../../../../shared/components/ui/alert/alert.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { EmptyStateComponent } from '../../../../shared/components/ui/empty-state/empty-state.component';
import { CurrencyXafPipe } from '../../../../shared/pipes/currency-xaf.pipe';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { NotificationService } from '../../../../core/services/notification.service';
import type {
  AuditorControl,
  ControlCheckpoint,
  ControlKind,
} from '../../../../shared/models/entities/auditor.model';
import { AuditorService } from '../../services/auditor.service';
import { formatApiError } from '../../../../core/utils';

@Component({
  selector: 'tc-auditor-controls',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AlertComponent,
    BadgeComponent,
    ButtonComponent,
    CardComponent,
    EmptyStateComponent,
    CurrencyXafPipe,
    DateFormatPipe,
  ],
  templateUrl: './controls-page.component.html',
})
export class AuditorControlsPageComponent {
  private readonly service = inject(AuditorService);
  private readonly notifications = inject(NotificationService);

  readonly resource = resource({
    loader: () => this.service.getControls(),
  });
  readonly controls = computed(() => this.resource.value() ?? []);

  readonly newKind = signal<ControlKind>('MONTHLY');
  readonly periodFrom = signal('2026-05-01');
  readonly periodTo = signal('2026-05-31');
  readonly creating = signal(false);

  readonly completing = signal<string | null>(null);
  readonly editCheckpoints = signal<ControlCheckpoint[]>([]);
  readonly completeObservations = signal('');
  readonly acting = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);

  kindLabel(k: ControlKind): string {
    const map = { WEEKLY: 'Hebdomadaire', MONTHLY: 'Mensuel', QUARTERLY: 'Trimestriel', AD_HOC: 'Ponctuel' };
    return map[k];
  }

  statusBadge(s: string): 'success' | 'warning' | 'info' | 'neutral' {
    if (s === 'COMPLETED') return 'success';
    if (s === 'IN_PROGRESS') return 'info';
    if (s === 'PLANNED') return 'warning';
    return 'neutral';
  }

  async onCreate(event: Event): Promise<void> {
    event.preventDefault();
    this.errorMessage.set(null);
    this.creating.set(true);
    try {
      await this.service.createControl({
        kind: this.newKind(),
        periodFrom: new Date(this.periodFrom()).toISOString(),
        periodTo: new Date(this.periodTo()).toISOString(),
      });
      this.notifications.success('Contrôle démarré.');
      this.resource.reload();
    } catch (e: unknown) {
      this.errorMessage.set(formatApiError(e, 'Erreur.'));
    } finally {
      this.creating.set(false);
    }
  }

  openComplete(c: AuditorControl): void {
    this.completing.set(c.id);
    this.editCheckpoints.set(c.checkpoints.map((cp) => ({ ...cp })));
    this.completeObservations.set(c.observations ?? '');
  }

  cancelComplete(): void {
    this.completing.set(null);
  }

  updateCp(i: number, value: number): void {
    this.editCheckpoints.update((arr) =>
      arr.map((cp, idx) => (idx === i ? { ...cp, observedValue: value } : cp)),
    );
  }

  async finalize(c: AuditorControl): Promise<void> {
    this.acting.set(c.id);
    this.errorMessage.set(null);
    try {
      await this.service.completeControl(c.id, {
        checkpoints: this.editCheckpoints(),
        observations: this.completeObservations().trim() || undefined,
      });
      this.notifications.success('Contrôle clôturé.');
      this.completing.set(null);
      this.resource.reload();
    } catch (e: unknown) {
      this.errorMessage.set(formatApiError(e, 'Erreur.'));
    } finally {
      this.acting.set(null);
    }
  }
}

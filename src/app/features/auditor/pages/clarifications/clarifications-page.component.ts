import { ChangeDetectionStrategy, Component, computed, inject, resource, signal } from '@angular/core';
import { AlertComponent } from '../../../../shared/components/ui/alert/alert.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { EmptyStateComponent } from '../../../../shared/components/ui/empty-state/empty-state.component';
import { InputComponent } from '../../../../shared/components/ui/input/input.component';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { NotificationService } from '../../../../core/services/notification.service';
import type { AuditorClarification, ClarificationStatus } from '../../../../shared/models/entities/auditor.model';
import { AuditorService } from '../../services/auditor.service';

@Component({
  selector: 'tc-auditor-clarifications',
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
  templateUrl: './clarifications-page.component.html',
})
export class AuditorClarificationsPageComponent {
  private readonly service = inject(AuditorService);
  private readonly notifications = inject(NotificationService);

  readonly resource = resource({
    loader: () => this.service.getClarifications(),
  });
  readonly clarifications = computed(() => this.resource.value() ?? []);

  readonly subject = signal('');
  readonly question = signal('');
  readonly targetRole = signal<'TREASURER' | 'SECRETARY' | 'CENSOR'>('TREASURER');
  readonly dueWithin = signal(48);
  readonly submitting = signal(false);

  readonly acting = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);

  statusBadge(s: ClarificationStatus): 'info' | 'success' | 'warning' | 'danger' | 'neutral' {
    if (s === 'PENDING') return 'warning';
    if (s === 'RESPONDED') return 'info';
    if (s === 'CLOSED') return 'success';
    if (s === 'ESCALATED') return 'danger';
    return 'neutral';
  }

  statusLabel(s: ClarificationStatus): string {
    const map = { PENDING: 'En attente', RESPONDED: 'Répondue', CLOSED: 'Clôturée', ESCALATED: 'Escaladée' };
    return map[s];
  }

  evalLabel(e: 'SATISFACTORY' | 'PARTIAL' | 'UNSATISFACTORY'): string {
    return e === 'SATISFACTORY' ? 'Satisfaisante' : e === 'PARTIAL' ? 'Partielle' : 'Insatisfaisante';
  }

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.errorMessage.set(null);
    if (!this.subject().trim() || !this.question().trim()) {
      this.errorMessage.set('Objet et question obligatoires.');
      return;
    }
    this.submitting.set(true);
    try {
      await this.service.createClarification({
        subject: this.subject().trim(),
        question: this.question().trim(),
        targetRole: this.targetRole(),
        dueWithinHours: this.dueWithin(),
      });
      this.notifications.success('Demande envoyée.');
      this.subject.set('');
      this.question.set('');
      this.resource.reload();
    } catch (e: unknown) {
      this.errorMessage.set((e as { error?: { message?: string } })?.error?.message ?? 'Erreur.');
    } finally {
      this.submitting.set(false);
    }
  }

  async simulate(c: AuditorClarification): Promise<void> {
    this.acting.set(`${c.id}:sim`);
    try {
      await this.service.simulateClarificationResponse(c.id);
      this.notifications.success('Réponse simulée reçue.');
      this.resource.reload();
    } catch (e: unknown) {
      this.errorMessage.set((e as { error?: { message?: string } })?.error?.message ?? 'Erreur.');
    } finally {
      this.acting.set(null);
    }
  }

  async evaluate(
    c: AuditorClarification,
    evaluation: 'SATISFACTORY' | 'PARTIAL' | 'UNSATISFACTORY',
  ): Promise<void> {
    const tag = evaluation === 'SATISFACTORY' ? 'sat' : evaluation === 'PARTIAL' ? 'par' : 'unsat';
    this.acting.set(`${c.id}:${tag}`);
    try {
      await this.service.evaluateClarification(c.id, evaluation);
      this.notifications.success('Évaluation enregistrée.');
      this.resource.reload();
    } catch (e: unknown) {
      this.errorMessage.set((e as { error?: { message?: string } })?.error?.message ?? 'Erreur.');
    } finally {
      this.acting.set(null);
    }
  }
}

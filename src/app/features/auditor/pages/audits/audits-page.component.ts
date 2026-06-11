import { ChangeDetectionStrategy, Component, computed, inject, resource, signal } from '@angular/core';
import { AlertComponent } from '../../../../shared/components/ui/alert/alert.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { EmptyStateComponent } from '../../../../shared/components/ui/empty-state/empty-state.component';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { NotificationService } from '../../../../core/services/notification.service';
import type { AuditFinding, AuditScope } from '../../../../shared/models/entities/auditor.model';
import { AuditorService } from '../../services/auditor.service';
import { formatApiError } from '../../../../core/utils';

interface FindingDraft {
  area: string;
  finding: AuditFinding;
  description: string;
}

@Component({
  selector: 'tc-auditor-audits',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AlertComponent,
    BadgeComponent,
    ButtonComponent,
    CardComponent,
    EmptyStateComponent,
    DateFormatPipe,
  ],
  templateUrl: './audits-page.component.html',
})
export class AuditorAuditsPageComponent {
  private readonly service = inject(AuditorService);
  private readonly notifications = inject(NotificationService);

  readonly resource = resource({
    loader: () => this.service.getAudits(),
  });
  readonly audits = computed(() => this.resource.value() ?? []);

  readonly scope = signal<AuditScope>('FINANCIAL');
  readonly periodFrom = signal('2026-04-01');
  readonly periodTo = signal('2026-04-30');
  readonly findings = signal<FindingDraft[]>([
    { area: '', finding: 'CONFORM', description: '' },
  ]);
  readonly overallFinding = signal<AuditFinding>('CONFORM');
  readonly observations = signal('');
  readonly submitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  findingBadge(f: AuditFinding): 'success' | 'warning' | 'danger' {
    if (f === 'CONFORM') return 'success';
    if (f === 'WITH_RESERVES') return 'warning';
    return 'danger';
  }

  findingLabel(f: AuditFinding): string {
    const map = { CONFORM: 'Conforme', WITH_RESERVES: 'Avec réserves', NON_CONFORM: 'Non conforme' };
    return map[f];
  }

  addFinding(): void {
    this.findings.update((arr) => [...arr, { area: '', finding: 'CONFORM', description: '' }]);
  }

  removeFinding(i: number): void {
    this.findings.update((arr) => arr.filter((_, idx) => idx !== i));
  }

  updateFinding(i: number, field: keyof FindingDraft, value: string): void {
    this.findings.update((arr) =>
      arr.map((f, idx) => (idx === i ? { ...f, [field]: value } : f)),
    );
  }

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.errorMessage.set(null);
    if (this.findings().some((f) => !f.area.trim() || !f.description.trim())) {
      this.errorMessage.set('Chaque constat doit avoir un domaine et une description.');
      return;
    }
    this.submitting.set(true);
    try {
      await this.service.createAudit({
        scope: this.scope(),
        periodFrom: new Date(this.periodFrom()).toISOString(),
        periodTo: new Date(this.periodTo()).toISOString(),
        findings: this.findings(),
        overallFinding: this.overallFinding(),
        observations: this.observations().trim() || undefined,
      });
      this.notifications.success('Audit enregistré.');
      this.findings.set([{ area: '', finding: 'CONFORM', description: '' }]);
      this.observations.set('');
      this.resource.reload();
    } catch (e: unknown) {
      this.errorMessage.set(formatApiError(e, 'Erreur.'));
    } finally {
      this.submitting.set(false);
    }
  }
}

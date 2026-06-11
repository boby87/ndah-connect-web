import { ChangeDetectionStrategy, Component, computed, inject, resource, signal } from '@angular/core';
import { AlertComponent } from '../../../../shared/components/ui/alert/alert.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { EmptyStateComponent } from '../../../../shared/components/ui/empty-state/empty-state.component';
import { InputComponent } from '../../../../shared/components/ui/input/input.component';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { NotificationService } from '../../../../core/services/notification.service';
import { REPORT_CATEGORY_LABELS } from '../../../../shared/models/entities/report.model';
import { SecretaryService, type GenerateReportPayload } from '../../services/secretary.service';
import { formatApiError } from '../../../../core/utils';

const CATEGORIES: { value: GenerateReportPayload['category']; label: string }[] = [
  { value: 'ATTENDANCE', label: 'Rapport de présence' },
  { value: 'MEMBERSHIP', label: 'Rapport des adhésions' },
  { value: 'PERIODIC', label: 'Rapport périodique' },
  { value: 'CYCLE', label: 'Rapport de cycle' },
];

@Component({
  selector: 'tc-secretary-reports',
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
  templateUrl: './reports-page.component.html',
})
export class SecretaryReportsComponent {
  private readonly service = inject(SecretaryService);
  private readonly notifications = inject(NotificationService);

  protected readonly categories = CATEGORIES;

  readonly resource = resource({
    loader: () => this.service.getReports(),
  });

  readonly reports = computed(() =>
    [...(this.resource.value() ?? [])].sort(
      (a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime(),
    ),
  );

  readonly category = signal<GenerateReportPayload['category']>('ATTENDANCE');
  readonly period = signal('');
  readonly periodTouched = signal(false);

  readonly submitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly periodError = computed(() => (this.period().trim() ? '' : 'Période requise.'));

  categoryLabel(c: string): string {
    return (REPORT_CATEGORY_LABELS as Record<string, string>)[c] ?? c;
  }

  download(id: string, kind: 'pdf' | 'excel'): void {
    this.notifications.info(`Téléchargement ${kind.toUpperCase()} du rapport ${id} simulé.`);
  }

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.periodTouched.set(true);
    this.errorMessage.set(null);

    if (this.periodError()) return;

    this.submitting.set(true);
    try {
      await this.service.generateReport({
        category: this.category(),
        periodLabel: this.period().trim(),
      });
      this.notifications.success('Rapport généré.');
      this.period.set('');
      this.periodTouched.set(false);
      this.resource.reload();
    } catch (e: unknown) {
      this.errorMessage.set(formatApiError(e, 'Erreur.'));
    } finally {
      this.submitting.set(false);
    }
  }
}

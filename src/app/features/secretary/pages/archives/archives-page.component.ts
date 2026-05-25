import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, resource, signal } from '@angular/core';
import { AlertComponent } from '../../../../shared/components/ui/alert/alert.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { EmptyStateComponent } from '../../../../shared/components/ui/empty-state/empty-state.component';
import { InputComponent } from '../../../../shared/components/ui/input/input.component';
import { TextareaComponent } from '../../../../shared/components/ui/textarea/textarea.component';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { NotificationService } from '../../../../core/services/notification.service';
import {
  ARCHIVE_DOCUMENT_TYPE_LABELS,
  type ArchiveDocumentType,
  type ArchiveVisibility,
} from '../../../../shared/models/entities/archive-document.model';
import { SecretaryService } from '../../services/secretary.service';

type Filter = 'ALL' | ArchiveDocumentType;

@Component({
  selector: 'tc-archives-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DecimalPipe,
    AlertComponent,
    BadgeComponent,
    ButtonComponent,
    CardComponent,
    EmptyStateComponent,
    InputComponent,
    TextareaComponent,
    DateFormatPipe,
  ],
  templateUrl: './archives-page.component.html',
})
export class ArchivesPageComponent {
  private readonly service = inject(SecretaryService);
  private readonly notifications = inject(NotificationService);

  protected readonly ARCHIVE_DOCUMENT_TYPE_LABELS = ARCHIVE_DOCUMENT_TYPE_LABELS;
  protected readonly types: ArchiveDocumentType[] = Object.keys(
    ARCHIVE_DOCUMENT_TYPE_LABELS,
  ) as ArchiveDocumentType[];
  protected readonly visibilities: ArchiveVisibility[] = ['ALL_MEMBERS', 'BUREAU', 'RESTRICTED'];

  readonly filter = signal<Filter>('ALL');

  readonly filterOptions: { label: string; value: Filter }[] = [
    { label: 'Tout', value: 'ALL' },
    { label: 'PV', value: 'MINUTES' },
    { label: 'ODJ', value: 'AGENDA' },
    { label: 'Rapports fin.', value: 'FINANCIAL_REPORT' },
    { label: 'Audits', value: 'AUDIT_REPORT' },
    { label: 'Statuts', value: 'BYLAW' },
  ];

  readonly resource = resource({
    loader: () => this.service.getArchives(),
  });

  readonly docs = computed(() => this.resource.value() ?? []);

  readonly visibleDocs = computed(() => {
    const f = this.filter();
    if (f === 'ALL') return this.docs();
    return this.docs().filter((d) => d.type === f);
  });

  readonly docType = signal<ArchiveDocumentType>('MINUTES');
  readonly title = signal('');
  readonly titleTouched = signal(false);
  readonly description = signal('');
  readonly fileName = signal('');
  readonly fileTouched = signal(false);
  readonly cycleNumber = signal('');
  readonly visibility = signal<ArchiveVisibility>('ALL_MEMBERS');

  readonly submitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly titleError = computed(() => (this.title().trim() ? '' : 'Titre requis.'));
  readonly fileError = computed(() => (this.fileName().trim() ? '' : 'Nom de fichier requis.'));

  countFor(value: Filter): number {
    if (value === 'ALL') return this.docs().length;
    return this.docs().filter((d) => d.type === value).length;
  }

  filterClass(value: Filter): string {
    const base = 'inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium border';
    return `${base} ${this.filter() === value ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`;
  }

  visibilityLabel(v: ArchiveVisibility): string {
    return { ALL_MEMBERS: 'Tous les membres', BUREAU: 'Bureau uniquement', RESTRICTED: 'Restreint' }[v];
  }

  formatFileSize(bytes: number): number {
    return bytes / 1024;
  }

  onTypeChange(event: Event): void {
    this.docType.set((event.target as HTMLSelectElement).value as ArchiveDocumentType);
  }

  download(id: string): void {
    this.notifications.info(`Téléchargement du document ${id} simulé.`, 'Téléchargement');
  }

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.titleTouched.set(true);
    this.fileTouched.set(true);
    this.errorMessage.set(null);

    if (this.titleError() || this.fileError()) return;

    this.submitting.set(true);
    try {
      await this.service.addArchive({
        type: this.docType(),
        title: this.title().trim(),
        description: this.description().trim() || undefined,
        fileName: this.fileName().trim(),
        fileSize: 100_000,
        visibility: this.visibility(),
        cycleNumber: this.cycleNumber() ? Number(this.cycleNumber()) : undefined,
      });
      this.notifications.success('Document archivé.');
      this.title.set('');
      this.description.set('');
      this.fileName.set('');
      this.cycleNumber.set('');
      this.titleTouched.set(false);
      this.fileTouched.set(false);
      this.resource.reload();
    } catch (e: unknown) {
      this.errorMessage.set((e as { error?: { message?: string } })?.error?.message ?? 'Erreur.');
    } finally {
      this.submitting.set(false);
    }
  }
}

import { ChangeDetectionStrategy, Component, computed, inject, resource, signal } from '@angular/core';
import { AlertComponent } from '../../../../shared/components/ui/alert/alert.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { EmptyStateComponent } from '../../../../shared/components/ui/empty-state/empty-state.component';
import { TextareaComponent } from '../../../../shared/components/ui/textarea/textarea.component';
import { LocationPickerComponent } from '../../../../shared/components/ui/location-picker/location-picker.component';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { NotificationService } from '../../../../core/services/notification.service';
import { SecretaryService } from '../../services/secretary.service';
import type {
  AgendaDraft,
  AgendaDraftStatus,
} from '../../../../shared/models/entities/agenda-draft.model';
import { formatApiError } from '../../../../core/utils';

const STANDARD_ITEMS: { title: string; duration: number }[] = [
  { title: 'Ouverture de la séance', duration: 5 },
  { title: 'Appel des membres', duration: 10 },
  { title: 'Lecture et adoption du PV précédent', duration: 15 },
  { title: 'Rapport du Trésorier', duration: 15 },
  { title: 'Rapport du Censeur', duration: 10 },
  { title: 'Rapport du Commissaire aux Comptes', duration: 10 },
  { title: 'Collecte des cotisations', duration: 30 },
  { title: 'Distribution de la cagnotte', duration: 20 },
  { title: 'Questions diverses', duration: 15 },
  { title: 'Clôture de la séance', duration: 5 },
];

const STATUS_LABELS: Record<AgendaDraftStatus, string> = {
  DRAFT: 'Brouillon',
  SUBMITTED_TO_PRESIDENT: 'Soumis au Président',
  CHANGES_REQUESTED: 'Modifications demandées',
  APPROVED: 'Approuvé',
  PUBLISHED: 'Publié',
};

@Component({
  selector: 'tc-agendas-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AlertComponent,
    BadgeComponent,
    ButtonComponent,
    CardComponent,
    EmptyStateComponent,
    TextareaComponent,
    LocationPickerComponent,
    DateFormatPipe,
  ],
  templateUrl: './agendas-page.component.html',
})
export class AgendasPageComponent {
  private readonly service = inject(SecretaryService);
  private readonly notifications = inject(NotificationService);

  protected readonly STATUS_LABELS = STATUS_LABELS;
  protected readonly standardItems = STANDARD_ITEMS;

  readonly resource = resource({
    loader: () => this.service.getAgendas(),
  });

  readonly membersResource = resource({
    loader: () => this.service.getMembers(),
  });

  readonly nextSessionResource = resource({
    loader: () => this.service.getNextSessionNumber(),
  });

  readonly agendas = computed(() => this.resource.value() ?? []);
  readonly members = computed(() => this.membersResource.value() ?? []);
  readonly nextSessionNumber = computed(() => this.nextSessionResource.value() ?? '…');

  readonly sessionNumber = signal('');
  readonly scheduledAt = signal('');
  readonly location = signal('');
  readonly beneficiary = signal('');
  readonly customItems = signal('');
  readonly dateTouched = signal(false);

  readonly submitting = signal(false);
  readonly acting = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);

  /** Valeur minimale pour le sélecteur de date (maintenant + 1 minute). */
  readonly dateMin = computed(() => {
    const d = new Date();
    d.setMinutes(d.getMinutes() + 1);
    return d.toISOString().slice(0, 16);
  });

  readonly dateError = computed(() => {
    const val = this.scheduledAt();
    if (!val) return this.dateTouched() ? 'Date requise.' : '';
    const selected = new Date(val);
    if (isNaN(selected.getTime())) return 'Date invalide.';
    if (selected <= new Date()) return 'La date doit être dans le futur.';
    return '';
  });

  statusKind(status: AgendaDraftStatus): 'neutral' | 'info' | 'warning' | 'success' {
    if (status === 'APPROVED' || status === 'PUBLISHED') return 'success';
    if (status === 'SUBMITTED_TO_PRESIDENT') return 'info';
    if (status === 'CHANGES_REQUESTED') return 'warning';
    return 'neutral';
  }

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.dateTouched.set(true);
    this.errorMessage.set(null);

    if (this.dateError()) return;

    const sessionNum = this.nextSessionResource.value();
    if (!sessionNum || sessionNum < 1) {
      this.errorMessage.set('Numéro de séance indisponible, veuillez réessayer.');
      return;
    }

    const items = [
      ...STANDARD_ITEMS.map((s) => ({
        title: s.title,
        isStandard: true,
        estimatedDurationMin: s.duration,
      })),
      ...this.customItems()
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .map((title) => ({ title, isStandard: false, estimatedDurationMin: 10 })),
    ];

    this.submitting.set(true);
    try {
      await this.service.createAgenda({
        sessionId: `session-${sessionNum}`,
        sessionNumber: sessionNum,
        scheduledAt: new Date(this.scheduledAt()).toISOString(),
        location: this.location().trim() || undefined,
        beneficiaryMemberId: this.beneficiary() || undefined,
        items,
      });
      this.notifications.success('Ordre du jour créé.');
      this.scheduledAt.set('');
      this.location.set('');
      this.beneficiary.set('');
      this.customItems.set('');
      this.dateTouched.set(false);
      this.resource.reload();
      this.nextSessionResource.reload();
    } catch (e: unknown) {
      this.errorMessage.set(formatApiError(e, 'Erreur.'));
    } finally {
      this.submitting.set(false);
    }
  }

  async submit(id: string): Promise<void> {
    this.acting.set(id);
    this.errorMessage.set(null);
    try {
      await this.service.submitAgenda(id);
      this.notifications.success('ODJ soumis au Président.');
      this.resource.reload();
    } catch (e: unknown) {
      this.errorMessage.set(formatApiError(e, 'Erreur.'));
    } finally {
      this.acting.set(null);
    }
  }
}

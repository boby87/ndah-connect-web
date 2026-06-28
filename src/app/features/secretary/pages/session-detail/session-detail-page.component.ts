import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  resource,
  signal,
} from '@angular/core';
import { DecimalPipe, Location } from '@angular/common';
import { AlertComponent } from '../../../../shared/components/ui/alert/alert.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { SpinnerComponent } from '../../../../shared/components/ui/spinner/spinner.component';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { CurrencyXafPipe } from '../../../../shared/pipes/currency-xaf.pipe';
import { NotificationService } from '../../../../core/services/notification.service';
import { SecretaryService, type AgendaItemPayload } from '../../services/secretary.service';
import { AttendancePageComponent } from '../attendance/attendance-page.component';
import { MinutesEditorComponent } from '../minutes/minutes-editor.component';
import { SESSION_STATUS_LABELS, SessionStatus } from '../../../../core/enums/session-status.enum';
import {
  CONVOCATION_CHANNEL_LABELS,
  type ConvocationChannel,
} from '../../../../shared/models/entities/convocation.model';
import { formatApiError } from '../../../../core/utils';
import type { AgendaDraft } from '../../../../shared/models/entities/agenda-draft.model';

interface EditableItem {
  _key: string;
  title: string;
  description: string;
  isStandard: boolean;
  estimatedDurationMin: number | null;
}

type Tab = 'agenda' | 'convocation' | 'attendance' | 'contributions' | 'minutes';

interface TabDef {
  key: Tab;
  label: string;
  icon: string;
}

const TABS: TabDef[] = [
  { key: 'agenda', label: 'Ordre du jour', icon: '📋' },
  { key: 'convocation', label: 'Convocation & RSVP', icon: '📬' },
  { key: 'attendance', label: 'Présences', icon: '👥' },
  { key: 'contributions', label: 'Cotisations', icon: '💰' },
  { key: 'minutes', label: 'Procès-verbal', icon: '📝' },
];

const STANDARD_ITEMS: { title: string; duration: number }[] = [
  { title: 'Ouverture de la séance', duration: 5 },
  { title: 'Appel des membres', duration: 10 },
  { title: 'Lecture et adoption du PV précédent', duration: 15 },
  { title: 'Rapport du Trésorier', duration: 15 },
  { title: 'Rapport du Censeur', duration: 10 },
  { title: 'Collecte des cotisations', duration: 30 },
  { title: 'Distribution de la cagnotte', duration: 20 },
  { title: 'Questions diverses', duration: 15 },
  { title: 'Clôture de la séance', duration: 5 },
];

const CHANNELS: ConvocationChannel[] = ['IN_APP', 'SMS', 'EMAIL', 'WHATSAPP'];

@Component({
  selector: 'tc-session-detail-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    DecimalPipe,
    AlertComponent,
    BadgeComponent,
    ButtonComponent,
    CardComponent,
    SpinnerComponent,
    DateFormatPipe,
    CurrencyXafPipe,
    AttendancePageComponent,
    MinutesEditorComponent,
  ],
  templateUrl: './session-detail-page.component.html',
})
export class SessionDetailPageComponent {
  readonly id = input.required<string>();

  private readonly locationService = inject(Location);
  private readonly secretaryService = inject(SecretaryService);
  private readonly notifications = inject(NotificationService);

  protected readonly SESSION_STATUS_LABELS = SESSION_STATUS_LABELS;
  protected readonly SessionStatus = SessionStatus;
  protected readonly CHANNELS = CHANNELS;
  protected readonly CHANNEL_LABELS = CONVOCATION_CHANNEL_LABELS;
  protected readonly TABS = TABS;

  // ── Resources ──────────────────────────────────────────────────────────────
  readonly sessionResource = resource({
    params: () => this.id(),
    loader: ({ params }) => this.secretaryService.getSession(params),
  });

  readonly agendasResource = resource({
    params: () => this.id(),
    loader: ({ params }) => this.secretaryService.getAgendasBySession(params),
  });

  readonly convocationsResource = resource({
    params: () => this.id(),
    loader: ({ params }) => this.secretaryService.getConvocationsBySession(params),
  });

  readonly rsvpsResource = resource({
    params: () => this.id(),
    loader: ({ params }) => this.secretaryService.getRsvps(params),
  });

  readonly minutesResource = resource({
    params: () => this.id(),
    loader: ({ params }) => this.secretaryService.getMinutesBySession(params),
  });

  readonly membersResource = resource({
    loader: () => this.secretaryService.getMembers(),
  });

  // ── Computed ───────────────────────────────────────────────────────────────
  readonly session = computed(() => this.sessionResource.value());
  readonly agendas = computed(() => this.agendasResource.value() ?? []);
  readonly convocations = computed(() => this.convocationsResource.value() ?? []);
  readonly rsvps = computed(() => this.rsvpsResource.value());
  readonly minutes = computed(() => this.minutesResource.value());
  readonly activeMembers = computed(() =>
    (this.membersResource.value() ?? []).filter((m) => m.status === 'ACTIVE'),
  );

  readonly tabAccess = computed(() => {
    const s = this.session();
    if (!s) {
      return { agenda: false, convocation: false, attendance: false, contributions: false, minutes: false };
    }
    const st = s.status;
    const isPast =
      st === SessionStatus.COMPLETED ||
      st === SessionStatus.VALIDATED ||
      st === SessionStatus.PENDING_VALIDATION;
    return {
      agenda: st !== SessionStatus.CANCELLED,
      convocation: st !== SessionStatus.CANCELLED,
      attendance: st === SessionStatus.IN_PROGRESS || isPast,
      contributions: st === SessionStatus.IN_PROGRESS || isPast,
      minutes: isPast,
    };
  });

  readonly isSessionEditable = computed(() => {
    const st = this.session()?.status;
    return st === SessionStatus.SCHEDULED;
  });

  // ── UI state ───────────────────────────────────────────────────────────────
  readonly activeTab = signal<Tab>('agenda');
  readonly errorMessage = signal<string | null>(null);
  readonly submitting = signal(false);
  readonly acting = signal<string | null>(null);

  // ── Agenda edit state ─────────────────────────────────────────────────────
  readonly editingAgendaId = signal<string | null>(null);
  readonly editItems = signal<EditableItem[]>([]);
  private _itemKeyCounter = 0;
  private nextKey(): string { return `k${++this._itemKeyCounter}`; }

  // ── Convocation form state ─────────────────────────────────────────────────
  readonly convMessage = signal(
    'Vous êtes convoqué(e) à la prochaine séance ordinaire de notre tontine.',
  );
  readonly selectedChannels = signal<ConvocationChannel[]>(['IN_APP', 'SMS']);
  readonly scheduleFor = signal('');
  readonly includeCandidates = signal(false);

  // ── Helpers ────────────────────────────────────────────────────────────────
  protected setTab(tab: Tab): void {
    if (!this.tabAccess()[tab]) return;
    this.activeTab.set(tab);
    this.errorMessage.set(null);
  }

  protected goBack(): void {
    this.locationService.back();
  }

  protected statusKind(status: SessionStatus): 'neutral' | 'info' | 'warning' | 'success' {
    if (status === SessionStatus.VALIDATED || status === SessionStatus.COMPLETED) return 'success';
    if (status === SessionStatus.IN_PROGRESS || status === SessionStatus.PENDING_VALIDATION)
      return 'info';
    if (status === SessionStatus.CANCELLED) return 'warning';
    return 'neutral';
  }

  protected agendaStatusKind(
    status: 'DRAFT' | 'SUBMITTED_TO_PRESIDENT' | 'CHANGES_REQUESTED' | 'APPROVED' | 'PUBLISHED',
  ): 'neutral' | 'info' | 'warning' | 'success' {
    if (status === 'APPROVED' || status === 'PUBLISHED') return 'success';
    if (status === 'SUBMITTED_TO_PRESIDENT') return 'info';
    if (status === 'CHANGES_REQUESTED') return 'warning';
    return 'neutral';
  }

  protected agendaStatusLabel(
    status: 'DRAFT' | 'SUBMITTED_TO_PRESIDENT' | 'CHANGES_REQUESTED' | 'APPROVED' | 'PUBLISHED',
  ): string {
    const map = {
      DRAFT: 'Brouillon',
      SUBMITTED_TO_PRESIDENT: 'Soumis au Président',
      CHANGES_REQUESTED: 'Modifications demandées',
      APPROVED: 'Approuvé',
      PUBLISHED: 'Publié',
    };
    return map[status];
  }

  protected convStatusLabel(status: 'DRAFT' | 'SCHEDULED' | 'SENT'): string {
    return { DRAFT: 'Brouillon', SCHEDULED: 'Programmée', SENT: 'Envoyée' }[status];
  }

  protected convStatusKind(status: 'DRAFT' | 'SCHEDULED' | 'SENT'): 'neutral' | 'info' | 'success' {
    return { DRAFT: 'neutral', SCHEDULED: 'info', SENT: 'success' }[
      status
    ] as 'neutral' | 'info' | 'success';
  }

  protected toggleChannel(ch: ConvocationChannel, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.selectedChannels.update((list) =>
      isChecked ? [...list, ch] : list.filter((c) => c !== ch),
    );
  }

  // ── Agenda items edit helpers ──────────────────────────────────────────────
  protected startEditItems(agenda: AgendaDraft): void {
    this.editItems.set(
      (agenda.items ?? []).map(item => ({
        _key: this.nextKey(),
        title: item.title,
        description: item.description ?? '',
        isStandard: item.isStandard,
        estimatedDurationMin: item.estimatedDurationMin ?? null,
      })),
    );
    this.editingAgendaId.set(agenda.id);
    this.errorMessage.set(null);
  }

  protected cancelEditItems(): void {
    this.editingAgendaId.set(null);
    this.editItems.set([]);
  }

  protected addEditItem(): void {
    this.editItems.update(items => [
      ...items,
      { _key: this.nextKey(), title: '', description: '', isStandard: false, estimatedDurationMin: null },
    ]);
  }

  protected removeEditItem(key: string): void {
    this.editItems.update(items => items.filter(i => i._key !== key));
  }

  protected moveEditItem(key: string, dir: 'up' | 'down'): void {
    this.editItems.update(items => {
      const idx = items.findIndex(i => i._key === key);
      if (idx < 0) return items;
      const next = dir === 'up' ? idx - 1 : idx + 1;
      if (next < 0 || next >= items.length) return items;
      const copy = [...items];
      [copy[idx], copy[next]] = [copy[next], copy[idx]];
      return copy;
    });
  }

  protected updateEditItem(key: string, patch: Partial<EditableItem>): void {
    this.editItems.update(items => items.map(i => (i._key === key ? { ...i, ...patch } : i)));
  }

  async saveItems(): Promise<void> {
    const agendaId = this.editingAgendaId();
    if (!agendaId) return;
    const payload: AgendaItemPayload[] = this.editItems().map(i => ({
      title: i.title.trim(),
      description: i.description.trim() || undefined,
      isStandard: i.isStandard,
      estimatedDurationMin: i.estimatedDurationMin ?? undefined,
    }));
    if (payload.some(p => !p.title)) {
      this.errorMessage.set('Chaque point doit avoir un titre.');
      return;
    }
    this.submitting.set(true);
    this.errorMessage.set(null);
    try {
      await this.secretaryService.updateAgendaItems(agendaId, payload);
      this.notifications.success('Ordre du jour enregistré.');
      this.editingAgendaId.set(null);
      this.editItems.set([]);
      this.agendasResource.reload();
    } catch (e: unknown) {
      this.errorMessage.set(formatApiError(e, "Erreur lors de l'enregistrement."));
    } finally {
      this.submitting.set(false);
    }
  }

  // ── Actions ────────────────────────────────────────────────────────────────
  async onCreateAgenda(): Promise<void> {
    const session = this.session();
    if (!session) return;
    this.submitting.set(true);
    this.errorMessage.set(null);
    try {
      await this.secretaryService.createAgenda({
        sessionId: session.id,
        sessionNumber: session.number,
        scheduledAt: session.scheduledAt,
        location: session.location,
        items: STANDARD_ITEMS.map((s) => ({
          title: s.title,
          isStandard: true,
          estimatedDurationMin: s.duration,
        })),
      });
      this.notifications.success('Ordre du jour créé avec les points standards.');
      this.agendasResource.reload();
    } catch (e: unknown) {
      this.errorMessage.set(formatApiError(e, "Erreur lors de la création de l'ODJ."));
    } finally {
      this.submitting.set(false);
    }
  }

  async onSubmitAgenda(id: string): Promise<void> {
    this.acting.set(id);
    this.errorMessage.set(null);
    try {
      await this.secretaryService.submitAgenda(id);
      this.notifications.success('ODJ soumis au Président.');
      this.agendasResource.reload();
    } catch (e: unknown) {
      this.errorMessage.set(formatApiError(e, 'Erreur.'));
    } finally {
      this.acting.set(null);
    }
  }

  async onDeleteAgenda(id: string): Promise<void> {
    if (!window.confirm('Supprimer cet ordre du jour ? Cette action est irréversible.')) return;
    this.acting.set(id);
    this.errorMessage.set(null);
    try {
      await this.secretaryService.deleteAgenda(id);
      this.notifications.success('Ordre du jour supprimé.');
      this.agendasResource.reload();
    } catch (e: unknown) {
      this.errorMessage.set(formatApiError(e, "Erreur lors de la suppression de l'ODJ."));
    } finally {
      this.acting.set(null);
    }
  }

  async onSendConvocation(event: Event): Promise<void> {
    event.preventDefault();
    const session = this.session();
    if (!session || this.selectedChannels().length === 0) return;
    this.submitting.set(true);
    this.errorMessage.set(null);
    try {
      await this.secretaryService.createConvocation({
        sessionId: session.id,
        channels: this.selectedChannels(),
        audienceMemberIds: this.activeMembers().map((m) => m.id),
        includeCandidates: this.includeCandidates(),
        message: this.convMessage().trim(),
        scheduledAt: this.scheduleFor()
          ? new Date(this.scheduleFor()).toISOString()
          : undefined,
      });
      this.notifications.success('Convocation enregistrée.');
      this.convocationsResource.reload();
      this.rsvpsResource.reload();
    } catch (e: unknown) {
      this.errorMessage.set(formatApiError(e, "Erreur lors de l'envoi."));
    } finally {
      this.submitting.set(false);
    }
  }
}

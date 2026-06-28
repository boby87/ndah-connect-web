import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  resource,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { AlertComponent } from '../../../../shared/components/ui/alert/alert.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { LocationPickerComponent } from '../../../../shared/components/ui/location-picker/location-picker.component';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { NotificationService } from '../../../../core/services/notification.service';
import { SecretaryService } from '../../services/secretary.service';
import { formatApiError } from '../../../../core/utils';
import { CYCLE_STATUS_LABELS, CycleStatus } from '../../../../core/enums/cycle-status.enum';
import { SESSION_STATUS_LABELS, SessionStatus } from '../../../../core/enums/session-status.enum';
import type { Cycle } from '../../../../shared/models/entities/cycle.model';
import type { Session } from '../../../../shared/models/entities/session.model';

type FormMode = 'single' | 'bulk' | 'edit';
type Interval = 'MONTHLY' | 'BIMONTHLY' | 'WEEKLY' | 'CUSTOM';

@Component({
  selector: 'tc-sessions-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    AlertComponent,
    BadgeComponent,
    ButtonComponent,
    CardComponent,
    LocationPickerComponent,
    DateFormatPipe,
  ],
  templateUrl: './sessions-page.component.html',
})
export class SessionsPageComponent {
  private readonly service = inject(SecretaryService);
  private readonly notifications = inject(NotificationService);
  private readonly router = inject(Router);

  protected readonly SESSION_STATUS_LABELS = SESSION_STATUS_LABELS;
  protected readonly SessionStatus = SessionStatus;
  protected readonly CycleStatus = CycleStatus;
  protected readonly CYCLE_STATUS_LABELS = CYCLE_STATUS_LABELS;

  // ── Resources ────────────────────────────────────────────────────────────
  readonly cyclesResource = resource({ loader: () => this.service.getCycles() });
  readonly cycles = computed(() => this.cyclesResource.value() ?? []);

  readonly activeCycle = computed(() =>
    this.cycles().find(c => c.status === CycleStatus.ACTIVE) ?? null
  );
  readonly closureRequestedCycle = computed(() =>
    this.cycles().find(c => c.status === CycleStatus.CLOSURE_REQUESTED) ?? null
  );
  readonly hasOpenCycle = computed(() =>
    this.activeCycle() !== null || this.closureRequestedCycle() !== null
  );

  readonly requestingClosure = signal(false);

  readonly selectedCycleId = signal<string>('');

  readonly sessionsResource = resource<Session[], string | undefined>({
    params: () => this.selectedCycleId() || undefined,
    loader: async ({ params: cycleId }) => {
      if (!cycleId) return [];
      return this.service.getSessionsByCycle(cycleId);
    },
  });
  readonly sessions = computed(() => this.sessionsResource.value() ?? []);

  // ── UI state ─────────────────────────────────────────────────────────────
  readonly formMode = signal<FormMode>('single');
  readonly expandedCycleId = signal<string>('');
  readonly errorMessage = signal<string | null>(null);
  readonly submitting = signal(false);

  // ── New cycle form ────────────────────────────────────────────────────────
  readonly showCycleForm = signal(false);
  readonly newCycleStartDate = signal('');
  readonly creatingCycle = signal(false);

  // ── Single session form ───────────────────────────────────────────────────
  readonly singleCycleId = signal('');
  readonly singleScheduledAt = signal('');
  readonly singleLocation = signal('');
  readonly singleDateTouched = signal(false);

  readonly singleDateMin = computed(() => {
    const d = new Date();
    d.setMinutes(d.getMinutes() + 1);
    return d.toISOString().slice(0, 16);
  });

  readonly singleDateError = computed(() => {
    const val = this.singleScheduledAt();
    if (!val) return this.singleDateTouched() ? 'Date requise.' : '';
    const selected = new Date(val);
    if (isNaN(selected.getTime())) return 'Date invalide.';
    if (selected <= new Date()) return 'La date doit être dans le futur.';
    return '';
  });

  // ── Bulk planning form ────────────────────────────────────────────────────
  readonly bulkCycleId = signal('');
  readonly bulkFirstDate = signal('');
  readonly bulkCount = signal(12);
  readonly bulkInterval = signal<Interval>('MONTHLY');
  readonly bulkCustomDays = signal(30);
  readonly bulkDefaultLocation = signal('');
  readonly bulkDateTouched = signal(false);

  readonly bulkPreview = computed(() => {
    const first = this.bulkFirstDate();
    const count = this.bulkCount();
    if (!first || count < 1) return [];
    const start = new Date(first);
    if (isNaN(start.getTime()) || start <= new Date()) return [];
    const interval = this.bulkInterval();
    const customDays = this.bulkCustomDays();
    const dates: Date[] = [];
    for (let i = 0; i < count; i++) {
      const d = new Date(start);
      if (interval === 'MONTHLY') {
        d.setMonth(d.getMonth() + i);
      } else if (interval === 'BIMONTHLY') {
        d.setDate(d.getDate() + i * 15);
      } else if (interval === 'WEEKLY') {
        d.setDate(d.getDate() + i * 7);
      } else {
        d.setDate(d.getDate() + i * customDays);
      }
      dates.push(d);
    }
    return dates;
  });

  readonly bulkDateError = computed(() => {
    const val = this.bulkFirstDate();
    if (!val) return this.bulkDateTouched() ? 'Date requise.' : '';
    const selected = new Date(val);
    if (isNaN(selected.getTime())) return 'Date invalide.';
    if (selected <= new Date()) return 'La date doit être dans le futur.';
    return '';
  });

  // ── Edit form ─────────────────────────────────────────────────────────────
  readonly editingSession = signal<Session | null>(null);
  readonly editScheduledAt = signal('');
  readonly editLocation = signal('');
  readonly editDateTouched = signal(false);

  readonly editDateError = computed(() => {
    const val = this.editScheduledAt();
    if (!val) return this.editDateTouched() ? 'Date requise.' : '';
    const selected = new Date(val);
    if (isNaN(selected.getTime())) return 'Date invalide.';
    if (selected <= new Date()) return 'La date doit être dans le futur.';
    return '';
  });

  // ── Helpers ───────────────────────────────────────────────────────────────

  protected statusKind(status: SessionStatus): 'neutral' | 'info' | 'warning' | 'success' {
    if (status === SessionStatus.VALIDATED || status === SessionStatus.COMPLETED) return 'success';
    if (status === SessionStatus.IN_PROGRESS) return 'info';
    if (status === SessionStatus.CANCELLED) return 'warning';
    return 'neutral';
  }

  protected toggleCycle(cycleId: string): void {
    if (this.expandedCycleId() === cycleId) {
      this.expandedCycleId.set('');
    } else {
      this.expandedCycleId.set(cycleId);
      this.selectedCycleId.set(cycleId);
    }
  }

  protected openSession(sessionId: string): void {
    this.router.navigate(['/secretary/sessions', sessionId]);
  }

  protected startEdit(session: Session): void {
    this.editingSession.set(session);
    this.editScheduledAt.set(new Date(session.scheduledAt).toISOString().slice(0, 16));
    this.editLocation.set(session.location ?? '');
    this.editDateTouched.set(false);
    this.formMode.set('edit');
  }

  protected cancelEdit(): void {
    this.editingSession.set(null);
    this.formMode.set('single');
  }

  protected cycleLabel(c: Cycle): string {
    return `Cycle ${c.number} — ${new Date(c.startDate).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}`;
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  async onRequestClosure(cycleId: string): Promise<void> {
    this.requestingClosure.set(true);
    this.errorMessage.set(null);
    try {
      await this.service.requestCycleClosure(cycleId);
      this.notifications.success('Demande de clôture envoyée au Président.');
      this.cyclesResource.reload();
    } catch (e: unknown) {
      this.errorMessage.set(formatApiError(e, 'Erreur lors de la demande de clôture.'));
    } finally {
      this.requestingClosure.set(false);
    }
  }

  async onCreateCycle(event: Event): Promise<void> {
    event.preventDefault();
    if (!this.newCycleStartDate()) return;
    this.creatingCycle.set(true);
    this.errorMessage.set(null);
    try {
      await this.service.createCycle({ startDate: this.newCycleStartDate() });
      this.notifications.success('Cycle créé.');
      this.newCycleStartDate.set('');
      this.showCycleForm.set(false);
      this.cyclesResource.reload();
    } catch (e: unknown) {
      this.errorMessage.set(formatApiError(e, 'Erreur lors de la création du cycle.'));
    } finally {
      this.creatingCycle.set(false);
    }
  }

  async onCreateSingle(event: Event): Promise<void> {
    event.preventDefault();
    this.singleDateTouched.set(true);
    this.errorMessage.set(null);
    if (this.singleDateError() || !this.singleCycleId()) {
      if (!this.singleCycleId()) this.errorMessage.set('Veuillez sélectionner un cycle.');
      return;
    }
    this.submitting.set(true);
    try {
      await this.service.createSession({
        cycleId: this.singleCycleId(),
        scheduledAt: new Date(this.singleScheduledAt()).toISOString(),
        location: this.singleLocation().trim() || undefined,
      });
      this.notifications.success('Séance créée.');
      this.singleScheduledAt.set('');
      this.singleLocation.set('');
      this.singleDateTouched.set(false);
      this.cyclesResource.reload();
      if (this.expandedCycleId() === this.singleCycleId()) {
        this.sessionsResource.reload();
      }
    } catch (e: unknown) {
      this.errorMessage.set(formatApiError(e, 'Erreur lors de la création.'));
    } finally {
      this.submitting.set(false);
    }
  }

  async onCreateBulk(event: Event): Promise<void> {
    event.preventDefault();
    this.bulkDateTouched.set(true);
    this.errorMessage.set(null);
    const preview = this.bulkPreview();
    if (this.bulkDateError() || !this.bulkCycleId() || preview.length === 0) {
      if (!this.bulkCycleId()) this.errorMessage.set('Veuillez sélectionner un cycle.');
      return;
    }
    this.submitting.set(true);
    try {
      const location = this.bulkDefaultLocation().trim() || undefined;
      await this.service.createBulkSessions({
        cycleId: this.bulkCycleId(),
        sessions: preview.map((d) => ({ scheduledAt: d.toISOString(), location })),
      });
      this.notifications.success(`${preview.length} séances planifiées.`);
      this.bulkFirstDate.set('');
      this.bulkDefaultLocation.set('');
      this.bulkDateTouched.set(false);
      this.cyclesResource.reload();
      if (this.expandedCycleId() === this.bulkCycleId()) {
        this.sessionsResource.reload();
      }
    } catch (e: unknown) {
      this.errorMessage.set(formatApiError(e, 'Erreur lors de la planification.'));
    } finally {
      this.submitting.set(false);
    }
  }

  async onUpdateSession(event: Event): Promise<void> {
    event.preventDefault();
    this.editDateTouched.set(true);
    this.errorMessage.set(null);
    const session = this.editingSession();
    if (!session || this.editDateError()) return;
    this.submitting.set(true);
    try {
      await this.service.updateSession(session.id, {
        scheduledAt: new Date(this.editScheduledAt()).toISOString(),
        location: this.editLocation().trim() || undefined,
      });
      this.notifications.success('Séance mise à jour.');
      this.editingSession.set(null);
      this.formMode.set('single');
      this.sessionsResource.reload();
      this.cyclesResource.reload();
    } catch (e: unknown) {
      this.errorMessage.set(formatApiError(e, 'Erreur lors de la mise à jour.'));
    } finally {
      this.submitting.set(false);
    }
  }
}

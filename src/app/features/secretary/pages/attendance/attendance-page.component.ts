import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  resource,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { AlertComponent } from '../../../../shared/components/ui/alert/alert.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { SpinnerComponent } from '../../../../shared/components/ui/spinner/spinner.component';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { NotificationService } from '../../../../core/services/notification.service';
import { PresidentService } from '../../../president/services/president.service';
import { SecretaryService } from '../../services/secretary.service';

const STATUSES: ('PRESENT' | 'LATE' | 'EXCUSED' | 'ABSENT')[] = ['PRESENT', 'LATE', 'EXCUSED', 'ABSENT'];

const STATUS_LABELS: Record<'PRESENT' | 'LATE' | 'EXCUSED' | 'ABSENT', string> = {
  PRESENT: 'Présent',
  LATE: 'Retard',
  EXCUSED: 'Excusé',
  ABSENT: 'Absent',
};

@Component({
  selector: 'tc-attendance-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    AlertComponent,
    ButtonComponent,
    CardComponent,
    SpinnerComponent,
    DateFormatPipe,
  ],
  templateUrl: './attendance-page.component.html',
})
export class AttendancePageComponent {
  readonly id = input.required<string>();

  protected readonly statuses = STATUSES;
  protected readonly statusLabels = STATUS_LABELS;

  private readonly secretary = inject(SecretaryService);
  private readonly president = inject(PresidentService);
  private readonly notifications = inject(NotificationService);

  readonly sessionResource = resource({
    params: () => this.id(),
    loader: ({ params }) => this.president.getSession(params),
  });

  readonly membersResource = resource({
    loader: () => this.secretary.getMembers(),
  });

  readonly session = computed(() => this.sessionResource.value());

  readonly activeMembers = computed(() =>
    (this.membersResource.value() ?? []).filter((m) => m.status === 'ACTIVE'),
  );

  readonly actingId = signal<string | null>(null);
  readonly finalizing = signal(false);
  readonly errorMessage = signal<string | null>(null);

  countByStatus(status: 'PRESENT' | 'LATE' | 'EXCUSED' | 'ABSENT'): number {
    return this.session()?.attendance.filter((a) => a.status === status).length ?? 0;
  }

  currentStatusFor(memberId: string): 'PRESENT' | 'LATE' | 'EXCUSED' | 'ABSENT' | null {
    return this.session()?.attendance.find((a) => a.memberId === memberId)?.status ?? null;
  }

  buttonClass(memberId: string, target: 'PRESENT' | 'LATE' | 'EXCUSED' | 'ABSENT'): string {
    const base = 'rounded-full px-3 py-1 text-xs border transition-colors';
    if (this.currentStatusFor(memberId) === target) {
      const colors = {
        PRESENT: 'bg-green-600 text-white border-green-600',
        LATE: 'bg-amber-500 text-white border-amber-500',
        EXCUSED: 'bg-blue-600 text-white border-blue-600',
        ABSENT: 'bg-red-600 text-white border-red-600',
      };
      return `${base} ${colors[target]}`;
    }
    return `${base} bg-white text-gray-700 border-gray-300 hover:bg-gray-50`;
  }

  async setStatus(
    memberId: string,
    status: 'PRESENT' | 'LATE' | 'EXCUSED' | 'ABSENT',
  ): Promise<void> {
    this.actingId.set(memberId);
    this.errorMessage.set(null);
    try {
      await this.secretary.setAttendance(this.id(), memberId, status);
      this.sessionResource.reload();
    } catch (e: unknown) {
      this.errorMessage.set((e as { error?: { message?: string } })?.error?.message ?? 'Erreur.');
    } finally {
      this.actingId.set(null);
    }
  }

  async finalize(): Promise<void> {
    this.finalizing.set(true);
    try {
      await this.secretary.finalizeAttendance(this.id());
      this.notifications.success('Feuille de présence finalisée.');
    } catch (e: unknown) {
      this.errorMessage.set((e as { error?: { message?: string } })?.error?.message ?? 'Erreur.');
    } finally {
      this.finalizing.set(false);
    }
  }
}

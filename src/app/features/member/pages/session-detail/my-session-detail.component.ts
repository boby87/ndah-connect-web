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
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { SpinnerComponent } from '../../../../shared/components/ui/spinner/spinner.component';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { CurrencyXafPipe } from '../../../../shared/pipes/currency-xaf.pipe';
import { AttendanceStatus, ATTENDANCE_STATUS_LABELS } from '../../../../core/enums/attendance-status.enum';
import { ContributionStatus, CONTRIBUTION_STATUS_LABELS } from '../../../../core/enums/contribution-status.enum';
import { SessionStatus } from '../../../../core/enums/session-status.enum';
import { MemberService } from '../../services/member.service';
import type { MemberSessionView } from '../../../../shared/models/entities/member-session-view.model';

type Tab = 'agenda' | 'attendance' | 'contributions';

@Component({
  selector: 'tc-my-session-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterLink, BadgeComponent, CardComponent, SpinnerComponent, DateFormatPipe, CurrencyXafPipe],
  templateUrl: './my-session-detail.component.html',
})
export class MySessionDetailComponent {
  private readonly memberService = inject(MemberService);

  protected readonly AttendanceStatus = AttendanceStatus;
  protected readonly ATTENDANCE_STATUS_LABELS = ATTENDANCE_STATUS_LABELS;
  protected readonly CONTRIBUTION_STATUS_LABELS = CONTRIBUTION_STATUS_LABELS;
  protected readonly ContributionStatus = ContributionStatus;

  readonly id = input.required<string>();

  readonly sessionResource = resource({
    params: () => this.id(),
    loader: ({ params }) => this.memberService.getSession(params),
  });

  readonly session = computed(() => this.sessionResource.value());

  readonly activeTab = signal<Tab>('agenda');

  readonly presentCount = computed(() =>
    (this.session()?.attendance ?? []).filter(a => a.status === AttendanceStatus.PRESENT).length,
  );
  readonly lateCount = computed(() =>
    (this.session()?.attendance ?? []).filter(a => a.status === AttendanceStatus.LATE).length,
  );
  readonly excusedCount = computed(() =>
    (this.session()?.attendance ?? []).filter(a => a.status === AttendanceStatus.EXCUSED).length,
  );
  readonly absentCount = computed(() =>
    (this.session()?.attendance ?? []).filter(a => a.status === AttendanceStatus.ABSENT).length,
  );

  readonly totalExpected = computed(() =>
    (this.session()?.contributions ?? []).reduce((sum, c) => sum + c.expectedAmount, 0),
  );

  readonly totalPaid = computed(() =>
    (this.session()?.contributions ?? []).reduce((sum, c) => sum + c.paidAmount, 0),
  );

  badgeKind(status: MemberSessionView['status']): 'success' | 'warning' | 'info' | 'neutral' {
    switch (status) {
      case SessionStatus.COMPLETED:
      case SessionStatus.VALIDATED:
        return 'success';
      case SessionStatus.IN_PROGRESS:
        return 'info';
      case SessionStatus.CANCELLED:
        return 'warning';
      default:
        return 'neutral';
    }
  }

  attendanceBadgeKind(status: AttendanceStatus): 'success' | 'warning' | 'info' | 'neutral' {
    switch (status) {
      case AttendanceStatus.PRESENT:
        return 'success';
      case AttendanceStatus.LATE:
        return 'warning';
      case AttendanceStatus.EXCUSED:
        return 'info';
      default:
        return 'neutral';
    }
  }

  contributionBadgeKind(status: ContributionStatus): 'success' | 'warning' | 'info' | 'neutral' {
    switch (status) {
      case ContributionStatus.PAID:
        return 'success';
      case ContributionStatus.PARTIAL:
        return 'warning';
      case ContributionStatus.LATE:
        return 'warning';
      case ContributionStatus.PENDING:
        return 'neutral';
      case ContributionStatus.EXEMPTED:
        return 'info';
      default:
        return 'neutral';
    }
  }
}

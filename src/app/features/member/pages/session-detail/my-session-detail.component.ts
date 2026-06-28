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
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { EmptyStateComponent } from '../../../../shared/components/ui/empty-state/empty-state.component';
import { InputComponent } from '../../../../shared/components/ui/input/input.component';
import { SpinnerComponent } from '../../../../shared/components/ui/spinner/spinner.component';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { CurrencyXafPipe } from '../../../../shared/pipes/currency-xaf.pipe';
import { StatusLabelPipe } from '../../../../shared/pipes/status-label.pipe';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { TreasurerService } from '../../../treasurer/services/treasurer.service';
import { AttendanceStatus, ATTENDANCE_STATUS_LABELS } from '../../../../core/enums/attendance-status.enum';
import { ContributionStatus, CONTRIBUTION_STATUS_LABELS } from '../../../../core/enums/contribution-status.enum';
import { ContributionType, CONTRIBUTION_TYPE_LABELS } from '../../../../core/enums/contribution-type.enum';
import { SessionStatus } from '../../../../core/enums/session-status.enum';
import { UserRole } from '../../../../core/enums/user-role.enum';
import { PaymentMethod, PAYMENT_METHOD_LABELS } from '../../../../core/enums/payment-method.enum';
import { MemberService } from '../../services/member.service';
import type { MemberSessionView } from '../../../../shared/models/entities/member-session-view.model';
import type { Contribution } from '../../../../shared/models/entities/contribution.model';
import type { SessionFinancialReport } from '../../../../shared/models/entities/treasury.model';

type Tab = 'agenda' | 'attendance' | 'contributions';

@Component({
  selector: 'tc-my-session-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    RouterLink,
    AlertComponent, BadgeComponent, ButtonComponent, CardComponent, EmptyStateComponent,
    InputComponent, SpinnerComponent,
    DateFormatPipe, CurrencyXafPipe, StatusLabelPipe,
  ],
  templateUrl: './my-session-detail.component.html',
})
export class MySessionDetailComponent {
  private readonly memberService = inject(MemberService);
  private readonly auth = inject(AuthService);
  private readonly treasurerService = inject(TreasurerService);

  protected readonly AttendanceStatus = AttendanceStatus;
  protected readonly ATTENDANCE_STATUS_LABELS = ATTENDANCE_STATUS_LABELS;
  protected readonly CONTRIBUTION_STATUS_LABELS = CONTRIBUTION_STATUS_LABELS;
  protected readonly ContributionStatus = ContributionStatus;
  protected readonly ContributionType = ContributionType;
  protected readonly CONTRIBUTION_TYPE_LABELS = CONTRIBUTION_TYPE_LABELS;
  protected readonly CONTRIBUTION_TYPES = [
    ContributionType.ORDINARY,
    ContributionType.CASH_FUND,
    ContributionType.ATTENDANCE,
    ContributionType.SAVINGS,
  ];
  protected readonly PAYMENT_METHOD_LABELS = PAYMENT_METHOD_LABELS;
  protected readonly PAYMENT_METHODS = [
    PaymentMethod.CASH,
    PaymentMethod.MOBILE_MONEY,
    PaymentMethod.ORANGE_MONEY,
    PaymentMethod.BANK_TRANSFER,
  ];

  readonly id = input.required<string>();

  readonly sessionResource = resource({
    params: () => this.id(),
    loader: ({ params }) => this.memberService.getSession(params),
  });

  readonly allContributionsResource = resource<
    Contribution[],
    { id: string; active: boolean; isTreasurer: boolean; type: ContributionType }
  >({
    params: () => ({
      id: this.id(),
      active: this.activeTab() === 'contributions',
      isTreasurer: this.auth.hasRole(UserRole.TREASURER),
      type: this.selectedType(),
    }),
    loader: async ({ params }) => {
      if (!params.active || !params.isTreasurer) return [];
      return this.treasurerService.getContributions(params.id, params.type);
    },
  });

  readonly reportResource = resource<SessionFinancialReport | null, { id: string; show: boolean }>({
    params: () => ({ id: this.id(), show: this.showReport() }),
    loader: async ({ params }) => {
      if (!params.show) return null;
      return this.treasurerService.getSessionReport(params.id);
    },
  });

  readonly session = computed(() => this.sessionResource.value());

  readonly activeTab = signal<Tab>('agenda');
  readonly selectedType = signal<ContributionType>(ContributionType.ORDINARY);

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

  protected readonly isTreasurer = computed(() => this.auth.hasRole(UserRole.TREASURER));

  protected readonly myContribution = computed(() => {
    const userId = this.auth.user()?.id;
    return (this.session()?.contributions ?? []).find((c) => c.memberId === userId) ?? null;
  });

  protected readonly allContributions = computed(() => this.allContributionsResource.value() ?? []);

  /** Liste de membres affichés pour le type sélectionné (avec leur cotisation ou null) */
  protected readonly membersForSelectedType = computed(() => {
    const s = this.session();
    if (!s) return [];
    const type = this.selectedType();
    const paidMap = new Map(this.allContributions().map((c) => [c.memberId, c]));

    let entries = s.contributions;
    if (type === ContributionType.ATTENDANCE) {
      const presentIds = new Set(
        s.attendance
          .filter((a) => a.status === AttendanceStatus.PRESENT || a.status === AttendanceStatus.LATE)
          .map((a) => a.memberId),
      );
      entries = entries.filter((e) => presentIds.has(e.memberId));
    }

    return entries.map((e) => ({
      memberId: e.memberId,
      memberName: e.memberName,
      contribution: paidMap.get(e.memberId) ?? null,
    }));
  });

  protected readonly totalPaidAll = computed(() =>
    this.allContributions().reduce((s, c) => s + c.paidAmount, 0),
  );
  protected readonly paidCount = computed(() =>
    this.allContributions().filter(
      (c) => c.status === ContributionStatus.PAID || c.status === ContributionStatus.EXEMPTED,
    ).length,
  );
  protected readonly report = computed(() => this.reportResource.value());

  readonly paying = signal<string | null>(null);
  readonly payAmount = signal('');
  readonly payAmountTouched = signal(false);
  readonly payMethod = signal<PaymentMethod>(PaymentMethod.CASH);
  readonly payReference = signal('');
  readonly paySubmitting = signal(false);
  readonly contribError = signal<string | null>(null);
  readonly showReport = signal(false);

  readonly payAmountError = computed(() => {
    if (!this.payAmountTouched()) return '';
    const n = Number(this.payAmount());
    if (!Number.isFinite(n) || n <= 0) return 'Montant invalide (doit être supérieur à 0).';
    return '';
  });

  protected memberName(memberId: string): string {
    return this.session()?.contributions.find((c) => c.memberId === memberId)?.memberName ?? '—';
  }

  protected payMethodLabel(method: string | undefined): string {
    if (!method) return '';
    return PAYMENT_METHOD_LABELS[method as PaymentMethod] ?? method;
  }

  protected contribStatusKind(
    status: ContributionStatus,
  ): 'neutral' | 'info' | 'warning' | 'success' {
    switch (status) {
      case ContributionStatus.PAID: return 'success';
      case ContributionStatus.EXEMPTED: return 'info';
      case ContributionStatus.PARTIAL:
      case ContributionStatus.LATE: return 'warning';
      default: return 'neutral';
    }
  }

  protected openPay(memberId: string): void {
    this.paying.set(memberId);
    this.payAmount.set('');
    this.payAmountTouched.set(false);
    this.payMethod.set(PaymentMethod.CASH);
    this.payReference.set('');
    this.contribError.set(null);
  }

  protected cancelPay(): void {
    this.paying.set(null);
    this.contribError.set(null);
  }

  protected async onPay(event: Event, memberId: string): Promise<void> {
    event.preventDefault();
    this.payAmountTouched.set(true);
    if (this.payAmountError()) return;
    this.paySubmitting.set(true);
    this.contribError.set(null);
    try {
      await this.treasurerService.recordContribution({
        memberId,
        contributionType: this.selectedType(),
        sessionId: this.id(),
        amount: Number(this.payAmount()),
        paymentMethod: this.payMethod(),
        reference: this.payReference().trim() || undefined,
      });
      this.cancelPay();
      this.allContributionsResource.reload();
    } catch {
      this.contribError.set("Erreur lors de l'enregistrement du paiement.");
    } finally {
      this.paySubmitting.set(false);
    }
  }

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

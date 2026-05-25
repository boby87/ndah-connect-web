import { Pipe, PipeTransform } from '@angular/core';
import { CONTRIBUTION_STATUS_LABELS, ContributionStatus } from '../../core/enums/contribution-status.enum';
import { LOAN_STATUS_LABELS, LoanStatus } from '../../core/enums/loan-status.enum';
import { MEMBER_STATUS_LABELS, MemberStatus } from '../../core/enums/member-status.enum';
import { SANCTION_STATUS_LABELS, SanctionStatus } from '../../core/enums/sanction-type.enum';
import { SESSION_STATUS_LABELS, SessionStatus } from '../../core/enums/session-status.enum';
import { TONTINE_STATUS_LABELS, TontineStatus } from '../../core/enums/tontine-status.enum';

type StatusDomain = 'contribution' | 'loan' | 'member' | 'sanction' | 'session' | 'tontine';

const LABEL_MAPS: Record<StatusDomain, Record<string, string>> = {
  contribution: CONTRIBUTION_STATUS_LABELS as Record<ContributionStatus, string>,
  loan: LOAN_STATUS_LABELS as Record<LoanStatus, string>,
  member: MEMBER_STATUS_LABELS as Record<MemberStatus, string>,
  sanction: SANCTION_STATUS_LABELS as Record<SanctionStatus, string>,
  session: SESSION_STATUS_LABELS as Record<SessionStatus, string>,
  tontine: TONTINE_STATUS_LABELS as Record<TontineStatus, string>,
};

@Pipe({ name: 'statusLabel', pure: true })
export class StatusLabelPipe implements PipeTransform {
  transform(value: string | null | undefined, domain: StatusDomain): string {
    if (!value) return '—';
    return LABEL_MAPS[domain]?.[value] ?? value;
  }
}

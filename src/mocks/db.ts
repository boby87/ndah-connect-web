import { seedContributions, seedCycles, seedLoans, seedMembers, seedSessions, seedTontines, seedUsers } from './seed';
import {
  presidentSeedAnnouncements,
  presidentSeedDecisions,
  presidentSeedSanctions,
  presidentSeedValidations,
} from './seed-president';
import {
  seedConflicts,
  seedCycleClose,
  seedDelegations,
  seedEmergencyBlocks,
  seedExtraordinaryContributions,
  seedMembershipFiles,
  seedReports,
  seedSessionsLive,
  seedVotes,
} from './seed-president-flows';
import {
  seedAgendaDrafts,
  seedArchives,
  seedConvocations,
  seedMinutesDrafts,
  seedRsvps,
} from './seed-secretary';
import {
  seedCashBoxTransfers,
  seedCashBoxes,
  seedCashMovements,
  seedDistributions,
  seedExpenses,
  seedMobileMoneyTx,
} from './seed-treasurer';
import {
  seedAbsenceJustifications,
  seedAttendanceModRequests,
  seedCensorCommunications,
  seedCensorReports,
  seedCensorSanctions,
} from './seed-censor';
import {
  seedAuditorAnomalies,
  seedAuditorAudits,
  seedAuditorCertifications,
  seedAuditorClarifications,
  seedAuditorControls,
  seedAuditorRecommendations,
  seedAuditorReports,
  seedSessionBalanceReviews,
} from './seed-auditor';
import type { AgendaDraft } from '../app/shared/models/entities/agenda-draft.model';
import type { Announcement } from '../app/shared/models/entities/announcement.model';
import type { ArchiveDocument } from '../app/shared/models/entities/archive-document.model';
import type { Convocation } from '../app/shared/models/entities/convocation.model';
import type { MemberRsvp } from '../app/shared/models/entities/rsvp.model';
import type { MinutesDraft } from '../app/shared/models/entities/minutes-draft.model';
import type { Conflict } from '../app/shared/models/entities/conflict.model';
import type { Contribution } from '../app/shared/models/entities/contribution.model';
import type { CycleClose } from '../app/shared/models/entities/cycle-close.model';
import type { Cycle } from '../app/shared/models/entities/cycle.model';
import type { Delegation } from '../app/shared/models/entities/delegation.model';
import type { EmergencyBlock } from '../app/shared/models/entities/emergency-block.model';
import type { ExtraordinaryContribution } from '../app/shared/models/entities/extraordinary-contribution.model';
import type { Loan } from '../app/shared/models/entities/loan.model';
import type { Member } from '../app/shared/models/entities/member.model';
import type { MembershipFile } from '../app/shared/models/entities/membership.model';
import type { ReportEntry } from '../app/shared/models/entities/report.model';
import type { Sanction } from '../app/shared/models/entities/sanction.model';
import type { SessionLive } from '../app/shared/models/entities/session-live.model';
import type { Session } from '../app/shared/models/entities/session.model';
import type { Tontine } from '../app/shared/models/entities/tontine.model';
import type { User } from '../app/shared/models/entities/user.model';
import type {
  CagnotteDistribution,
  CashBox,
  CashBoxTransfer,
  CashMovement,
  Expense,
  MobileMoneyTransaction,
} from '../app/shared/models/entities/treasury.model';
import type {
  AbsenceJustification,
  AttendanceModificationRequest,
  CensorCommunication,
  CensorReport,
} from '../app/shared/models/entities/sanction.model';
import type {
  AuditorAnomaly,
  AuditorAudit,
  AuditorCertification,
  AuditorClarification,
  AuditorControl,
  AuditorRecommendation,
  AuditorReport,
  SessionBalanceReview,
} from '../app/shared/models/entities/auditor.model';
import type { PendingValidation, ValidationDecision } from '../app/shared/models/entities/validation.model';
import type { Vote } from '../app/shared/models/entities/vote.model';

export const db = {
  users: [...seedUsers] as User[],
  tontines: [...seedTontines] as Tontine[],
  cycles: [...seedCycles] as Cycle[],
  members: [...seedMembers] as Member[],
  sessions: [...seedSessions] as Session[],
  contributions: [...seedContributions] as Contribution[],
  loans: [...seedLoans] as Loan[],
  sanctions: [...presidentSeedSanctions, ...seedCensorSanctions] as Sanction[],
  attendanceModRequests: [...seedAttendanceModRequests] as AttendanceModificationRequest[],
  absenceJustifications: [...seedAbsenceJustifications] as AbsenceJustification[],
  censorCommunications: [...seedCensorCommunications] as CensorCommunication[],
  censorReports: [...seedCensorReports] as CensorReport[],
  auditorAnomalies: [...seedAuditorAnomalies] as AuditorAnomaly[],
  auditorControls: [...seedAuditorControls] as AuditorControl[],
  auditorAudits: [...seedAuditorAudits] as AuditorAudit[],
  auditorRecommendations: [...seedAuditorRecommendations] as AuditorRecommendation[],
  auditorClarifications: [...seedAuditorClarifications] as AuditorClarification[],
  auditorCertifications: [...seedAuditorCertifications] as AuditorCertification[],
  auditorReports: [...seedAuditorReports] as AuditorReport[],
  sessionBalanceReviews: [...seedSessionBalanceReviews] as SessionBalanceReview[],
  validations: [...presidentSeedValidations] as PendingValidation[],
  decisions: [...presidentSeedDecisions] as ValidationDecision[],
  announcements: [...presidentSeedAnnouncements] as Announcement[],
  sessionsLive: [...seedSessionsLive] as SessionLive[],
  membershipFiles: [...seedMembershipFiles] as MembershipFile[],
  extraordinaryContributions: [...seedExtraordinaryContributions] as ExtraordinaryContribution[],
  conflicts: [...seedConflicts] as Conflict[],
  cycleClose: { ...seedCycleClose } as CycleClose,
  votes: [...seedVotes] as Vote[],
  delegations: [...seedDelegations] as Delegation[],
  emergencyBlocks: [...seedEmergencyBlocks] as EmergencyBlock[],
  reports: [...seedReports] as ReportEntry[],
  agendaDrafts: [...seedAgendaDrafts] as AgendaDraft[],
  convocations: [...seedConvocations] as Convocation[],
  rsvps: [...seedRsvps] as MemberRsvp[],
  minutesDrafts: [...seedMinutesDrafts] as MinutesDraft[],
  archives: [...seedArchives] as ArchiveDocument[],
  cashBoxes: [...seedCashBoxes] as CashBox[],
  cashMovements: [...seedCashMovements] as CashMovement[],
  cashBoxTransfers: [...seedCashBoxTransfers] as CashBoxTransfer[],
  expenses: [...seedExpenses] as Expense[],
  mobileMoneyTx: [...seedMobileMoneyTx] as MobileMoneyTransaction[],
  distributions: [...seedDistributions] as CagnotteDistribution[],
  otpStore: new Map<string, string>(),
};

export const findUserByIdentifier = (identifier: string): User | undefined => {
  const value = identifier.trim().toLowerCase();
  return db.users.find(
    (u) => u.email.toLowerCase() === value || u.phone.replace(/\s/g, '') === value.replace(/\s/g, ''),
  );
};

export const findMemberByUserId = (userId: string): Member | undefined =>
  db.members.find((m) => m.userId === userId);

export const generateOtp = (identifier: string): string => {
  const code = String(Math.floor(100000 + Math.random() * 900000));
  db.otpStore.set(identifier, code);
  // eslint-disable-next-line no-console
  console.info(`[MSW] OTP for ${identifier}: ${code}`);
  return code;
};

import { Injectable, signal, computed } from '@angular/core';
import { User } from '../../shared/models/entities/user.model';
import { Tontine } from '../../shared/models/entities/tontine.model';
import { Member } from '../../shared/models/entities/member.model';
import { Session } from '../../shared/models/entities/session.model';
import { Contribution } from '../../shared/models/entities/contribution.model';
import { Loan, LoanGuarantor } from '../../shared/models/entities/loan.model';
import { Sanction } from '../../shared/models/entities/sanction.model';
import { Distribution } from '../../shared/models/entities/distribution.model';
import { CashBox } from '../../shared/models/entities/cash-box.model';
import { Transaction } from '../../shared/models/entities/transaction.model';
import { TontineDocument } from '../../shared/models/entities/document.model';
import { Vote, VoteOption } from '../../shared/models/entities/vote.model';
import { Notification } from '../../shared/models/entities/notification.model';
import { UserRole } from '../enums/user-role.enum';
import { MemberStatus } from '../enums/member-status.enum';
import { TontineStatus } from '../enums/tontine-status.enum';
import { SessionStatus } from '../enums/session-status.enum';
import { LoanStatus } from '../enums/loan-status.enum';
import { ContributionStatus } from '../enums/contribution-status.enum';
import { SanctionType } from '../enums/sanction-type.enum';
import { PaymentMethod } from '../enums/payment-method.enum';

// ── Extended interfaces for mock tracking ──

export interface PendingValidation {
  id: string;
  type: 'loan_disbursement' | 'transfer' | 'expense' | 'agenda' | 'minutes' | 'adhesion';
  title: string;
  description: string;
  amount?: number;
  submittedBy: string;
  submittedAt: string;
  priority: 'critical' | 'normal' | 'low';
  auditorApproval?: 'approved' | 'reserved' | 'pending';
  auditorComment?: string;
  status: 'pending' | 'approved' | 'rejected' | 'blocked';
  presidentComment?: string;
  relatedId?: string;
}

export interface PresidentDecision {
  id: string;
  date: string;
  action: 'approved' | 'rejected' | 'blocked' | 'cancelled';
  target: string;
  comment?: string;
}

export interface DashboardAlert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  message: string;
  actionLabel?: string;
  actionRoute?: string;
  dismissed: boolean;
}

export interface AgendaItem {
  id: string;
  order: number;
  title: string;
  status: 'completed' | 'in-progress' | 'pending';
}

// ── Secretary-specific interfaces ──

export interface SecretaryOdjItem {
  id: string;
  order: number;
  title: string;
  isStandard: boolean;
  isEnabled: boolean;
  details?: string;
}

export interface SecretaryOdjSuggestion {
  id: string;
  title: string;
  reason: string;
  added: boolean;
}

export interface MemberConfirmation {
  memberId: string;
  memberName: string;
  memberRole: string;
  status: 'confirmed' | 'declined' | 'no_response';
  respondedAt?: string;
  declineReason?: string;
}

export interface AttendanceRecord {
  memberId: string;
  memberName: string;
  status: 'present' | 'late' | 'absent_excused' | 'absent_unexcused' | 'left_early';
  confirmedPresence: boolean;
  arrivalTime?: string;
  lateMinutes?: number;
  absenceReason?: string;
  hasJustification: boolean;
}

export interface PvSection {
  id: string;
  order: number;
  title: string;
  content: string;
  isAuto: boolean;
}

export interface PvAttachment {
  id: string;
  name: string;
  isAuto: boolean;
  attached: boolean;
}

export interface ResignationRequest {
  id: string;
  memberId: string;
  member: Member;
  requestDate: string;
  reason: string;
  effectDesired: 'immediate' | 'end_of_cycle';
  arrearsAmount: number;
  unpaidSanctions: number;
  activeLoans: number;
  totalDue: number;
  status: 'pending' | 'regularization_required' | 'transmitted' | 'accepted' | 'rejected';
  secretaryObservations?: string;
  conditions?: string[];
}

export interface SecretaryAnnouncement {
  id: string;
  type: 'info' | 'reminder' | 'document' | 'alert' | 'celebration';
  title: string;
  message: string;
  recipients: 'all' | 'bureau' | 'custom';
  channels: string[];
  sentAt?: string;
  status: 'draft' | 'sent';
}

export interface GeneratedReport {
  id: string;
  type: string;
  title: string;
  period: string;
  format: string;
  generatedAt: string;
  status: 'generating' | 'ready' | 'error';
  options?: { charts: boolean; stats: boolean; nominal: boolean };
}

// ── Censor-specific interfaces ──

export interface AutoDetectedSanction {
  id: string;
  memberId: string;
  memberName: string;
  type: 'late' | 'absence';
  arrivalTime?: string;
  lateMinutes?: number;
  signaled: boolean;
  justificationPending: boolean;
  amount: number;
  selected: boolean;
}

export interface AttendanceModificationRequest {
  id: string;
  sessionId: string;
  sessionLabel: string;
  memberId: string;
  memberName: string;
  currentStatus: 'present' | 'late' | 'absent_excused' | 'absent_unexcused';
  requestedStatus: 'present' | 'late' | 'absent_excused' | 'absent_unexcused';
  requestedBy: string;
  requestedAt: string;
  reason: string;
  impactSanction?: string;
  status: 'pending' | 'approved' | 'refused' | 'info_requested';
  censorComment?: string;
}

export interface AbsenceJustification {
  id: string;
  memberId: string;
  memberName: string;
  sessionId: string;
  sessionLabel: string;
  absenceDate: string;
  declared: boolean;
  declaredAt?: string;
  documentType: string;
  documentUrl: string;
  documentSize: number;
  submittedAt: string;
  sanctionAmount: number;
  sanctionPaid: boolean;
  censorDecision?: 'validated' | 'rejected' | 'complement_requested';
  censorComment?: string;
  presidentDecision?: 'validated' | 'rejected';
  status: 'pending_censor' | 'pending_president' | 'validated' | 'rejected' | 'complement_requested';
  checks: { readable: boolean; dated: boolean; coversDate: boolean; authentic: boolean; officialStamp: boolean };
}

export interface CensorCommunication {
  id: string;
  type: 'warning' | 'reminder' | 'order' | 'info';
  recipientType: 'individual' | 'group' | 'all';
  recipients: { memberId: string; memberName: string }[];
  subject: string;
  message: string;
  channels: string[];
  sentAt: string;
}

export interface CensorReport {
  id: string;
  period: string;
  sessionLabel: string;
  sanctionsApplied: number;
  totalAmount: number;
  byType: { type: string; count: number; amount: number }[];
  unpaidCount: number;
  unpaidAmount: number;
  membersAtRisk: { name: string; sanctionCount: number; unpaidAmount: number }[];
  observations: string;
  generatedAt: string;
  status: 'draft' | 'finalized';
}

@Injectable({ providedIn: 'root' })
export class MockDataService {

  // ═══════════════════════════════════════════
  // USERS
  // ═══════════════════════════════════════════

  private makeUser(id: string, first: string, last: string, phone: string, extra: Partial<User> = {}): User {
    return {
      id, firstName: first, lastName: last, phoneNumber: phone,
      email: `${first.toLowerCase()}.${last.toLowerCase()}@email.cm`,
      kycStatus: 'verified', isActive: true,
      createdAt: '2024-06-15T10:00:00Z', updatedAt: '2026-03-01T08:00:00Z',
      ...extra,
    };
  }

  readonly presidentUser = this.makeUser('u-001', 'Alain', 'NKOMO', '677100100', { gender: 'male', profession: 'Ingénieur Informatique', address: 'Douala, Bonanjo' });
  readonly vicePresidentUser = this.makeUser('u-002', 'Sylvie', 'MBARGA', '677200200', { gender: 'female', profession: 'Comptable' });
  readonly secretaryUser = this.makeUser('u-003', 'Marie', 'NGUEMO', '677300300', { gender: 'female', profession: 'Juriste', address: 'Douala, Akwa' });
  readonly treasurerUser = this.makeUser('u-004', 'Patrice', 'ONDOUA', '677400400', { gender: 'male', profession: 'Banquier' });
  readonly censorUser = this.makeUser('u-005', 'Berthe', 'EYENGA', '677500500', { gender: 'female', profession: 'Enseignante' });
  readonly auditorUser = this.makeUser('u-006', 'Samuel', 'TABI', '677600600', { gender: 'male', profession: 'Expert-Comptable' });

  readonly memberUsers: User[] = [
    this.makeUser('u-007', 'Rodrigue', 'FOUDA', '677700700', { gender: 'male', profession: 'Commerçant' }),
    this.makeUser('u-008', 'Estelle', 'MENGUE', '677800800', { gender: 'female', profession: 'Médecin' }),
    this.makeUser('u-009', 'Thierry', 'ESSAMA', '677900900', { gender: 'male', profession: 'Architecte' }),
    this.makeUser('u-010', 'Nadège', 'BILE', '677101010', { gender: 'female', profession: 'Pharmacienne' }),
    this.makeUser('u-011', 'Hervé', 'NOAH', '677111111', { gender: 'male', profession: 'Entrepreneur' }),
    this.makeUser('u-012', 'Françoise', 'EKOTTO', '677121212', { gender: 'female', profession: 'Ingénieure Génie Civil' }),
    this.makeUser('u-013', 'Landry', 'MVOUMA', '677131313', { gender: 'male', profession: 'Avocat' }),
    this.makeUser('u-014', 'Aline', 'BELL', '677141414', { gender: 'female', profession: 'Infirmière' }),
    this.makeUser('u-015', 'Didier', 'NGOUMOU', '677151515', { gender: 'male', profession: 'Mécanicien' }),
    this.makeUser('u-016', 'Brigitte', 'TCHAMBA', '677161616', { gender: 'female', profession: 'Restauratrice' }),
    this.makeUser('u-017', 'Gaston', 'MBIANDA', '677171717', { gender: 'male', profession: 'Chauffeur' }),
    this.makeUser('u-018', 'Pauline', 'EBOGO', '677181818', { gender: 'female', profession: 'Couturière' }),
  ];

  readonly allUsers: User[] = [
    this.presidentUser, this.vicePresidentUser, this.secretaryUser,
    this.treasurerUser, this.censorUser, this.auditorUser,
    ...this.memberUsers,
  ];

  // ═══════════════════════════════════════════
  // TONTINE
  // ═══════════════════════════════════════════

  readonly tontine: Tontine = {
    id: 'tontine-001',
    name: 'La Solidaire de Douala',
    description: 'Tontine d\'entraide et d\'épargne pour les professionnels de Douala',
    status: TontineStatus.ACTIVE,
    contributionAmount: 25000,
    currency: 'XAF',
    frequency: 'monthly',
    cycleDurationSessions: 12,
    lateToleranceMinutes: 15,
    absencePenaltyAmount: 2000,
    latePenaltyAmount: 1000,
    loanInterestRate: 5,
    potDeductionRate: 3,
    minMembers: 12,
    maxMembers: 50,
    createdBy: 'u-001',
    createdAt: '2024-06-15T10:00:00Z',
    updatedAt: '2026-03-01T08:00:00Z',
  };

  // ═══════════════════════════════════════════
  // MEMBERS
  // ═══════════════════════════════════════════

  private makeMember(id: string, userId: string, user: User, role: UserRole, tour?: number, status = MemberStatus.ACTIVE): Member {
    return {
      id, userId, user, tontineId: 'tontine-001', role, status,
      joinedAt: '2024-06-15T10:00:00Z', tourNumber: tour,
      canRequestLoan: status === MemberStatus.ACTIVE,
      createdAt: '2024-06-15T10:00:00Z', updatedAt: '2026-03-01T08:00:00Z',
    };
  }

  readonly _members = signal<Member[]>([
    this.makeMember('m-001', 'u-001', this.presidentUser, UserRole.PRESIDENT, 1),
    this.makeMember('m-002', 'u-002', this.vicePresidentUser, UserRole.VICE_PRESIDENT, 2),
    this.makeMember('m-003', 'u-003', this.secretaryUser, UserRole.SECRETARY, 3),
    this.makeMember('m-004', 'u-004', this.treasurerUser, UserRole.TREASURER, 4),
    this.makeMember('m-005', 'u-005', this.censorUser, UserRole.CENSOR, 5),
    this.makeMember('m-006', 'u-006', this.auditorUser, UserRole.AUDITOR, 6),
    this.makeMember('m-007', 'u-007', this.memberUsers[0], UserRole.MEMBER, 7),
    this.makeMember('m-008', 'u-008', this.memberUsers[1], UserRole.MEMBER, 8),
    this.makeMember('m-009', 'u-009', this.memberUsers[2], UserRole.MEMBER, 9),
    this.makeMember('m-010', 'u-010', this.memberUsers[3], UserRole.MEMBER, 10),
    this.makeMember('m-011', 'u-011', this.memberUsers[4], UserRole.MEMBER, 11),
    this.makeMember('m-012', 'u-012', this.memberUsers[5], UserRole.MEMBER, 12),
    this.makeMember('m-013', 'u-013', this.memberUsers[6], UserRole.MEMBER),
    this.makeMember('m-014', 'u-014', this.memberUsers[7], UserRole.MEMBER),
    this.makeMember('m-015', 'u-015', this.memberUsers[8], UserRole.MEMBER),
    this.makeMember('m-016', 'u-016', this.memberUsers[9], UserRole.MEMBER),
    this.makeMember('m-017', 'u-017', this.memberUsers[10], UserRole.MEMBER, undefined, MemberStatus.SUSPENDED),
    this.makeMember('m-018', 'u-018', this.memberUsers[11], UserRole.MEMBER),
  ]);

  readonly members = this._members.asReadonly();
  readonly activeMembers = computed(() => this._members().filter(m => m.status === MemberStatus.ACTIVE));

  // Adhesion requests (pending members)
  readonly _adhesionRequests = signal<Member[]>([
    {
      id: 'adh-001', userId: 'u-adh-1',
      user: this.makeUser('u-adh-1', 'Victor', 'TCHOUMI', '677191919', { gender: 'male', profession: 'Électricien' }),
      tontineId: 'tontine-001', role: UserRole.MEMBER, status: MemberStatus.PENDING,
      joinedAt: '2026-03-10T10:00:00Z', canRequestLoan: false,
      sponsorId: 'm-007', sponsor: this._members()[6],
      createdAt: '2026-03-10T10:00:00Z', updatedAt: '2026-03-10T10:00:00Z',
    },
    {
      id: 'adh-002', userId: 'u-adh-2',
      user: this.makeUser('u-adh-2', 'Mireille', 'BIYICK', '677202020', { gender: 'female', profession: 'Informaticienne' }),
      tontineId: 'tontine-001', role: UserRole.MEMBER, status: MemberStatus.PENDING,
      joinedAt: '2026-03-12T14:00:00Z', canRequestLoan: false,
      sponsorId: 'm-008', sponsor: this._members()[7],
      createdAt: '2026-03-12T14:00:00Z', updatedAt: '2026-03-12T14:00:00Z',
    },
  ]);

  readonly adhesionRequests = this._adhesionRequests.asReadonly();

  // ═══════════════════════════════════════════
  // CASH BOXES
  // ═══════════════════════════════════════════

  readonly _cashBoxes = signal<CashBox[]>([
    { id: 'cb-001', tontineId: 'tontine-001', type: 'main', name: 'Caisse Principale', balance: 2_450_000, createdAt: '2024-06-15T10:00:00Z' },
    { id: 'cb-002', tontineId: 'tontine-001', type: 'emergency', name: 'Caisse de Secours', balance: 380_000, createdAt: '2024-06-15T10:00:00Z' },
    { id: 'cb-003', tontineId: 'tontine-001', type: 'operational', name: 'Caisse de Fonctionnement', balance: 145_000, createdAt: '2024-06-15T10:00:00Z' },
  ]);

  readonly cashBoxes = this._cashBoxes.asReadonly();
  readonly totalBalance = computed(() => this._cashBoxes().reduce((sum, cb) => sum + cb.balance, 0));

  // ═══════════════════════════════════════════
  // SESSIONS
  // ═══════════════════════════════════════════

  readonly _sessions = signal<Session[]>([
    {
      id: 'sess-007', cycleId: 'cycle-002', tontineId: 'tontine-001', number: 7,
      sessionType: 'ordinary', scheduledDate: '2026-02-01', scheduledTime: '15:00',
      location: 'Hôtel Akwa Palace, Douala', beneficiaryId: 'm-007',
      beneficiary: this._members()[6], status: SessionStatus.CLOSED,
      agendaValidated: true, openedAt: '2026-02-01T15:05:00Z', closedAt: '2026-02-01T18:30:00Z',
      openedBy: 'u-001', quorumReached: true, createdAt: '2026-01-25T10:00:00Z',
    },
    {
      id: 'sess-008', cycleId: 'cycle-002', tontineId: 'tontine-001', number: 8,
      sessionType: 'ordinary', scheduledDate: '2026-03-01', scheduledTime: '15:00',
      location: 'Salle Polyvalente Bonapriso, Douala', beneficiaryId: 'm-008',
      beneficiary: this._members()[7], status: SessionStatus.CLOSED,
      agendaValidated: true, openedAt: '2026-03-01T15:10:00Z', closedAt: '2026-03-01T18:45:00Z',
      openedBy: 'u-001', quorumReached: true, createdAt: '2026-02-22T10:00:00Z',
    },
    {
      id: 'sess-009', cycleId: 'cycle-002', tontineId: 'tontine-001', number: 9,
      sessionType: 'ordinary', scheduledDate: '2026-03-22', scheduledTime: '15:00',
      location: 'Restaurant Le Foyer, Douala', beneficiaryId: 'm-009',
      beneficiary: this._members()[8], status: SessionStatus.SCHEDULED,
      agendaValidated: false, quorumReached: undefined,
      createdAt: '2026-03-10T10:00:00Z',
    },
    {
      id: 'sess-010', cycleId: 'cycle-002', tontineId: 'tontine-001', number: 10,
      sessionType: 'ordinary', scheduledDate: '2026-04-19', scheduledTime: '15:00',
      location: 'Hôtel Ibis Douala', beneficiaryId: 'm-010',
      beneficiary: this._members()[9], status: SessionStatus.SCHEDULED,
      agendaValidated: false, quorumReached: undefined,
      createdAt: '2026-03-10T10:00:00Z',
    },
  ]);

  readonly sessions = this._sessions.asReadonly();

  // ═══════════════════════════════════════════
  // LOANS
  // ═══════════════════════════════════════════

  readonly _loans = signal<Loan[]>([
    {
      id: 'loan-001', memberId: 'm-007', member: this._members()[6],
      tontineId: 'tontine-001', amount: 300_000, interestRate: 5, durationMonths: 4,
      totalToRepay: 315_000, monthlyPayment: 78_750, status: LoanStatus.PRESIDENT_REVIEW,
      requestReason: 'Financement achat de marchandises pour boutique',
      guarantors: [
        { id: 'lg-001', loanId: 'loan-001', guarantorId: 'm-008', guarantor: this._members()[7], status: 'accepted', respondedAt: '2026-03-06T10:00:00Z' },
        { id: 'lg-002', loanId: 'loan-001', guarantorId: 'm-011', guarantor: this._members()[10], status: 'accepted', respondedAt: '2026-03-07T08:00:00Z' },
      ],
      auditorApproved: true, auditorComment: 'Dossier conforme. Membre fiable avec bon historique.',
      auditorApprovedAt: '2026-03-08T14:00:00Z',
      remainingAmount: 315_000, createdAt: '2026-03-05T09:00:00Z',
    },
    {
      id: 'loan-002', memberId: 'm-012', member: this._members()[11],
      tontineId: 'tontine-001', amount: 150_000, interestRate: 5, durationMonths: 3,
      totalToRepay: 157_500, monthlyPayment: 52_500, status: LoanStatus.PRESIDENT_REVIEW,
      requestReason: 'Frais de scolarité des enfants',
      guarantors: [
        { id: 'lg-003', loanId: 'loan-002', guarantorId: 'm-013', guarantor: this._members()[12], status: 'accepted', respondedAt: '2026-03-10T10:00:00Z' },
        { id: 'lg-004', loanId: 'loan-002', guarantorId: 'm-009', guarantor: this._members()[8], status: 'accepted', respondedAt: '2026-03-10T16:00:00Z' },
      ],
      auditorApproved: true, auditorComment: 'Acceptable. Capacité de remboursement vérifiée.',
      auditorApprovedAt: '2026-03-11T10:00:00Z',
      remainingAmount: 157_500, createdAt: '2026-03-09T11:00:00Z',
    },
    {
      id: 'loan-003', memberId: 'm-010', member: this._members()[9],
      tontineId: 'tontine-001', amount: 200_000, interestRate: 5, durationMonths: 3,
      totalToRepay: 210_000, monthlyPayment: 70_000, status: LoanStatus.REPAYING,
      requestReason: 'Rénovation pharmacie',
      guarantors: [
        { id: 'lg-005', loanId: 'loan-003', guarantorId: 'm-005', guarantor: this._members()[4], status: 'accepted', respondedAt: '2026-01-20T10:00:00Z' },
        { id: 'lg-006', loanId: 'loan-003', guarantorId: 'm-014', guarantor: this._members()[13], status: 'accepted', respondedAt: '2026-01-21T08:00:00Z' },
      ],
      auditorApproved: true, presidentApproved: true,
      presidentComment: 'Approuvé', presidentApprovedAt: '2026-01-25T10:00:00Z',
      disbursementMethod: PaymentMethod.MTN_MOMO, disbursedAt: '2026-01-26T10:00:00Z',
      nextPaymentDate: '2026-03-26', remainingAmount: 70_000, createdAt: '2026-01-18T09:00:00Z',
    },
    {
      id: 'loan-004', memberId: 'm-015', member: this._members()[14],
      tontineId: 'tontine-001', amount: 100_000, interestRate: 5, durationMonths: 2,
      totalToRepay: 105_000, monthlyPayment: 52_500, status: LoanStatus.COMPLETED,
      requestReason: 'Achat d\'outillage',
      guarantors: [
        { id: 'lg-007', loanId: 'loan-004', guarantorId: 'm-016', guarantor: this._members()[15], status: 'accepted', respondedAt: '2025-12-05T10:00:00Z' },
      ],
      auditorApproved: true, presidentApproved: true,
      disbursedAt: '2025-12-10T10:00:00Z',
      remainingAmount: 0, createdAt: '2025-12-01T09:00:00Z',
    },
  ]);

  readonly loans = this._loans.asReadonly();
  readonly pendingLoans = computed(() => this._loans().filter(l => l.status === LoanStatus.PRESIDENT_REVIEW));
  readonly activeLoans = computed(() => this._loans().filter(l => [LoanStatus.DISBURSED, LoanStatus.REPAYING].includes(l.status)));

  // ═══════════════════════════════════════════
  // CONTRIBUTIONS
  // ═══════════════════════════════════════════

  readonly _contributions = signal<Contribution[]>([
    ...this._members().slice(0, 16).map((m, i) => ({
      id: `contrib-008-${i}`, memberId: m.id, member: m,
      sessionId: 'sess-008', tontineId: 'tontine-001', amount: 25_000,
      contributionType: 'regular' as const, paymentMethod: i % 3 === 0 ? PaymentMethod.CASH : i % 3 === 1 ? PaymentMethod.MTN_MOMO : PaymentMethod.ORANGE_MONEY,
      status: i < 14 ? ContributionStatus.CONFIRMED : ContributionStatus.PENDING,
      paidAt: i < 14 ? '2026-03-01T16:00:00Z' : undefined,
      confirmedBy: i < 14 ? 'u-004' : undefined,
      createdAt: '2026-03-01T15:30:00Z',
    })),
  ]);

  readonly contributions = this._contributions.asReadonly();

  // ═══════════════════════════════════════════
  // SANCTIONS
  // ═══════════════════════════════════════════

  readonly _sanctions = signal<Sanction[]>([
    {
      id: 'sanc-001', memberId: 'm-017', member: this._members()[16],
      tontineId: 'tontine-001', sessionId: 'sess-008', type: SanctionType.ABSENCE,
      reason: 'Absence non justifiée à la séance #8', amount: 2000,
      status: 'pending', appliedBy: 'u-005', appliedAt: '2026-03-01T18:00:00Z',
      contested: false,
    },
    {
      id: 'sanc-002', memberId: 'm-015', member: this._members()[14],
      tontineId: 'tontine-001', sessionId: 'sess-008', type: SanctionType.LATE,
      reason: 'Retard de 25 minutes à la séance #8', amount: 1000,
      status: 'paid', appliedBy: 'u-005', appliedAt: '2026-03-01T18:00:00Z',
      paymentMethod: PaymentMethod.CASH, paidAt: '2026-03-01T18:30:00Z',
      contested: false,
    },
    {
      id: 'sanc-003', memberId: 'm-013', member: this._members()[12],
      tontineId: 'tontine-001', type: SanctionType.CONTRIBUTION_LATE,
      reason: 'Cotisation en retard de 10 jours (Séance #7)', amount: 1500,
      status: 'contested', appliedBy: 'u-005', appliedAt: '2026-02-11T10:00:00Z',
      contested: true, contestReason: 'J\'étais en déplacement professionnel et j\'avais prévenu le trésorier.',
    },
    {
      id: 'sanc-004', memberId: 'm-016', member: this._members()[15],
      tontineId: 'tontine-001', sessionId: 'sess-007', type: SanctionType.ABSENCE,
      reason: 'Absence non justifiée à la séance #7', amount: 2000,
      status: 'paid', appliedBy: 'u-005', appliedAt: '2026-02-01T18:00:00Z',
      paymentMethod: PaymentMethod.MTN_MOMO, paidAt: '2026-02-03T10:00:00Z',
      contested: false,
    },
    {
      id: 'sanc-005', memberId: 'm-011', member: this._members()[10],
      tontineId: 'tontine-001', type: SanctionType.OTHER,
      reason: 'Comportement perturbateur en séance', amount: 5000,
      status: 'pending', appliedBy: 'u-005', appliedAt: '2026-03-05T10:00:00Z',
      contested: true, contestReason: 'Je conteste cette sanction, je n\'ai fait que poser des questions légitimes.',
    },
  ]);

  readonly sanctions = this._sanctions.asReadonly();
  readonly pendingSanctions = computed(() => this._sanctions().filter(s => s.status === 'pending'));
  readonly contestedSanctions = computed(() => this._sanctions().filter(s => s.contested && !s.contestResult));

  // ═══════════════════════════════════════════
  // DISTRIBUTIONS
  // ═══════════════════════════════════════════

  readonly _distributions = signal<Distribution[]>([
    {
      id: 'dist-008', sessionId: 'sess-008', beneficiaryId: 'm-008',
      beneficiary: this._members()[7], tontineId: 'tontine-001',
      grossAmount: 400_000, emergencyFundDeduction: 12_000,
      operationalFundDeduction: 8_000, otherDeductions: 0,
      netAmount: 380_000, paymentMethod: PaymentMethod.CASH,
      status: 'distributed', treasurerSignature: true,
      presidentSignature: true, beneficiarySignature: true,
      distributedAt: '2026-03-01T17:30:00Z', createdAt: '2026-03-01T17:00:00Z',
    },
    {
      id: 'dist-007', sessionId: 'sess-007', beneficiaryId: 'm-007',
      beneficiary: this._members()[6], tontineId: 'tontine-001',
      grossAmount: 400_000, emergencyFundDeduction: 12_000,
      operationalFundDeduction: 8_000, otherDeductions: 0,
      netAmount: 380_000, paymentMethod: PaymentMethod.MTN_MOMO,
      status: 'distributed', treasurerSignature: true,
      presidentSignature: true, beneficiarySignature: true,
      distributedAt: '2026-02-01T17:30:00Z', createdAt: '2026-02-01T17:00:00Z',
    },
  ]);

  readonly distributions = this._distributions.asReadonly();

  // ═══════════════════════════════════════════
  // DOCUMENTS
  // ═══════════════════════════════════════════

  readonly _documents = signal<TontineDocument[]>([
    {
      id: 'doc-001', tontineId: 'tontine-001', sessionId: 'sess-009',
      type: 'agenda', title: 'Ordre du jour - Séance #9',
      description: 'ODJ de la séance ordinaire du 22 Mars 2026',
      fileUrl: '/assets/mock/odj-9.pdf', fileName: 'ODJ_Seance_9.pdf',
      fileSize: 85_000, mimeType: 'application/pdf',
      uploadedBy: 'u-003', createdAt: '2026-03-10T14:00:00Z',
    },
    {
      id: 'doc-002', tontineId: 'tontine-001', sessionId: 'sess-008',
      type: 'minutes', title: 'Procès-verbal - Séance #8',
      description: 'PV de la séance ordinaire du 1er Mars 2026',
      fileUrl: '/assets/mock/pv-8.pdf', fileName: 'PV_Seance_8.pdf',
      fileSize: 150_000, mimeType: 'application/pdf',
      uploadedBy: 'u-003', createdAt: '2026-03-03T10:00:00Z',
    },
    {
      id: 'doc-003', tontineId: 'tontine-001',
      type: 'rules', title: 'Règlement intérieur',
      description: 'Règlement intérieur de la tontine La Solidaire de Douala',
      fileUrl: '/assets/mock/reglement.pdf', fileName: 'Reglement_Interieur.pdf',
      fileSize: 250_000, mimeType: 'application/pdf',
      uploadedBy: 'u-003', createdAt: '2024-06-15T10:00:00Z',
    },
    {
      id: 'doc-004', tontineId: 'tontine-001', sessionId: 'sess-008',
      type: 'report', title: 'Rapport financier - Séance #8',
      description: 'Rapport du trésorier pour la séance #8',
      fileUrl: '/assets/mock/rapport-8.pdf', fileName: 'Rapport_Financier_8.pdf',
      fileSize: 120_000, mimeType: 'application/pdf',
      uploadedBy: 'u-004', createdAt: '2026-03-02T10:00:00Z',
    },
    {
      id: 'doc-005', tontineId: 'tontine-001',
      type: 'report', title: 'Rapport d\'audit - Cycle #2',
      description: 'Contrôle périodique du Commissaire aux Comptes',
      fileUrl: '/assets/mock/audit-c2.pdf', fileName: 'Rapport_Audit_C2.pdf',
      fileSize: 200_000, mimeType: 'application/pdf',
      uploadedBy: 'u-006', createdAt: '2026-03-05T09:00:00Z',
    },
  ]);

  readonly documents = this._documents.asReadonly();

  // ═══════════════════════════════════════════
  // VOTES
  // ═══════════════════════════════════════════

  readonly _votes = signal<Vote[]>([
    {
      id: 'vote-001', tontineId: 'tontine-001', sessionId: 'sess-008',
      title: 'Augmentation de la cotisation mensuelle',
      description: 'Proposition de passer de 25 000 XAF à 30 000 XAF',
      type: 'two_thirds', status: 'closed',
      options: [
        { id: 'vo-001', voteId: 'vote-001', label: 'Pour', votes: 10 },
        { id: 'vo-002', voteId: 'vote-001', label: 'Contre', votes: 5 },
        { id: 'vo-003', voteId: 'vote-001', label: 'Abstention', votes: 1 },
      ],
      startedAt: '2026-03-01T17:00:00Z', closedAt: '2026-03-01T17:20:00Z',
      createdBy: 'u-001', createdAt: '2026-03-01T16:50:00Z',
    },
    {
      id: 'vote-002', tontineId: 'tontine-001',
      title: 'Cotisation extraordinaire - Décès père de Mme BELL',
      description: 'Collecte de 5 000 XAF par membre pour soutenir Mme Aline BELL',
      type: 'majority', status: 'open',
      options: [
        { id: 'vo-004', voteId: 'vote-002', label: 'Pour', votes: 12 },
        { id: 'vo-005', voteId: 'vote-002', label: 'Contre', votes: 1 },
        { id: 'vo-006', voteId: 'vote-002', label: 'Abstention', votes: 0 },
      ],
      startedAt: '2026-03-13T10:00:00Z',
      createdBy: 'u-001', createdAt: '2026-03-13T09:00:00Z',
    },
    {
      id: 'vote-003', tontineId: 'tontine-001',
      title: 'Suspension de M. MBIANDA pour absence répétée',
      description: '3 absences consécutives non justifiées. Le règlement prévoit une suspension.',
      type: 'majority', status: 'draft',
      options: [
        { id: 'vo-007', voteId: 'vote-003', label: 'Pour la suspension', votes: 0 },
        { id: 'vo-008', voteId: 'vote-003', label: 'Contre', votes: 0 },
        { id: 'vo-009', voteId: 'vote-003', label: 'Avertissement seulement', votes: 0 },
      ],
      createdBy: 'u-001', createdAt: '2026-03-12T14:00:00Z',
    },
  ]);

  readonly votes = this._votes.asReadonly();

  // ═══════════════════════════════════════════
  // TRANSACTIONS
  // ═══════════════════════════════════════════

  readonly _transactions = signal<Transaction[]>([
    { id: 'tx-001', tontineId: 'tontine-001', cashBoxId: 'cb-001', type: 'credit', category: 'Cotisations', amount: 400_000, description: 'Cotisations séance #8 (16 membres)', reference: 'COT-008', performedBy: 'u-004', createdAt: '2026-03-01T17:00:00Z' },
    { id: 'tx-002', tontineId: 'tontine-001', cashBoxId: 'cb-001', type: 'debit', category: 'Distribution', amount: 380_000, description: 'Distribution cagnotte à Estelle MENGUE', reference: 'DIST-008', performedBy: 'u-004', createdAt: '2026-03-01T17:30:00Z' },
    { id: 'tx-003', tontineId: 'tontine-001', cashBoxId: 'cb-002', type: 'credit', category: 'Déduction', amount: 12_000, description: 'Déduction caisse de secours séance #8', reference: 'DED-008-SEC', performedBy: 'u-004', createdAt: '2026-03-01T17:30:00Z' },
    { id: 'tx-004', tontineId: 'tontine-001', cashBoxId: 'cb-003', type: 'credit', category: 'Déduction', amount: 8_000, description: 'Déduction caisse fonctionnement séance #8', reference: 'DED-008-FONC', performedBy: 'u-004', createdAt: '2026-03-01T17:30:00Z' },
    { id: 'tx-005', tontineId: 'tontine-001', cashBoxId: 'cb-001', type: 'debit', category: 'Prêt', amount: 200_000, description: 'Décaissement prêt Nadège BILE', reference: 'PRET-003', performedBy: 'u-004', createdAt: '2026-01-26T10:00:00Z' },
    { id: 'tx-006', tontineId: 'tontine-001', cashBoxId: 'cb-001', type: 'credit', category: 'Remboursement', amount: 70_000, description: 'Remboursement prêt Nadège BILE (1/3)', reference: 'REMB-003-1', performedBy: 'u-004', createdAt: '2026-02-26T10:00:00Z' },
    { id: 'tx-007', tontineId: 'tontine-001', cashBoxId: 'cb-001', type: 'credit', category: 'Remboursement', amount: 70_000, description: 'Remboursement prêt Nadège BILE (2/3)', reference: 'REMB-003-2', performedBy: 'u-004', createdAt: '2026-03-13T10:00:00Z' },
    { id: 'tx-008', tontineId: 'tontine-001', cashBoxId: 'cb-001', type: 'credit', category: 'Sanctions', amount: 3_000, description: 'Paiement sanctions séance #8', reference: 'SANC-008', performedBy: 'u-004', createdAt: '2026-03-01T18:30:00Z' },
  ]);

  readonly transactions = this._transactions.asReadonly();

  // ═══════════════════════════════════════════
  // PENDING VALIDATIONS
  // ═══════════════════════════════════════════

  readonly _pendingValidations = signal<PendingValidation[]>([
    {
      id: 'pv-001', type: 'loan_disbursement', priority: 'critical',
      title: 'Décaissement prêt - Rodrigue FOUDA', amount: 300_000,
      description: 'Prêt de 300 000 XAF sur 4 mois pour achat de marchandises',
      submittedBy: 'Patrice ONDOUA (Trésorier)', submittedAt: '2026-03-08T14:00:00Z',
      auditorApproval: 'approved', auditorComment: 'Dossier conforme. Membre fiable.',
      status: 'pending', relatedId: 'loan-001',
    },
    {
      id: 'pv-002', type: 'loan_disbursement', priority: 'critical',
      title: 'Décaissement prêt - Françoise EKOTTO', amount: 150_000,
      description: 'Prêt de 150 000 XAF sur 3 mois pour frais de scolarité',
      submittedBy: 'Patrice ONDOUA (Trésorier)', submittedAt: '2026-03-11T10:00:00Z',
      auditorApproval: 'approved', auditorComment: 'Acceptable. Capacité vérifiée.',
      status: 'pending', relatedId: 'loan-002',
    },
    {
      id: 'pv-003', type: 'transfer', priority: 'critical',
      title: 'Transfert Principale → Secours', amount: 120_000,
      description: 'Renflouement de la caisse de secours (solde inférieur au seuil)',
      submittedBy: 'Patrice ONDOUA (Trésorier)', submittedAt: '2026-03-12T09:00:00Z',
      auditorApproval: 'approved', auditorComment: 'Transfert nécessaire. Caisse de secours sous le seuil minimum.',
      status: 'pending',
    },
    {
      id: 'pv-004', type: 'agenda', priority: 'normal',
      title: 'Ordre du jour - Séance #9', description: 'ODJ pour la séance ordinaire du 22 Mars 2026',
      submittedBy: 'Carine ATANGANA (Secrétaire)', submittedAt: '2026-03-10T14:00:00Z',
      status: 'pending', relatedId: 'doc-001',
    },
    {
      id: 'pv-005', type: 'minutes', priority: 'normal',
      title: 'Procès-verbal - Séance #8', description: 'PV de la séance du 1er Mars 2026, signé par la Secrétaire',
      submittedBy: 'Carine ATANGANA (Secrétaire)', submittedAt: '2026-03-03T10:00:00Z',
      status: 'pending', relatedId: 'doc-002',
    },
    {
      id: 'pv-006', type: 'adhesion', priority: 'normal',
      title: 'Adhésion - Victor TCHOUMI', description: 'Électricien, parrainé par Rodrigue FOUDA. Dossier validé par le Secrétaire.',
      submittedBy: 'Carine ATANGANA (Secrétaire)', submittedAt: '2026-03-10T10:00:00Z',
      status: 'pending', relatedId: 'adh-001',
    },
    {
      id: 'pv-007', type: 'adhesion', priority: 'normal',
      title: 'Adhésion - Mireille BIYICK', description: 'Informaticienne, parrainée par Estelle MENGUE. Dossier validé par le Secrétaire.',
      submittedBy: 'Carine ATANGANA (Secrétaire)', submittedAt: '2026-03-12T14:00:00Z',
      status: 'pending', relatedId: 'adh-002',
    },
    {
      id: 'pv-008', type: 'expense', priority: 'normal',
      title: 'Dépense - Location salle séance #9', amount: 75_000,
      description: 'Location du Restaurant Le Foyer pour la séance du 22 Mars',
      submittedBy: 'Patrice ONDOUA (Trésorier)', submittedAt: '2026-03-11T16:00:00Z',
      auditorApproval: 'approved', auditorComment: 'Conforme au budget prévisionnel.',
      status: 'pending',
    },
  ]);

  readonly pendingValidations = this._pendingValidations.asReadonly();
  readonly criticalValidations = computed(() => this._pendingValidations().filter(v => v.priority === 'critical' && v.status === 'pending'));
  readonly normalValidations = computed(() => this._pendingValidations().filter(v => v.priority !== 'critical' && v.status === 'pending'));

  // ═══════════════════════════════════════════
  // PRESIDENT DECISIONS HISTORY
  // ═══════════════════════════════════════════

  readonly _decisions = signal<PresidentDecision[]>([
    { id: 'd-001', date: '2026-03-01', action: 'approved', target: 'PV Séance #7', comment: 'Approuvé' },
    { id: 'd-002', date: '2026-02-28', action: 'approved', target: 'Décaissement prêt Nadège BILE (200 000 XAF)', comment: 'Dossier complet' },
    { id: 'd-003', date: '2026-02-25', action: 'rejected', target: 'Dépense 80 000 XAF (décoration salle)', comment: 'Justificatifs manquants' },
    { id: 'd-004', date: '2026-02-20', action: 'approved', target: 'Adhésion Pauline EBOGO' },
    { id: 'd-005', date: '2026-02-15', action: 'cancelled', target: 'Sanction Hervé NOAH (absence)', comment: 'Justificatif médical fourni' },
  ]);

  readonly decisions = this._decisions.asReadonly();

  // ═══════════════════════════════════════════
  // DASHBOARD ALERTS
  // ═══════════════════════════════════════════

  readonly _alerts = signal<DashboardAlert[]>([
    { id: 'alert-001', type: 'critical', message: '2 décaissements de prêts en attente de votre validation', actionLabel: 'Traiter', actionRoute: '/loans', dismissed: false },
    { id: 'alert-002', type: 'critical', message: 'Transfert entre caisses à valider (120 000 XAF)', actionLabel: 'Voir', actionRoute: '/treasury', dismissed: false },
    { id: 'alert-003', type: 'warning', message: 'Solde caisse de secours bas (380 000 XAF < seuil 500 000 XAF)', dismissed: false },
    { id: 'alert-004', type: 'warning', message: '2 contestations de sanctions en attente de résolution', actionLabel: 'Traiter', actionRoute: '/sanctions/contestations', dismissed: false },
    { id: 'alert-005', type: 'info', message: 'Séance #9 programmée pour le 22 Mars 2026 - ODJ à valider', actionLabel: 'Valider', actionRoute: '/sessions/sess-009', dismissed: false },
  ]);

  readonly alerts = this._alerts.asReadonly();
  readonly activeAlerts = computed(() => this._alerts().filter(a => !a.dismissed));

  // ═══════════════════════════════════════════
  // NOTIFICATIONS
  // ═══════════════════════════════════════════

  readonly _notifications = signal<Notification[]>([
    { id: 'notif-001', userId: 'u-001', tontineId: 'tontine-001', type: 'loan_request', title: 'Demande de prêt', body: 'Rodrigue FOUDA a demandé un prêt de 300 000 XAF', isRead: false, createdAt: '2026-03-08T14:00:00Z' },
    { id: 'notif-002', userId: 'u-001', tontineId: 'tontine-001', type: 'loan_request', title: 'Demande de prêt', body: 'Françoise EKOTTO a demandé un prêt de 150 000 XAF', isRead: false, createdAt: '2026-03-11T10:00:00Z' },
    { id: 'notif-003', userId: 'u-001', tontineId: 'tontine-001', type: 'document', title: 'Document à valider', body: 'L\'ordre du jour de la séance #9 est prêt', isRead: false, createdAt: '2026-03-10T14:00:00Z' },
    { id: 'notif-004', userId: 'u-001', tontineId: 'tontine-001', type: 'document', title: 'PV à signer', body: 'Le PV de la séance #8 est prêt pour signature', isRead: false, createdAt: '2026-03-03T10:00:00Z' },
    { id: 'notif-005', userId: 'u-001', tontineId: 'tontine-001', type: 'sanction', title: 'Contestation', body: 'Landry MVOUMA conteste sa sanction de retard de cotisation', isRead: true, createdAt: '2026-02-12T10:00:00Z' },
    { id: 'notif-006', userId: 'u-001', tontineId: 'tontine-001', type: 'sanction', title: 'Contestation', body: 'Hervé NOAH conteste sa sanction pour comportement', isRead: false, createdAt: '2026-03-06T10:00:00Z' },
    { id: 'notif-007', userId: 'u-001', tontineId: 'tontine-001', type: 'adhesion', title: 'Nouvelle adhésion', body: 'Victor TCHOUMI souhaite rejoindre la tontine', isRead: true, createdAt: '2026-03-10T10:00:00Z' },
    { id: 'notif-008', userId: 'u-001', tontineId: 'tontine-001', type: 'adhesion', title: 'Nouvelle adhésion', body: 'Mireille BIYICK souhaite rejoindre la tontine', isRead: false, createdAt: '2026-03-12T14:00:00Z' },
    { id: 'notif-009', userId: 'u-001', tontineId: 'tontine-001', type: 'treasury', title: 'Alerte trésorerie', body: 'Le solde de la caisse de secours est inférieur au seuil', isRead: false, createdAt: '2026-03-12T09:00:00Z' },
    { id: 'notif-010', userId: 'u-001', tontineId: 'tontine-001', type: 'audit', title: 'Rapport du Commissaire', body: 'Samuel TABI a soumis son rapport de contrôle périodique', isRead: true, createdAt: '2026-03-05T09:00:00Z' },
  ]);

  readonly notifications = this._notifications.asReadonly();
  readonly unreadNotifications = computed(() => this._notifications().filter(n => !n.isRead));

  // ═══════════════════════════════════════════
  // SESSION AGENDA ITEMS (for live session)
  // ═══════════════════════════════════════════

  readonly _agendaItems = signal<AgendaItem[]>([
    { id: 'ag-01', order: 1, title: 'Ouverture de la séance', status: 'pending' },
    { id: 'ag-02', order: 2, title: 'Appel des membres', status: 'pending' },
    { id: 'ag-03', order: 3, title: 'Lecture et adoption du PV #8', status: 'pending' },
    { id: 'ag-04', order: 4, title: 'Rapport du Trésorier', status: 'pending' },
    { id: 'ag-05', order: 5, title: 'Rapport du Censeur', status: 'pending' },
    { id: 'ag-06', order: 6, title: 'Rapport du Commissaire aux Comptes', status: 'pending' },
    { id: 'ag-07', order: 7, title: 'Collecte des cotisations', status: 'pending' },
    { id: 'ag-08', order: 8, title: 'Distribution de la cagnotte à Thierry ESSAMA', status: 'pending' },
    { id: 'ag-09', order: 9, title: 'Présentation candidats adhésion (2)', status: 'pending' },
    { id: 'ag-10', order: 10, title: 'Vote: Cotisation extraordinaire décès père Mme BELL', status: 'pending' },
    { id: 'ag-11', order: 11, title: 'Questions diverses', status: 'pending' },
    { id: 'ag-12', order: 12, title: 'Clôture de la séance', status: 'pending' },
  ]);

  readonly agendaItems = this._agendaItems.asReadonly();

  // ═══════════════════════════════════════════
  // ACTIONS (INTERACTIVE STATE CHANGES)
  // ═══════════════════════════════════════════

  approveValidation(id: string, comment = 'Approuvé'): void {
    this._pendingValidations.update(list =>
      list.map(v => v.id === id ? { ...v, status: 'approved' as const, presidentComment: comment } : v),
    );
    const v = this._pendingValidations().find(x => x.id === id);
    if (v) {
      this.addDecision('approved', v.title, comment);
      // Side effects based on type
      if (v.type === 'loan_disbursement' && v.relatedId) {
        this._loans.update(list =>
          list.map(l => l.id === v.relatedId ? { ...l, status: LoanStatus.APPROVED, presidentApproved: true, presidentComment: comment, presidentApprovedAt: new Date().toISOString() } : l),
        );
      }
      if (v.type === 'adhesion' && v.relatedId) {
        this._adhesionRequests.update(list =>
          list.map(a => a.id === v.relatedId ? { ...a, status: MemberStatus.ACTIVE } : a),
        );
      }
      if (v.type === 'transfer' && v.amount) {
        this._cashBoxes.update(boxes => boxes.map(cb => {
          if (cb.type === 'main') return { ...cb, balance: cb.balance - v.amount! };
          if (cb.type === 'emergency') return { ...cb, balance: cb.balance + v.amount! };
          return cb;
        }));
      }
      if (v.type === 'agenda' && v.relatedId) {
        this._sessions.update(list =>
          list.map(s => s.id === 'sess-009' ? { ...s, agendaValidated: true } : s),
        );
      }
    }
  }

  rejectValidation(id: string, comment: string): void {
    this._pendingValidations.update(list =>
      list.map(v => v.id === id ? { ...v, status: 'rejected' as const, presidentComment: comment } : v),
    );
    const v = this._pendingValidations().find(x => x.id === id);
    if (v) {
      this.addDecision('rejected', v.title, comment);
      if (v.type === 'loan_disbursement' && v.relatedId) {
        this._loans.update(list =>
          list.map(l => l.id === v.relatedId ? { ...l, status: LoanStatus.REQUESTED, presidentApproved: false, presidentComment: comment } : l),
        );
      }
    }
  }

  blockValidation(id: string, comment: string): void {
    this._pendingValidations.update(list =>
      list.map(v => v.id === id ? { ...v, status: 'blocked' as const, presidentComment: comment } : v),
    );
    const v = this._pendingValidations().find(x => x.id === id);
    if (v) this.addDecision('blocked', v.title, comment);
  }

  cancelSanction(id: string, reason: string): void {
    this._sanctions.update(list =>
      list.map(s => s.id === id ? { ...s, status: 'cancelled' as const, cancelledBy: 'u-001', cancelledAt: new Date().toISOString(), cancelReason: reason } : s),
    );
    const s = this._sanctions().find(x => x.id === id);
    if (s) this.addDecision('cancelled', `Sanction ${s.member.user.firstName} ${s.member.user.lastName}`, reason);
  }

  resolveContestation(id: string, accept: boolean, comment: string): void {
    this._sanctions.update(list =>
      list.map(s => s.id === id ? {
        ...s,
        contestResult: accept ? 'accepted' as const : 'rejected' as const,
        status: accept ? 'cancelled' as const : s.status,
        cancelledBy: accept ? 'u-001' : undefined,
        cancelledAt: accept ? new Date().toISOString() : undefined,
        cancelReason: accept ? comment : undefined,
      } : s),
    );
    this.addDecision(accept ? 'approved' : 'rejected', `Contestation sanction #${id}`, comment);
  }

  openSession(sessionId: string): void {
    this._sessions.update(list =>
      list.map(s => s.id === sessionId ? { ...s, status: SessionStatus.OPENED, openedAt: new Date().toISOString(), openedBy: 'u-001', quorumReached: true } : s),
    );
    this._agendaItems.update(items =>
      items.map((item, i) => i === 0 ? { ...item, status: 'completed' as const } : i === 1 ? { ...item, status: 'in-progress' as const } : item),
    );
  }

  createSession(data: { sessionType: 'ordinary' | 'extraordinary'; scheduledDate: string; scheduledTime: string; location: string; beneficiaryId?: string }): Session {
    const members = this._members();
    const sessions = this._sessions();
    const nextNumber = sessions.length > 0 ? Math.max(...sessions.map(s => s.number)) + 1 : 1;
    const beneficiary = data.beneficiaryId ? members.find(m => m.id === data.beneficiaryId) : undefined;
    const newSession: Session = {
      id: `sess-${Date.now()}`, cycleId: 'cycle-002', tontineId: 'tontine-001', number: nextNumber,
      sessionType: data.sessionType, scheduledDate: data.scheduledDate, scheduledTime: data.scheduledTime,
      location: data.location, beneficiaryId: data.beneficiaryId, beneficiary,
      status: SessionStatus.SCHEDULED, agendaValidated: false, quorumReached: undefined,
      createdAt: new Date().toISOString(),
    };
    this._sessions.update(list => [...list, newSession]);
    return newSession;
  }

  batchCreateSessions(data: { startDate: string; time: string; location: string; frequency: 'weekly' | 'biweekly' | 'monthly'; count: number; beneficiaryIds: string[] }): Session[] {
    const members = this._members();
    const sessions = this._sessions();
    let nextNumber = sessions.length > 0 ? Math.max(...sessions.map(s => s.number)) + 1 : 1;
    const created: Session[] = [];
    let currentDate = new Date(data.startDate);

    for (let i = 0; i < data.count; i++) {
      const beneficiaryId = data.beneficiaryIds[i] ?? undefined;
      const beneficiary = beneficiaryId ? members.find(m => m.id === beneficiaryId) : undefined;
      const newSession: Session = {
        id: `sess-batch-${Date.now()}-${i}`, cycleId: 'cycle-002', tontineId: 'tontine-001', number: nextNumber + i,
        sessionType: 'ordinary', scheduledDate: currentDate.toISOString().split('T')[0], scheduledTime: data.time,
        location: data.location, beneficiaryId, beneficiary,
        status: SessionStatus.SCHEDULED, agendaValidated: false, quorumReached: undefined,
        createdAt: new Date().toISOString(),
      };
      created.push(newSession);

      // Advance date
      if (data.frequency === 'weekly') currentDate.setDate(currentDate.getDate() + 7);
      else if (data.frequency === 'biweekly') currentDate.setDate(currentDate.getDate() + 14);
      else currentDate.setMonth(currentDate.getMonth() + 1);
    }
    this._sessions.update(list => [...list, ...created]);
    return created;
  }

  closeSession(sessionId: string): void {
    this._sessions.update(list =>
      list.map(s => s.id === sessionId ? { ...s, status: SessionStatus.CLOSED, closedAt: new Date().toISOString() } : s),
    );
    this._agendaItems.update(items => items.map(item => ({ ...item, status: 'completed' as const })));
  }

  advanceAgenda(): void {
    const items = this._agendaItems();
    const currentIdx = items.findIndex(i => i.status === 'in-progress');
    if (currentIdx === -1) {
      // Start the first pending item
      const firstPending = items.findIndex(i => i.status === 'pending');
      if (firstPending >= 0) {
        this._agendaItems.update(list =>
          list.map((item, i) => i === firstPending ? { ...item, status: 'in-progress' as const } : item),
        );
      }
    } else {
      this._agendaItems.update(list =>
        list.map((item, i) => {
          if (i === currentIdx) return { ...item, status: 'completed' as const };
          if (i === currentIdx + 1) return { ...item, status: 'in-progress' as const };
          return item;
        }),
      );
    }
  }

  launchVote(title: string, description: string, type: 'majority' | 'unanimous' | 'two_thirds', options: string[]): void {
    const newVote: Vote = {
      id: `vote-${Date.now()}`, tontineId: 'tontine-001',
      title, description, type, status: 'open',
      options: options.map((label, i) => ({ id: `vo-new-${i}`, voteId: '', label, votes: 0 })),
      startedAt: new Date().toISOString(), createdBy: 'u-001', createdAt: new Date().toISOString(),
    };
    this._votes.update(list => [newVote, ...list]);
  }

  recordVoteResults(voteId: string, results: Record<string, number>): void {
    this._votes.update(list =>
      list.map(v => {
        if (v.id !== voteId) return v;
        return {
          ...v,
          status: 'closed' as const,
          closedAt: new Date().toISOString(),
          options: v.options.map(o => ({ ...o, votes: results[o.label] ?? o.votes })),
        };
      }),
    );
  }

  dismissAlert(id: string): void {
    this._alerts.update(list => list.map(a => a.id === id ? { ...a, dismissed: true } : a));
  }

  markNotificationRead(id: string): void {
    this._notifications.update(list =>
      list.map(n => n.id === id ? { ...n, isRead: true, readAt: new Date().toISOString() } : n),
    );
  }

  markAllNotificationsRead(): void {
    this._notifications.update(list =>
      list.map(n => ({ ...n, isRead: true, readAt: n.readAt ?? new Date().toISOString() })),
    );
  }

  suspendMember(memberId: string, reason: string): void {
    this._members.update(list =>
      list.map(m => m.id === memberId ? { ...m, status: MemberStatus.SUSPENDED, canRequestLoan: false } : m),
    );
    this.addDecision('approved', `Suspension membre ${memberId}`, reason);
  }

  activateMember(memberId: string): void {
    this._members.update(list =>
      list.map(m => m.id === memberId ? { ...m, status: MemberStatus.ACTIVE, canRequestLoan: true } : m),
    );
  }

  private addDecision(action: PresidentDecision['action'], target: string, comment?: string): void {
    const decision: PresidentDecision = {
      id: `d-${Date.now()}`, date: new Date().toISOString().split('T')[0],
      action, target, comment,
    };
    this._decisions.update(list => [decision, ...list]);
  }

  // ═══════════════════════════════════════════
  // COMPUTED STATS
  // ═══════════════════════════════════════════

  readonly stats = computed(() => ({
    activeMembers: this.activeMembers().length,
    totalBalance: this.totalBalance(),
    activeLoans: this.activeLoans().length,
    activeLoanAmount: this.activeLoans().reduce((s, l) => s + l.remainingAmount, 0),
    pendingSanctions: this.pendingSanctions().length,
    pendingSanctionAmount: this.pendingSanctions().reduce((s, san) => s + san.amount, 0),
    nextSession: this._sessions().find(s => s.status === SessionStatus.SCHEDULED),
    contributionRate: 92,
    cycleProgress: 67,
    cycleCompleted: 8,
    cycleTotalSessions: 12,
    pendingValidations: this._pendingValidations().filter(v => v.status === 'pending').length,
    unreadNotifications: this.unreadNotifications().length,
  }));

  // ═══════════════════════════════════════════
  // SECRETARY-SPECIFIC DATA
  // ═══════════════════════════════════════════

  // ── ODJ (Ordre du Jour) ──

  readonly _odjItems = signal<SecretaryOdjItem[]>([
    { id: 'odj-01', order: 1, title: 'Ouverture de la séance', isStandard: true, isEnabled: true },
    { id: 'odj-02', order: 2, title: 'Appel des membres', isStandard: true, isEnabled: true },
    { id: 'odj-03', order: 3, title: 'Lecture et adoption du PV #8', isStandard: true, isEnabled: true },
    { id: 'odj-04', order: 4, title: 'Rapport du Trésorier', isStandard: true, isEnabled: true },
    { id: 'odj-05', order: 5, title: 'Rapport du Censeur', isStandard: true, isEnabled: true },
    { id: 'odj-06', order: 6, title: 'Rapport du Commissaire aux Comptes', isStandard: true, isEnabled: true },
    { id: 'odj-07', order: 7, title: 'Collecte des cotisations', isStandard: true, isEnabled: true },
    { id: 'odj-08', order: 8, title: 'Distribution de la cagnotte à Thierry ESSAMA', isStandard: true, isEnabled: true },
    { id: 'odj-09', order: 9, title: 'Présentation candidats adhésion (2)', isStandard: false, isEnabled: true, details: 'Victor TCHOUMI, Mireille BIYICK' },
    { id: 'odj-10', order: 10, title: 'Vote adhésion Victor TCHOUMI', isStandard: false, isEnabled: true },
    { id: 'odj-11', order: 11, title: 'Vote adhésion Mireille BIYICK', isStandard: false, isEnabled: true },
    { id: 'odj-12', order: 12, title: 'Questions diverses', isStandard: true, isEnabled: true },
    { id: 'odj-13', order: 13, title: 'Clôture de la séance', isStandard: true, isEnabled: true },
  ]);

  readonly _odjSuggestions = signal<SecretaryOdjSuggestion[]>([
    { id: 'sug-01', title: 'Demande de démission de Gaston MBIANDA', reason: '1 demande de démission en attente (reçue le 08/03)', added: false },
    { id: 'sug-02', title: 'Information: Cotisation extraordinaire en cours', reason: 'Collecte en cours pour décès père de Mme BELL – état de la collecte', added: false },
  ]);

  readonly _odjStatus = signal<'draft' | 'submitted' | 'revision_requested' | 'validated'>('draft');
  readonly _odjPresidentComment = signal<string>('');

  readonly odjItems = this._odjItems.asReadonly();
  readonly odjSuggestions = this._odjSuggestions.asReadonly();
  readonly odjStatus = this._odjStatus.asReadonly();

  // ── Confirmations ──

  readonly _confirmations = signal<MemberConfirmation[]>([
    ...this._members().slice(0, 12).map((m, i) => ({
      memberId: m.id, memberName: `${m.user.firstName} ${m.user.lastName}`,
      memberRole: m.role, status: 'confirmed' as const,
      respondedAt: `2026-03-${15 + (i % 5)}T10:00:00Z`,
    })),
    { memberId: 'm-013', memberName: 'Landry MVOUMA', memberRole: 'member', status: 'declined' as const, respondedAt: '2026-03-18T11:00:00Z', declineReason: 'Déplacement professionnel' },
    { memberId: 'm-014', memberName: 'Aline BELL', memberRole: 'member', status: 'declined' as const, respondedAt: '2026-03-17T09:00:00Z', declineReason: 'Raison médicale' },
    { memberId: 'm-017', memberName: 'Gaston MBIANDA', memberRole: 'member', status: 'declined' as const, respondedAt: '2026-03-19T14:00:00Z', declineReason: 'Travail' },
    { memberId: 'm-015', memberName: 'Didier NGOUMOU', memberRole: 'member', status: 'no_response' as const },
    { memberId: 'm-016', memberName: 'Brigitte TCHAMBA', memberRole: 'member', status: 'no_response' as const },
    { memberId: 'm-018', memberName: 'Pauline EBOGO', memberRole: 'member', status: 'no_response' as const },
  ]);

  readonly confirmations = this._confirmations.asReadonly();
  readonly confirmedCount = computed(() => this._confirmations().filter(c => c.status === 'confirmed').length);
  readonly declinedCount = computed(() => this._confirmations().filter(c => c.status === 'declined').length);
  readonly noResponseCount = computed(() => this._confirmations().filter(c => c.status === 'no_response').length);
  readonly quorumRequired = computed(() => Math.ceil(this._members().filter(m => m.status === MemberStatus.ACTIVE).length * 0.67));

  // ── Attendance ──

  readonly _attendance = signal<AttendanceRecord[]>([
    ...this._members().slice(0, 10).map((m, i) => ({
      memberId: m.id, memberName: `${m.user.firstName} ${m.user.lastName}`,
      status: 'present' as const, confirmedPresence: true,
      arrivalTime: `14:${50 + i}`, lateMinutes: 0, absenceReason: '', hasJustification: false,
    })),
    { memberId: 'm-011', memberName: 'Hervé NOAH', status: 'present' as const, confirmedPresence: true, arrivalTime: '15:02', lateMinutes: 2, absenceReason: '', hasJustification: false },
    { memberId: 'm-012', memberName: 'Françoise EKOTTO', status: 'late' as const, confirmedPresence: false, arrivalTime: '15:20', lateMinutes: 20, absenceReason: '', hasJustification: false },
    { memberId: 'm-013', memberName: 'Landry MVOUMA', status: 'absent_excused' as const, confirmedPresence: false, absenceReason: 'Déplacement professionnel', hasJustification: true },
    { memberId: 'm-014', memberName: 'Aline BELL', status: 'absent_excused' as const, confirmedPresence: false, absenceReason: 'Raison médicale', hasJustification: true },
    { memberId: 'm-015', memberName: 'Didier NGOUMOU', status: 'absent_unexcused' as const, confirmedPresence: false, absenceReason: '', hasJustification: false },
    { memberId: 'm-016', memberName: 'Brigitte TCHAMBA', status: 'present' as const, confirmedPresence: true, arrivalTime: '15:00', lateMinutes: 0, absenceReason: '', hasJustification: false },
    { memberId: 'm-017', memberName: 'Gaston MBIANDA', status: 'absent_unexcused' as const, confirmedPresence: false, absenceReason: '', hasJustification: false },
    { memberId: 'm-018', memberName: 'Pauline EBOGO', status: 'late' as const, confirmedPresence: false, arrivalTime: '15:18', lateMinutes: 18, absenceReason: '', hasJustification: false },
  ]);

  readonly attendance = this._attendance.asReadonly();
  readonly _attendanceFinalized = signal(false);
  readonly attendanceFinalized = this._attendanceFinalized.asReadonly();
  readonly attendanceSummary = computed(() => {
    const records = this._attendance();
    return {
      present: records.filter(r => r.status === 'present').length,
      late: records.filter(r => r.status === 'late').length,
      absentExcused: records.filter(r => r.status === 'absent_excused').length,
      absentUnexcused: records.filter(r => r.status === 'absent_unexcused').length,
      total: records.length,
      quorumReached: records.filter(r => r.status === 'present' || r.status === 'late').length >= this.quorumRequired(),
    };
  });

  // ── PV (Procès-verbal) ──

  readonly _pvSections = signal<PvSection[]>([
    { id: 'pv-01', order: 1, title: 'Ouverture de la séance', content: 'Le Président Alain NKOMO a ouvert la séance à 15h05 en souhaitant la bienvenue à tous les membres présents.', isAuto: false },
    { id: 'pv-02', order: 2, title: 'Appel des membres', content: '14 membres présents sur 18. Le quorum étant atteint, la séance peut valablement délibérer.', isAuto: true },
    { id: 'pv-03', order: 3, title: 'Lecture et adoption du PV #8', content: 'Le PV de la séance #8 a été lu et adopté à l\'unanimité sans modification.', isAuto: false },
    { id: 'pv-04', order: 4, title: 'Rapport du Trésorier', content: 'Le Trésorier Patrice ONDOUA a présenté le bilan financier :\n• Cotisations collectées : 400 000 XAF\n• Solde caisses : 2 975 000 XAF\nLe rapport a été approuvé sans observation.', isAuto: false },
    { id: 'pv-05', order: 5, title: 'Rapport du Censeur', content: 'Le Censeur Berthe EYENGA a présenté son rapport :\n• Sanctions appliquées ce mois : 3\n• Contestations traitées : 1\nRAS.', isAuto: false },
    { id: 'pv-06', order: 6, title: 'Rapport du Commissaire aux Comptes', content: 'Le Commissaire Samuel TABI a présenté son rapport. Les comptes sont certifiés conformes. Recommandation de renforcer le suivi des remboursements de prêts.', isAuto: false },
    { id: 'pv-07', order: 7, title: 'Collecte des cotisations', content: 'Cotisations collectées : 350 000 XAF\nMembres ayant cotisé : 14/14 présents\nArriérés collectés : 50 000 XAF', isAuto: true },
    { id: 'pv-08', order: 8, title: 'Distribution de la cagnotte', content: 'Bénéficiaire : Thierry ESSAMA (Tour #9)\nMontant brut : 400 000 XAF\nPrélèvements : 20 000 XAF (5%)\nMontant net distribué : 380 000 XAF\nMode : Espèces\nSigné par : Trésorier ✅, Président ✅, Bénéficiaire ✅', isAuto: true },
    { id: 'pv-09', order: 9, title: 'Questions diverses', content: '', isAuto: false },
    { id: 'pv-10', order: 10, title: 'Clôture de la séance', content: 'L\'ordre du jour étant épuisé, le Président a clôturé la séance à 17h45.', isAuto: false },
  ]);

  readonly _pvAttachments = signal<PvAttachment[]>([
    { id: 'att-01', name: 'Feuille de présence', isAuto: true, attached: true },
    { id: 'att-02', name: 'Bilan financier du Trésorier', isAuto: true, attached: true },
    { id: 'att-03', name: 'Rapport du Censeur', isAuto: false, attached: true },
    { id: 'att-04', name: 'Rapport du Commissaire aux Comptes', isAuto: false, attached: true },
    { id: 'att-05', name: 'Reçu de distribution cagnotte', isAuto: true, attached: true },
  ]);

  readonly _pvStatus = signal<'pending' | 'draft' | 'submitted' | 'secretary_signed' | 'president_signed' | 'archived'>('draft');
  readonly pvSections = this._pvSections.asReadonly();
  readonly pvAttachments = this._pvAttachments.asReadonly();
  readonly pvStatus = this._pvStatus.asReadonly();

  // ── Resignations ──

  readonly _resignations = signal<ResignationRequest[]>([
    {
      id: 'resign-001', memberId: 'm-017',
      member: this._members()[16],
      requestDate: '2026-03-08', reason: 'Pour des raisons personnelles et professionnelles, je ne suis plus en mesure de continuer dans cette tontine. Je demande à être libéré de mes engagements.',
      effectDesired: 'immediate', arrearsAmount: 75_000, unpaidSanctions: 2_000, activeLoans: 0, totalDue: 77_000,
      status: 'pending',
    },
  ]);

  readonly resignations = this._resignations.asReadonly();

  // ── Convocations ──

  readonly _convocationsSent = signal(false);
  readonly _convocationSummary = signal({
    pushSent: 0, smsSent: 0, emailSent: 0, emailFailed: 0, candidatesSent: 0,
    reminders: [
      { type: 'J-2 (membres sans réponse)', scheduledDate: '2026-03-20', sent: false },
      { type: 'J-1 (tous les membres)', scheduledDate: '2026-03-21', sent: false },
      { type: 'Jour J (matin)', scheduledDate: '2026-03-22', sent: false },
    ],
  });
  readonly convocationsSent = this._convocationsSent.asReadonly();
  readonly convocationSummary = this._convocationSummary.asReadonly();

  // ── Announcements ──

  readonly _announcements = signal<SecretaryAnnouncement[]>([
    { id: 'ann-001', type: 'reminder', title: 'Rappel: Séance #9 ce samedi 22 mars', message: 'Chers membres, je vous rappelle que notre prochaine séance (#9) se tiendra ce samedi à 15h00 au Restaurant Le Foyer. Bénéficiaire : Thierry ESSAMA. Préparez vos cotisations. À samedi !', recipients: 'all', channels: ['push', 'sms'], sentAt: '2026-03-19T09:00:00Z', status: 'sent' },
    { id: 'ann-002', type: 'document', title: 'PV Séance #8 disponible', message: 'Le procès-verbal de la séance #8 a été validé et archivé. Vous pouvez le consulter dans l\'espace Documents.', recipients: 'all', channels: ['push'], sentAt: '2026-03-05T10:00:00Z', status: 'sent' },
  ]);
  readonly announcements = this._announcements.asReadonly();

  // ── Secretary Alerts ──

  readonly _secretaryAlerts = signal<DashboardAlert[]>([
    { id: 'sa-001', type: 'critical', message: 'PV Séance #8 à finaliser (J+13)', actionLabel: 'Rédiger', actionRoute: '/sessions/pv-editor/sess-008', dismissed: false },
    { id: 'sa-002', type: 'warning', message: '2 demandes d\'adhésion en attente de traitement', actionLabel: 'Traiter', actionRoute: '/members/adhesion-requests', dismissed: false },
    { id: 'sa-003', type: 'warning', message: '1 demande de démission reçue', actionLabel: 'Traiter', actionRoute: '/members/resignations', dismissed: false },
    { id: 'sa-004', type: 'info', message: 'ODJ Séance #9 à préparer (séance le 22/03)', actionLabel: 'Préparer', actionRoute: '/sessions/odj/sess-009', dismissed: false },
    { id: 'sa-005', type: 'info', message: 'Convocations séance #9 à envoyer', actionLabel: 'Envoyer', actionRoute: '/sessions/convocations/sess-009', dismissed: false },
  ]);

  readonly secretaryAlerts = this._secretaryAlerts.asReadonly();
  readonly activeSecretaryAlerts = computed(() => this._secretaryAlerts().filter(a => !a.dismissed));

  // ── Secretary Notifications ──

  readonly _secretaryNotifications = signal<Notification[]>([
    { id: 'sn-001', userId: 'u-003', tontineId: 'tontine-001', type: 'session', title: 'Rappel préparation ODJ', body: 'N\'oubliez pas de préparer l\'ODJ de la séance #9 (J-5)', isRead: false, createdAt: '2026-03-14T08:00:00Z' },
    { id: 'sn-002', userId: 'u-003', tontineId: 'tontine-001', type: 'adhesion', title: 'Nouvelle demande d\'adhésion', body: 'Victor TCHOUMI souhaite rejoindre la tontine', isRead: false, createdAt: '2026-03-10T10:00:00Z' },
    { id: 'sn-003', userId: 'u-003', tontineId: 'tontine-001', type: 'adhesion', title: 'Nouvelle demande d\'adhésion', body: 'Mireille BIYICK souhaite rejoindre la tontine', isRead: false, createdAt: '2026-03-12T14:00:00Z' },
    { id: 'sn-004', userId: 'u-003', tontineId: 'tontine-001', type: 'resignation', title: 'Demande de démission', body: 'Gaston MBIANDA a demandé sa démission', isRead: false, createdAt: '2026-03-08T16:00:00Z' },
    { id: 'sn-005', userId: 'u-003', tontineId: 'tontine-001', type: 'document', title: 'ODJ #8 validé par le Président', body: 'Le Président a validé l\'ordre du jour de la séance #8', isRead: true, createdAt: '2026-02-25T14:00:00Z' },
    { id: 'sn-006', userId: 'u-003', tontineId: 'tontine-001', type: 'document', title: 'PV #7 signé et archivé', body: 'Le PV de la séance #7 a été signé par le Président et archivé', isRead: true, createdAt: '2026-02-05T10:00:00Z' },
    { id: 'sn-007', userId: 'u-003', tontineId: 'tontine-001', type: 'absence', title: 'Signalement d\'absence', body: 'Gaston MBIANDA a signalé son absence pour la séance #9', isRead: true, createdAt: '2026-03-19T14:00:00Z' },
  ]);
  readonly secretaryNotifications = this._secretaryNotifications.asReadonly();
  readonly unreadSecretaryNotifications = computed(() => this._secretaryNotifications().filter(n => !n.isRead));

  // ── Secretary Activity History ──

  readonly _secretaryActivity = signal<{ date: string; text: string }[]>([
    { date: '2026-03-13', text: 'Convocations séance #8 envoyées (18 membres)' },
    { date: '2026-03-10', text: 'Demande adhésion Victor TCHOUMI reçue' },
    { date: '2026-03-08', text: 'Demande de démission Gaston MBIANDA reçue' },
    { date: '2026-03-05', text: 'PV #7 signé et archivé' },
    { date: '2026-03-03', text: 'PV #8 soumis pour signature' },
    { date: '2026-02-28', text: 'ODJ #8 validé par le Président' },
    { date: '2026-02-25', text: 'ODJ #8 soumis au Président' },
    { date: '2026-02-22', text: 'Pointage séance #8 finalisé' },
  ]);
  readonly secretaryActivity = this._secretaryActivity.asReadonly();

  // ── Secretary Calendar ──

  readonly secretaryCalendar = computed(() => [
    { date: 'Aujourd\'hui (14/03)', tasks: ['Finaliser PV #8', 'Préparer ODJ #9'] },
    { date: 'Cette semaine', tasks: ['17/03 - Envoyer convocations séance #9', '19/03 - Relancer confirmations'] },
    { date: 'Semaine prochaine', tasks: ['22/03 - Séance #9 (Pointage à effectuer)', '23/03 - Rédiger PV #9'] },
  ]);

  // ── Secretary Stats ──

  readonly secretaryStats = computed(() => ({
    activeMembers: this.activeMembers().length,
    sessionsInCycle: '8/12',
    pvPending: 1,
    attendanceRate: 85,
    adhesionsInProgress: this._adhesionRequests().length,
    resignationsInProgress: this._resignations().filter(r => r.status === 'pending' || r.status === 'regularization_required').length,
    documentsArchived: this._documents().length + 12,
    absencesReported: this._attendance().filter(a => a.status === 'absent_unexcused').length,
  }));

  // ═══════════════════════════════════════════
  // SECRETARY ACTIONS
  // ═══════════════════════════════════════════

  addOdjItem(title: string): void {
    const items = this._odjItems();
    const lastItems = items.filter(i => i.title === 'Questions diverses' || i.title === 'Clôture de la séance');
    const others = items.filter(i => i.title !== 'Questions diverses' && i.title !== 'Clôture de la séance');
    const newItem: SecretaryOdjItem = { id: `odj-${Date.now()}`, order: others.length + 1, title, isStandard: false, isEnabled: true };
    this._odjItems.set([...others, newItem, ...lastItems].map((item, i) => ({ ...item, order: i + 1 })));
  }

  removeOdjItem(id: string): void {
    this._odjItems.update(items => items.filter(i => i.id !== id).map((item, i) => ({ ...item, order: i + 1 })));
  }

  addOdjSuggestion(id: string): void {
    const sug = this._odjSuggestions().find(s => s.id === id);
    if (sug && !sug.added) {
      this.addOdjItem(sug.title);
      this._odjSuggestions.update(list => list.map(s => s.id === id ? { ...s, added: true } : s));
    }
  }

  submitOdj(): void {
    this._odjStatus.set('submitted');
    this._secretaryActivity.update(list => [{ date: new Date().toISOString().split('T')[0], text: 'ODJ #9 soumis au Président' }, ...list]);
  }

  validateOdj(): void {
    this._odjStatus.set('validated');
    this._sessions.update(list => list.map(s => s.id === 'sess-009' ? { ...s, agendaValidated: true } : s));
    this._secretaryAlerts.update(list => list.map(a => a.id === 'sa-004' ? { ...a, dismissed: true } : a));
  }

  requestOdjRevision(comment: string): void {
    this._odjStatus.set('revision_requested');
    this._odjPresidentComment.set(comment);
  }

  sendConvocations(): void {
    const memberCount = this.activeMembers().length;
    this._convocationsSent.set(true);
    this._convocationSummary.set({
      pushSent: memberCount, smsSent: memberCount, emailSent: memberCount - 1, emailFailed: 1, candidatesSent: this._adhesionRequests().length,
      reminders: [
        { type: 'J-2 (membres sans réponse)', scheduledDate: '2026-03-20', sent: false },
        { type: 'J-1 (tous les membres)', scheduledDate: '2026-03-21', sent: false },
        { type: 'Jour J (matin)', scheduledDate: '2026-03-22', sent: false },
      ],
    });
    this._secretaryAlerts.update(list => list.map(a => a.id === 'sa-005' ? { ...a, dismissed: true } : a));
    this._secretaryActivity.update(list => [{ date: new Date().toISOString().split('T')[0], text: `Convocations séance #9 envoyées (${memberCount} membres)` }, ...list]);
  }

  relanceConfirmation(memberId: string): void {
    this._confirmations.update(list => list.map(c => c.memberId === memberId && c.status === 'no_response' ? { ...c, status: 'confirmed' as const, respondedAt: new Date().toISOString() } : c));
  }

  relanceAllNoResponse(): void {
    this._confirmations.update(list => list.map(c => c.status === 'no_response' ? { ...c, status: 'confirmed' as const, respondedAt: new Date().toISOString() } : c));
  }

  updateAttendance(memberId: string, status: AttendanceRecord['status']): void {
    this._attendance.update(list => list.map(a => a.memberId === memberId ? { ...a, status } : a));
  }

  finalizeAttendance(): void {
    this._attendanceFinalized.set(true);
    this._secretaryActivity.update(list => [{ date: new Date().toISOString().split('T')[0], text: 'Pointage séance #9 finalisé' }, ...list]);
  }

  updatePvSection(id: string, content: string): void {
    this._pvSections.update(list => list.map(s => s.id === id ? { ...s, content } : s));
  }

  submitPv(): void {
    this._pvStatus.set('submitted');
    this._secretaryActivity.update(list => [{ date: new Date().toISOString().split('T')[0], text: 'PV #9 soumis pour signature' }, ...list]);
  }

  signPvAsSecretary(): void {
    this._pvStatus.set('secretary_signed');
  }

  signPvAsPresident(): void {
    this._pvStatus.set('archived');
    this._secretaryAlerts.update(list => list.map(a => a.id === 'sa-001' ? { ...a, dismissed: true } : a));
  }

  validateAdhesionDossier(id: string, decision: 'validate' | 'request_complement' | 'reject', observations: string): void {
    if (decision === 'validate') {
      this._adhesionRequests.update(list => list.map(a => a.id === id ? { ...a, status: MemberStatus.PENDING } : a));
      this._secretaryActivity.update(list => [{ date: new Date().toISOString().split('T')[0], text: `Dossier adhésion ${id} validé et inscrit à l'ODJ` }, ...list]);
    } else if (decision === 'reject') {
      this._adhesionRequests.update(list => list.filter(a => a.id !== id));
    }
  }

  processResignation(id: string, decision: 'transmit' | 'regularization' | 'agenda', observations: string): void {
    this._resignations.update(list => list.map(r => {
      if (r.id !== id) return r;
      if (decision === 'transmit') return { ...r, status: 'transmitted' as const, secretaryObservations: observations };
      if (decision === 'regularization') return { ...r, status: 'regularization_required' as const, secretaryObservations: observations };
      return { ...r, secretaryObservations: observations };
    }));
    this._secretaryActivity.update(list => [{ date: new Date().toISOString().split('T')[0], text: `Demande démission ${id} traitée (${decision})` }, ...list]);
  }

  sendAnnouncement(title: string, message: string, type: SecretaryAnnouncement['type'], recipients: string, channels: string[]): void {
    const ann: SecretaryAnnouncement = {
      id: `ann-${Date.now()}`, type, title, message, recipients: recipients as SecretaryAnnouncement['recipients'], channels, sentAt: new Date().toISOString(), status: 'sent',
    };
    this._announcements.update(list => [ann, ...list]);
    this._secretaryActivity.update(list => [{ date: new Date().toISOString().split('T')[0], text: `Annonce envoyée: ${title}` }, ...list]);
  }

  dismissSecretaryAlert(id: string): void {
    this._secretaryAlerts.update(list => list.map(a => a.id === id ? { ...a, dismissed: true } : a));
  }

  archiveDocument(title: string, type: string, description: string): void {
    const doc: TontineDocument = {
      id: `doc-${Date.now()}`, tontineId: 'tontine-001', type: type as TontineDocument['type'],
      title, description, fileUrl: '/assets/mock/doc.pdf', fileName: `${title.replace(/\s+/g, '_')}.pdf`,
      fileSize: 100_000, mimeType: 'application/pdf', uploadedBy: 'u-003', createdAt: new Date().toISOString(),
    };
    this._documents.update(list => [doc, ...list]);
    this._secretaryActivity.update(list => [{ date: new Date().toISOString().split('T')[0], text: `Document archivé: ${title}` }, ...list]);
  }

  // --- Report generation (Flow 12) ---
  readonly _generatedReports = signal<GeneratedReport[]>([
    { id: 'rpt-1', type: 'attendance', title: 'Rapport de présences - Cycle #1', period: 'Sept 2025 - Déc 2025', format: 'pdf', generatedAt: '2025-12-20', status: 'ready' },
    { id: 'rpt-2', type: 'members', title: 'Liste des membres actifs', period: 'Année 2025', format: 'excel', generatedAt: '2025-12-15', status: 'ready' },
  ]);

  readonly reportStats = computed(() => ({
    attendanceRate: 85,
    alwaysPresent: 12,
    withAbsences: 6,
    sessionsAnalyzed: 11,
    topPresent: [
      { name: 'Alain NKOMO', role: 'Président', rate: 100 },
      { name: 'Marie NGUEMO', role: 'Secrétaire', rate: 100 },
      { name: 'Paul BIYA', role: 'Trésorier', rate: 100 },
      { name: 'Claire ESSOMBA', role: 'Membre', rate: 100 },
      { name: 'Jean KAMGA', role: 'Membre', rate: 95 },
    ],
    frequentAbsences: [
      { name: 'Gaston MBIANDA', absences: 3, rate: 27 },
      { name: 'Marthe ONANA', absences: 2, rate: 18 },
    ],
  }));

  generateReport(type: string, period: string, format: string, options: { charts: boolean; stats: boolean; nominal: boolean }): GeneratedReport {
    const titles: Record<string, string> = {
      attendance: 'Rapport de présences',
      members: 'Liste des membres',
      sessions: 'Historique des séances',
      adhesions: 'Registre des adhésions/démissions',
      pv_summary: 'Récapitulatif des PV',
    };
    const report: GeneratedReport = {
      id: `rpt-${Date.now()}`, type, title: `${titles[type] || 'Rapport'} - ${period}`,
      period, format, generatedAt: new Date().toISOString().split('T')[0], status: 'ready',
      options,
    };
    this._generatedReports.update(list => [report, ...list]);
    this._secretaryActivity.update(list => [{ date: report.generatedAt, text: `Rapport généré: ${report.title}` }, ...list]);
    return report;
  }

  // ═══════════════════════════════════════════
  // CENSOR-SPECIFIC DATA
  // ═══════════════════════════════════════════

  readonly _autoDetectedSanctions = signal<AutoDetectedSanction[]>([
    { id: 'auto-001', memberId: 'm-012', memberName: 'Françoise EKOTTO', type: 'late', arrivalTime: '15:20', lateMinutes: 20, signaled: false, justificationPending: false, amount: 1000, selected: true },
    { id: 'auto-002', memberId: 'm-018', memberName: 'Pauline EBOGO', type: 'late', arrivalTime: '15:18', lateMinutes: 18, signaled: false, justificationPending: false, amount: 1000, selected: true },
    { id: 'auto-003', memberId: 'm-011', memberName: 'Hervé NOAH', type: 'late', arrivalTime: '15:02', lateMinutes: 2, signaled: false, justificationPending: false, amount: 1000, selected: false },
    { id: 'auto-004', memberId: 'm-015', memberName: 'Didier NGOUMOU', type: 'absence', signaled: false, justificationPending: false, amount: 2000, selected: true },
    { id: 'auto-005', memberId: 'm-017', memberName: 'Gaston MBIANDA', type: 'absence', signaled: false, justificationPending: false, amount: 2000, selected: true },
    { id: 'auto-006', memberId: 'm-013', memberName: 'Landry MVOUMA', type: 'absence', signaled: true, justificationPending: true, amount: 2000, selected: false },
    { id: 'auto-007', memberId: 'm-014', memberName: 'Aline BELL', type: 'absence', signaled: true, justificationPending: true, amount: 2000, selected: false },
  ]);
  readonly autoDetectedSanctions = this._autoDetectedSanctions.asReadonly();
  readonly selectedAutoSanctions = computed(() => this._autoDetectedSanctions().filter(s => s.selected));

  readonly _attendanceModifications = signal<AttendanceModificationRequest[]>([
    { id: 'amod-001', sessionId: 'sess-008', sessionLabel: '#8 - 01 Mars 2026', memberId: 'm-015', memberName: 'Didier NGOUMOU', currentStatus: 'absent_unexcused', requestedStatus: 'present', requestedBy: 'Marie NGUEMO (Secrétaire)', requestedAt: '2026-03-02T10:00:00Z', reason: 'Erreur de pointage. Le membre était présent mais a été enregistré absent lors de la clôture.', impactSanction: 'Sanction d\'absence (2 000 XAF) sera annulée', status: 'pending' },
    { id: 'amod-002', sessionId: 'sess-008', sessionLabel: '#8 - 01 Mars 2026', memberId: 'm-018', memberName: 'Pauline EBOGO', currentStatus: 'late', requestedStatus: 'present', requestedBy: 'Marie NGUEMO (Secrétaire)', requestedAt: '2026-03-02T11:30:00Z', reason: 'Le retard enregistré est dû à une erreur d\'horloge. Le membre était à l\'heure.', impactSanction: 'Sanction de retard (1 000 XAF) sera annulée', status: 'pending' },
    { id: 'amod-003', sessionId: 'sess-007', sessionLabel: '#7 - 01 Fév 2026', memberId: 'm-016', memberName: 'Brigitte TCHAMBA', currentStatus: 'absent_unexcused', requestedStatus: 'absent_excused', requestedBy: 'Marie NGUEMO (Secrétaire)', requestedAt: '2026-02-02T09:00:00Z', reason: 'Le membre a présenté un justificatif médical après la séance.', impactSanction: 'Sanction d\'absence (2 000 XAF) sera annulée', status: 'pending' },
  ]);
  readonly attendanceModifications = this._attendanceModifications.asReadonly();
  readonly pendingAttendanceModifications = computed(() => this._attendanceModifications().filter(r => r.status === 'pending'));

  readonly _absenceJustifications = signal<AbsenceJustification[]>([
    { id: 'just-001', memberId: 'm-013', memberName: 'Landry MVOUMA', sessionId: 'sess-008', sessionLabel: '#8 - 01 Mars 2026', absenceDate: '2026-03-01', declared: true, declaredAt: '2026-02-28T14:00:00Z', documentType: 'Ordre de mission', documentUrl: '/assets/mock/ordre-mission.pdf', documentSize: 180_000, submittedAt: '2026-03-02T10:00:00Z', sanctionAmount: 2000, sanctionPaid: false, status: 'pending_censor', checks: { readable: false, dated: false, coversDate: false, authentic: false, officialStamp: false } },
    { id: 'just-002', memberId: 'm-014', memberName: 'Aline BELL', sessionId: 'sess-008', sessionLabel: '#8 - 01 Mars 2026', absenceDate: '2026-03-01', declared: true, declaredAt: '2026-02-27T09:00:00Z', documentType: 'Certificat médical', documentUrl: '/assets/mock/certificat-medical.pdf', documentSize: 245_000, submittedAt: '2026-03-02T14:00:00Z', sanctionAmount: 2000, sanctionPaid: false, status: 'pending_censor', checks: { readable: false, dated: false, coversDate: false, authentic: false, officialStamp: false } },
    { id: 'just-003', memberId: 'm-016', memberName: 'Brigitte TCHAMBA', sessionId: 'sess-007', sessionLabel: '#7 - 01 Fév 2026', absenceDate: '2026-02-01', declared: false, documentType: 'Certificat médical', documentUrl: '/assets/mock/certificat-2.pdf', documentSize: 150_000, submittedAt: '2026-02-05T10:00:00Z', sanctionAmount: 2000, sanctionPaid: true, status: 'pending_censor', checks: { readable: false, dated: false, coversDate: false, authentic: false, officialStamp: false } },
    { id: 'just-004', memberId: 'm-017', memberName: 'Gaston MBIANDA', sessionId: 'sess-007', sessionLabel: '#7 - 01 Fév 2026', absenceDate: '2026-02-01', declared: false, documentType: 'Attestation employeur', documentUrl: '/assets/mock/attestation.pdf', documentSize: 120_000, submittedAt: '2026-02-10T16:00:00Z', sanctionAmount: 2000, sanctionPaid: false, status: 'pending_censor', checks: { readable: false, dated: false, coversDate: false, authentic: false, officialStamp: false } },
    { id: 'just-005', memberId: 'm-009', memberName: 'Thierry ESSAMA', sessionId: 'sess-007', sessionLabel: '#7 - 01 Fév 2026', absenceDate: '2026-02-01', declared: true, declaredAt: '2026-01-30T10:00:00Z', documentType: 'Convocation tribunal', documentUrl: '/assets/mock/convocation.pdf', documentSize: 95_000, submittedAt: '2026-02-03T10:00:00Z', sanctionAmount: 2000, sanctionPaid: false, censorDecision: 'validated', censorComment: 'Document conforme, convocation officielle du tribunal.', presidentDecision: 'validated', status: 'validated', checks: { readable: true, dated: true, coversDate: true, authentic: true, officialStamp: true } },
  ]);
  readonly absenceJustifications = this._absenceJustifications.asReadonly();
  readonly pendingJustifications = computed(() => this._absenceJustifications().filter(j => j.status === 'pending_censor'));

  readonly _censorCommunications = signal<CensorCommunication[]>([
    { id: 'cc-001', type: 'reminder', recipientType: 'individual', recipients: [{ memberId: 'm-017', memberName: 'Gaston MBIANDA' }], subject: 'Rappel: Sanction impayée', message: 'Cher Gaston MBIANDA, nous vous rappelons que vous avez une sanction impayée de 2 000 XAF pour absence à la séance #8. Merci de régulariser.', channels: ['sms', 'push'], sentAt: '2026-03-10T10:00:00Z' },
    { id: 'cc-002', type: 'warning', recipientType: 'individual', recipients: [{ memberId: 'm-011', memberName: 'Hervé NOAH' }], subject: 'Avertissement: Comportement en séance', message: 'Cher Hervé NOAH, suite à votre comportement perturbateur lors de la séance #8, nous vous adressons un avertissement formel.', channels: ['sms', 'push', 'email'], sentAt: '2026-03-06T14:00:00Z' },
    { id: 'cc-003', type: 'reminder', recipientType: 'group', recipients: [{ memberId: 'm-017', memberName: 'Gaston MBIANDA' }, { memberId: 'm-011', memberName: 'Hervé NOAH' }], subject: 'Rappel: Sanctions impayées', message: 'Rappel groupé pour sanctions impayées. Veuillez régulariser votre situation avant la prochaine séance.', channels: ['sms', 'push'], sentAt: '2026-03-08T09:00:00Z' },
  ]);
  readonly censorCommunications = this._censorCommunications.asReadonly();

  readonly _censorAlerts = signal<DashboardAlert[]>([
    { id: 'ca-001', type: 'critical', message: '3 demandes de modification de présence en attente', actionLabel: 'Traiter', actionRoute: '/sanctions/attendance-modifications', dismissed: false },
    { id: 'ca-002', type: 'critical', message: '4 justificatifs d\'absence à valider', actionLabel: 'Traiter', actionRoute: '/sanctions/justify-absence', dismissed: false },
    { id: 'ca-003', type: 'warning', message: '2 contestations de sanctions à traiter', actionLabel: 'Traiter', actionRoute: '/sanctions/contestations', dismissed: false },
    { id: 'ca-004', type: 'warning', message: '3 sanctions impayées > 30 jours', actionLabel: 'Voir', actionRoute: '/sanctions/unpaid', dismissed: false },
    { id: 'ca-005', type: 'info', message: 'Rapport de séance à préparer pour la séance #9', actionLabel: 'Générer', actionRoute: '/sanctions/report', dismissed: false },
  ]);
  readonly censorAlerts = this._censorAlerts.asReadonly();
  readonly activeCensorAlerts = computed(() => this._censorAlerts().filter(a => !a.dismissed));

  readonly _censorNotifications = signal<Notification[]>([
    { id: 'cn-001', userId: 'u-005', tontineId: 'tontine-001', type: 'attendance', title: 'Modification de présence', body: 'Le secrétaire demande une modification de présence pour Didier NGOUMOU (#8)', isRead: false, createdAt: '2026-03-02T10:00:00Z' },
    { id: 'cn-002', userId: 'u-005', tontineId: 'tontine-001', type: 'justification', title: 'Justificatif à valider', body: 'Landry MVOUMA a soumis un ordre de mission pour son absence à la séance #8', isRead: false, createdAt: '2026-03-02T10:00:00Z' },
    { id: 'cn-003', userId: 'u-005', tontineId: 'tontine-001', type: 'justification', title: 'Justificatif à valider', body: 'Aline BELL a soumis un certificat médical pour son absence à la séance #8', isRead: false, createdAt: '2026-03-02T14:00:00Z' },
    { id: 'cn-004', userId: 'u-005', tontineId: 'tontine-001', type: 'contestation', title: 'Contestation de sanction', body: 'Landry MVOUMA conteste sa sanction pour cotisation en retard', isRead: false, createdAt: '2026-02-12T10:00:00Z' },
    { id: 'cn-005', userId: 'u-005', tontineId: 'tontine-001', type: 'contestation', title: 'Contestation de sanction', body: 'Hervé NOAH conteste sa sanction pour comportement perturbateur', isRead: false, createdAt: '2026-03-06T10:00:00Z' },
    { id: 'cn-006', userId: 'u-005', tontineId: 'tontine-001', type: 'sanction_paid', title: 'Sanction payée', body: 'Didier NGOUMOU a payé sa sanction de retard (1 000 XAF)', isRead: true, createdAt: '2026-03-01T18:30:00Z' },
    { id: 'cn-007', userId: 'u-005', tontineId: 'tontine-001', type: 'cancellation', title: 'Sanction annulée par le Président', body: 'Le Président a annulé la sanction de Brigitte TCHAMBA (absence #7) - Justificatif médical accepté', isRead: true, createdAt: '2026-02-15T14:00:00Z' },
  ]);
  readonly censorNotifications = this._censorNotifications.asReadonly();
  readonly unreadCensorNotifications = computed(() => this._censorNotifications().filter(n => !n.isRead));

  readonly _censorActivity = signal<{ date: string; text: string }[]>([
    { date: '2026-03-05', text: 'Sanction appliquée: Hervé NOAH - Comportement perturbateur (5 000 XAF)' },
    { date: '2026-03-01', text: 'Sanctions automatiques confirmées: 2 retards, 1 absence (séance #8)' },
    { date: '2026-03-01', text: 'Sanction appliquée: Gaston MBIANDA - Absence séance #8 (2 000 XAF)' },
    { date: '2026-02-15', text: 'Justificatif validé: Thierry ESSAMA (convocation tribunal)' },
    { date: '2026-02-11', text: 'Sanction appliquée: Landry MVOUMA - Cotisation en retard (1 500 XAF)' },
    { date: '2026-02-03', text: 'Rappel de paiement envoyé à Brigitte TCHAMBA' },
    { date: '2026-02-01', text: 'Sanctions séance #7 appliquées (3 sanctions)' },
  ]);
  readonly censorActivity = this._censorActivity.asReadonly();

  readonly censorStats = computed(() => {
    const allSanctions = this._sanctions();
    const pending = allSanctions.filter(s => s.status === 'pending');
    const paid = allSanctions.filter(s => s.status === 'paid');
    const contested = allSanctions.filter(s => s.contested && !s.contestResult);
    return {
      sanctionsThisMonth: allSanctions.length,
      byType: {
        late: allSanctions.filter(s => s.type === SanctionType.LATE).length,
        absence: allSanctions.filter(s => s.type === SanctionType.ABSENCE).length,
        contributionLate: allSanctions.filter(s => s.type === SanctionType.CONTRIBUTION_LATE).length,
        other: allSanctions.filter(s => s.type === SanctionType.OTHER).length,
      },
      totalAmount: allSanctions.reduce((s, san) => s + san.amount, 0),
      collectedAmount: paid.reduce((s, san) => s + san.amount, 0),
      unpaidCount: pending.length,
      unpaidAmount: pending.reduce((s, san) => s + san.amount, 0),
      contestedCount: contested.length,
      pendingModifications: this.pendingAttendanceModifications().length,
      pendingJustifications: this.pendingJustifications().length,
      paymentRate: allSanctions.length > 0 ? Math.round((paid.length / allSanctions.length) * 100) : 0,
    };
  });

  readonly censorCalendar = computed(() => [
    { date: 'Aujourd\'hui (14/03)', tasks: ['Traiter 3 modifications de présence', 'Valider 4 justificatifs'] },
    { date: 'Cette semaine', tasks: ['Traiter 2 contestations', 'Envoyer rappels impayés'] },
    { date: 'Semaine prochaine', tasks: ['22/03 - Séance #9 (préparer rapport)', '22/03 - Confirmer sanctions auto'] },
  ]);

  readonly mostSanctionedMembers = computed(() => {
    const sanctionsByMember = new Map<string, { name: string; count: number; totalAmount: number }>();
    for (const s of this._sanctions()) {
      const key = s.memberId;
      const existing = sanctionsByMember.get(key);
      if (existing) {
        existing.count++;
        existing.totalAmount += s.amount;
      } else {
        sanctionsByMember.set(key, { name: `${s.member.user.firstName} ${s.member.user.lastName}`, count: 1, totalAmount: s.amount });
      }
    }
    return [...sanctionsByMember.values()].sort((a, b) => b.count - a.count).slice(0, 5);
  });

  // ═══════════════════════════════════════════
  // CENSOR ACTIONS
  // ═══════════════════════════════════════════

  toggleAutoSanction(id: string): void {
    this._autoDetectedSanctions.update(list => list.map(s => s.id === id ? { ...s, selected: !s.selected } : s));
  }

  selectAllAutoSanctions(type: 'late' | 'absence'): void {
    this._autoDetectedSanctions.update(list => list.map(s => s.type === type ? { ...s, selected: true } : s));
  }

  deselectAllAutoSanctions(type: 'late' | 'absence'): void {
    this._autoDetectedSanctions.update(list => list.map(s => s.type === type ? { ...s, selected: false } : s));
  }

  confirmAutoSanctions(): void {
    const selected = this.selectedAutoSanctions();
    for (const auto of selected) {
      const sanction: Sanction = {
        id: `sanc-auto-${Date.now()}-${auto.memberId}`,
        memberId: auto.memberId,
        member: this._members().find(m => m.id === auto.memberId)!,
        tontineId: 'tontine-001',
        sessionId: 'sess-009',
        type: auto.type === 'late' ? SanctionType.LATE : SanctionType.ABSENCE,
        reason: auto.type === 'late' ? `Retard de ${auto.lateMinutes} minutes à la séance #9` : 'Absence non justifiée à la séance #9',
        amount: auto.amount,
        status: 'pending',
        appliedBy: 'u-005',
        appliedAt: new Date().toISOString(),
        contested: false,
      };
      this._sanctions.update(list => [...list, sanction]);
    }
    this._autoDetectedSanctions.update(list => list.filter(s => !s.selected));
    this._censorActivity.update(list => [{ date: new Date().toISOString().split('T')[0], text: `Sanctions automatiques confirmées: ${selected.length} sanctions` }, ...list]);
  }

  applySanction(memberId: string, type: SanctionType, amount: number, reason: string, sessionId?: string): void {
    const member = this._members().find(m => m.id === memberId);
    if (!member) return;
    const sanction: Sanction = {
      id: `sanc-${Date.now()}`,
      memberId,
      member,
      tontineId: 'tontine-001',
      sessionId,
      type,
      reason,
      amount,
      status: 'pending',
      appliedBy: 'u-005',
      appliedAt: new Date().toISOString(),
      contested: false,
    };
    this._sanctions.update(list => [...list, sanction]);
    this._censorActivity.update(list => [{ date: new Date().toISOString().split('T')[0], text: `Sanction appliquée: ${member.user.firstName} ${member.user.lastName} - ${reason}` }, ...list]);
  }

  censorCancelSanction(id: string, reason: string): void {
    this._sanctions.update(list =>
      list.map(s => s.id === id ? { ...s, status: 'cancelled' as const, cancelledBy: 'u-005', cancelledAt: new Date().toISOString(), cancelReason: reason } : s),
    );
    this._censorActivity.update(list => [{ date: new Date().toISOString().split('T')[0], text: `Sanction annulée: ${id} - ${reason}` }, ...list]);
  }

  censorResolveContestation(id: string, decision: 'accept' | 'reject' | 'transfer', comment: string): void {
    this._sanctions.update(list =>
      list.map(s => {
        if (s.id !== id) return s;
        if (decision === 'accept') return { ...s, contestResult: 'accepted' as const, status: 'cancelled' as const, cancelledBy: 'u-005', cancelledAt: new Date().toISOString(), cancelReason: comment };
        if (decision === 'reject') return { ...s, contestResult: 'rejected' as const };
        return s; // transfer — status unchanged, handled by president
      }),
    );
    this._censorActivity.update(list => [{ date: new Date().toISOString().split('T')[0], text: `Contestation traitée: ${id} (${decision})` }, ...list]);
  }

  processAttendanceModification(id: string, decision: 'approved' | 'refused' | 'info_requested', comment: string): void {
    this._attendanceModifications.update(list =>
      list.map(r => r.id === id ? { ...r, status: decision, censorComment: comment } : r),
    );
    if (decision === 'approved') {
      const req = this._attendanceModifications().find(r => r.id === id);
      if (req) {
        this._attendance.update(list => list.map(a => a.memberId === req.memberId ? { ...a, status: req.requestedStatus } : a));
      }
    }
    this._censorActivity.update(list => [{ date: new Date().toISOString().split('T')[0], text: `Modification présence traitée: ${id} (${decision})` }, ...list]);
  }

  processJustification(id: string, decision: 'validated' | 'rejected' | 'complement_requested', comment: string, checks?: AbsenceJustification['checks']): void {
    this._absenceJustifications.update(list =>
      list.map(j => {
        if (j.id !== id) return j;
        const newStatus = decision === 'validated' ? 'pending_president' as const : decision === 'rejected' ? 'rejected' as const : 'complement_requested' as const;
        return { ...j, censorDecision: decision, censorComment: comment, status: newStatus, checks: checks ?? j.checks };
      }),
    );
    this._censorActivity.update(list => [{ date: new Date().toISOString().split('T')[0], text: `Justificatif traité: ${id} (${decision})` }, ...list]);
  }

  sendCensorCommunication(type: CensorCommunication['type'], recipientType: CensorCommunication['recipientType'], recipients: { memberId: string; memberName: string }[], subject: string, message: string, channels: string[]): void {
    const comm: CensorCommunication = { id: `cc-${Date.now()}`, type, recipientType, recipients, subject, message, channels, sentAt: new Date().toISOString() };
    this._censorCommunications.update(list => [comm, ...list]);
    this._censorActivity.update(list => [{ date: new Date().toISOString().split('T')[0], text: `Communication envoyée: ${subject} (${recipients.length} destinataire(s))` }, ...list]);
  }

  dismissCensorAlert(id: string): void {
    this._censorAlerts.update(list => list.map(a => a.id === id ? { ...a, dismissed: true } : a));
  }
}

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
  readonly secretaryUser = this.makeUser('u-003', 'Carine', 'ATANGANA', '677300300', { gender: 'female', profession: 'Juriste' });
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
}

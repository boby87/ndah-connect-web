import { UserRole } from '../app/core/enums/user-role.enum';
import { SessionStatus } from '../app/core/enums/session-status.enum';
import type { Conflict } from '../app/shared/models/entities/conflict.model';
import type { CycleClose } from '../app/shared/models/entities/cycle-close.model';
import type { Delegation } from '../app/shared/models/entities/delegation.model';
import type { EmergencyBlock } from '../app/shared/models/entities/emergency-block.model';
import type { ExtraordinaryContribution } from '../app/shared/models/entities/extraordinary-contribution.model';
import type { MembershipFile } from '../app/shared/models/entities/membership.model';
import type { ReportEntry } from '../app/shared/models/entities/report.model';
import type { SessionLive } from '../app/shared/models/entities/session-live.model';
import type { Vote } from '../app/shared/models/entities/vote.model';

export const seedSessionsLive: SessionLive[] = [
  {
    id: 'session-1',
    tontineId: 'tontine-1',
    cycleId: 'cycle-1',
    number: 5,
    scheduledAt: '2026-05-15T18:00:00.000Z',
    startedAt: '2026-05-15T18:10:00.000Z',
    endedAt: '2026-05-15T20:15:00.000Z',
    location: 'Domicile du Président',
    status: SessionStatus.COMPLETED,
    agenda: [
      { id: 'a1', order: 1, title: 'Ouverture', status: 'DONE' },
      { id: 'a2', order: 2, title: 'Pointage', status: 'DONE' },
      { id: 'a3', order: 3, title: 'Collecte', status: 'DONE' },
      { id: 'a4', order: 4, title: 'Distribution cagnotte', status: 'DONE' },
    ],
    attendance: [
      { memberId: 'member-1', fullName: 'Achille Mbongo', status: 'PRESENT', checkInAt: '2026-05-15T18:05:00.000Z' },
      { memberId: 'member-2', fullName: 'Béatrice Nkomo', status: 'PRESENT', checkInAt: '2026-05-15T18:08:00.000Z' },
      { memberId: 'member-3', fullName: 'Joseph Tchoumi', status: 'LATE', checkInAt: '2026-05-15T18:45:00.000Z' },
    ],
    totalCollected: 600000,
    totalDistributed: 550000,
    quorumThreshold: 0.5,
    beneficiaryMemberId: 'member-3',
    beneficiaryFullName: 'Joseph Tchoumi',
    cagnotteAmount: 550000,
    cagnotteSignedByPresident: true,
  },
  {
    id: 'session-2',
    tontineId: 'tontine-1',
    cycleId: 'cycle-1',
    number: 6,
    scheduledAt: '2026-05-25T18:00:00.000Z',
    startedAt: '2026-05-25T18:10:00.000Z',
    location: 'Domicile du Trésorier',
    status: SessionStatus.IN_PROGRESS,
    agenda: [
      { id: 'b1', order: 1, title: 'Ouverture', status: 'PENDING' },
      { id: 'b2', order: 2, title: 'Pointage des présences', status: 'PENDING' },
      { id: 'b3', order: 3, title: 'Lecture du PV #5', status: 'PENDING' },
      { id: 'b4', order: 4, title: 'Rapports Trésorier / Censeur / Commissaire', status: 'PENDING' },
      { id: 'b5', order: 5, title: 'Collecte des cotisations', status: 'PENDING' },
      { id: 'b6', order: 6, title: 'Distribution à Achille Mbongo', status: 'PENDING' },
      { id: 'b7', order: 7, title: 'Examen des demandes de prêt', status: 'PENDING' },
      { id: 'b8', order: 8, title: 'Questions diverses & clôture', status: 'PENDING' },
    ],
    attendance: [
      { memberId: 'member-1', fullName: 'Achille Mbongo', status: 'PRESENT', checkInAt: '2026-05-25T18:00:00.000Z' },
      { memberId: 'member-2', fullName: 'Béatrice Nkomo', status: 'PRESENT', checkInAt: '2026-05-25T18:05:00.000Z' },
      { memberId: 'member-3', fullName: 'Joseph Tchoumi', status: 'LATE', checkInAt: '2026-05-25T18:18:00.000Z' },
      { memberId: 'member-4', fullName: 'Yvonne Fopa', status: 'PRESENT', checkInAt: '2026-05-25T18:02:00.000Z' },
      { memberId: 'member-5', fullName: 'Désiré Etoa', status: 'PRESENT', checkInAt: '2026-05-25T18:03:00.000Z' },
    ],
    totalCollected: 0,
    totalDistributed: 0,
    quorumThreshold: 0.5,
    beneficiaryMemberId: 'member-1',
    beneficiaryFullName: 'Achille Mbongo',
    cagnotteAmount: 600000,
    cagnotteSignedByPresident: false,
  },
];

export const seedMembershipFiles: MembershipFile[] = [
  {
    id: 'mb-1',
    tontineId: 'tontine-1',
    kind: 'ADHESION',
    candidateFullName: 'Paul Essono',
    candidatePhone: '+237699556677',
    candidateEmail: 'paul.essono@example.cm',
    sponsorFullName: 'Achille Mbongo',
    motivation: 'Souhaite intégrer la tontine pour soutenir ses projets familiaux.',
    status: 'PRESIDENT_REVIEW',
    submittedAt: '2026-05-10T10:00:00.000Z',
    bureauReviewedAt: '2026-05-14T11:00:00.000Z',
    assemblyVotedAt: '2026-05-15T19:30:00.000Z',
    assemblyVoteYes: 9,
    assemblyVoteNo: 1,
    assemblyVoteAbstain: 1,
    attachments: [
      { id: 'att-cv', name: 'CV.pdf' },
      { id: 'att-id', name: 'Pièce identité.pdf' },
    ],
    history: [
      { at: '2026-05-10T10:00:00.000Z', actor: 'Paul Essono', action: 'Dossier déposé' },
      { at: '2026-05-14T11:00:00.000Z', actor: 'Bureau', action: 'Dossier examiné' },
      { at: '2026-05-15T19:30:00.000Z', actor: 'Assemblée', action: 'Vote approuvé (9/11)' },
    ],
  },
  {
    id: 'mb-2',
    tontineId: 'tontine-1',
    kind: 'RESIGNATION',
    candidateFullName: 'Sylvie Mbida',
    memberId: 'member-4',
    motivation: 'Départ professionnel à l’étranger pour 3 ans.',
    status: 'PRESIDENT_REVIEW',
    submittedAt: '2026-05-18T08:00:00.000Z',
    bureauReviewedAt: '2026-05-20T09:00:00.000Z',
    history: [
      { at: '2026-05-18T08:00:00.000Z', actor: 'Sylvie Mbida', action: 'Demande de démission déposée' },
      { at: '2026-05-20T09:00:00.000Z', actor: 'Bureau', action: 'Avis favorable transmis au Président' },
    ],
  },
  {
    id: 'mb-3',
    tontineId: 'tontine-1',
    kind: 'EXCLUSION',
    candidateFullName: 'Robert Tchana',
    memberId: 'member-5',
    motivation: 'Trois cotisations consécutives impayées + absences répétées.',
    status: 'ASSEMBLY_VOTE_PENDING',
    submittedAt: '2026-05-21T10:00:00.000Z',
    bureauReviewedAt: '2026-05-22T08:00:00.000Z',
    history: [
      { at: '2026-05-21T10:00:00.000Z', actor: 'Censeur', action: 'Proposition de radiation' },
      { at: '2026-05-22T08:00:00.000Z', actor: 'Bureau', action: 'Confirmation et convocation Assemblée' },
    ],
  },
];

export const seedExtraordinaryContributions: ExtraordinaryContribution[] = [
  {
    id: 'ec-1',
    tontineId: 'tontine-1',
    motive: 'Décès de M. Biya (frère d’Achille Mbongo)',
    beneficiaryMemberId: 'member-1',
    beneficiaryFullName: 'Achille Mbongo',
    amountPerMember: 10000,
    dueDate: '2026-06-10T00:00:00.000Z',
    status: 'COLLECTING',
    exemptBeneficiary: true,
    totalExpected: 110000,
    totalCollected: 60000,
    votedByAssemblyAt: '2026-05-22T19:00:00.000Z',
    createdAt: '2026-05-23T09:00:00.000Z',
    members: [
      { memberId: 'member-1', fullName: 'Achille Mbongo', expected: 0, paid: 0, exempted: true },
      { memberId: 'member-2', fullName: 'Béatrice Nkomo', expected: 10000, paid: 10000, exempted: false, paidAt: '2026-05-24T09:00:00.000Z' },
      { memberId: 'member-3', fullName: 'Joseph Tchoumi', expected: 10000, paid: 0, exempted: false },
    ],
  },
];

export const seedConflicts: Conflict[] = [
  {
    id: 'conf-1',
    tontineId: 'tontine-1',
    subject: 'Différend entre Joseph Tchoumi et Béatrice Nkomo',
    description:
      'Joseph conteste les retards facturés par Béatrice en sa qualité de Secrétaire. Le Censeur a tenté une première médiation sans succès.',
    parties: [
      { memberId: 'member-3', fullName: 'Joseph Tchoumi', role: 'INITIATOR' },
      { memberId: 'member-2', fullName: 'Béatrice Nkomo', role: 'RESPONDENT' },
    ],
    status: 'OPEN',
    escalatedByUserId: 'user-censeur',
    escalatedByFullName: 'Censeur',
    escalatedAt: '2026-05-20T10:00:00.000Z',
    severity: 'MEDIUM',
    history: [
      { at: '2026-05-15T19:00:00.000Z', actor: 'Joseph Tchoumi', action: 'Plainte déposée' },
      { at: '2026-05-18T10:00:00.000Z', actor: 'Censeur', action: 'Médiation tentée sans accord' },
      { at: '2026-05-20T10:00:00.000Z', actor: 'Censeur', action: 'Escalade au Président' },
    ],
  },
];

export const seedCycleClose: CycleClose = {
  id: 'cc-1',
  tontineId: 'tontine-1',
  cycleId: 'cycle-1',
  cycleNumber: 2,
  status: 'IN_PROGRESS',
  checklist: [
    { key: 'distributions', label: 'Toutes les cagnottes ont été distribuées', status: 'PENDING' },
    { key: 'loans', label: 'Tous les prêts en cours sont reportés ou remboursés', status: 'PENDING' },
    { key: 'sanctions', label: 'Toutes les sanctions sont résolues', status: 'PENDING' },
    { key: 'auditor', label: 'Validation du Commissaire aux Comptes', status: 'PENDING' },
    { key: 'inventory', label: 'Inventaire des caisses signé par le Trésorier', status: 'DONE' },
    { key: 'minutes', label: 'PV de la dernière séance publié', status: 'DONE' },
  ],
  summary: {
    totalCollected: 6800000,
    totalDistributed: 6600000,
    totalLoansOutstanding: 210000,
    totalSanctionsCollected: 35000,
    netResult: 25000,
    membersRetained: 11,
    newMembersNextCycle: 1,
  },
};

export const seedVotes: Vote[] = [
  {
    id: 'vote-1',
    tontineId: 'tontine-1',
    question: 'Faut-il augmenter la cotisation mensuelle à 60 000 XAF pour le cycle 3 ?',
    description: 'Proposition débattue lors de la séance #5 et soumise au vote en ligne.',
    options: [
      { id: 'o-yes', label: 'Pour', count: 6 },
      { id: 'o-no', label: 'Contre', count: 4 },
      { id: 'o-abstain', label: 'Abstention', count: 1 },
    ],
    isAnonymous: true,
    hideResultsUntilClose: false,
    scope: 'ASSEMBLY',
    audience: 'MEMBERS_ACTIVE',
    status: 'OPEN',
    opensAt: '2026-05-22T08:00:00.000Z',
    closesAt: '2026-06-01T18:00:00.000Z',
    createdByUserId: 'user-1',
    createdByFullName: 'Achille Mbongo',
    createdAt: '2026-05-22T08:00:00.000Z',
    totalVoters: 12,
    totalVoted: 11,
    quorumPercent: 0.66,
  },
];

export const seedDelegations: Delegation[] = [
  {
    id: 'del-1',
    tontineId: 'tontine-1',
    delegateeUserId: 'user-2',
    delegateeFullName: 'Béatrice Nkomo',
    delegateeRole: UserRole.SECRETARY,
    powers: ['VALIDATE_DOCUMENTS', 'PUBLISH_ANNOUNCEMENTS'],
    reason: 'Voyage du Président à l’étranger.',
    startsAt: '2026-06-01T00:00:00.000Z',
    endsAt: '2026-06-15T23:59:59.000Z',
    status: 'ACTIVE',
    createdAt: '2026-05-23T10:00:00.000Z',
  },
];

export const seedEmergencyBlocks: EmergencyBlock[] = [
  {
    id: 'eb-1',
    tontineId: 'tontine-1',
    target: 'LOAN_DISBURSEMENT',
    reason: 'Audit interne en cours, suspendre tous les décaissements de prêt jusqu’à nouvel ordre.',
    status: 'LIFTED',
    activatedByUserId: 'user-1',
    activatedByFullName: 'Achille Mbongo',
    activatedAt: '2026-04-01T09:00:00.000Z',
    liftedByUserId: 'user-1',
    liftedAt: '2026-04-15T10:00:00.000Z',
    liftReason: 'Audit terminé sans anomalie.',
  },
];

export const seedReports: ReportEntry[] = [
  {
    id: 'rep-1',
    tontineId: 'tontine-1',
    category: 'TREASURY',
    title: 'Rapport de trésorerie — Mai 2026',
    description: 'État des caisses, recettes, dépenses, solde global.',
    periodLabel: 'Mai 2026',
    authorFullName: 'Trésorier',
    generatedAt: '2026-05-22T18:00:00.000Z',
    metricsJson: { soldeGlobal: 6800000, recettes: 600000, depenses: 120000 },
    downloadUrlPdf: '#',
    downloadUrlExcel: '#',
  },
  {
    id: 'rep-2',
    tontineId: 'tontine-1',
    category: 'AUDIT',
    title: 'Rapport du Commissaire — Cycle 2 (intermédiaire)',
    description: 'Vérifications financières et avis sur les opérations majeures.',
    periodLabel: 'Cycle 2 — 1ère moitié',
    authorFullName: 'Béatrice Nkomo (Commissaire)',
    generatedAt: '2026-05-20T12:00:00.000Z',
    metricsJson: { operationsAuditees: 28, anomaliesDetectees: 0 },
    downloadUrlPdf: '#',
  },
  {
    id: 'rep-3',
    tontineId: 'tontine-1',
    category: 'CENSOR',
    title: 'Rapport disciplinaire — Mai 2026',
    description: 'Sanctions appliquées, taux de présence, contestations.',
    periodLabel: 'Mai 2026',
    authorFullName: 'Censeur',
    generatedAt: '2026-05-23T08:00:00.000Z',
    metricsJson: { sanctionsAppliquees: 3, contestations: 1 },
    downloadUrlPdf: '#',
  },
  {
    id: 'rep-4',
    tontineId: 'tontine-1',
    category: 'PERIODIC',
    title: 'Synthèse hebdomadaire — Semaine 21',
    periodLabel: '20-26 mai 2026',
    authorFullName: 'Système',
    generatedAt: '2026-05-26T07:00:00.000Z',
    metricsJson: { reunions: 1, cotisationsRecues: 11, retardsSanctionnes: 1 },
    downloadUrlPdf: '#',
    downloadUrlExcel: '#',
  },
];

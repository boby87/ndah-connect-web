import type { AgendaDraft } from '../app/shared/models/entities/agenda-draft.model';
import type { ArchiveDocument } from '../app/shared/models/entities/archive-document.model';
import type { Convocation } from '../app/shared/models/entities/convocation.model';
import type { MinutesDraft } from '../app/shared/models/entities/minutes-draft.model';
import type { MemberRsvp } from '../app/shared/models/entities/rsvp.model';

export const seedAgendaDrafts: AgendaDraft[] = [
  {
    id: 'agdraft-1',
    tontineId: 'tontine-1',
    sessionId: 'session-2',
    sessionNumber: 6,
    scheduledAt: '2026-06-15T18:00:00.000Z',
    location: 'Domicile du Trésorier',
    beneficiaryMemberId: 'member-1',
    beneficiaryFullName: 'Achille Mbongo',
    items: [
      { id: 'i1', order: 1, title: 'Ouverture de la séance', isStandard: true, estimatedDurationMin: 5 },
      { id: 'i2', order: 2, title: 'Appel des membres', isStandard: true, estimatedDurationMin: 10 },
      { id: 'i3', order: 3, title: 'Lecture et adoption du PV #5', isStandard: true, estimatedDurationMin: 15 },
      { id: 'i4', order: 4, title: 'Rapport du Trésorier', isStandard: true, estimatedDurationMin: 15 },
      { id: 'i5', order: 5, title: 'Rapport du Censeur', isStandard: true, estimatedDurationMin: 10 },
      { id: 'i6', order: 6, title: 'Rapport du Commissaire aux Comptes', isStandard: true, estimatedDurationMin: 10 },
      { id: 'i7', order: 7, title: 'Collecte des cotisations', isStandard: true, estimatedDurationMin: 30 },
      { id: 'i8', order: 8, title: 'Distribution de la cagnotte à Achille Mbongo', isStandard: false, estimatedDurationMin: 20 },
      { id: 'i9', order: 9, title: 'Examen des demandes de prêt', isStandard: false, estimatedDurationMin: 20 },
      { id: 'i10', order: 10, title: 'Présentation candidat Paul Essono', isStandard: false, estimatedDurationMin: 15 },
      { id: 'i11', order: 11, title: 'Questions diverses', isStandard: true, estimatedDurationMin: 15 },
      { id: 'i12', order: 12, title: 'Clôture de la séance', isStandard: true, estimatedDurationMin: 5 },
    ],
    status: 'SUBMITTED_TO_PRESIDENT',
    createdAt: '2026-05-22T08:00:00.000Z',
    submittedAt: '2026-05-22T10:00:00.000Z',
  },
];

export const seedConvocations: Convocation[] = [
  {
    id: 'conv-1',
    tontineId: 'tontine-1',
    sessionId: 'session-1',
    sessionNumber: 5,
    scheduledFor: '2026-05-15T18:00:00.000Z',
    channels: ['IN_APP', 'SMS', 'EMAIL'],
    audienceMemberIds: ['member-1', 'member-2', 'member-3'],
    includeCandidates: false,
    reminders: [{ offsetHoursBefore: 24 }, { offsetHoursBefore: 2 }],
    message:
      'Vous êtes convoqué(e) à la séance ordinaire #5 du 15 mai 2026 à 18h00 chez le Président. Ordre du jour en pièce jointe.',
    status: 'SENT',
    sentAt: '2026-05-10T08:00:00.000Z',
    totalRecipients: 12,
    totalDelivered: 12,
    totalFailed: 0,
  },
];

const member1Rsvp: MemberRsvp = {
  sessionId: 'session-2',
  memberId: 'member-1',
  memberFullName: 'Achille Mbongo',
  status: 'CONFIRMED',
  respondedAt: '2026-05-21T09:00:00.000Z',
};

const member2Rsvp: MemberRsvp = {
  sessionId: 'session-2',
  memberId: 'member-2',
  memberFullName: 'Béatrice Nkomo',
  status: 'CONFIRMED',
  respondedAt: '2026-05-21T10:00:00.000Z',
};

const member3Rsvp: MemberRsvp = {
  sessionId: 'session-2',
  memberId: 'member-3',
  memberFullName: 'Joseph Tchoumi',
  status: 'PENDING',
};

export const seedRsvps: MemberRsvp[] = [member1Rsvp, member2Rsvp, member3Rsvp];

export const seedMinutesDrafts: MinutesDraft[] = [
  {
    id: 'min-1',
    tontineId: 'tontine-1',
    sessionId: 'session-1',
    sessionNumber: 5,
    sessionDate: '2026-05-15T18:00:00.000Z',
    attendanceSummary: {
      present: 2,
      late: 1,
      absent: 0,
      excused: 0,
      total: 3,
      quorumReached: true,
    },
    financialSummary: {
      totalCollected: 600000,
      totalDistributed: 550000,
      beneficiaryFullName: 'Joseph Tchoumi',
    },
    sections: [
      {
        key: 'opening',
        title: 'Ouverture de la séance',
        content:
          "La séance s'est ouverte à 18h10 sous la présidence de M. Achille Mbongo. Le quorum est atteint avec 11 membres présents sur 12 (92%).",
        required: true,
      },
      {
        key: 'previous_minutes',
        title: 'Adoption du PV précédent',
        content: 'Le PV de la séance #4 a été lu et adopté à l\'unanimité sans amendement.',
        required: true,
      },
      {
        key: 'collection',
        title: 'Collecte des cotisations',
        content:
          'Toutes les cotisations ont été collectées (11 × 50 000 XAF = 550 000 XAF + 50 000 XAF de cotisations extraordinaires).',
        required: true,
      },
      {
        key: 'distribution',
        title: 'Distribution de la cagnotte',
        content:
          'La cagnotte de 550 000 XAF a été distribuée à M. Joseph Tchoumi conformément à l\'ordre de tour. Reçu signé.',
        required: true,
      },
      {
        key: 'other',
        title: 'Questions diverses',
        content:
          "M. Tchoumi a soulevé un point sur les retards facturés ; le point sera traité par la médiation du Président.",
        required: false,
      },
      {
        key: 'closing',
        title: 'Clôture',
        content: 'La séance a été clôturée à 20h15. Prochaine séance prévue le 15 juin 2026.',
        required: true,
      },
    ],
    attachments: [
      { id: 'att-pres', name: 'Feuille de présence #5.pdf' },
      { id: 'att-fin', name: 'Bilan financier Trésorier #5.pdf' },
      { id: 'att-receipt', name: 'Reçu distribution cagnotte.pdf' },
    ],
    status: 'SECRETARY_SIGNED',
    secretarySignedAt: '2026-05-16T09:00:00.000Z',
    createdAt: '2026-05-15T21:00:00.000Z',
    updatedAt: '2026-05-16T09:00:00.000Z',
  },
];

export const seedArchives: ArchiveDocument[] = [
  {
    id: 'arch-1',
    tontineId: 'tontine-1',
    cycleNumber: 2,
    sessionNumber: 5,
    type: 'MINUTES',
    title: 'PV — Séance #5',
    description: 'Procès-verbal signé par le Secrétaire et le Président.',
    fileName: 'PV-seance-5.pdf',
    fileSize: 245000,
    mimeType: 'application/pdf',
    visibility: 'ALL_MEMBERS',
    uploadedByFullName: 'Béatrice Nkomo',
    uploadedAt: '2026-05-17T10:00:00.000Z',
    tags: ['pv', 'cycle-2'],
  },
  {
    id: 'arch-2',
    tontineId: 'tontine-1',
    cycleNumber: 2,
    sessionNumber: 5,
    type: 'ATTENDANCE_SHEET',
    title: 'Feuille de présence — Séance #5',
    fileName: 'presence-5.pdf',
    fileSize: 78000,
    mimeType: 'application/pdf',
    visibility: 'ALL_MEMBERS',
    uploadedByFullName: 'Béatrice Nkomo',
    uploadedAt: '2026-05-15T21:00:00.000Z',
    tags: ['présence', 'cycle-2'],
  },
  {
    id: 'arch-3',
    tontineId: 'tontine-1',
    type: 'BYLAW',
    title: 'Règlement intérieur 2024',
    description: 'Version en vigueur depuis janvier 2024.',
    fileName: 'reglement-2024.pdf',
    fileSize: 412000,
    mimeType: 'application/pdf',
    visibility: 'ALL_MEMBERS',
    uploadedByFullName: 'Béatrice Nkomo',
    uploadedAt: '2024-01-15T08:00:00.000Z',
    tags: ['statuts', 'fondation'],
  },
  {
    id: 'arch-4',
    tontineId: 'tontine-1',
    cycleNumber: 2,
    type: 'AUDIT_REPORT',
    title: 'Rapport audit intermédiaire — Cycle 2',
    fileName: 'audit-cycle2-int.pdf',
    fileSize: 156000,
    mimeType: 'application/pdf',
    visibility: 'BUREAU',
    uploadedByFullName: 'Béatrice Nkomo',
    uploadedAt: '2026-05-20T12:00:00.000Z',
    tags: ['audit', 'cycle-2'],
  },
];

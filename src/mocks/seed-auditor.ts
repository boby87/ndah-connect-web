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

export const seedAuditorAnomalies: AuditorAnomaly[] = [
  {
    id: 'anom-1',
    tontineId: 'tontine-1',
    reference: 'SIG-2026-001',
    category: 'CASH_DISCREPANCY',
    severity: 'MEDIUM',
    title: 'Écart caisse fonctionnement',
    description:
      "Lors du contrôle du 15/05/2026, un écart de 5 000 XAF a été constaté sur la caisse de fonctionnement. Solde attendu : 130 000 XAF — Solde constaté : 125 000 XAF.",
    audience: 'PRESIDENT',
    status: 'IN_RESPONSE',
    raisedAt: '2026-05-15T16:00:00.000Z',
    raisedByUserId: 'user-6',
    raisedByFullName: 'Christine Mballa (Commissaire)',
    detectedAt: '2026-05-15T15:30:00.000Z',
    requestsResponse: true,
    copyToTreasurer: true,
    response:
      "L'écart correspond à des frais de transport non encore comptabilisés. Justificatif joint.",
    responseAt: '2026-05-15T18:30:00.000Z',
    responseByFullName: 'Yvonne Fopa (Trésorier)',
    history: [
      { at: '2026-05-15T16:00:00.000Z', actor: 'Commissaire', action: 'Signalement créé' },
      { at: '2026-05-15T16:00:00.000Z', actor: 'Système', action: 'Notification envoyée au Président' },
      { at: '2026-05-15T18:30:00.000Z', actor: 'Trésorier', action: 'Réponse fournie' },
    ],
  },
];

export const seedAuditorControls: AuditorControl[] = [
  {
    id: 'ctrl-1',
    tontineId: 'tontine-1',
    reference: 'CTRL-2026-04',
    kind: 'MONTHLY',
    status: 'COMPLETED',
    periodFrom: '2026-04-01T00:00:00.000Z',
    periodTo: '2026-04-30T00:00:00.000Z',
    completedAt: '2026-05-02T10:00:00.000Z',
    authorFullName: 'Christine Mballa (Commissaire)',
    checkpoints: [
      { id: 'cp-1', label: 'Caisse principale', category: 'CASH', expectedValue: 2400000, observedValue: 2400000, variance: 0, conform: true },
      { id: 'cp-2', label: 'Caisse secours', category: 'CASH', expectedValue: 320000, observedValue: 320000, variance: 0, conform: true },
      { id: 'cp-3', label: 'Caisse fonctionnement', category: 'CASH', expectedValue: 130000, observedValue: 130000, variance: 0, conform: true },
      { id: 'cp-4', label: 'Justificatifs dépenses', category: 'RECEIPT', conform: true, note: '3/3 présents' },
      { id: 'cp-5', label: 'Recouvrement cotisations', category: 'CONTRIBUTION', expectedValue: 600000, observedValue: 580000, variance: -20000, conform: false, note: '2 membres en retard' },
    ],
    observations: 'Contrôle mensuel conforme — un suivi des arriérés est nécessaire.',
    conformCount: 4,
    anomaliesCount: 1,
    generatedAnomalyIds: [],
  },
  {
    id: 'ctrl-2',
    tontineId: 'tontine-1',
    reference: 'CTRL-2026-05',
    kind: 'MONTHLY',
    status: 'PLANNED',
    periodFrom: '2026-05-01T00:00:00.000Z',
    periodTo: '2026-05-31T00:00:00.000Z',
    dueDate: '2026-06-05T00:00:00.000Z',
    authorFullName: 'Christine Mballa (Commissaire)',
    checkpoints: [],
    conformCount: 0,
    anomaliesCount: 0,
    generatedAnomalyIds: [],
  },
];

export const seedAuditorAudits: AuditorAudit[] = [
  {
    id: 'aud-1',
    tontineId: 'tontine-1',
    reference: 'AUD-2026-T1',
    scope: 'COMPLETE',
    status: 'COMPLETED',
    periodFrom: '2026-01-01T00:00:00.000Z',
    periodTo: '2026-03-31T00:00:00.000Z',
    completedAt: '2026-04-15T10:00:00.000Z',
    authorFullName: 'Christine Mballa (Commissaire)',
    overallFinding: 'WITH_RESERVES',
    findings: [
      { id: 'f1', area: 'Trésorerie', finding: 'CONFORM', description: 'Les caisses sont équilibrées et tracées.' },
      { id: 'f2', area: 'Prêts', finding: 'WITH_RESERVES', description: 'Le suivi des remboursements pourrait être renforcé.' },
      { id: 'f3', area: 'Sanctions', finding: 'CONFORM', description: 'Le processus de sanction est respecté.' },
    ],
    observations: 'Audit trimestriel Q1 — globalement satisfaisant, suivi à renforcer sur les prêts.',
    generatedRecommendationIds: ['reco-1'],
  },
];

export const seedAuditorRecommendations: AuditorRecommendation[] = [
  {
    id: 'reco-1',
    tontineId: 'tontine-1',
    reference: 'REC-2026-001',
    origin: 'AUDIT',
    originId: 'aud-1',
    title: 'Renforcer le suivi des remboursements de prêts',
    description:
      'Mettre en place un suivi mensuel automatique des échéances et une relance systématique 7 jours avant échéance.',
    priority: 'MEDIUM',
    recipient: 'BUREAU',
    dueDate: '2026-06-30T00:00:00.000Z',
    status: 'IN_PROGRESS',
    emittedAt: '2026-04-15T10:30:00.000Z',
    emittedByFullName: 'Christine Mballa (Commissaire)',
    acknowledgedAt: '2026-04-16T09:00:00.000Z',
    implementationProgress: 40,
  },
  {
    id: 'reco-2',
    tontineId: 'tontine-1',
    reference: 'REC-2026-002',
    origin: 'PERIODIC_CONTROL',
    originId: 'ctrl-1',
    title: 'Régulariser les retards de cotisation',
    description:
      'Émettre des rappels formels aux deux membres concernés par les arriérés.',
    priority: 'LOW',
    recipient: 'TREASURER',
    dueDate: '2026-06-15T00:00:00.000Z',
    status: 'IMPLEMENTED',
    emittedAt: '2026-05-02T10:30:00.000Z',
    emittedByFullName: 'Christine Mballa (Commissaire)',
    acknowledgedAt: '2026-05-03T11:00:00.000Z',
    implementationProgress: 100,
    implementedAt: '2026-05-20T14:00:00.000Z',
  },
];

export const seedAuditorClarifications: AuditorClarification[] = [
  {
    id: 'clar-1',
    tontineId: 'tontine-1',
    reference: 'ECL-2026-001',
    subject: 'Dépense EXP-2026-021 — location salle AG',
    question:
      "Pourriez-vous préciser le détail du devis comparé et joindre les 3 devis reçus avant signature ?",
    targetRole: 'TREASURER',
    dueWithinHours: 48,
    status: 'RESPONDED',
    raisedAt: '2026-05-22T09:00:00.000Z',
    raisedByFullName: 'Christine Mballa (Commissaire)',
    response:
      "Trois devis ont été reçus : Salle Fouda (120k), Salle Mvog-Mbi (135k), Salle Bastos (160k). Le moins cher a été retenu.",
    respondedAt: '2026-05-22T16:00:00.000Z',
    respondedByFullName: 'Yvonne Fopa (Trésorier)',
    evaluation: 'SATISFACTORY',
  },
];

export const seedSessionBalanceReviews: SessionBalanceReview[] = [
  {
    id: 'sbr-1',
    tontineId: 'tontine-1',
    sessionId: 'session-1',
    sessionNumber: 5,
    reviewedAt: '2026-05-16T08:00:00.000Z',
    reviewedByFullName: 'Christine Mballa (Commissaire)',
    decision: 'CONFORM',
    observations: 'Bilan conforme. Calculs exacts, justificatifs correspondent aux opérations.',
  },
];

export const seedAuditorCertifications: AuditorCertification[] = [
  {
    id: 'cert-1',
    tontineId: 'tontine-1',
    reference: 'CERT-2026-T1',
    scope: 'CYCLE',
    periodLabel: 'Cycle #1 — Janvier à Décembre 2025',
    emittedAt: '2026-01-20T10:00:00.000Z',
    emittedByFullName: 'Christine Mballa (Commissaire)',
    decision: 'CERTIFIED',
    assets: [
      { label: 'Caisse principale (clôture)', amount: 2400000 },
      { label: 'Caisse de secours', amount: 320000 },
      { label: 'Caisse de fonctionnement', amount: 130000 },
      { label: 'Prêts en cours', amount: 800000 },
    ],
    liabilities: [
      { label: 'Cotisations collectées (net)', amount: 1880000 },
      { label: 'Intérêts cumulés', amount: 90000 },
      { label: 'Report cycle précédent', amount: 1680000 },
    ],
    totalAssets: 3650000,
    totalLiabilities: 3650000,
    balanced: true,
    signedDigitally: true,
    downloadUrl: '#',
  },
];

export const seedAuditorReports: AuditorReport[] = [
  {
    id: 'audrep-1',
    tontineId: 'tontine-1',
    reference: 'AUD-RPT-2026-S5',
    scope: 'LAST_SESSION',
    periodLabel: 'Séance #5 — 15 mai 2026',
    sessionId: 'session-1',
    sessionNumber: 5,
    generatedAt: '2026-05-16T09:30:00.000Z',
    authorFullName: 'Christine Mballa (Commissaire)',
    totalBalance: 2925000,
    cashBoxSnapshot: [
      { name: 'Caisse principale', balance: 2450000 },
      { name: 'Caisse de secours', balance: 350000 },
      { name: 'Caisse de fonctionnement', balance: 125000 },
    ],
    validationsCount: 4,
    anomaliesCount: 1,
    recommendationsCount: 2,
    observations:
      'Séance #5 conforme. Une anomalie mineure d\'écart de caisse a été résolue. Deux recommandations sont actives.',
  },
];

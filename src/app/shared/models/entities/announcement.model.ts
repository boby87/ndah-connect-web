export type AnnouncementAudience = 'ALL' | 'BUREAU' | 'MEMBERS';
export type AnnouncementChannel = 'IN_APP' | 'SMS' | 'EMAIL';

export interface Announcement {
  id: string;
  tontineId: string;
  authorUserId: string;
  authorFullName: string;
  title: string;
  body: string;
  audience: AnnouncementAudience;
  channels: AnnouncementChannel[];
  publishedAt: string;
}

export interface PresidentKpi {
  totalCashBalance: number;
  activeMembersCount: number;
  activeLoansCount: number;
  activeLoansAmount: number;
  pendingSanctionsCount: number;
  pendingSanctionsAmount: number;
  nextSessionInDays?: number;
  nextSessionNumber?: number;
  contributionRate: number;
  pendingValidationsCount: number;
  cycleProgressPercent: number;
  cycleCompletedSessions: number;
  cycleTotalSessions: number;
}

export interface PresidentPerformanceTrend {
  label: string;
  current: number;
  previous: number;
  unit?: string;
  trend: 'UP' | 'DOWN' | 'FLAT';
  positiveTrend: 'UP' | 'DOWN';
}

export interface PresidentAlert {
  id: string;
  level: 'CRITICAL' | 'WARNING' | 'INFO';
  message: string;
  link?: string;
}

export interface PresidentDecisionLogEntry {
  id: string;
  decidedAt: string;
  decision: 'APPROVED' | 'REJECTED' | 'BLOCKED';
  subject: string;
}

export interface PresidentAgendaItem {
  id: string;
  when: string;
  title: string;
  bucket: 'TODAY' | 'THIS_WEEK' | 'UPCOMING';
}

export interface PresidentDashboard {
  kpi: PresidentKpi;
  alerts: PresidentAlert[];
  pendingValidations: {
    id: string;
    title: string;
    category: string;
    priority: 'CRITICAL' | 'HIGH' | 'NORMAL' | 'LOW';
    amount?: number;
  }[];
  performance: PresidentPerformanceTrend[];
  recentDecisions: PresidentDecisionLogEntry[];
  agenda: PresidentAgendaItem[];
}

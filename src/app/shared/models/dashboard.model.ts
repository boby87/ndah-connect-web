export interface DashboardMetric {
  label: string;
  value: number;
  currency?: string;
  trend?: number;
  trendLabel?: string;
  icon?: string;
  color?: 'green' | 'blue' | 'orange' | 'red' | 'purple';
}

export interface DashboardStats {
  totalMembers: DashboardMetric;
  totalFunds: DashboardMetric;
  activeLoans: DashboardMetric;
  interestRate: DashboardMetric;
}


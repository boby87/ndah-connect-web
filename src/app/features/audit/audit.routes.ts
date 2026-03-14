import { Routes } from '@angular/router';

export const AUDIT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/audit-dashboard/audit-dashboard.component').then(m => m.AuditDashboardComponent),
  },
  {
    path: 'report',
    loadComponent: () =>
      import('./pages/audit-report/audit-report.component').then(m => m.AuditReportComponent),
  },
  {
    path: 'control',
    loadComponent: () =>
      import('./pages/periodic-control/periodic-control.component').then(m => m.PeriodicControlComponent),
  },
  {
    path: 'certification',
    loadComponent: () =>
      import('./pages/certification/certification.component').then(m => m.CertificationComponent),
  },
  {
    path: 'recommendations',
    loadComponent: () =>
      import('./pages/recommendations/recommendations.component').then(m => m.RecommendationsComponent),
  },
];

import { Routes } from '@angular/router';
import { roleGuard } from '../../core/auth/guards/role.guard';
import { UserRole } from '../../core/enums/user-role.enum';

export const AUDITOR_ROUTES: Routes = [
  {
    path: '',
    canActivate: [roleGuard],
    data: { roles: [UserRole.AUDITOR] },
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/auditor-dashboard.component').then(
            (m) => m.AuditorDashboardComponent,
          ),
        title: 'Commissaire · Tableau de bord',
      },
      {
        path: 'validations',
        loadComponent: () =>
          import('./pages/validations/validations-page.component').then(
            (m) => m.AuditorValidationsPageComponent,
          ),
        title: 'Commissaire · Validations',
      },
      {
        path: 'financial-data',
        loadComponent: () =>
          import('./pages/financial-data/financial-data-page.component').then(
            (m) => m.AuditorFinancialDataPageComponent,
          ),
        title: 'Commissaire · Données financières',
      },
      {
        path: 'balance-reviews',
        loadComponent: () =>
          import('./pages/balance-reviews/balance-reviews-page.component').then(
            (m) => m.AuditorBalanceReviewsPageComponent,
          ),
        title: 'Commissaire · Bilans séance',
      },
      {
        path: 'controls',
        loadComponent: () =>
          import('./pages/controls/controls-page.component').then(
            (m) => m.AuditorControlsPageComponent,
          ),
        title: 'Commissaire · Contrôles',
      },
      {
        path: 'audits',
        loadComponent: () =>
          import('./pages/audits/audits-page.component').then((m) => m.AuditorAuditsPageComponent),
        title: 'Commissaire · Audits',
      },
      {
        path: 'anomalies',
        loadComponent: () =>
          import('./pages/anomalies/anomalies-page.component').then(
            (m) => m.AuditorAnomaliesPageComponent,
          ),
        title: 'Commissaire · Anomalies',
      },
      {
        path: 'clarifications',
        loadComponent: () =>
          import('./pages/clarifications/clarifications-page.component').then(
            (m) => m.AuditorClarificationsPageComponent,
          ),
        title: 'Commissaire · Éclaircissements',
      },
      {
        path: 'recommendations',
        loadComponent: () =>
          import('./pages/recommendations/recommendations-page.component').then(
            (m) => m.AuditorRecommendationsPageComponent,
          ),
        title: 'Commissaire · Recommandations',
      },
      {
        path: 'certifications',
        loadComponent: () =>
          import('./pages/certifications/certifications-page.component').then(
            (m) => m.AuditorCertificationsPageComponent,
          ),
        title: 'Commissaire · Certifications',
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./pages/reports/reports-page.component').then(
            (m) => m.AuditorReportsPageComponent,
          ),
        title: 'Commissaire · Rapports',
      },
      {
        path: 'export',
        loadComponent: () =>
          import('./pages/export/export-page.component').then((m) => m.AuditorExportPageComponent),
        title: 'Commissaire · Export',
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];

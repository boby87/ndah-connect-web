import { Routes } from '@angular/router';
import { roleGuard } from '../../core/auth/guards/role.guard';
import { UserRole } from '../../core/enums/user-role.enum';

export const CENSOR_ROUTES: Routes = [
  {
    path: '',
    canActivate: [roleGuard],
    data: { roles: [UserRole.CENSOR] },
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/censor-dashboard.component').then(
            (m) => m.CensorDashboardComponent,
          ),
        title: 'Censeur · Tableau de bord',
      },
      {
        path: 'sanctions',
        loadComponent: () =>
          import('./pages/sanctions/sanctions-page.component').then(
            (m) => m.CensorSanctionsPageComponent,
          ),
        title: 'Censeur · Sanctions',
      },
      {
        path: 'sanctions/multiple',
        loadComponent: () =>
          import('./pages/multiple-sanctions/multiple-sanctions-page.component').then(
            (m) => m.CensorMultipleSanctionsPageComponent,
          ),
        title: 'Censeur · Sanctions multiples',
      },
      {
        path: 'auto-confirm',
        loadComponent: () =>
          import('./pages/auto-confirm/auto-confirm-page.component').then(
            (m) => m.CensorAutoConfirmPageComponent,
          ),
        title: 'Censeur · Confirmer sanctions auto',
      },
      {
        path: 'contestations',
        loadComponent: () =>
          import('./pages/contestations/contestations-page.component').then(
            (m) => m.CensorContestationsPageComponent,
          ),
        title: 'Censeur · Contestations',
      },
      {
        path: 'attendance-modifications',
        loadComponent: () =>
          import(
            './pages/attendance-modifications/attendance-modifications-page.component'
          ).then((m) => m.CensorAttendanceModificationsPageComponent),
        title: 'Censeur · Modifications présence',
      },
      {
        path: 'justifications',
        loadComponent: () =>
          import('./pages/justifications/justifications-page.component').then(
            (m) => m.CensorJustificationsPageComponent,
          ),
        title: 'Censeur · Justificatifs',
      },
      {
        path: 'unpaid',
        loadComponent: () =>
          import('./pages/unpaid/unpaid-page.component').then((m) => m.CensorUnpaidPageComponent),
        title: 'Censeur · Sanctions impayées',
      },
      {
        path: 'communications',
        loadComponent: () =>
          import('./pages/communications/communications-page.component').then(
            (m) => m.CensorCommunicationsPageComponent,
          ),
        title: 'Censeur · Communications',
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./pages/reports/reports-page.component').then(
            (m) => m.CensorReportsPageComponent,
          ),
        title: 'Censeur · Rapports',
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];

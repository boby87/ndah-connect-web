import { Routes } from '@angular/router';
import { roleGuard } from '../../core/auth/guards/role.guard';
import { UserRole } from '../../core/enums/user-role.enum';

export const SECRETARY_ROUTES: Routes = [
  {
    path: '',
    canActivate: [roleGuard],
    data: { roles: [UserRole.SECRETARY] },
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/secretary-dashboard.component').then(
            (m) => m.SecretaryDashboardComponent,
          ),
        title: 'Secrétariat · Tableau de bord',
      },
      {
        path: 'agendas',
        loadComponent: () =>
          import('./pages/agendas/agendas-page.component').then((m) => m.AgendasPageComponent),
        title: 'Secrétariat · Ordres du jour',
      },
      {
        path: 'convocations',
        loadComponent: () =>
          import('./pages/convocations/convocations-page.component').then(
            (m) => m.ConvocationsPageComponent,
          ),
        title: 'Secrétariat · Convocations',
      },
      {
        path: 'rsvps/:id',
        loadComponent: () =>
          import('./pages/rsvps/rsvps-page.component').then((m) => m.RsvpsPageComponent),
        title: 'Secrétariat · Confirmations',
      },
      {
        path: 'attendance/:id',
        loadComponent: () =>
          import('./pages/attendance/attendance-page.component').then(
            (m) => m.AttendancePageComponent,
          ),
        title: 'Secrétariat · Pointage',
      },
      {
        path: 'minutes',
        loadComponent: () =>
          import('./pages/minutes/minutes-list.component').then((m) => m.MinutesListComponent),
        title: 'Secrétariat · Procès-verbaux',
      },
      {
        path: 'minutes/:id',
        loadComponent: () =>
          import('./pages/minutes/minutes-editor.component').then((m) => m.MinutesEditorComponent),
        title: 'Secrétariat · Rédaction PV',
      },
      {
        path: 'membership',
        loadComponent: () =>
          import('./pages/membership/membership-review.component').then(
            (m) => m.MembershipReviewComponent,
          ),
        title: 'Secrétariat · Dossiers',
      },
      {
        path: 'members',
        loadComponent: () =>
          import('./pages/members/members-registry.component').then(
            (m) => m.MembersRegistryComponent,
          ),
        title: 'Secrétariat · Registre',
      },
      {
        path: 'archives',
        loadComponent: () =>
          import('./pages/archives/archives-page.component').then((m) => m.ArchivesPageComponent),
        title: 'Secrétariat · Archives',
      },
      {
        path: 'announcements',
        loadComponent: () =>
          import('./pages/announcements/announcements-page.component').then(
            (m) => m.SecretaryAnnouncementsComponent,
          ),
        title: 'Secrétariat · Annonces',
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./pages/reports/reports-page.component').then((m) => m.SecretaryReportsComponent),
        title: 'Secrétariat · Rapports',
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];

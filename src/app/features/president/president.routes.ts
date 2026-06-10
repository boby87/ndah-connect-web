import { Routes } from '@angular/router';
import { roleGuard } from '../../core/auth/guards/role.guard';
import { UserRole } from '../../core/enums/user-role.enum';

export const PRESIDENT_ROUTES: Routes = [
  {
    path: '',
    canActivate: [roleGuard],
    data: { roles: [UserRole.PRESIDENT] },
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/president-dashboard.component').then(
            (m) => m.PresidentDashboardComponent,
          ),
        title: 'Présidence · Tableau de bord',
      },
      {
        path: 'validations',
        loadComponent: () =>
          import('./pages/validations/validations-list.component').then(
            (m) => m.ValidationsListComponent,
          ),
        title: 'Présidence · Validations',
      },
      {
        path: 'validations/:id',
        loadComponent: () =>
          import('./pages/validations/validation-detail.component').then(
            (m) => m.ValidationDetailComponent,
          ),
        title: 'Présidence · Détail validation',
      },
      {
        path: 'sessions',
        loadComponent: () =>
          import('./pages/sessions/sessions-list.component').then((m) => m.SessionsListComponent),
        title: 'Présidence · Séances',
      },
      {
        path: 'sessions/:id',
        loadComponent: () =>
          import('./pages/sessions/session-preside.component').then((m) => m.SessionPresideComponent),
        title: 'Présidence · Présider la séance',
      },
      {
        path: 'membership',
        loadComponent: () =>
          import('./pages/membership/membership-list.component').then((m) => m.MembershipListComponent),
        title: 'Présidence · Membres',
      },
      {
        path: 'invitations',
        loadComponent: () =>
          import('./pages/invitations/invitations-page.component').then(
            (m) => m.InvitationsPageComponent,
          ),
        title: 'Présidence · Invitations',
      },
      {
        path: 'presidency-transfer',
        loadComponent: () =>
          import('./pages/presidency-transfer/presidency-transfer-page.component').then(
            (m) => m.PresidencyTransferPageComponent,
          ),
        title: 'Présidence · Transfert',
      },
      {
        path: 'membership/:id',
        loadComponent: () =>
          import('./pages/membership/membership-detail.component').then(
            (m) => m.MembershipDetailComponent,
          ),
        title: 'Présidence · Dossier membre',
      },
      {
        path: 'extra-contributions',
        loadComponent: () =>
          import('./pages/extra-contrib/extra-contrib-page.component').then(
            (m) => m.ExtraContribComponent,
          ),
        title: 'Présidence · Cotisations extraordinaires',
      },
      {
        path: 'conflicts',
        loadComponent: () =>
          import('./pages/conflicts/conflicts-page.component').then((m) => m.ConflictsComponent),
        title: 'Présidence · Médiation conflits',
      },
      {
        path: 'cycle-close',
        loadComponent: () =>
          import('./pages/cycle-close/cycle-close-page.component').then(
            (m) => m.CycleClosePageComponent,
          ),
        title: 'Présidence · Clôture de cycle',
      },
      {
        path: 'votes',
        loadComponent: () =>
          import('./pages/votes/votes-page.component').then((m) => m.VotesPageComponent),
        title: 'Présidence · Votes',
      },
      {
        path: 'delegations',
        loadComponent: () =>
          import('./pages/delegations/delegations-page.component').then(
            (m) => m.DelegationsPageComponent,
          ),
        title: 'Présidence · Délégations',
      },
      {
        path: 'emergency',
        loadComponent: () =>
          import('./pages/emergency/emergency-blocks-page.component').then(
            (m) => m.EmergencyBlocksPageComponent,
          ),
        title: 'Présidence · Blocage d\'urgence',
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./pages/reports/reports-page.component').then((m) => m.ReportsPageComponent),
        title: 'Présidence · Rapports',
      },
      {
        path: 'sanctions',
        loadComponent: () =>
          import('./pages/sanctions/sanctions-review.component').then(
            (m) => m.SanctionsReviewComponent,
          ),
        title: 'Présidence · Sanctions',
      },
      {
        path: 'announcements',
        loadComponent: () =>
          import('./pages/announcements/announcements-page.component').then(
            (m) => m.AnnouncementsPageComponent,
          ),
        title: 'Présidence · Annonces',
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];

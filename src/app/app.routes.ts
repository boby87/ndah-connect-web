import { Routes } from '@angular/router';
import { authGuard } from './core/auth/guards/auth.guard';
import { noAuthGuard } from './core/auth/guards/no-auth.guard';
import { roleGuard } from './core/auth/guards/role.guard';
import { UserRole } from './core/enums/user-role.enum';

export const routes: Routes = [
  {
    path: 'auth',
    canActivate: [noAuthGuard],
    loadComponent: () => import('./layouts/auth-layout/auth-layout.component').then(m => m.AuthLayoutComponent),
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      { path: 'dashboard', loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES) },
      { path: 'tontines', loadChildren: () => import('./features/tontines/tontines.routes').then(m => m.TONTINE_ROUTES) },
      { path: 'members', loadChildren: () => import('./features/members/members.routes').then(m => m.MEMBER_ROUTES) },
      { path: 'sessions', loadChildren: () => import('./features/sessions/sessions.routes').then(m => m.SESSION_ROUTES) },
      { path: 'contributions', loadChildren: () => import('./features/contributions/contributions.routes').then(m => m.CONTRIBUTION_ROUTES) },
      { path: 'distributions', loadChildren: () => import('./features/distributions/distributions.routes').then(m => m.DISTRIBUTION_ROUTES) },
      { path: 'loans', loadChildren: () => import('./features/loans/loans.routes').then(m => m.LOAN_ROUTES) },
      {
        path: 'treasury',
        canActivate: [roleGuard],
        data: { roles: [UserRole.TREASURER, UserRole.PRESIDENT, UserRole.AUDITOR] },
        loadChildren: () => import('./features/treasury/treasury.routes').then(m => m.TREASURY_ROUTES),
      },
      { path: 'sanctions', loadChildren: () => import('./features/sanctions/sanctions.routes').then(m => m.SANCTION_ROUTES) },
      { path: 'votes', loadChildren: () => import('./features/votes/votes.routes').then(m => m.VOTE_ROUTES) },
      { path: 'documents', loadChildren: () => import('./features/documents/documents.routes').then(m => m.DOCUMENT_ROUTES) },
      { path: 'notifications', loadChildren: () => import('./features/notifications/notifications.routes').then(m => m.NOTIFICATION_ROUTES) },
      {
        path: 'audit',
        canActivate: [roleGuard],
        data: { roles: [UserRole.AUDITOR, UserRole.PRESIDENT] },
        loadChildren: () => import('./features/audit/audit.routes').then(m => m.AUDIT_ROUTES),
      },
      { path: 'social-aid', loadChildren: () => import('./features/social-aid/social-aid.routes').then(m => m.SOCIAL_AID_ROUTES) },
      { path: 'settings', loadChildren: () => import('./features/settings/settings.routes').then(m => m.SETTINGS_ROUTES) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { roles: [UserRole.PRESIDENT] },
    loadComponent: () => import('./layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES),
  },
  { path: '**', redirectTo: 'dashboard' },
];

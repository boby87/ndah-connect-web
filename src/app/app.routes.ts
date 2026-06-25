import { Routes } from '@angular/router';
import { authGuard } from './core/auth/guards/auth.guard';
import { noAuthGuard } from './core/auth/guards/no-auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    canActivate: [noAuthGuard],
    loadComponent: () =>
      import('./layouts/auth-layout/auth-layout.component').then((m) => m.AuthLayoutComponent),
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layouts/main-layout/main-layout.component').then((m) => m.MainLayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/member/pages/dashboard/member-dashboard.component').then(
            (m) => m.MemberDashboardComponent,
          ),
        title: 'Tableau de bord · TontineConnect',
      },
      {
        path: 'member',
        loadChildren: () =>
          import('./features/member/member.routes').then((m) => m.MEMBER_ROUTES),
      },
      {
        path: 'president',
        loadChildren: () =>
          import('./features/president/president.routes').then((m) => m.PRESIDENT_ROUTES),
      },
      {
        path: 'secretary',
        loadChildren: () =>
          import('./features/secretary/secretary.routes').then((m) => m.SECRETARY_ROUTES),
      },
      {
        path: 'treasurer',
        loadChildren: () =>
          import('./features/treasurer/treasurer.routes').then((m) => m.TREASURER_ROUTES),
      },
      {
        path: 'censor',
        loadChildren: () =>
          import('./features/censor/censor.routes').then((m) => m.CENSOR_ROUTES),
      },
      {
        path: 'auditor',
        loadChildren: () =>
          import('./features/auditor/auditor.routes').then((m) => m.AUDITOR_ROUTES),
      },
      {
        path: 'notifications',
        loadComponent: () =>
          import('./features/notifications/pages/notification-list/notification-list.component').then(
            (m) => m.NotificationListPageComponent,
          ),
        title: 'Notifications · TontineConnect',
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];

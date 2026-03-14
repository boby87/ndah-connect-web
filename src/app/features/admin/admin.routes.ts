import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
  },
  {
    path: 'users',
    loadComponent: () =>
      import('./pages/user-management/user-management.component').then(m => m.UserManagementComponent),
  },
  {
    path: 'tontines',
    loadComponent: () =>
      import('./pages/tontine-management/tontine-management.component').then(m => m.TontineManagementComponent),
  },
  {
    path: 'logs',
    loadComponent: () =>
      import('./pages/system-logs/system-logs.component').then(m => m.SystemLogsComponent),
  },
  {
    path: 'system-settings',
    loadComponent: () =>
      import('./pages/system-settings/system-settings.component').then(m => m.SystemSettingsComponent),
  },
];

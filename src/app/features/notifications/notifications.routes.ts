import { Routes } from '@angular/router';

export const NOTIFICATION_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/notification-list/notification-list.component').then(m => m.NotificationListComponent),
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./pages/notification-settings/notification-settings.component').then(m => m.NotificationSettingsComponent),
  },
];

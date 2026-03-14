import { Routes } from '@angular/router';

export const SETTINGS_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'profile',
    pathMatch: 'full',
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./pages/profile-settings/profile-settings.component').then(m => m.ProfileSettingsComponent),
  },
  {
    path: 'security',
    loadComponent: () =>
      import('./pages/security-settings/security-settings.component').then(m => m.SecuritySettingsComponent),
  },
  {
    path: 'notifications',
    loadComponent: () =>
      import('./pages/notification-preferences/notification-preferences.component').then(m => m.NotificationPreferencesComponent),
  },
  {
    path: 'tontine',
    loadComponent: () =>
      import('./pages/tontine-settings/tontine-settings.component').then(m => m.TontineSettingsComponent),
  },
  {
    path: 'appearance',
    loadComponent: () =>
      import('./pages/appearance-settings/appearance-settings.component').then(m => m.AppearanceSettingsComponent),
  },
];

import { Routes } from '@angular/router';

export const SESSION_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/session-list/session-list.component').then(m => m.SessionListComponent),
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./pages/session-create/session-create.component').then(m => m.SessionCreateComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/session-detail/session-detail.component').then(m => m.SessionDetailComponent),
  },
  {
    path: ':id/live',
    loadComponent: () =>
      import('./pages/session-live/session-live.component').then(m => m.SessionLiveComponent),
  },
];

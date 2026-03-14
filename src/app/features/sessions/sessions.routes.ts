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
    path: 'odj/:id',
    loadComponent: () =>
      import('./pages/odj-preparation/odj-preparation.component').then(m => m.OdjPreparationComponent),
  },
  {
    path: 'convocations/:id',
    loadComponent: () =>
      import('./pages/convocations/convocations.component').then(m => m.ConvocationsComponent),
  },
  {
    path: 'confirmations/:id',
    loadComponent: () =>
      import('./pages/confirmations/confirmations.component').then(m => m.ConfirmationsComponent),
  },
  {
    path: 'attendance/:id',
    loadComponent: () =>
      import('./pages/attendance/attendance.component').then(m => m.AttendanceComponent),
  },
  {
    path: 'pv-editor/:id',
    loadComponent: () =>
      import('./pages/pv-editor/pv-editor.component').then(m => m.PvEditorComponent),
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

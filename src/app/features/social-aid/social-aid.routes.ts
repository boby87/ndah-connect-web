import { Routes } from '@angular/router';

export const SOCIAL_AID_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/aid-list/aid-list.component').then(m => m.AidListComponent),
  },
  {
    path: 'request',
    loadComponent: () =>
      import('./pages/aid-request/aid-request.component').then(m => m.AidRequestComponent),
  },
  {
    path: 'extraordinary-contribution',
    loadComponent: () =>
      import('./pages/extraordinary-contribution/extraordinary-contribution.component').then(m => m.ExtraordinaryContributionComponent),
  },
];

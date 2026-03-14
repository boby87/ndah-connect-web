import { Routes } from '@angular/router';

export const CONTRIBUTION_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/contribution-list/contribution-list.component').then(m => m.ContributionListComponent),
  },
  {
    path: 'collect',
    loadComponent: () =>
      import('./pages/contribution-collect/contribution-collect.component').then(m => m.ContributionCollectComponent),
  },
  {
    path: 'my-contributions',
    loadComponent: () =>
      import('./pages/my-contributions/my-contributions.component').then(m => m.MyContributionsComponent),
  },
  {
    path: 'arrears',
    loadComponent: () =>
      import('./pages/arrears-list/arrears-list.component').then(m => m.ArrearsListComponent),
  },
];

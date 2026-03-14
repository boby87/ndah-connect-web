import { Routes } from '@angular/router';

export const DISTRIBUTION_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/distribution-list/distribution-list.component').then(m => m.DistributionListComponent),
  },
  {
    path: 'process',
    loadComponent: () =>
      import('./pages/distribution-process/distribution-process.component').then(m => m.DistributionProcessComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/distribution-detail/distribution-detail.component').then(m => m.DistributionDetailComponent),
  },
];

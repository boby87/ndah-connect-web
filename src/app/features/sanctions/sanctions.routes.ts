import { Routes } from '@angular/router';

export const SANCTION_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/sanction-list/sanction-list.component').then(m => m.SanctionListComponent),
  },
  {
    path: 'my-sanctions',
    loadComponent: () =>
      import('./pages/my-sanctions/my-sanctions.component').then(m => m.MySanctionsComponent),
  },
  {
    path: 'contestations',
    loadComponent: () =>
      import('./pages/contestations/contestations.component').then(m => m.ContestationsComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/sanction-detail/sanction-detail.component').then(m => m.SanctionDetailComponent),
  },
];

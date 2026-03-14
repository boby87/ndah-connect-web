import { Routes } from '@angular/router';

export const VOTE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/vote-list/vote-list.component').then(m => m.VoteListComponent),
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./pages/vote-create/vote-create.component').then(m => m.VoteCreateComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/vote-detail/vote-detail.component').then(m => m.VoteDetailComponent),
  },
  {
    path: ':id/results',
    loadComponent: () =>
      import('./pages/vote-results/vote-results.component').then(m => m.VoteResultsComponent),
  },
];

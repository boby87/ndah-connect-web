import { Routes } from '@angular/router';

export const TONTINE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/tontine-list/tontine-list.component').then(m => m.TontineListComponent),
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./pages/tontine-create/tontine-create.component').then(m => m.TontineCreateComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/tontine-detail/tontine-detail.component').then(m => m.TontineDetailComponent),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./pages/tontine-edit/tontine-edit.component').then(m => m.TontineEditComponent),
  },
];

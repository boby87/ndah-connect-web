import { Routes } from '@angular/router';

export const MEMBER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/member-list/member-list.component').then(m => m.MemberListComponent),
  },
  {
    path: 'adhesion-requests',
    loadComponent: () =>
      import('./pages/adhesion-requests/adhesion-requests.component').then(m => m.AdhesionRequestsComponent),
  },
  {
    path: 'resignations',
    loadComponent: () =>
      import('./pages/resignation-requests/resignation-requests.component').then(m => m.ResignationRequestsComponent),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./pages/member-profile/member-profile.component').then(m => m.MemberProfileComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/member-detail/member-detail.component').then(m => m.MemberDetailComponent),
  },
];

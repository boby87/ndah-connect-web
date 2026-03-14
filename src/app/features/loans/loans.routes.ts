import { Routes } from '@angular/router';

export const LOAN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/loan-list/loan-list.component').then(m => m.LoanListComponent),
  },
  {
    path: 'request',
    loadComponent: () =>
      import('./pages/loan-request/loan-request.component').then(m => m.LoanRequestComponent),
  },
  {
    path: 'my-loans',
    loadComponent: () =>
      import('./pages/my-loans/my-loans.component').then(m => m.MyLoansComponent),
  },
  {
    path: 'guarantor-requests',
    loadComponent: () =>
      import('./pages/guarantor-requests/guarantor-requests.component').then(m => m.GuarantorRequestsComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/loan-detail/loan-detail.component').then(m => m.LoanDetailComponent),
  },
];

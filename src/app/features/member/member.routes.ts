import { Routes } from '@angular/router';

export const MEMBER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/dashboard/member-dashboard.component').then(
        (m) => m.MemberDashboardComponent,
      ),
    title: 'Tableau de bord · TontineConnect',
  },
  {
    path: 'contributions',
    loadComponent: () =>
      import('./pages/contributions/my-contributions.component').then(
        (m) => m.MyContributionsComponent,
      ),
    title: 'Mes cotisations · TontineConnect',
  },
  {
    path: 'planning',
    loadComponent: () =>
      import('./pages/planning/my-planning.component').then((m) => m.MyPlanningComponent),
    title: 'Mon planning · TontineConnect',
  },
  {
    path: 'loans',
    loadComponent: () =>
      import('./pages/loans/my-loans.component').then((m) => m.MyLoansComponent),
    title: 'Mes prêts · TontineConnect',
  },
  {
    path: 'loan-simulator',
    loadComponent: () =>
      import('./pages/loan-simulator/loan-simulator.component').then(
        (m) => m.LoanSimulatorComponent,
      ),
    title: 'Simulateur de prêt · TontineConnect',
  },
  {
    path: 'create-tontine',
    loadComponent: () =>
      import('../tontines/pages/create/create-tontine.component').then(
        (m) => m.CreateTontineComponent,
      ),
    title: 'Créer une tontine · TontineConnect',
  },
];

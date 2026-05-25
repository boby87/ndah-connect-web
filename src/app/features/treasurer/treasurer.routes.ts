import { Routes } from '@angular/router';
import { roleGuard } from '../../core/auth/guards/role.guard';
import { UserRole } from '../../core/enums/user-role.enum';

export const TREASURER_ROUTES: Routes = [
  {
    path: '',
    canActivate: [roleGuard],
    data: { roles: [UserRole.TREASURER] },
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/treasurer-dashboard.component').then(
            (m) => m.TreasurerDashboardComponent,
          ),
        title: 'Trésorerie · Tableau de bord',
      },
      {
        path: 'contributions',
        loadComponent: () =>
          import('./pages/contributions/contributions-page.component').then(
            (m) => m.ContributionsCollectComponent,
          ),
        title: 'Trésorerie · Cotisations',
      },
      {
        path: 'mobile-money',
        loadComponent: () =>
          import('./pages/mobile-money/mobile-money-page.component').then(
            (m) => m.MobileMoneyPageComponent,
          ),
        title: 'Trésorerie · Mobile Money',
      },
      {
        path: 'cashboxes',
        loadComponent: () =>
          import('./pages/cashboxes/cashboxes-page.component').then(
            (m) => m.CashBoxesPageComponent,
          ),
        title: 'Trésorerie · Caisses',
      },
      {
        path: 'transfers',
        loadComponent: () =>
          import('./pages/transfers/transfers-page.component').then(
            (m) => m.TransfersPageComponent,
          ),
        title: 'Trésorerie · Transferts',
      },
      {
        path: 'expenses',
        loadComponent: () =>
          import('./pages/expenses/expenses-page.component').then((m) => m.ExpensesPageComponent),
        title: 'Trésorerie · Dépenses',
      },
      {
        path: 'distributions',
        loadComponent: () =>
          import('./pages/distributions/distributions-page.component').then(
            (m) => m.DistributionsPageComponent,
          ),
        title: 'Trésorerie · Distribution cagnotte',
      },
      {
        path: 'loans',
        loadComponent: () =>
          import('./pages/loans/loans-page.component').then((m) => m.TreasurerLoansPageComponent),
        title: 'Trésorerie · Prêts',
      },
      {
        path: 'sanctions',
        loadComponent: () =>
          import('./pages/sanctions/sanctions-page.component').then(
            (m) => m.TreasurerSanctionsPageComponent,
          ),
        title: 'Trésorerie · Sanctions',
      },
      {
        path: 'bilan',
        loadComponent: () =>
          import('./pages/bilan/bilan-page.component').then((m) => m.BilanPageComponent),
        title: 'Trésorerie · Bilan de séance',
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./pages/reports/reports-page.component').then(
            (m) => m.TreasurerReportsPageComponent,
          ),
        title: 'Trésorerie · Rapports',
      },
      {
        path: 'reconciliation',
        redirectTo: 'mobile-money',
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];

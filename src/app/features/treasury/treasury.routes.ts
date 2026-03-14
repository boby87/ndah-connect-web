import { Routes } from '@angular/router';

export const TREASURY_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/treasury-overview/treasury-overview.component').then(m => m.TreasuryOverviewComponent),
  },
  {
    path: 'cash-boxes',
    loadComponent: () =>
      import('./pages/cash-boxes/cash-boxes.component').then(m => m.CashBoxesComponent),
  },
  {
    path: 'transactions',
    loadComponent: () =>
      import('./pages/transactions/transactions.component').then(m => m.TransactionsComponent),
  },
  {
    path: 'transfer',
    loadComponent: () =>
      import('./pages/transfer-funds/transfer-funds.component').then(m => m.TransferFundsComponent),
  },
  {
    path: 'reports',
    loadComponent: () =>
      import('./pages/financial-reports/financial-reports.component').then(m => m.FinancialReportsComponent),
  },
];

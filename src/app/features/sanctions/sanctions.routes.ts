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
    path: 'apply',
    loadComponent: () =>
      import('./pages/sanction-apply/sanction-apply.component').then(m => m.SanctionApplyComponent),
  },
  {
    path: 'auto-confirm',
    loadComponent: () =>
      import('./pages/sanction-auto-confirm/sanction-auto-confirm.component').then(m => m.SanctionAutoConfirmComponent),
  },
  {
    path: 'unpaid',
    loadComponent: () =>
      import('./pages/unpaid-sanctions/unpaid-sanctions.component').then(m => m.UnpaidSanctionsComponent),
  },
  {
    path: 'send-reminders',
    loadComponent: () =>
      import('./pages/send-reminders/send-reminders.component').then(m => m.SendRemindersComponent),
  },
  {
    path: 'report',
    loadComponent: () =>
      import('./pages/censor-report/censor-report.component').then(m => m.CensorReportComponent),
  },
  {
    path: 'communication',
    loadComponent: () =>
      import('./pages/censor-communication/censor-communication.component').then(m => m.CensorCommunicationComponent),
  },
  {
    path: 'attendance-modifications',
    loadComponent: () =>
      import('./pages/attendance-modifications/attendance-modifications.component').then(m => m.AttendanceModificationsComponent),
  },
  {
    path: 'justify-absence',
    loadComponent: () =>
      import('./pages/justify-absence/justify-absence.component').then(m => m.JustifyAbsenceComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/sanction-detail/sanction-detail.component').then(m => m.SanctionDetailComponent),
  },
];

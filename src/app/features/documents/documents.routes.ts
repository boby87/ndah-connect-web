import { Routes } from '@angular/router';

export const DOCUMENT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/document-list/document-list.component').then(m => m.DocumentListComponent),
  },
  {
    path: 'upload',
    loadComponent: () =>
      import('./pages/document-upload/document-upload.component').then(m => m.DocumentUploadComponent),
  },
  {
    path: 'archives',
    loadComponent: () =>
      import('./pages/archives/archives.component').then(m => m.ArchivesComponent),
  },
  {
    path: 'reports',
    loadComponent: () =>
      import('./pages/reports/reports.component').then(m => m.ReportsComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/document-viewer/document-viewer.component').then(m => m.DocumentViewerComponent),
  },
];

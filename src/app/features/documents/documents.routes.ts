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
    path: ':id',
    loadComponent: () =>
      import('./pages/document-viewer/document-viewer.component').then(m => m.DocumentViewerComponent),
  },
];

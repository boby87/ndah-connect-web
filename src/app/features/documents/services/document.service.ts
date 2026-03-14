import { Injectable, inject } from '@angular/core';
import { DocumentApiService } from '../../../core/api/services/document-api.service';

@Injectable({ providedIn: 'root' })
export class DocumentService {
  private readonly api = inject(DocumentApiService);
}

import { Injectable, inject } from '@angular/core';
import { SanctionApiService } from '../../../core/api/services/sanction-api.service';

@Injectable({ providedIn: 'root' })
export class SanctionService {
  private readonly api = inject(SanctionApiService);
}

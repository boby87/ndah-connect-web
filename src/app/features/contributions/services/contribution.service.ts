import { Injectable, inject } from '@angular/core';
import { ContributionApiService } from '../../../core/api/services/contribution-api.service';

@Injectable({ providedIn: 'root' })
export class ContributionService {
  private readonly api = inject(ContributionApiService);
}

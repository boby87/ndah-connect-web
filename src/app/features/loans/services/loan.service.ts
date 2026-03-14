import { Injectable, inject } from '@angular/core';
import { LoanApiService } from '../../../core/api/services/loan-api.service';

@Injectable({ providedIn: 'root' })
export class LoanService {
  private readonly api = inject(LoanApiService);
}

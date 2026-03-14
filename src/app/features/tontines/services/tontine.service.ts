import { Injectable, inject } from '@angular/core';
import { TontineApiService } from '../../../core/api/services/tontine-api.service';

@Injectable({ providedIn: 'root' })
export class TontineService {
  private readonly api = inject(TontineApiService);
}

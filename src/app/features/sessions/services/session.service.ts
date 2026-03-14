import { Injectable, inject } from '@angular/core';
import { SessionApiService } from '../../../core/api/services/session-api.service';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly api = inject(SessionApiService);
}

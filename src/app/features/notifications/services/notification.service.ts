import { Injectable, inject } from '@angular/core';
import { NotificationApiService } from '../../../core/api/services/notification-api.service';

@Injectable({ providedIn: 'root' })
export class FeatureNotificationService {
  private readonly api = inject(NotificationApiService);
}

import { Injectable, inject } from '@angular/core';
import { MemberApiService } from '../../../core/api/services/member-api.service';

@Injectable({ providedIn: 'root' })
export class MemberService {
  private readonly api = inject(MemberApiService);
}

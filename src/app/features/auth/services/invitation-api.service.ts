import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { API_CONFIG } from '../../../core/config/api.config';
import type { ApiResponse } from '../../../core/api/models/api-response.model';
import type { AuthSession } from '../../../shared/models/entities/user.model';
import type { UserRole } from '../../../core/enums/user-role.enum';

export interface InvitationPreview {
  tontineName: string | null;
  invitedByFullName: string;
  proposedRole: UserRole;
  candidateFullName: string;
  candidatePhone: string;
  candidateEmail: string | null;
  expiresAt: string;
  expired: boolean;
  alreadyAccepted: boolean;
}

export interface InvitationAcceptResult {
  session: AuthSession;
  memberId: string;
  tontineId: string;
  tontineName: string;
}

@Injectable({ providedIn: 'root' })
export class InvitationApiService {
  private readonly http = inject(HttpClient);

  async preview(token: string): Promise<InvitationPreview> {
    const res = await firstValueFrom(
      this.http.get<ApiResponse<InvitationPreview>>(
        `${API_CONFIG.baseUrl}/auth/invitations/${token}/preview`,
      ),
    );
    return res.data;
  }

  async accept(token: string, password: string): Promise<InvitationAcceptResult> {
    const res = await firstValueFrom(
      this.http.post<ApiResponse<InvitationAcceptResult>>(
        `${API_CONFIG.baseUrl}/auth/invitations/${token}/accept`,
        { password },
      ),
    );
    return res.data;
  }
}

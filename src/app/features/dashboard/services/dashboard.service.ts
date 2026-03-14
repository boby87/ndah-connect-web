import { Injectable, inject } from '@angular/core';
import { TontineApiService } from '../../../core/api/services/tontine-api.service';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly tontineApi = inject(TontineApiService);

  async getStats(tontineId: string): Promise<DashboardStats> {
    // Placeholder — would aggregate multiple API calls
    return {
      activeMembers: 0,
      totalBalance: 0,
      nextSession: null,
      pendingContributions: 0,
    };
  }
}

export interface DashboardStats {
  activeMembers: number;
  totalBalance: number;
  nextSession: { date: string; location?: string } | null;
  pendingContributions: number;
}

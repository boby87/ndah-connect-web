import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiListResponse, ApiResponse, PaginationParams } from '../models';
import { Loan } from '../../../shared/models/entities';

@Injectable({ providedIn: 'root' })
export class LoanApiService {
  private readonly api = inject(ApiService);

  getAll(tontineId: string, params?: PaginationParams): Observable<ApiListResponse<Loan>> {
    return this.api.get(`tontines/${tontineId}/loans`, params as Record<string, string | number>);
  }

  getById(id: string): Observable<ApiResponse<Loan>> {
    return this.api.get(`loans/${id}`);
  }

  request(data: Partial<Loan>): Observable<ApiResponse<Loan>> {
    return this.api.post('loans', data);
  }

  respondAsGuarantor(loanId: string, accept: boolean): Observable<ApiResponse<void>> {
    return this.api.post(`loans/${loanId}/guarantor-response`, { accept });
  }

  approveAsAuditor(loanId: string, data: { approved: boolean; comment?: string }): Observable<ApiResponse<void>> {
    return this.api.post(`loans/${loanId}/auditor-approval`, data);
  }

  approveAsPresident(loanId: string, data: { approved: boolean; comment?: string }): Observable<ApiResponse<void>> {
    return this.api.post(`loans/${loanId}/president-approval`, data);
  }

  disburse(loanId: string, data: { method: string; reference?: string }): Observable<ApiResponse<void>> {
    return this.api.post(`loans/${loanId}/disburse`, data);
  }

  repay(loanId: string, data: { amount: number; method: string; reference?: string }): Observable<ApiResponse<void>> {
    return this.api.post(`loans/${loanId}/repay`, data);
  }
}

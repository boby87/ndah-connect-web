import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiListResponse, ApiResponse } from '../models';
import { TontineDocument } from '../../../shared/models/entities';

@Injectable({ providedIn: 'root' })
export class DocumentApiService {
  private readonly api = inject(ApiService);

  getAll(tontineId: string): Observable<ApiListResponse<TontineDocument>> {
    return this.api.get(`tontines/${tontineId}/documents`);
  }

  getById(id: string): Observable<ApiResponse<TontineDocument>> {
    return this.api.get(`documents/${id}`);
  }

  upload(tontineId: string, formData: FormData): Observable<ApiResponse<TontineDocument>> {
    return this.api.upload(`tontines/${tontineId}/documents`, formData);
  }

  delete(id: string): Observable<ApiResponse<void>> {
    return this.api.delete(`documents/${id}`);
  }
}

import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, filter, firstValueFrom, map } from 'rxjs';

import { API_CONFIG } from '../config/api.config';
import type { ApiResponse } from '../api/models/api-response.model';

export interface UploadedFile {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  url?: string;
  uploadedAt: string;
  uploadedByUserId?: string;
}

export type UploadProgress =
  | { kind: 'progress'; loaded: number; total: number; percent: number }
  | { kind: 'done'; file: UploadedFile };

@Injectable({ providedIn: 'root' })
export class FileUploadService {
  private readonly http = inject(HttpClient);
  private readonly base = `${API_CONFIG.baseUrl}/files`;

  async upload(file: File, metadata?: Record<string, string>): Promise<UploadedFile> {
    const formData = this.buildFormData(file, metadata);
    const response = await firstValueFrom(
      this.http.post<ApiResponse<UploadedFile>>(this.base, formData),
    );
    return response.data;
  }

  uploadWithProgress(file: File, metadata?: Record<string, string>): Observable<UploadProgress> {
    const formData = this.buildFormData(file, metadata);
    return this.http
      .post<ApiResponse<UploadedFile>>(this.base, formData, {
        reportProgress: true,
        observe: 'events',
      })
      .pipe(
        map((event) => this.mapProgressEvent(event)),
        filter((evt): evt is UploadProgress => evt !== null),
      );
  }

  async getMetadata(id: string): Promise<UploadedFile> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<UploadedFile>>(`${this.base}/${id}`),
    );
    return response.data;
  }

  async download(id: string): Promise<Blob> {
    return firstValueFrom(
      this.http.get(`${this.base}/${id}/download`, { responseType: 'blob' }),
    );
  }

  buildDownloadUrl(id: string): string {
    return `${this.base}/${id}/download`;
  }

  async delete(id: string): Promise<void> {
    await firstValueFrom(this.http.delete<ApiResponse<void>>(`${this.base}/${id}`));
  }

  private buildFormData(file: File, metadata?: Record<string, string>): FormData {
    const formData = new FormData();
    formData.append('file', file, file.name);
    if (metadata) {
      for (const [key, value] of Object.entries(metadata)) {
        formData.append(key, value);
      }
    }
    return formData;
  }

  private mapProgressEvent(event: HttpEvent<ApiResponse<UploadedFile>>): UploadProgress | null {
    if (event.type === HttpEventType.UploadProgress) {
      const total = event.total ?? event.loaded;
      const percent = total > 0 ? Math.round((event.loaded / total) * 100) : 0;
      return { kind: 'progress', loaded: event.loaded, total, percent };
    }
    if (event.type === HttpEventType.Response && event.body) {
      return { kind: 'done', file: event.body.data };
    }
    return null;
  }
}

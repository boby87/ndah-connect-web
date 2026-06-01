import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';

import { FileUploadService, type UploadedFile } from './file-upload.service';
import { API_CONFIG } from '../config/api.config';

const BASE = `${API_CONFIG.baseUrl}/files`;

const uploaded: UploadedFile = {
  id: 'f1',
  fileName: 'doc.pdf',
  fileSize: 1234,
  mimeType: 'application/pdf',
  uploadedAt: '2026-01-01T00:00:00Z',
};

describe('FileUploadService', () => {
  let service: FileUploadService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        FileUploadService,
      ],
    });
    service = TestBed.inject(FileUploadService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('POST /files envoie un FormData et retourne le fichier', async () => {
    const file = new File(['hello'], 'doc.pdf', { type: 'application/pdf' });
    const promise = service.upload(file, { category: 'MINUTES' });

    const req = httpMock.expectOne(BASE);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBeInstanceOf(FormData);
    const body = req.request.body as FormData;
    expect(body.get('file')).toBeTruthy();
    expect(body.get('category')).toBe('MINUTES');

    req.flush({ data: uploaded, timestamp: '' });
    expect(await promise).toEqual(uploaded);
  });

  it('GET /files/:id renvoie les métadonnées', async () => {
    const promise = service.getMetadata('f1');
    const req = httpMock.expectOne(`${BASE}/f1`);
    expect(req.request.method).toBe('GET');
    req.flush({ data: uploaded, timestamp: '' });
    expect(await promise).toEqual(uploaded);
  });

  it('GET /files/:id/download renvoie un Blob', async () => {
    const promise = service.download('f1');
    const req = httpMock.expectOne(`${BASE}/f1/download`);
    expect(req.request.method).toBe('GET');
    expect(req.request.responseType).toBe('blob');
    const blob = new Blob(['payload'], { type: 'application/pdf' });
    req.flush(blob);
    const result = await promise;
    expect(result).toBeInstanceOf(Blob);
    expect(result.size).toBe(blob.size);
  });

  it('buildDownloadUrl produit une URL absolue', () => {
    expect(service.buildDownloadUrl('f1')).toBe(`${BASE}/f1/download`);
  });

  it('DELETE /files/:id', async () => {
    const promise = service.delete('f1');
    const req = httpMock.expectOne(`${BASE}/f1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ data: null, timestamp: '' });
    await promise;
  });
});

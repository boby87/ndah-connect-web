export interface TontineDocument {
  id: string;
  tontineId: string;
  sessionId?: string;
  type: 'agenda' | 'minutes' | 'report' | 'rules' | 'receipt' | 'other';
  title: string;
  description?: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: string;
  createdAt: string;
}

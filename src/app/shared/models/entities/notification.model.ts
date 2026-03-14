export interface Notification {
  id: string;
  userId: string;
  tontineId?: string;
  type: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

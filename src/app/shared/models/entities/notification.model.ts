export type NotificationKind = 'info' | 'success' | 'warning' | 'error';

export type NotificationCategory =
  | 'CONTRIBUTION'
  | 'LOAN'
  | 'SESSION'
  | 'SANCTION'
  | 'VOTE'
  | 'GENERAL';

export interface AppNotification {
  id: string;
  userId: string;
  tontineId?: string;
  kind: NotificationKind;
  category: NotificationCategory;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

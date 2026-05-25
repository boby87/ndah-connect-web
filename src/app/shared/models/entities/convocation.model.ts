export type ConvocationChannel = 'IN_APP' | 'SMS' | 'EMAIL' | 'WHATSAPP';
export type ConvocationStatus = 'DRAFT' | 'SCHEDULED' | 'SENT';

export const CONVOCATION_CHANNEL_LABELS: Record<ConvocationChannel, string> = {
  IN_APP: 'Notification in-app',
  SMS: 'SMS',
  EMAIL: 'Email',
  WHATSAPP: 'WhatsApp',
};

export interface Convocation {
  id: string;
  tontineId: string;
  sessionId: string;
  sessionNumber: number;
  scheduledFor: string;
  channels: ConvocationChannel[];
  audienceMemberIds: string[];
  includeCandidates: boolean;
  reminders: { offsetHoursBefore: number }[];
  message: string;
  status: ConvocationStatus;
  sentAt?: string;
  scheduledAt?: string;
  totalRecipients: number;
  totalDelivered: number;
  totalFailed: number;
}

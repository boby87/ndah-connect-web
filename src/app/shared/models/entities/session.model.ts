import { SessionStatus } from '../../../core/enums';
import { Member } from './member.model';

export interface Session {
  id: string;
  cycleId: string;
  tontineId: string;
  number: number;
  sessionType: 'ordinary' | 'extraordinary';
  scheduledDate: string;
  scheduledTime: string;
  location?: string;
  locationCoordinates?: { lat: number; lng: number };
  beneficiaryId?: string;
  beneficiary?: Member;
  status: SessionStatus;
  agendaValidated: boolean;
  agendaDocumentId?: string;
  minutesDocumentId?: string;
  openedAt?: string;
  closedAt?: string;
  openedBy?: string;
  quorumReached?: boolean;
  createdAt: string;
}

export type EventType = 'birth' | 'marriage' | 'bereavement' | 'illness' | 'other';

export interface SolidityEvent {
  id: string;
  eventType: EventType;
  memberId: string;
  memberName: string;
  eventDate: Date;
  location: string;
  description?: string;
  estimatedBenefit: number;
  totalBenefit: number;
  contributions: Array<{
    memberId: string;
    memberName: string;
    amount: number;
    date: Date;
  }>;
  documents?: string[];
  status: 'pending' | 'approved' | 'completed';
  createdDate: Date;
}


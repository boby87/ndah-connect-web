export type MinutesDraftStatus =
  | 'DRAFT'
  | 'SECRETARY_SIGNED'
  | 'PRESIDENT_SIGNED'
  | 'PUBLISHED'
  | 'CHANGES_REQUESTED';

export interface MinutesSection {
  key: string;
  title: string;
  content: string;
  required: boolean;
}

export interface MinutesDraft {
  id: string;
  tontineId: string;
  sessionId: string;
  sessionNumber: number;
  sessionDate: string;
  attendanceSummary: {
    present: number;
    late: number;
    absent: number;
    excused: number;
    total: number;
    quorumReached: boolean;
  };
  financialSummary: {
    totalCollected: number;
    totalDistributed: number;
    beneficiaryFullName?: string;
  };
  sections: MinutesSection[];
  attachments: { id: string; name: string }[];
  status: MinutesDraftStatus;
  secretarySignedAt?: string;
  presidentSignedAt?: string;
  publishedAt?: string;
  presidentComment?: string;
  createdAt: string;
  updatedAt: string;
}

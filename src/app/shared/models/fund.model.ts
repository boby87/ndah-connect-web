export interface Fund {
  id: string;
  name: string;
  description: string;
  totalAmount: number;
  currentAmount: number;
  interestRate: number;
  frequency: 'monthly' | 'quarterly' | 'annually';
  createdDate: Date;
  members: string[];
  status: 'active' | 'closed';
}

export interface SolidityFund extends Fund {
  recentContributions: Array<{
    memberId: string;
    memberName: string;
    amount: number;
    date: Date;
    type: 'cotisation' | 'versement';
  }>;
}


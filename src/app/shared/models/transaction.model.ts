export interface Transaction {
  id: string;
  date: Date;
  description: string;
  type: 'deposit' | 'withdrawal' | 'loan' | 'repayment' | 'fine' | 'interest';
  amount: number;
  memberId: string;
  memberName: string;
  category: 'cotisation' | 'pret' | 'remboursement' | 'amende' | 'tontine';
  status: 'pending' | 'completed' | 'failed';
  reference?: string;
}

export interface TransactionHistory {
  transactions: Transaction[];
  totalIncome: number;
  totalExpense: number;
  balance: number;
}


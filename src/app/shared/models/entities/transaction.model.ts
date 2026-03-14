export interface Transaction {
  id: string;
  tontineId: string;
  cashBoxId: string;
  type: 'credit' | 'debit';
  category: string;
  amount: number;
  description: string;
  reference?: string;
  performedBy: string;
  createdAt: string;
}

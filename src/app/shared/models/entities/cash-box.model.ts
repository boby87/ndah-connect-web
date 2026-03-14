export interface CashBox {
  id: string;
  tontineId: string;
  type: 'main' | 'emergency' | 'operational';
  name: string;
  balance: number;
  createdAt: string;
}

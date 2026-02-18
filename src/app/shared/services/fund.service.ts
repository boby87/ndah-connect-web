import { Injectable } from '@angular/core';
import { signal, computed, Signal } from '@angular/core';
import { Fund, SolidityFund } from '../models';

@Injectable({
  providedIn: 'root'
})
export class FundService {
  private fundsSignal = signal<Fund[]>([
    {
      id: '1',
      name: 'Tontine Principale',
      description: 'Fonds de tontine hebdomadaire de l\'association',
      totalAmount: 12450000,
      currentAmount: 12450000,
      interestRate: 0,
      frequency: 'monthly',
      createdDate: new Date('2020-01-15'),
      members: ['1', '2', '3'],
      status: 'active'
    },
    {
      id: '2',
      name: 'Fonds de Solidarité',
      description: 'Fonds pour l\'assistance mutuelle',
      totalAmount: 2450000,
      currentAmount: 2450000,
      interestRate: 0,
      frequency: 'monthly',
      createdDate: new Date('2021-06-20'),
      members: ['1', '2', '3'],
      status: 'active'
    }
  ]);

  private selectedFundSignal = signal<Fund | null>(null);

  public funds: Signal<Fund[]> = this.fundsSignal.asReadonly();
  public totalFunds = computed(() =>
    this.fundsSignal().reduce((sum, f) => sum + f.currentAmount, 0)
  );
  public selectedFund = this.selectedFundSignal.asReadonly();
  public activeFunds = computed(() =>
    this.fundsSignal().filter(f => f.status === 'active')
  );

  constructor() {}

  getFundById(id: string): Signal<SolidityFund | null> {
    return computed(() => {
      const fund = this.fundsSignal().find(f => f.id === id);
      if (!fund) return null;

      return {
        ...fund,
        recentContributions: [
          {
            memberId: '1',
            memberName: 'Jean Tagne',
            amount: 50000,
            date: new Date('2024-05-12'),
            type: 'cotisation'
          },
          {
            memberId: '2',
            memberName: 'Marie Kamga',
            amount: 50000,
            date: new Date('2024-05-10'),
            type: 'cotisation'
          }
        ]
      } as SolidityFund;
    });
  }

  selectFund(fund: Fund) {
    this.selectedFundSignal.set(fund);
  }

  addFund(fund: Omit<Fund, 'id'>) {
    const newFund: Fund = {
      ...fund,
      id: String(Math.max(...this.fundsSignal().map(f => parseInt(f.id)), 0) + 1)
    };
    this.fundsSignal.update(funds => [...funds, newFund]);
  }

  updateFund(id: string, updates: Partial<Fund>) {
    this.fundsSignal.update(funds =>
      funds.map(f => f.id === id ? { ...f, ...updates } : f)
    );
  }
}


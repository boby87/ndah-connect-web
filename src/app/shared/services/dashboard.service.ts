import { Injectable } from '@angular/core';
import { signal, computed } from '@angular/core';
import { DashboardStats, DashboardMetric } from '../models';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private statsSignal = signal<DashboardStats>({
    totalMembers: {
      label: 'Total des Membres',
      value: 1240,
      trend: 12,
      trendLabel: 'Membres à l\'inscriptions',
      icon: 'users',
      color: 'blue'
    },
    totalFunds: {
      label: 'Solde Total de Caisse',
      value: 12450000,
      currency: 'FCFA',
      trend: -2.5,
      trendLabel: 'ce mois',
      icon: 'wallet',
      color: 'green'
    },
    activeLoans: {
      label: 'Montant Total des Prêts en Cours',
      value: 4200000,
      currency: 'FCFA',
      icon: 'trending-up',
      color: 'orange'
    },
    interestRate: {
      label: 'Intérêts Générés',
      value: 155000,
      currency: 'FCFA',
      trend: -12.4,
      trendLabel: '(mois)',
      icon: 'percent',
      color: 'purple'
    }
  });

  public stats = this.statsSignal.asReadonly();

  public primaryMetrics = computed(() => [
    this.statsSignal().totalMembers,
    this.statsSignal().totalFunds,
    this.statsSignal().activeLoans,
    this.statsSignal().interestRate
  ]);

  constructor() {}

  updateStat(key: keyof DashboardStats, updates: Partial<DashboardMetric>) {
    this.statsSignal.update(stats => ({
      ...stats,
      [key]: {
        ...stats[key],
        ...updates
      }
    }));
  }
}


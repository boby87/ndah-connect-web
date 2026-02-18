import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent, ButtonComponent, StatusBadgeComponent } from '../../shared/components';
import { FundService } from '../../shared/services';

@Component({
  selector: 'app-funds',
  standalone: true,
  imports: [CommonModule, CardComponent, ButtonComponent, StatusBadgeComponent],
  template: `
    <div class="space-y-8 pb-8">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 class="text-4xl font-bold text-gray-900">Gestion des Prêts & Épargne</h1>
          <p class="text-gray-600 mt-2 text-lg">Supervision financière et transparence des fonds de l'association</p>
        </div>
        <app-button label="Nouveau Prêt" variant="primary" size="lg" (clickEvent)="openNewFund()"></app-button>
      </div>

      <!-- Funds Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        @for (fund of fundService.funds(); track fund.id) {
          <app-card [title]="fund.name">
            <div class="space-y-5">
              <div class="flex justify-between items-center">
                <span class="text-gray-600 font-medium">Solde actuel:</span>
                <span class="text-3xl font-bold text-blue-600">{{ formatCurrency(fund.currentAmount) }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600 font-medium">Solde total:</span>
                <span class="text-lg font-semibold text-gray-900">{{ formatCurrency(fund.totalAmount) }}</span>
              </div>

              <div>
                <div class="w-full bg-gray-200 rounded-full h-3">
                  <div
                    class="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300"
                    [style.width.%]="(fund.currentAmount / fund.totalAmount * 100)">
                  </div>
                </div>
                <p class="text-xs text-gray-500 mt-2">{{ ((fund.currentAmount / fund.totalAmount) * 100).toFixed(0) }}% disponible</p>
              </div>

              <div class="bg-gray-50 rounded-lg p-3 space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Fréquence:</span>
                  <span class="font-semibold text-gray-900">{{ formatFrequency(fund.frequency) }}</span>
                </div>
              </div>

              <div class="flex justify-between items-center pt-3 border-t border-gray-100">
                <app-status-badge [status]="fund.status" [label]="formatStatus(fund.status)"></app-status-badge>
                <app-button label="Détails" variant="secondary" size="sm" (clickEvent)="viewFund(fund)"></app-button>
              </div>
            </div>
          </app-card>
        }
      </div>

      <!-- Recent Contributions -->
      <app-card title="Contributions Récentes">
        <div class="space-y-6">
          @for (fund of fundService.activeFunds(); track fund.id) {
            <div>
              <p class="font-semibold text-gray-900 mb-4">{{ fund.name }}</p>
              <div class="space-y-3">
                @for (contrib of getContributions(fund.id); track contrib.memberId) {
                  <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <span class="text-gray-700 font-medium">{{ contrib.memberName }}</span>
                    <span class="font-semibold text-green-600">+{{ formatCurrency(contrib.amount) }}</span>
                  </div>
                }
                @if (getContributions(fund.id).length === 0) {
                  <p class="text-gray-500 text-center py-4">Aucune contribution récente</p>
                }
              </div>
            </div>
          }
        </div>
      </app-card>
    </div>
  `,
  styles: []
})
export class FundsComponent {
  fundService = inject(FundService);

  viewFund(fund: any) {
    console.log('View fund:', fund.id);
  }

  openNewFund() {
    console.log('Open new fund dialog');
  }

  getContributions(fundId: string) {
    const fund = this.fundService.getFundById(fundId)();
    return fund?.recentContributions || [];
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      maximumFractionDigits: 0
    }).format(value);
  }

  formatFrequency(freq: string): string {
    const frequencies: Record<string, string> = {
      monthly: 'Mensuel',
      quarterly: 'Trimestriel',
      annually: 'Annuel'
    };
    return frequencies[freq] || freq;
  }

  formatStatus(status: string): string {
    const statuses: Record<string, string> = {
      active: 'Actif',
      closed: 'Fermé'
    };
    return statuses[status] || status;
  }
}


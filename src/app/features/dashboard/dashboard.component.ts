import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetricCardComponent, DataTableComponent, CardComponent, StatusBadgeComponent } from '../../shared/components';
import { DashboardService, MemberService, FundService, EventService } from '../../shared/services';
import { TableColumn } from '../../shared/components/data-table.component';
import { Member } from '../../shared/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MetricCardComponent, DataTableComponent, CardComponent, StatusBadgeComponent],
  template: `
    <div class="space-y-8 pb-8">
      <!-- Header -->
      <div>
        <h1 class="text-4xl font-bold text-gray-900">Tableau de Bord</h1>
        <p class="text-gray-600 mt-2 text-lg">Supervision financière et transparence des fonds de l'association.</p>
      </div>

      <!-- Primary Metrics Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        @for (metric of dashboardService.primaryMetrics(); track metric.label) {
          <app-metric-card [metric]="metric"></app-metric-card>
        }
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Active Loans Section -->
        <div class="lg:col-span-2">
          <app-card title="Suivi des Prêts Actifs">
            <app-data-table
              [data]="memberService.members()"
              [columns]="loanColumns"
              [actions]="loanActions">
            </app-data-table>
          </app-card>
        </div>

        <!-- Active Funds Section -->
        <app-card title="Fonds Actifs" class="h-full">
          <div class="space-y-4">
            @for (fund of fundService.activeFunds(); track fund.id) {
              <div class="pb-4 border-b border-gray-100 last:border-0">
                <div class="flex justify-between items-start mb-3">
                  <p class="font-semibold text-gray-900">{{ fund.name }}</p>
                  <p class="text-lg font-bold text-blue-600">{{ formatCurrency(fund.currentAmount) }}</p>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    class="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-300"
                    [style.width.%]="(fund.currentAmount / fund.totalAmount * 100)">
                  </div>
                </div>
                <p class="text-xs text-gray-500 mt-2">{{ getProgressText(fund.currentAmount, fund.totalAmount) }}</p>
              </div>
            }
          </div>
        </app-card>
      </div>

      <!-- Secondary Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Recent Members -->
        <app-card title="Membres Récents">
          <div class="space-y-4">
            @for (member of getRecentMembers(); track member.id) {
              <div class="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 px-2 py-2 rounded-lg transition-colors">
                <div class="flex-1">
                  <p class="font-semibold text-gray-900">{{ member.firstName }} {{ member.lastName }}</p>
                  <p class="text-sm text-gray-500">Depuis {{ formatDate(member.joinDate) }}</p>
                </div>
                <app-status-badge [status]="member.status" [label]="formatStatus(member.status)"></app-status-badge>
              </div>
            }
            @if (memberService.members().length === 0) {
              <p class="text-gray-500 text-center py-4">Aucun membre récent</p>
            }
          </div>
        </app-card>

        <!-- Pending Events -->
        <app-card title="Événements en Attente">
          <div class="space-y-4">
            @for (event of getPendingEvents(); track event.id) {
              <div class="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 px-2 py-2 rounded-lg transition-colors">
                <div class="flex-1">
                  <p class="font-semibold text-gray-900">{{ event.memberName }}</p>
                  <p class="text-sm text-gray-500">{{ getEventTypeLabel(event.eventType) }}</p>
                </div>
                <app-status-badge [status]="event.status" [label]="formatStatus(event.status)"></app-status-badge>
              </div>
            }
            @if (getPendingEvents().length === 0) {
              <p class="text-gray-500 text-center py-4">Aucun événement en attente</p>
            }
          </div>
        </app-card>
      </div>
    </div>
  `,
  styles: []
})
export class DashboardComponent {
  dashboardService = inject(DashboardService);
  memberService = inject(MemberService);
  fundService = inject(FundService);
  eventService = inject(EventService);

  loanColumns: TableColumn<Member>[] = [
    { key: 'firstName', label: 'Prénom' },
    { key: 'lastName', label: 'Nom' },
    { key: 'totalLoans', label: 'Montant Prêt', format: (v) => this.formatCurrency(v) },
    { key: 'status', label: 'Status' }
  ];

  loanActions = [
    { label: 'Détails', onClick: (member: Member) => console.log('View', member), variant: 'primary' as const },
    { label: 'Éditer', onClick: (member: Member) => console.log('Edit', member), variant: 'secondary' as const }
  ];

  getRecentMembers() {
    return this.memberService.members().slice(0, 3);
  }

  getPendingEvents() {
    return this.eventService.events().filter(e => e.status === 'pending').slice(0, 3);
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      maximumFractionDigits: 0
    }).format(value);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('fr-FR').format(new Date(date));
  }

  formatStatus(status: string): string {
    const statuses: Record<string, string> = {
      active: 'Actif',
      inactive: 'Inactif',
      pending: 'En attente',
      completed: 'Complété',
      suspended: 'Suspendu',
      approved: 'Approuvé'
    };
    return statuses[status] || status;
  }

  getEventTypeLabel(type: string): string {
    const types: Record<string, string> = {
      birth: 'Naissance',
      marriage: 'Mariage',
      bereavement: 'Deuil',
      illness: 'Maladie',
      other: 'Autre'
    };
    return types[type] || type;
  }

  getProgressText(current: number, total: number): string {
    const percentage = Math.round((current / total) * 100);
    return `${percentage}% collectés`;
  }
}


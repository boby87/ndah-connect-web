import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent, ButtonComponent, DataTableComponent, StatusBadgeComponent } from '../../shared/components';
import { EventService } from '../../shared/services';
import { TableColumn } from '../../shared/components/data-table.component';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, CardComponent, ButtonComponent, DataTableComponent, StatusBadgeComponent],
  template: `
    <div class="space-y-8 pb-8">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 class="text-4xl font-bold text-gray-900">Solidarité & Entraide</h1>
          <p class="text-gray-600 mt-2 text-lg">Gérez les associations communautaires et suivez les actions en cours</p>
        </div>
        <app-button label="Déclarer un Événement" variant="primary" size="lg" (clickEvent)="openNewEvent()"></app-button>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <app-card>
          <div class="flex justify-between items-start">
            <div>
              <p class="text-gray-600 text-sm font-medium uppercase tracking-wide">Solde Caisse de Solidarité</p>
              <p class="text-3xl font-bold mt-3 text-green-600">{{ formatCurrency(2450000) }}</p>
              <p class="text-sm text-gray-500 mt-2">+45 ce mois</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">💰</div>
          </div>
        </app-card>

        <app-card>
          <div class="flex justify-between items-start">
            <div>
              <p class="text-gray-600 text-sm font-medium uppercase tracking-wide">Événements en Attente</p>
              <p class="text-3xl font-bold mt-3 text-amber-600">{{ eventService.pendingEvents() }}</p>
              <p class="text-sm text-gray-500 mt-2">Actions requises immédiatement</p>
            </div>
            <div class="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-2xl">⏱️</div>
          </div>
        </app-card>

        <app-card>
          <div class="flex justify-between items-start">
            <div>
              <p class="text-gray-600 text-sm font-medium uppercase tracking-wide">Événements Complétés</p>
              <p class="text-3xl font-bold mt-3 text-blue-600">{{ getCompletedCount() }}</p>
              <p class="text-sm text-gray-500 mt-2">Bénéficiaires assistés</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">✓</div>
          </div>
        </app-card>
      </div>

      <!-- Pending Events -->
      <app-card title="Événements en Attente de Validation">
        <div class="space-y-4">
          @for (event of getPendingEvents(); track event.id) {
            <div class="border-l-4 border-amber-500 bg-amber-50 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div class="flex justify-between items-start mb-3">
                <div>
                  <p class="font-bold text-gray-900">{{ event.memberName }}</p>
                  <p class="text-sm text-gray-600">{{ getEventTypeLabel(event.eventType) }}</p>
                </div>
                <app-status-badge [status]="event.status" [label]="formatStatus(event.status)"></app-status-badge>
              </div>

              <div class="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <span class="text-gray-600">Date de l'événement:</span>
                  <p class="font-semibold text-gray-900">{{ formatDate(event.eventDate) }}</p>
                </div>
                <div>
                  <span class="text-gray-600">Bénéfice Estimé:</span>
                  <p class="font-semibold text-green-600">{{ formatCurrency(event.estimatedBenefit) }}</p>
                </div>
              </div>

              <div class="flex gap-3 flex-wrap">
                <app-button label="Approuver" variant="primary" size="sm" (clickEvent)="approveEvent(event)"></app-button>
                <app-button label="Détails" variant="secondary" size="sm" (clickEvent)="viewEvent(event)"></app-button>
              </div>
            </div>
          }
          @if (getPendingEvents().length === 0) {
            <p class="text-gray-500 text-center py-8">Aucun événement en attente de validation</p>
          }
        </div>
      </app-card>

      <!-- All Events Table -->
      <app-card title="Tous les Événements">
        <app-data-table
          [data]="eventService.events()"
          [columns]="columns"
          [actions]="tableActions">
        </app-data-table>
      </app-card>
    </div>
  `,
  styles: []
})
export class EventsComponent {
  eventService = inject(EventService);

  columns: TableColumn<any>[] = [
    { key: 'memberName', label: 'Bénéficiaire' },
    { key: 'eventType', label: 'Type', format: (v) => this.getEventTypeLabel(v) },
    { key: 'eventDate', label: 'Date', format: (v) => this.formatDate(v) },
    { key: 'estimatedBenefit', label: 'Bénéfice', format: (v) => this.formatCurrency(v) },
    { key: 'status', label: 'Statut' }
  ];

  tableActions = [
    {
      label: 'Voir Détails',
      onClick: (event: any) => this.viewEvent(event),
      variant: 'primary' as const
    }
  ];

  getPendingEvents() {
    return this.eventService.events().filter(e => e.status === 'pending');
  }

  getCompletedCount() {
    return this.eventService.events().filter(e => e.status === 'completed').length;
  }

  approveEvent(event: any) {
    this.eventService.approveEvent(event.id);
    console.log('Event approved');
  }

  viewEvent(event: any) {
    console.log('View event:', event.id);
  }

  openNewEvent() {
    console.log('Open new event dialog');
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
}


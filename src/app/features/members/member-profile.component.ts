import { Component, inject, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent, ButtonComponent, StatusBadgeComponent, DataTableComponent } from '../../shared/components';
import { MemberService } from '../../shared/services';
import { TableColumn } from '../../shared/components/data-table.component';

@Component({
  selector: 'app-member-profile',
  standalone: true,
  imports: [CommonModule, CardComponent, ButtonComponent, StatusBadgeComponent, DataTableComponent],
  template: `
    <div class="space-y-6">
      @if (member(); as member) {
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
          <div class="h-32 bg-gradient-to-r from-blue-500 to-blue-600"></div>
          <div class="px-6 pb-6">
            <div class="flex items-end gap-4 -mt-16 mb-6">
              <div class="w-32 h-32 bg-gray-300 rounded-lg border-4 border-white shadow-lg flex items-center justify-center text-4xl">
                👤
              </div>
              <div>
                <h1 class="text-3xl font-bold text-gray-900">{{ member.firstName }} {{ member.lastName }}</h1>
                <app-status-badge [status]="member.status" [label]="formatStatus(member.status)"></app-status-badge>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <app-card title="Épargne Totale">
            <p class="text-3xl font-bold text-blue-600">{{ formatCurrency(memberProfile()?.totalEpargne || 0) }}</p>
            <p class="text-sm text-gray-600 mt-2">Cotisations accumulées</p>
          </app-card>

          <app-card title="Capacité d'Emprunt">
            <p class="text-3xl font-bold text-green-600">{{ formatCurrency(memberProfile()?.capaciteEmprunt || 0) }}</p>
            <p class="text-sm text-gray-600 mt-2">Basée sur l'épargne et historique</p>
          </app-card>

          <app-card title="Prêts en Cours">
            <p class="text-3xl font-bold text-orange-600">{{ formatCurrency(memberProfile()?.pretsCours || 0) }}</p>
            <p class="text-sm text-gray-600 mt-2">Montant à rembourser</p>
          </app-card>
        </div>

        <app-card title="Informations de Contact">
          <div class="space-y-4">
            <div class="flex justify-between">
              <span class="text-gray-600">Email:</span>
              <span class="font-semibold">{{ member.email }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Téléphone:</span>
              <span class="font-semibold">{{ member.phone }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Quartier:</span>
              <span class="font-semibold">{{ member.quartier }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Membre depuis:</span>
              <span class="font-semibold">{{ formatDate(member.joinDate) }}</span>
            </div>
          </div>
        </app-card>

        @if (member.discipline) {
          <app-card title="Discipline & Présence">
            <div class="space-y-4">
              <div>
                <div class="flex justify-between mb-2">
                  <span class="text-gray-700">Taux de Présence</span>
                  <span class="font-bold text-blue-600">{{ member.discipline.attendance }}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div
                    class="bg-blue-500 h-2 rounded-full"
                    [style.width.%]="member.discipline.attendance">
                  </div>
                </div>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Statut:</span>
                <span class="font-semibold" [ngClass]="getDisciplineClass(member.discipline.status)">
                  {{ formatDisciplineStatus(member.discipline.status) }}
                </span>
              </div>
            </div>
          </app-card>
        }

        @if (memberProfile()?.historiqueFinancier) {
          <app-card title="Historique Financier Récent">
            <app-data-table
              [data]="memberProfile()?.historiqueFinancier || []"
              [columns]="historyColumns">
            </app-data-table>
          </app-card>
        }

        <div class="flex gap-4">
          <app-button label="Éditer Profil" variant="primary" (click)="editProfile()"></app-button>
          <app-button label="Retour" variant="secondary" (click)="goBack()"></app-button>
        </div>
      } @else {
        <div class="text-center py-12">
          <p class="text-gray-500">Membre non trouvé</p>
        </div>
      }
    </div>
  `,
  styles: []
})
export class MemberProfileComponent {
  memberService = inject(MemberService);
  memberId = input.required<string>();

  member = computed(() => this.memberService.getMemberById(this.memberId())());
  memberProfile = computed(() => this.member() as any);

  historyColumns: TableColumn<any>[] = [
    { key: 'date', label: 'Date', format: (v) => this.formatDate(v) },
    { key: 'description', label: 'Description' },
    { key: 'type', label: 'Type' },
    { key: 'montant', label: 'Montant', format: (v) => this.formatCurrency(v) }
  ];

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
      suspended: 'Suspendu'
    };
    return statuses[status] || status;
  }

  formatDisciplineStatus(status: string): string {
    const statuses: Record<string, string> = {
      bon: 'Bon',
      moyen: 'Moyen',
      mauvais: 'Mauvais'
    };
    return statuses[status] || status;
  }

  getDisciplineClass(status: string): string {
    const classes: Record<string, string> = {
      bon: 'text-green-600',
      moyen: 'text-yellow-600',
      mauvais: 'text-red-600'
    };
    return classes[status] || 'text-gray-600';
  }

  editProfile() {
    console.log('Edit profile');
  }

  goBack() {
    console.log('Go back');
  }
}


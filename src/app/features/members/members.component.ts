import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardComponent, ButtonComponent, StatusBadgeComponent } from '../../shared/components';
import { MemberService } from '../../shared/services';
import { Member } from '../../shared/models';

@Component({
  selector: 'app-members',
  standalone: true,
  imports: [CommonModule, CardComponent, ButtonComponent, StatusBadgeComponent, FormsModule],
  template: `
    <div class="space-y-6 pb-8">
      <!-- Header Section -->
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Annuaire des Membres</h1>
        </div>
        <app-button label="+ Ajouter un Membre" variant="primary" size="lg" (clickEvent)="openAddMember()"></app-button>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Total Members Card -->
        <app-card>
          <div class="flex justify-between items-start">
            <div>
              <p class="text-gray-500 text-sm font-medium uppercase tracking-wide">Total des membres</p>
              <div class="mt-3">
                <p class="text-3xl font-bold text-gray-900">{{ memberService.totalMembers() }}</p>
                <p class="text-xs text-gray-500 mt-1">Membres actifs/intégrés</p>
              </div>
            </div>
          </div>
        </app-card>

        <!-- Nouveaux Members Card -->
        <app-card>
          <div class="flex justify-between items-start">
            <div>
              <p class="text-gray-500 text-sm font-medium uppercase tracking-wide">Nouveaux (ce mois)</p>
              <div class="mt-3">
                <p class="text-3xl font-bold text-gray-900">42</p>
                <p class="text-xs text-green-600 mt-1">+5% Inscriptions valides récemment</p>
              </div>
            </div>
          </div>
        </app-card>

        <!-- Cotisations Urgent Card -->
        <app-card>
          <div class="flex justify-between items-start">
            <div>
              <p class="text-gray-500 text-sm font-medium uppercase tracking-wide">En attente de cotisation</p>
              <div class="mt-3">
                <p class="text-3xl font-bold text-orange-500">15</p>
                <p class="text-xs text-orange-600 mt-1">Status: Urgent - Actions requises immédiatement</p>
              </div>
            </div>
          </div>
        </app-card>
      </div>

      <!-- Search and Filters Section -->
      <app-card>
        <div class="space-y-4">
          <!-- Search Input -->
          <div class="relative">
            <input
              type="text"
              placeholder="Rechercher par nom, ID ou quartier..."
              [(ngModel)]="searchQuery"
              (input)="updateFilters()"
              class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            <span class="absolute right-3 top-2.5 text-gray-400">🔍</span>
          </div>

          <!-- Filters Row -->
          <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto flex-wrap">
              <!-- Status Filter -->
              <select
                [(ngModel)]="selectedStatus"
                (change)="updateFilters()"
                class="px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                <option value="">Status: Tous</option>
                <option value="active">Status: Actif</option>
                <option value="inactive">Status: Inactif</option>
                <option value="suspended">Status: Suspendu</option>
              </select>

              <!-- Quartier Filter -->
              <select
                [(ngModel)]="selectedQuartier"
                (change)="updateFilters()"
                class="px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                <option value="">Quartier: Tous</option>
                <option value="Yaoundé">Quartier: Yaoundé</option>
                <option value="Douala">Quartier: Douala</option>
                <option value="Bamenda">Quartier: Bamenda</option>
              </select>

              <!-- Type Filter -->
              <select
                [(ngModel)]="selectedType"
                (change)="updateFilters()"
                class="px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                <option value="">Type: Tous</option>
                <option value="titulaire">Type: Titulaire</option>
                <option value="sympathisant">Type: Sympathisant</option>
                <option value="honneur">Type: Membre d'honneur</option>
              </select>
            </div>

            <app-button label="Appliquer" variant="primary" size="md" (clickEvent)="applyFilters()"></app-button>
          </div>
        </div>
      </app-card>

      <!-- Members Grid -->
      <div class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          @for (member of filteredMembers(); track member.id) {
            <app-card>
              <div class="text-center space-y-3">
                <!-- Member Photo -->
                <div class="flex justify-center">
                  <div class="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center overflow-hidden">
                    @if (member.photo) {
                      <img [src]="member.photo" [alt]="member.firstName" class="w-full h-full object-cover" />
                    } @else {
                      <span class="text-2xl">{{ getInitials(member) }}</span>
                    }
                  </div>
                </div>

                <!-- Member Info -->
                <div>
                  <h3 class="font-semibold text-gray-900">{{ member.firstName }} {{ member.lastName }}</h3>
                  <p class="text-xs text-gray-500 mt-1">ID: BAM-2024-{{ member.id }}</p>
                </div>

                <!-- Join Date -->
                <div class="text-xs">
                  <p class="text-green-600 font-medium">À JOUR</p>
                  <p class="text-gray-500">{{ formatDate(member.joinDate) }}</p>
                </div>

                <!-- Member Type Badge -->
                <app-status-badge [status]="member.status" [label]="getMemberType(member.id)"></app-status-badge>

                <!-- Quartier -->
                <p class="text-xs text-gray-600 flex items-center justify-center gap-1">
                  📍 Quartier: {{ member.quartier }}
                </p>

                <!-- View Profile Button -->
                <app-button
                  label="Voir le profil"
                  variant="primary"
                  size="md"
                  [fullWidth]="true"
                  (clickEvent)="viewProfile(member)"></app-button>
              </div>
            </app-card>
          }
        </div>

        <!-- Pagination -->
        <div class="flex items-center justify-between mt-8 px-4">
          <p class="text-sm text-gray-600">Affichage de 1–8 sur {{ memberService.totalMembers() }} membres</p>

          <div class="flex items-center gap-2">
            <button class="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded">←</button>
            <button class="px-3 py-1 bg-blue-600 text-white rounded font-semibold">1</button>
            <button class="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded">2</button>
            <button class="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded">3</button>
            <span class="px-2 py-1 text-gray-600">...</span>
            <button class="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded">155</button>
            <button class="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded">→</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class MembersComponent {
  memberService = inject(MemberService);

  // Filter signals
  searchQuery = signal('');
  selectedStatus = signal('');
  selectedQuartier = signal('');
  selectedType = signal('');

  // Computed filtered members
  filteredMembers = computed(() => {
    let filtered = this.memberService.members();

    const search = this.searchQuery().toLowerCase();
    if (search) {
      filtered = filtered.filter(m =>
        m.firstName.toLowerCase().includes(search) ||
        m.lastName.toLowerCase().includes(search) ||
        m.quartier.toLowerCase().includes(search) ||
        m.id.includes(search)
      );
    }

    if (this.selectedStatus()) {
      filtered = filtered.filter(m => m.status === this.selectedStatus());
    }

    if (this.selectedQuartier()) {
      filtered = filtered.filter(m => m.quartier === this.selectedQuartier());
    }

    return filtered.slice(0, 8); // Display 8 members per page
  });

  updateFilters() {
    // Signals automatically trigger reactivity
  }

  applyFilters() {
    console.log('Filters applied');
  }

  viewProfile(member: Member) {
    console.log('View profile:', member.id);
    this.memberService.selectMember(member);
  }

  openAddMember() {
    console.log('Open add member dialog');
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      maximumFractionDigits: 0
    }).format(value);
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  getInitials(member: Member): string {
    return (member.firstName.charAt(0) + member.lastName.charAt(0)).toUpperCase();
  }

  getMemberType(id: string): string {
    // Map different member types based on ID or other logic
    const types: Record<string, string> = {
      '1': 'TITULAIRE',
      '2': 'SYMPATHISANT',
      '3': 'MEMBRE D\'HONNEUR'
    };
    return types[id] || 'TITULAIRE';
  }
}


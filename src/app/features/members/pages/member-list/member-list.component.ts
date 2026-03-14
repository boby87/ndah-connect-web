import { ChangeDetectionStrategy, Component, inject, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { PageHeaderComponent } from '../../../../shared/components/layout/page-header/page-header.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { SearchInputComponent } from '../../../../shared/components/forms/search-input/search-input.component';
import { MockDataService } from '../../../../core/services/mock-data.service';

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [PageHeaderComponent, ButtonComponent, CardComponent, BadgeComponent, SearchInputComponent],
  template: `
    <app-page-header title="Membres ({{ mock.members().length }})">
      <app-button variant="primary" (clicked)="router.navigate(['/members/adhesion-requests'])">
        Demandes d'adhésion ({{ mock.adhesionRequests().length }})
      </app-button>
    </app-page-header>

    <div class="controls">
      <app-search-input placeholder="Rechercher un membre..." (searchChange)="searchQuery.set($event)" />
      <div class="filter-tabs">
        <button [class]="'tab' + (filter() === 'all' ? ' active' : '')" (click)="filter.set('all')">Tous</button>
        <button [class]="'tab' + (filter() === 'active' ? ' active' : '')" (click)="filter.set('active')">Actifs</button>
        <button [class]="'tab' + (filter() === 'suspended' ? ' active' : '')" (click)="filter.set('suspended')">Suspendus</button>
        <button [class]="'tab' + (filter() === 'bureau' ? ' active' : '')" (click)="filter.set('bureau')">Bureau</button>
      </div>
    </div>

    <div class="member-grid">
      @for (member of filteredMembers(); track member.id) {
        <app-card class="member-card" (click)="router.navigate(['/members', member.id])">
          <div class="card-body">
            <div class="card-top">
              <div class="avatar">{{ getInitials(member.user.firstName, member.user.lastName) }}</div>
              <div class="member-info">
                <h3 class="member-name">{{ member.user.firstName }} {{ member.user.lastName }}</h3>
                <p class="member-phone">📞 {{ member.user.phoneNumber }}</p>
              </div>
            </div>
            <div class="card-meta">
              <app-badge [variant]="getRoleVariant(member.role)" size="sm">{{ getRoleLabel(member.role) }}</app-badge>
              <app-badge [variant]="member.status === 'active' ? 'success' : member.status === 'suspended' ? 'danger' : 'warning'" size="sm">
                {{ member.status === 'active' ? '✅ Actif' : member.status === 'suspended' ? '🚫 Suspendu' : member.status }}
              </app-badge>
            </div>
            @if (member.tourNumber) {
              <span class="tour-num">Tour #{{ member.tourNumber }}</span>
            }
            <p class="profession">{{ member.user.profession }}</p>
          </div>
        </app-card>
      } @empty {
        <div class="empty-state">Aucun membre trouvé</div>
      }
    </div>
  `,
  styles: `@reference "tailwindcss";
    .controls { @apply flex flex-col gap-3 mb-6; }
    .filter-tabs { @apply flex gap-2 flex-wrap; }
    .tab { @apply px-3 py-1.5 rounded-lg text-sm font-medium bg-white border border-slate-200 text-slate-600 cursor-pointer hover:bg-slate-50; }
    .tab.active { @apply bg-blue-600 text-white border-blue-600; }
    .member-grid { @apply grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4; }
    .member-card { @apply cursor-pointer; }
    .card-body { @apply p-2 flex flex-col gap-2; }
    .card-top { @apply flex items-center gap-3; }
    .avatar { @apply w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold flex-shrink-0; }
    .member-info { @apply flex flex-col; }
    .member-name { @apply font-semibold text-slate-900 text-sm; }
    .member-phone { @apply text-xs text-slate-500; }
    .card-meta { @apply flex gap-2 flex-wrap; }
    .tour-num { @apply text-xs text-slate-400; }
    .profession { @apply text-xs text-slate-500; }
    .empty-state { @apply col-span-full text-center py-12 text-slate-400; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MemberListComponent {
  protected readonly router = inject(Router);
  protected readonly mock = inject(MockDataService);

  readonly searchQuery = signal('');
  readonly filter = signal<'all' | 'active' | 'suspended' | 'bureau'>('all');

  readonly filteredMembers = computed(() => {
    let members = this.mock.members();
    const f = this.filter();
    if (f === 'active') members = members.filter(m => m.status === 'active');
    else if (f === 'suspended') members = members.filter(m => m.status === 'suspended');
    else if (f === 'bureau') members = members.filter(m => !['member'].includes(m.role));
    const q = this.searchQuery().toLowerCase();
    if (q) members = members.filter(m =>
      `${m.user.firstName} ${m.user.lastName}`.toLowerCase().includes(q) ||
      m.user.phoneNumber.includes(q)
    );
    return members;
  });

  getInitials(first: string, last: string): string {
    return (first[0] + last[0]).toUpperCase();
  }

  getRoleVariant(role: string): 'primary' | 'secondary' | 'warning' | 'info' | 'success' | 'danger' {
    const map: Record<string, 'primary' | 'secondary' | 'warning' | 'info'> = { president: 'primary', vice_president: 'primary', treasurer: 'warning', secretary: 'info' };
    return map[role] ?? 'secondary';
  }

  getRoleLabel(role: string): string {
    const map: Record<string, string> = { president: 'Président', vice_president: 'Vice-Président', treasurer: 'Trésorier', secretary: 'Secrétaire', censor: 'Censeur', auditor: 'CAC', member: 'Membre' };
    return map[role] ?? role;
  }
}

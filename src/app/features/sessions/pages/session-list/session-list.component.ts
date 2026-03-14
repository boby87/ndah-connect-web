import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PageHeaderComponent } from '../../../../shared/components/layout/page-header/page-header.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { MockDataService } from '../../../../core/services/mock-data.service';
import { CurrencyXafPipe } from '../../../../shared/pipes/currency-xaf.pipe';

@Component({
  selector: 'app-session-list',
  standalone: true,
  imports: [PageHeaderComponent, ButtonComponent, CardComponent, BadgeComponent, CurrencyXafPipe],
  template: `
    <app-page-header title="Séances" subtitle="Gestion des séances de la tontine">
      <app-button variant="primary" (clicked)="navigateToCreate()">+ Nouvelle séance</app-button>
    </app-page-header>

    <div class="session-grid">
      @for (session of mock.sessions(); track session.id) {
        <app-card class="session-card" (click)="navigateToDetail(session.id)">
          <div class="card-body">
            <div class="card-top">
              <h3 class="session-title">Séance #{{ session.number }}</h3>
              <app-badge
                [variant]="session.status === 'closed' ? 'secondary' : session.status === 'opened' ? 'success' : session.status === 'cancelled' ? 'danger' : 'warning'"
                size="sm"
              >
                @switch (session.status) {
                  @case ('scheduled') { 📅 Programmée }
                  @case ('opened') { 🟢 En cours }
                  @case ('closed') { ✅ Clôturée }
                  @case ('cancelled') { ❌ Annulée }
                }
              </app-badge>
            </div>
            <p class="session-meta">{{ session.scheduledDate }} à {{ session.scheduledTime }}</p>
            <p class="session-meta">📍 {{ session.location }}</p>
            @if (session.beneficiary) {
              <p class="session-beneficiary">🎯 Bénéficiaire: {{ session.beneficiary.user.firstName }} {{ session.beneficiary.user.lastName }}</p>
            }
            <div class="session-footer">
              @if (session.agendaValidated) {
                <app-badge variant="success" size="sm">ODJ validé</app-badge>
              } @else {
                <app-badge variant="warning" size="sm">ODJ en attente</app-badge>
              }
              @if (session.status === 'scheduled') {
                <app-button variant="primary" size="sm" (clicked)="navigateToLive(session.id); $event.stopPropagation()">
                  Ouvrir la séance
                </app-button>
              }
              @if (session.status === 'opened') {
                <app-button variant="success" size="sm" (clicked)="navigateToLive(session.id); $event.stopPropagation()">
                  Rejoindre
                </app-button>
              }
            </div>
          </div>
        </app-card>
      }
    </div>
  `,
  styles: `@reference "tailwindcss";
    .session-grid { @apply grid grid-cols-1 md:grid-cols-2 gap-4; }
    .session-card { @apply cursor-pointer; }
    .card-body { @apply p-2 flex flex-col gap-2; }
    .card-top { @apply flex justify-between items-center; }
    .session-title { @apply text-lg font-bold text-slate-900; }
    .session-meta { @apply text-sm text-slate-600; }
    .session-beneficiary { @apply text-sm text-blue-600 font-medium; }
    .session-footer { @apply flex items-center justify-between gap-2 mt-2 pt-2 border-t border-slate-100; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionListComponent {
  private readonly router = inject(Router);
  protected readonly mock = inject(MockDataService);

  navigateToCreate(): void { this.router.navigate(['/sessions/create']); }
  navigateToDetail(id: string): void { this.router.navigate(['/sessions', id]); }
  navigateToLive(id: string): void { this.router.navigate(['/sessions', id, 'live']); }
}

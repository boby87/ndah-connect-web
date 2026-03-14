import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MockDataService, ResignationRequest } from '../../../../core/services/mock-data.service';
import { CurrencyXafPipe } from '../../../../shared/pipes/currency-xaf.pipe';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';

@Component({
  selector: 'app-resignation-requests',
  standalone: true,
  imports: [CurrencyXafPipe, CardComponent, BadgeComponent, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page-header">
      <h1 class="page-title">🚪 Demandes de démission</h1>
      <p class="page-subtitle">Traitement des demandes de départ des membres</p>
    </div>

    @if (mock.resignations().length === 0) {
      <app-card>
        <div class="empty-state">
          <span class="empty-icon">✅</span>
          <p class="empty-text">Aucune demande de démission en cours</p>
        </div>
      </app-card>
    }

    @for (resign of mock.resignations(); track resign.id) {
      <app-card>
        <div class="card-body">
          <div class="resign-header">
            <div class="resign-info">
              <h2 class="resign-name">{{ resign.member.user.firstName }} {{ resign.member.user.lastName }}</h2>
              <span class="resign-meta">Membre depuis {{ resign.member.joinedAt }} · Tour #{{ resign.member.tourNumber }}</span>
              <span class="resign-date">Demandé le {{ resign.requestDate }}</span>
            </div>
            <app-badge [variant]="resignStatusVariant(resign.status)" size="sm">{{ resignStatusLabel(resign.status) }}</app-badge>
          </div>

          <!-- Reason -->
          <div class="resign-section">
            <h3 class="subsection-title">📝 Motif de la démission</h3>
            <p class="resign-reason">{{ resign.reason }}</p>
            <div class="resign-effect">
              <span class="effect-label">Effet souhaité :</span>
              <app-badge [variant]="resign.effectDesired === 'immediate' ? 'danger' : 'warning'" size="sm">
                {{ resign.effectDesired === 'immediate' ? 'Immédiat' : 'Fin du cycle' }}
              </app-badge>
            </div>
          </div>

          <!-- Financial Situation -->
          <div class="resign-section">
            <h3 class="subsection-title">💰 Situation financière</h3>
            <div class="financial-grid">
              <div class="fin-row">
                <span>Arriérés de cotisations</span>
                <span [class]="resign.arrearsAmount > 0 ? 'fin-danger' : 'fin-ok'">{{ resign.arrearsAmount | currencyXaf }}</span>
              </div>
              <div class="fin-row">
                <span>Sanctions impayées</span>
                <span [class]="resign.unpaidSanctions > 0 ? 'fin-danger' : 'fin-ok'">{{ resign.unpaidSanctions | currencyXaf }}</span>
              </div>
              <div class="fin-row">
                <span>Prêts en cours</span>
                <span [class]="resign.activeLoans > 0 ? 'fin-danger' : 'fin-ok'">{{ resign.activeLoans | currencyXaf }}</span>
              </div>
              <div class="fin-row fin-total">
                <span>Total dû</span>
                <span [class]="resign.totalDue > 0 ? 'fin-danger' : 'fin-ok'">{{ resign.totalDue | currencyXaf }}</span>
              </div>
            </div>
          </div>

          <!-- Actions -->
          @if (resign.status === 'pending') {
            <div class="resign-section">
              <h3 class="subsection-title">⚡ Actions</h3>
              <textarea class="observations-input" [value]="observations()" (input)="observations.set($any($event.target).value)" placeholder="Observations du secrétaire..." rows="3"></textarea>
              <div class="actions-row">
                @if (resign.totalDue > 0) {
                  <app-button variant="secondary" (clicked)="processResignation(resign.id, 'regularization')">📋 Demander régularisation</app-button>
                }
                <app-button variant="primary" (clicked)="processResignation(resign.id, 'transmit')">📤 Transmettre au Président</app-button>
              </div>
            </div>
          }

          @if (resign.status === 'regularization_required') {
            <div class="regularization-alert">
              ⏳ En attente de régularisation du membre. Total dû : <strong>{{ resign.totalDue | currencyXaf }}</strong>
            </div>
          }

          @if (resign.status === 'transmitted') {
            <div class="transmitted-alert">
              📤 Dossier transmis au Président pour décision.
              @if (resign.secretaryObservations) {
                <p class="obs-text">Observations : {{ resign.secretaryObservations }}</p>
              }
            </div>
          }
        </div>
      </app-card>
    }
  `,
  styles: [`
    @reference "tailwindcss";
    .page-header { @apply mb-6; }
    .page-title { @apply text-2xl font-bold text-slate-900; }
    .page-subtitle { @apply text-sm text-slate-500 mt-1; }

    .empty-state { @apply flex flex-col items-center py-12; }
    .empty-icon { @apply text-4xl mb-2; }
    .empty-text { @apply text-slate-500; }

    .card-body { @apply p-2; }
    .resign-header { @apply flex items-start justify-between gap-4 mb-4; }
    .resign-info { @apply flex flex-col gap-0.5; }
    .resign-name { @apply text-lg font-bold text-slate-900; }
    .resign-meta { @apply text-xs text-slate-500; }
    .resign-date { @apply text-xs text-slate-400; }

    .resign-section { @apply mt-4 pt-4 border-t border-slate-100; }
    .subsection-title { @apply text-sm font-semibold text-slate-700 mb-2; }
    .resign-reason { @apply text-sm text-slate-700 bg-slate-50 rounded-lg p-3 italic; }
    .resign-effect { @apply flex items-center gap-2 mt-2; }
    .effect-label { @apply text-sm text-slate-600; }

    .financial-grid { @apply space-y-2; }
    .fin-row { @apply flex items-center justify-between text-sm py-1; }
    .fin-total { @apply font-bold border-t border-slate-200 pt-2 mt-2; }
    .fin-danger { @apply text-red-600 font-semibold; }
    .fin-ok { @apply text-green-600 font-semibold; }

    .observations-input { @apply w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y mb-3; }
    .actions-row { @apply flex gap-3; }

    .regularization-alert { @apply mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800; }
    .transmitted-alert { @apply mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800; }
    .obs-text { @apply mt-1 italic; }
  `],
})
export class ResignationRequestsComponent {
  protected readonly mock = inject(MockDataService);
  readonly observations = signal('');

  resignStatusVariant(status: string): 'success' | 'warning' | 'info' | 'danger' {
    if (status === 'accepted') return 'success';
    if (status === 'transmitted') return 'info';
    if (status === 'regularization_required') return 'warning';
    if (status === 'rejected') return 'danger';
    return 'secondary' as any;
  }

  resignStatusLabel(status: string): string {
    if (status === 'pending') return 'En attente';
    if (status === 'regularization_required') return 'Régularisation requise';
    if (status === 'transmitted') return 'Transmis au Président';
    if (status === 'accepted') return 'Acceptée';
    if (status === 'rejected') return 'Rejetée';
    return status;
  }

  processResignation(id: string, decision: 'transmit' | 'regularization'): void {
    this.mock.processResignation(id, decision, this.observations());
  }
}

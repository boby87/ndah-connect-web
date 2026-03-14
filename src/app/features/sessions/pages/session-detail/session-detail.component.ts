import { ChangeDetectionStrategy, Component, inject, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageHeaderComponent } from '../../../../shared/components/layout/page-header/page-header.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { MockDataService } from '../../../../core/services/mock-data.service';
import { CurrencyXafPipe } from '../../../../shared/pipes/currency-xaf.pipe';

@Component({
  selector: 'app-session-detail',
  standalone: true,
  imports: [PageHeaderComponent, CardComponent, BadgeComponent, ButtonComponent, CurrencyXafPipe],
  template: `
    <app-page-header title="Détail de la séance" backLink="/sessions" />

    @if (session(); as s) {
      <div class="detail-grid">
        <app-card>
          <div class="section">
            <h2 class="title">Séance #{{ s.number }}</h2>
            <app-badge
              [variant]="s.status === 'closed' ? 'secondary' : s.status === 'opened' ? 'success' : 'warning'"
            >
              @switch (s.status) {
                @case ('scheduled') { 📅 Programmée }
                @case ('opened') { 🟢 En cours }
                @case ('closed') { ✅ Clôturée }
                @case ('cancelled') { ❌ Annulée }
              }
            </app-badge>

            <div class="info-grid">
              <div class="info-item"><span class="label">Type</span><span>{{ s.sessionType === 'ordinary' ? 'Ordinaire' : 'Extraordinaire' }}</span></div>
              <div class="info-item"><span class="label">Date</span><span>{{ s.scheduledDate }}</span></div>
              <div class="info-item"><span class="label">Heure</span><span>{{ s.scheduledTime }}</span></div>
              <div class="info-item"><span class="label">Lieu</span><span>{{ s.location }}</span></div>
              @if (s.beneficiary) {
                <div class="info-item"><span class="label">Bénéficiaire</span><span class="text-blue-600 font-medium">{{ s.beneficiary.user.firstName }} {{ s.beneficiary.user.lastName }}</span></div>
              }
              <div class="info-item"><span class="label">ODJ</span><span>{{ s.agendaValidated ? '✅ Validé' : '⏳ En attente' }}</span></div>
              @if (s.quorumReached !== undefined) {
                <div class="info-item"><span class="label">Quorum</span><span>{{ s.quorumReached ? '✅ Atteint' : '❌ Non atteint' }}</span></div>
              }
            </div>

            <div class="actions">
              @if (s.status === 'scheduled') {
                <app-button variant="primary" (clicked)="goToLive()">🟢 Ouvrir la séance</app-button>
                @if (!s.agendaValidated) {
                  <app-button variant="outline" (clicked)="validateAgenda()">📋 Valider l'ODJ</app-button>
                }
              }
              @if (s.status === 'opened') {
                <app-button variant="success" (clicked)="goToLive()">📡 Rejoindre la séance en direct</app-button>
              }
            </div>
          </div>
        </app-card>
      </div>
    } @else {
      <p class="not-found">Séance introuvable.</p>
    }
  `,
  styles: `@reference "tailwindcss";
    .detail-grid { @apply max-w-3xl; }
    .section { @apply p-2 flex flex-col gap-4; }
    .title { @apply text-xl font-bold text-slate-900; }
    .info-grid { @apply grid grid-cols-2 gap-3 mt-4; }
    .info-item { @apply flex flex-col; }
    .label { @apply text-xs text-slate-500 uppercase tracking-wide; }
    .actions { @apply flex gap-3 mt-4 pt-4 border-t border-slate-100; }
    .not-found { @apply p-6 text-slate-500; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly mock = inject(MockDataService);

  readonly session = computed(() => {
    const id = this.route.snapshot.paramMap.get('id');
    return this.mock.sessions().find(s => s.id === id) ?? null;
  });

  goToLive(): void {
    const s = this.session();
    if (s) this.router.navigate(['/sessions', s.id, 'live']);
  }

  validateAgenda(): void {
    this.mock.approveValidation('pv-004', 'ODJ validé par le Président');
  }
}

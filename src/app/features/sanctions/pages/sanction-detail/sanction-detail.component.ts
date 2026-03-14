import { ChangeDetectionStrategy, Component, inject, computed, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageHeaderComponent } from '../../../../shared/components/layout/page-header/page-header.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { ModalComponent } from '../../../../shared/components/ui/modal/modal.component';
import { MockDataService } from '../../../../core/services/mock-data.service';
import { CurrencyXafPipe } from '../../../../shared/pipes/currency-xaf.pipe';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sanction-detail',
  standalone: true,
  imports: [PageHeaderComponent, CardComponent, BadgeComponent, ButtonComponent, ModalComponent, CurrencyXafPipe, FormsModule],
  template: `
    <app-page-header title="Détail de la sanction" backLink="/sanctions" />

    @if (sanction(); as s) {
      <div class="detail-layout">
        <div class="detail-header">
          <div>
            <h2>{{ s.member.user.firstName }} {{ s.member.user.lastName }}</h2>
            <p class="header-sub">{{ s.reason }}</p>
          </div>
          <div class="header-right">
            <span class="amount">{{ s.amount | currencyXaf }}</span>
            <app-badge [variant]="s.status === 'paid' ? 'success' : s.contested ? 'warning' : 'danger'">
              {{ s.status === 'paid' ? '✅ Payée' : s.contested ? '⚠️ Contestée' : '🔴 En attente' }}
            </app-badge>
          </div>
        </div>

        <div class="detail-grid">
          <app-card>
            <div class="section">
              <h3 class="section-title">📋 Détails</h3>
              <div class="info-grid">
                <div class="info-item"><span class="info-label">Type</span><span class="info-value">{{ getTypeLabel(s.type) }}</span></div>
                <div class="info-item"><span class="info-label">Montant</span><span class="info-value">{{ s.amount | currencyXaf }}</span></div>
                <div class="info-item"><span class="info-label">Appliquée par</span><span class="info-value">{{ s.appliedBy }}</span></div>
                <div class="info-item"><span class="info-label">Date</span><span class="info-value">{{ s.appliedAt }}</span></div>
                @if (s.paidAt) {
                  <div class="info-item"><span class="info-label">Payée le</span><span class="info-value">{{ s.paidAt }}</span></div>
                  <div class="info-item"><span class="info-label">Mode</span><span class="info-value">{{ s.paymentMethod }}</span></div>
                }
              </div>
            </div>
          </app-card>

          @if (s.contested) {
            <app-card>
              <div class="section">
                <h3 class="section-title">⚠️ Contestation</h3>
                <div class="contest-box">
                  <p class="contest-text">{{ s.contestReason }}</p>
                </div>
                @if (!s.contestResult) {
                  <div class="contest-actions">
                    <app-button variant="primary" (clicked)="resolveContestation(s.id, true)">✅ Accepter la contestation (annuler sanction)</app-button>
                    <app-button variant="danger" (clicked)="resolveContestation(s.id, false)">❌ Rejeter la contestation (maintenir sanction)</app-button>
                  </div>
                } @else {
                  <app-badge [variant]="s.contestResult === 'accepted' ? 'success' : 'danger'">
                    Contestation {{ s.contestResult === 'accepted' ? 'acceptée' : 'rejetée' }}
                  </app-badge>
                }
              </div>
            </app-card>
          }

          @if (s.status === 'pending' && !s.contested) {
            <app-card>
              <div class="section">
                <h3 class="section-title">⚖️ Actions du Président</h3>
                <div class="president-actions">
                  <app-button variant="danger" (clicked)="showCancelModal.set(true)">🚫 Annuler cette sanction</app-button>
                </div>
              </div>
            </app-card>
          }
        </div>
      </div>

      <app-modal [isOpen]="showCancelModal()" title="Annuler la sanction" (closed)="showCancelModal.set(false)">
        <div class="modal-form">
          <label class="form-label">Motif d'annulation</label>
          <textarea class="form-textarea" [(ngModel)]="cancelReason" rows="3"></textarea>
          <div class="modal-actions">
            <app-button variant="outline" (clicked)="showCancelModal.set(false)">Retour</app-button>
            <app-button variant="danger" (clicked)="cancelSanction(s.id)">Confirmer l'annulation</app-button>
          </div>
        </div>
      </app-modal>
    } @else {
      <div class="not-found">Sanction non trouvée</div>
    }
  `,
  styles: `@reference "tailwindcss";
    .detail-layout { @apply flex flex-col gap-6; }
    .detail-header { @apply flex justify-between items-start bg-white rounded-xl p-4 shadow-sm border; }
    .header-sub { @apply text-sm text-slate-500 mt-1; }
    .header-right { @apply flex flex-col items-end gap-1; }
    .amount { @apply text-xl font-bold text-slate-900; }
    .detail-grid { @apply grid grid-cols-1 lg:grid-cols-2 gap-6; }
    .section { @apply p-2 flex flex-col gap-3; }
    .section-title { @apply text-base font-semibold text-slate-900; }
    .info-grid { @apply grid grid-cols-2 gap-3; }
    .info-item { @apply flex flex-col; }
    .info-label { @apply text-xs text-slate-500; }
    .info-value { @apply text-sm font-semibold text-slate-900; }
    .contest-box { @apply bg-amber-50 rounded-lg p-3; }
    .contest-text { @apply text-sm text-amber-800; }
    .contest-actions { @apply flex flex-col gap-2; }
    .president-actions { @apply flex flex-col gap-2; }
    .modal-form { @apply flex flex-col gap-3 p-4; }
    .form-label { @apply text-sm font-medium text-slate-700; }
    .form-textarea { @apply border border-slate-300 rounded-lg px-3 py-2 text-sm resize-y; }
    .modal-actions { @apply flex justify-end gap-2 mt-2; }
    .not-found { @apply text-center py-12 text-slate-400; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SanctionDetailComponent {
  private readonly route = inject(ActivatedRoute);
  protected readonly router = inject(Router);
  protected readonly mock = inject(MockDataService);

  showCancelModal = signal(false);
  cancelReason = '';

  readonly sanction = computed(() => {
    const id = this.route.snapshot.paramMap.get('id');
    return this.mock.sanctions().find(s => s.id === id) ?? null;
  });

  getTypeLabel(type: string): string {
    const map: Record<string, string> = { absence: 'Absence', late: 'Retard', contribution_late: 'Cotisation en retard', other: 'Autre' };
    return map[type] ?? type;
  }

  resolveContestation(sanctionId: string, accept: boolean): void {
    this.mock.resolveContestation(sanctionId, accept, accept ? 'Contestation acceptée' : 'Contestation rejetée');
  }

  cancelSanction(sanctionId: string): void {
    this.mock.cancelSanction(sanctionId, this.cancelReason);
    this.showCancelModal.set(false);
    this.router.navigate(['/sanctions']);
  }
}

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
  selector: 'app-loan-detail',
  standalone: true,
  imports: [PageHeaderComponent, CardComponent, BadgeComponent, ButtonComponent, ModalComponent, CurrencyXafPipe, FormsModule],
  template: `
    <app-page-header title="Détail du prêt" backLink="/loans" />

    @if (loan(); as l) {
      <div class="detail-layout">
        <!-- Header -->
        <div class="detail-header">
          <div>
            <h2 class="borrower-name">{{ l.member.user.firstName }} {{ l.member.user.lastName }}</h2>
            <p class="borrower-role">{{ l.member.role }} - {{ l.member.user.profession }}</p>
          </div>
          <app-badge [variant]="l.status === 'president_review' ? 'warning' : l.status === 'repaying' ? 'info' : l.status === 'completed' ? 'success' : 'secondary'">
            {{ getStatusLabel(l.status) }}
          </app-badge>
        </div>

        <div class="detail-grid">
          <!-- Loan info -->
          <app-card>
            <div class="section">
              <h3 class="section-title">💰 Informations du prêt</h3>
              <div class="info-grid">
                <div class="info-item"><span class="info-label">Montant demandé</span><span class="info-value highlight">{{ l.amount | currencyXaf }}</span></div>
                <div class="info-item"><span class="info-label">Taux d'intérêt</span><span class="info-value">{{ l.interestRate }}%</span></div>
                <div class="info-item"><span class="info-label">Durée</span><span class="info-value">{{ l.durationMonths }} mois</span></div>
                <div class="info-item"><span class="info-label">Total à rembourser</span><span class="info-value">{{ l.totalToRepay | currencyXaf }}</span></div>
                <div class="info-item"><span class="info-label">Mensualité</span><span class="info-value">{{ l.monthlyPayment | currencyXaf }}</span></div>
                <div class="info-item"><span class="info-label">Reste à rembourser</span><span class="info-value">{{ l.remainingAmount | currencyXaf }}</span></div>
              </div>
              <div class="reason-box">
                <span class="reason-label">Motif:</span>
                <p>{{ l.requestReason }}</p>
              </div>
            </div>
          </app-card>

          <!-- Guarantors -->
          <app-card>
            <div class="section">
              <h3 class="section-title">🤝 Garants ({{ l.guarantors.length }})</h3>
              @for (g of l.guarantors; track g.id) {
                <div class="guarantor-item">
                  <div>
                    <span class="guarantor-name">{{ g.guarantor.user.firstName }} {{ g.guarantor.user.lastName }}</span>
                    <span class="guarantor-role">{{ g.guarantor.role }}</span>
                  </div>
                  <app-badge [variant]="g.status === 'accepted' ? 'success' : g.status === 'refused' ? 'danger' : 'warning'" size="sm">
                    {{ g.status === 'accepted' ? '✅ Accepté' : g.status === 'refused' ? '❌ Refusé' : '⏳ En attente' }}
                  </app-badge>
                </div>
              }
            </div>
          </app-card>

          <!-- Auditor review -->
          <app-card>
            <div class="section">
              <h3 class="section-title">📋 Avis du Commissaire aux Comptes</h3>
              @if (l.auditorApproved !== undefined) {
                <div class="auditor-box">
                  <app-badge [variant]="l.auditorApproved ? 'success' : 'danger'">
                    {{ l.auditorApproved ? '✅ Favorable' : '❌ Défavorable' }}
                  </app-badge>
                  <p class="auditor-comment">{{ l.auditorComment }}</p>
                  <span class="auditor-date">Avis rendu le {{ l.auditorApprovedAt }}</span>
                </div>
              } @else {
                <p class="pending-text">En attente de l'avis du CAC</p>
              }
            </div>
          </app-card>

          <!-- President action -->
          @if (l.status === 'president_review') {
            <app-card>
              <div class="section">
                <h3 class="section-title">⚖️ Décision du Président</h3>
                <p class="action-hint">En tant que Président, vous pouvez approuver, rejeter ou bloquer ce prêt.</p>
                <div class="decision-actions">
                  <app-button variant="primary" (clicked)="approve(l.id)">✅ Approuver le décaissement</app-button>
                  <app-button variant="outline" (clicked)="showBlockModal.set(true)">⏸️ Bloquer (demander des infos)</app-button>
                  <app-button variant="danger" (clicked)="showRejectModal.set(true)">❌ Rejeter</app-button>
                </div>
              </div>
            </app-card>
          }

          @if (l.status === 'repaying') {
            <app-card>
              <div class="section">
                <h3 class="section-title">📊 Suivi du remboursement</h3>
                <div class="progress-bar-container">
                  <div class="progress-label">{{ getRepaymentPercent(l) }}% remboursé</div>
                  <div class="progress-track">
                    <div class="progress-fill" [style.width.%]="getRepaymentPercent(l)"></div>
                  </div>
                </div>
                @if (l.nextPaymentDate) {
                  <p class="next-payment">Prochain paiement: {{ l.nextPaymentDate }}</p>
                }
              </div>
            </app-card>
          }
        </div>
      </div>

      <!-- Reject Modal -->
      <app-modal [isOpen]="showRejectModal()" title="Rejeter le prêt" (closed)="showRejectModal.set(false)">
        <div class="modal-form">
          <p>Êtes-vous sûr de vouloir rejeter ce prêt de {{ l.amount | currencyXaf }} pour {{ l.member.user.firstName }} {{ l.member.user.lastName }} ?</p>
          <label class="form-label">Motif du rejet</label>
          <textarea class="form-textarea" [(ngModel)]="rejectReason" rows="3"></textarea>
          <div class="modal-actions">
            <app-button variant="outline" (clicked)="showRejectModal.set(false)">Annuler</app-button>
            <app-button variant="danger" (clicked)="reject(l.id)">Confirmer le rejet</app-button>
          </div>
        </div>
      </app-modal>

      <!-- Block Modal -->
      <app-modal [isOpen]="showBlockModal()" title="Bloquer le prêt" (closed)="showBlockModal.set(false)">
        <div class="modal-form">
          <p>Demander des informations complémentaires avant décision.</p>
          <label class="form-label">Informations demandées</label>
          <textarea class="form-textarea" [(ngModel)]="blockReason" rows="3"></textarea>
          <div class="modal-actions">
            <app-button variant="outline" (clicked)="showBlockModal.set(false)">Annuler</app-button>
            <app-button variant="secondary" (clicked)="block(l.id)">Bloquer en attente</app-button>
          </div>
        </div>
      </app-modal>
    } @else {
      <div class="not-found">Prêt non trouvé</div>
    }
  `,
  styles: `@reference "tailwindcss";
    .detail-layout { @apply flex flex-col gap-6; }
    .detail-header { @apply flex justify-between items-start bg-white rounded-xl p-4 shadow-sm border; }
    .borrower-name { @apply text-xl font-bold text-slate-900; }
    .borrower-role { @apply text-sm text-slate-500; }
    .detail-grid { @apply grid grid-cols-1 lg:grid-cols-2 gap-6; }
    .section { @apply p-2 flex flex-col gap-3; }
    .section-title { @apply text-base font-semibold text-slate-900; }
    .info-grid { @apply grid grid-cols-2 gap-3; }
    .info-item { @apply flex flex-col; }
    .info-label { @apply text-xs text-slate-500; }
    .info-value { @apply text-sm font-semibold text-slate-900; }
    .info-value.highlight { @apply text-blue-600 text-base; }
    .reason-box { @apply bg-slate-50 rounded-lg p-3 text-sm text-slate-700; }
    .reason-label { @apply font-medium; }
    .guarantor-item { @apply flex justify-between items-center py-2 border-b last:border-none; }
    .guarantor-name { @apply text-sm font-medium text-slate-800; }
    .guarantor-role { @apply text-xs text-slate-500 ml-2; }
    .auditor-box { @apply flex flex-col gap-2; }
    .auditor-comment { @apply text-sm text-slate-700 bg-slate-50 p-3 rounded-lg; }
    .auditor-date { @apply text-xs text-slate-400; }
    .pending-text { @apply text-sm text-slate-400 italic; }
    .action-hint { @apply text-sm text-slate-600; }
    .decision-actions { @apply flex flex-col gap-2; }
    .progress-bar-container { @apply flex flex-col gap-1; }
    .progress-label { @apply text-sm text-slate-600; }
    .progress-track { @apply h-3 bg-slate-200 rounded-full overflow-hidden; }
    .progress-fill { @apply h-full bg-green-500 rounded-full; }
    .next-payment { @apply text-sm text-slate-500; }
    .modal-form { @apply flex flex-col gap-3 p-4; }
    .form-label { @apply text-sm font-medium text-slate-700; }
    .form-textarea { @apply border border-slate-300 rounded-lg px-3 py-2 text-sm resize-y; }
    .modal-actions { @apply flex justify-end gap-2 mt-2; }
    .not-found { @apply text-center py-12 text-slate-400; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoanDetailComponent {
  private readonly route = inject(ActivatedRoute);
  protected readonly router = inject(Router);
  protected readonly mock = inject(MockDataService);

  showRejectModal = signal(false);
  showBlockModal = signal(false);
  rejectReason = '';
  blockReason = '';

  readonly loan = computed(() => {
    const id = this.route.snapshot.paramMap.get('id');
    return this.mock.loans().find(l => l.id === id) ?? null;
  });

  getStatusLabel(status: string): string {
    const map: Record<string, string> = { president_review: 'En attente de validation', repaying: 'En remboursement', completed: 'Terminé', disbursed: 'Décaissé' };
    return map[status] ?? status;
  }

  getRepaymentPercent(loan: any): number {
    if (loan.totalToRepay === 0) return 100;
    return Math.round(((loan.totalToRepay - loan.remainingAmount) / loan.totalToRepay) * 100);
  }

  approve(loanId: string): void {
    const pv = this.mock.pendingValidations().find(v => v.relatedId === loanId || v.title.includes(this.loan()?.member?.user?.lastName ?? ''));
    if (pv) this.mock.approveValidation(pv.id, 'Prêt approuvé par le Président');
    this.router.navigate(['/loans']);
  }

  reject(loanId: string): void {
    const pv = this.mock.pendingValidations().find(v => v.relatedId === loanId || v.title.includes(this.loan()?.member?.user?.lastName ?? ''));
    if (pv) this.mock.rejectValidation(pv.id, this.rejectReason);
    this.showRejectModal.set(false);
    this.router.navigate(['/loans']);
  }

  block(loanId: string): void {
    const pv = this.mock.pendingValidations().find(v => v.relatedId === loanId || v.title.includes(this.loan()?.member?.user?.lastName ?? ''));
    if (pv) this.mock.blockValidation(pv.id, this.blockReason);
    this.showBlockModal.set(false);
    this.router.navigate(['/loans']);
  }
}

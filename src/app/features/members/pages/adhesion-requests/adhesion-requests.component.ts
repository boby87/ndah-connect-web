import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { PageHeaderComponent } from '../../../../shared/components/layout/page-header/page-header.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { ModalComponent } from '../../../../shared/components/ui/modal/modal.component';
import { MockDataService } from '../../../../core/services/mock-data.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-adhesion-requests',
  standalone: true,
  imports: [PageHeaderComponent, CardComponent, BadgeComponent, ButtonComponent, ModalComponent, FormsModule],
  template: `
    <app-page-header title="Demandes d'adhésion" backLink="/members" />

    <div class="request-list">
      @for (req of mock.adhesionRequests(); track req.id) {
        <app-card>
          <div class="request-body">
            <div class="request-top">
              <div class="avatar">{{ req.user.firstName[0] }}{{ req.user.lastName[0] }}</div>
              <div class="request-info">
                <h3 class="request-name">{{ req.user.firstName }} {{ req.user.lastName }}</h3>
                <p class="request-meta">📞 {{ req.user.phoneNumber }} · {{ req.user.profession }}</p>
                <p class="request-meta">Genre: {{ req.user.gender === 'male' ? 'Homme' : 'Femme' }}</p>
              </div>
              <app-badge variant="warning">⏳ En attente</app-badge>
            </div>

            @if (req.sponsor) {
              <div class="sponsor-info">
                <span class="sponsor-label">Parrainé par:</span>
                <span class="sponsor-name">{{ req.sponsor.user.firstName }} {{ req.sponsor.user.lastName }}</span>
              </div>
            }

            <p class="request-date">Demande reçue le {{ req.createdAt }}</p>

            <div class="request-actions">
              <app-button variant="primary" (clicked)="approveRequest(req.id)">✅ Accepter</app-button>
              <app-button variant="danger" (clicked)="selectedReqId.set(req.id); showRejectModal.set(true)">❌ Refuser</app-button>
            </div>
          </div>
        </app-card>
      } @empty {
        <div class="empty-state">
          <p>🎉 Aucune demande d'adhésion en attente</p>
        </div>
      }
    </div>

    <app-modal [isOpen]="showRejectModal()" title="Refuser la demande" (closed)="showRejectModal.set(false)">
      <div class="modal-form">
        <label class="form-label">Motif du refus</label>
        <textarea class="form-textarea" [(ngModel)]="rejectReason" rows="3" placeholder="Expliquez le motif..."></textarea>
        <div class="modal-actions">
          <app-button variant="outline" (clicked)="showRejectModal.set(false)">Annuler</app-button>
          <app-button variant="danger" (clicked)="rejectRequest()">Confirmer le refus</app-button>
        </div>
      </div>
    </app-modal>
  `,
  styles: `@reference "tailwindcss";
    .request-list { @apply flex flex-col gap-4; }
    .request-body { @apply p-2 flex flex-col gap-3; }
    .request-top { @apply flex items-center gap-3; }
    .avatar { @apply w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold flex-shrink-0; }
    .request-info { @apply flex-1; }
    .request-name { @apply font-semibold text-slate-900; }
    .request-meta { @apply text-sm text-slate-500; }
    .sponsor-info { @apply flex gap-2 text-sm bg-slate-50 rounded-lg p-2; }
    .sponsor-label { @apply text-slate-500; }
    .sponsor-name { @apply font-medium text-slate-800; }
    .request-date { @apply text-xs text-slate-400; }
    .request-actions { @apply flex gap-2; }
    .empty-state { @apply text-center py-12 text-slate-400; }
    .modal-form { @apply flex flex-col gap-3 p-4; }
    .form-label { @apply text-sm font-medium text-slate-700; }
    .form-textarea { @apply border border-slate-300 rounded-lg px-3 py-2 text-sm resize-y; }
    .modal-actions { @apply flex justify-end gap-2 mt-2; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdhesionRequestsComponent {
  protected readonly router = inject(Router);
  protected readonly mock = inject(MockDataService);

  showRejectModal = signal(false);
  selectedReqId = signal<string | null>(null);
  rejectReason = '';

  approveRequest(id: string): void {
    const pv = this.mock.pendingValidations().find(v => v.type === 'adhesion');
    if (pv) this.mock.approveValidation(pv.id, 'Adhésion approuvée');
    this.mock._adhesionRequests.update(reqs => reqs.filter(r => r.id !== id));
  }

  rejectRequest(): void {
    const id = this.selectedReqId();
    if (id) {
      const pv = this.mock.pendingValidations().find(v => v.type === 'adhesion');
      if (pv) this.mock.rejectValidation(pv.id, this.rejectReason);
      this.mock._adhesionRequests.update(reqs => reqs.filter(r => r.id !== id));
    }
    this.showRejectModal.set(false);
    this.rejectReason = '';
  }
}

import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MockDataService, AttendanceModificationRequest } from '../../../../core/services/mock-data.service';
import { PageHeaderComponent } from '../../../../shared/components/layout/page-header/page-header.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { ModalComponent } from '../../../../shared/components/ui/modal/modal.component';

@Component({
  selector: 'app-attendance-modifications',
  standalone: true,
  imports: [FormsModule, PageHeaderComponent, CardComponent, BadgeComponent, ButtonComponent, ModalComponent],
  template: `
    <app-page-header title="Modifications de présence" subtitle="Validez les demandes du secrétaire" backLink="/sanctions" />

    <div class="modifications-container">
      <!-- Filter tabs -->
      <div class="filter-tabs">
        <button [class]="'tab' + (filter() === 'pending' ? ' active' : '')" (click)="filter.set('pending')" type="button">En attente ({{ pendingCount() }})</button>
        <button [class]="'tab' + (filter() === 'all' ? ' active' : '')" (click)="filter.set('all')" type="button">Toutes ({{ allCount() }})</button>
      </div>

      @for (req of filteredRequests(); track req.id) {
        <app-card>
          <div class="request-item">
            <div class="request-header">
              <div class="request-member">
                <span class="member-name">{{ req.memberName }}</span>
                <span class="session-label">{{ req.sessionLabel }}</span>
              </div>
              <app-badge [variant]="statusVariant(req.status)" size="sm">{{ statusLabel(req.status) }}</app-badge>
            </div>

            <div class="request-change">
              <div class="change-from">
                <span class="change-label">Statut actuel</span>
                <app-badge variant="danger" size="sm">{{ req.currentStatus }}</app-badge>
              </div>
              <span class="change-arrow">→</span>
              <div class="change-to">
                <span class="change-label">Statut demandé</span>
                <app-badge variant="success" size="sm">{{ req.requestedStatus }}</app-badge>
              </div>
            </div>

            <div class="request-details">
              <p class="request-reason"><strong>Motif:</strong> {{ req.reason }}</p>
              <p class="request-impact"><strong>Impact:</strong> {{ req.impactSanction }}</p>
              <p class="request-by">Demandé par <strong>{{ req.requestedBy }}</strong></p>
            </div>

            @if (req.status === 'pending') {
              <div class="request-actions">
                <app-button variant="success" size="sm" (clicked)="openDecisionModal(req, 'approved')">✅ Approuver</app-button>
                <app-button variant="outline" size="sm" (clicked)="openDecisionModal(req, 'info_requested')">❓ Demander infos</app-button>
                <app-button variant="danger" size="sm" (clicked)="openDecisionModal(req, 'refused')">❌ Refuser</app-button>
              </div>
            }
          </div>
        </app-card>
      } @empty {
        <app-card>
          <div class="empty-state">
            <span class="empty-icon">✅</span>
            <p class="empty-text">Aucune demande de modification {{ filter() === 'pending' ? 'en attente' : '' }}</p>
          </div>
        </app-card>
      }
    </div>

    <!-- Decision Modal -->
    <app-modal [isOpen]="showModal()" [title]="modalTitle()" (closed)="closeModal()">
      <div class="modal-content">
        <p class="modal-desc">{{ modalDescription() }}</p>
        <textarea class="modal-textarea" rows="3" placeholder="Commentaire (optionnel)" [(ngModel)]="decisionComment"></textarea>
        <div class="modal-actions">
          <app-button variant="outline" (clicked)="closeModal()">Annuler</app-button>
          <app-button [variant]="modalAction() === 'approved' ? 'primary' : modalAction() === 'refused' ? 'danger' : 'outline'" (clicked)="submitDecision()">Confirmer</app-button>
        </div>
      </div>
    </app-modal>
  `,
  styles: `
    @reference "tailwindcss";
    .modifications-container { @apply space-y-4; }
    .filter-tabs { @apply flex gap-2 mb-4; }
    .tab { @apply px-4 py-2 text-sm rounded-lg border border-slate-200 bg-white cursor-pointer hover:bg-slate-50; }
    .tab.active { @apply bg-blue-50 border-blue-300 text-blue-700 font-medium; }
    .request-item { @apply space-y-3; }
    .request-header { @apply flex items-center justify-between; }
    .request-member { @apply flex flex-col; }
    .member-name { @apply text-sm font-semibold text-slate-900; }
    .session-label { @apply text-xs text-slate-500; }
    .request-change { @apply flex items-center gap-3 p-3 bg-slate-50 rounded-lg; }
    .change-from, .change-to { @apply flex flex-col items-center gap-1; }
    .change-label { @apply text-xs text-slate-500; }
    .change-arrow { @apply text-lg text-slate-400; }
    .request-details { @apply space-y-1; }
    .request-reason, .request-impact { @apply text-sm text-slate-700; }
    .request-by { @apply text-xs text-slate-500; }
    .request-actions { @apply flex gap-2 pt-2 border-t border-slate-100; }
    .empty-state { @apply flex flex-col items-center gap-2 py-8; }
    .empty-icon { @apply text-4xl; }
    .empty-text { @apply text-sm text-slate-500; }
    .modal-content { @apply space-y-4; }
    .modal-desc { @apply text-sm text-slate-700; }
    .modal-textarea { @apply w-full px-3 py-2 border border-slate-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500; }
    .modal-actions { @apply flex justify-end gap-3; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttendanceModificationsComponent {
  private readonly mock = inject(MockDataService);

  readonly filter = signal<'pending' | 'all'>('pending');
  readonly showModal = signal(false);
  readonly modalAction = signal<'approved' | 'refused' | 'info_requested'>('approved');
  readonly currentRequest = signal<AttendanceModificationRequest | null>(null);
  readonly decisionComment = signal('');

  pendingCount() { return this.mock.pendingAttendanceModifications().length; }
  allCount() { return this.mock.attendanceModifications().length; }

  filteredRequests() {
    return this.filter() === 'pending' ? this.mock.pendingAttendanceModifications() : this.mock.attendanceModifications();
  }

  statusVariant(status: string): 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' {
    return status === 'pending' ? 'warning' : status === 'approved' ? 'success' : status === 'refused' ? 'danger' : 'info';
  }

  statusLabel(status: string): string {
    return status === 'pending' ? 'En attente' : status === 'approved' ? 'Approuvée' : status === 'refused' ? 'Refusée' : 'Info demandée';
  }

  modalTitle(): string {
    return this.modalAction() === 'approved' ? 'Approuver la modification' : this.modalAction() === 'refused' ? 'Refuser la modification' : 'Demander des informations';
  }

  modalDescription(): string {
    const name = this.currentRequest()?.memberName ?? '';
    return this.modalAction() === 'approved' ? `Approuver la modification de présence pour ${name} ?`
      : this.modalAction() === 'refused' ? `Refuser la modification de présence pour ${name} ?`
      : `Demander des informations complémentaires concernant la modification pour ${name}.`;
  }

  openDecisionModal(req: AttendanceModificationRequest, action: 'approved' | 'refused' | 'info_requested'): void {
    this.currentRequest.set(req);
    this.modalAction.set(action);
    this.decisionComment.set('');
    this.showModal.set(true);
  }

  closeModal(): void { this.showModal.set(false); }

  submitDecision(): void {
    const req = this.currentRequest();
    if (!req) return;
    this.mock.processAttendanceModification(req.id, this.modalAction(), this.decisionComment());
    this.closeModal();
  }
}

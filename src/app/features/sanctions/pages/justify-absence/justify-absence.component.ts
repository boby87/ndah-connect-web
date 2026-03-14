import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService, AbsenceJustification } from '../../../../core/services/mock-data.service';
import { PageHeaderComponent } from '../../../../shared/components/layout/page-header/page-header.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { ModalComponent } from '../../../../shared/components/ui/modal/modal.component';
import { CurrencyXafPipe } from '../../../../shared/pipes/currency-xaf.pipe';

@Component({
  selector: 'app-justify-absence',
  standalone: true,
  imports: [FormsModule, PageHeaderComponent, CardComponent, BadgeComponent, ButtonComponent, ModalComponent, CurrencyXafPipe, DatePipe],
  template: `
    <app-page-header title="Justificatifs d'absence" subtitle="Validez les justificatifs soumis par les membres" backLink="/sanctions" />

    <div class="justify-container">
      <!-- Filter tabs -->
      <div class="filter-tabs">
        <button [class]="'tab' + (filter() === 'pending' ? ' active' : '')" (click)="filter.set('pending')" type="button">En attente ({{ pendingCount() }})</button>
        <button [class]="'tab' + (filter() === 'all' ? ' active' : '')" (click)="filter.set('all')" type="button">Tous ({{ allCount() }})</button>
      </div>

      @for (just of filteredJustifications(); track just.id) {
        <app-card>
          <div class="justif-item">
            <div class="justif-header">
              <div class="justif-member">
                <span class="member-name">{{ just.memberName }}</span>
                <span class="session-label">{{ just.sessionLabel }} · {{ just.absenceDate }}</span>
              </div>
              <app-badge [variant]="statusVariant(just.status)" size="sm">{{ statusLabel(just.status) }}</app-badge>
            </div>

            <!-- Document info -->
            <div class="document-info">
              <span class="doc-type">📄 {{ just.documentType }}</span>
              @if (just.declared) {
                <app-badge variant="info" size="sm">Absence déclarée le {{ just.declaredAt | date:'dd/MM' }}</app-badge>
              } @else {
                <app-badge variant="warning" size="sm">Non déclarée à l'avance</app-badge>
              }
            </div>

            <!-- Sanction info -->
            <div class="sanction-info">
              <span class="sanction-label">Sanction: {{ just.sanctionAmount | currencyXaf }}</span>
              <app-badge [variant]="just.sanctionPaid ? 'success' : 'danger'" size="sm">{{ just.sanctionPaid ? 'Payée' : 'Non payée' }}</app-badge>
            </div>

            <!-- Validation checklist (only when reviewing) -->
            @if (just.status === 'pending_censor') {
              <div class="checklist">
                <h3 class="checklist-title">✅ Points de contrôle</h3>
                <label class="check-item">
                  <input type="checkbox" [checked]="just.checks.readable" disabled />
                  <span>Document lisible</span>
                </label>
                <label class="check-item">
                  <input type="checkbox" [checked]="just.checks.dated" disabled />
                  <span>Document daté</span>
                </label>
                <label class="check-item">
                  <input type="checkbox" [checked]="just.checks.coversDate" disabled />
                  <span>Couvre la date d'absence</span>
                </label>
                <label class="check-item">
                  <input type="checkbox" [checked]="just.checks.authentic" disabled />
                  <span>Semble authentique</span>
                </label>
                <label class="check-item">
                  <input type="checkbox" [checked]="just.checks.officialStamp" disabled />
                  <span>Cachet/tampon officiel</span>
                </label>
              </div>

              <div class="justif-actions">
                <app-button variant="success" size="sm" (clicked)="openDecisionModal(just, 'validated')">✅ Valider</app-button>
                <app-button variant="outline" size="sm" (clicked)="openDecisionModal(just, 'complement_requested')">❓ Demander complément</app-button>
                <app-button variant="danger" size="sm" (clicked)="openDecisionModal(just, 'rejected')">❌ Rejeter</app-button>
              </div>
            }

            <!-- Decision result -->
            @if (just.censorDecision) {
              <div class="decision-result">
                <span class="decision-label">Décision censeur:</span>
                <app-badge [variant]="just.censorDecision === 'validated' ? 'success' : just.censorDecision === 'rejected' ? 'danger' : 'warning'" size="sm">
                  {{ just.censorDecision === 'validated' ? 'Validé' : just.censorDecision === 'rejected' ? 'Rejeté' : 'Complément demandé' }}
                </app-badge>
                @if (just.censorComment) {
                  <p class="decision-comment">{{ just.censorComment }}</p>
                }
              </div>
            }

            @if (just.presidentDecision) {
              <div class="decision-result">
                <span class="decision-label">Décision président:</span>
                <app-badge [variant]="just.presidentDecision === 'validated' ? 'success' : 'danger'" size="sm">
                  {{ just.presidentDecision === 'validated' ? 'Validé' : 'Rejeté' }}
                </app-badge>
              </div>
            }
          </div>
        </app-card>
      } @empty {
        <app-card>
          <div class="empty-state">
            <span class="empty-icon">✅</span>
            <p class="empty-text">Aucun justificatif {{ filter() === 'pending' ? 'en attente' : '' }}</p>
          </div>
        </app-card>
      }
    </div>

    <!-- Decision Modal -->
    <app-modal [isOpen]="showModal()" [title]="modalTitle()" (closed)="closeModal()">
      <div class="modal-content">
        <p class="modal-desc">{{ modalDescription() }}</p>

        @if (modalAction() === 'validated') {
          <div class="modal-checks">
            <h3 class="checks-title">Confirmez les points de contrôle:</h3>
            <label class="check-item"><input type="checkbox" [(ngModel)]="checkReadable" /> Document lisible</label>
            <label class="check-item"><input type="checkbox" [(ngModel)]="checkDated" /> Document daté</label>
            <label class="check-item"><input type="checkbox" [(ngModel)]="checkCoversDate" /> Couvre la date d'absence</label>
            <label class="check-item"><input type="checkbox" [(ngModel)]="checkAuthentic" /> Semble authentique</label>
            <label class="check-item"><input type="checkbox" [(ngModel)]="checkStamp" /> Cachet/tampon officiel</label>
          </div>
        }

        <textarea class="modal-textarea" rows="3" [placeholder]="modalAction() === 'complement_requested' ? 'Précisez les documents manquants...' : 'Commentaire (optionnel)'" [(ngModel)]="decisionComment"></textarea>
        <div class="modal-actions">
          <app-button variant="outline" (clicked)="closeModal()">Annuler</app-button>
          <app-button [variant]="modalAction() === 'validated' ? 'primary' : modalAction() === 'rejected' ? 'danger' : 'outline'" (clicked)="submitDecision()">Confirmer</app-button>
        </div>
      </div>
    </app-modal>
  `,
  styles: `
    @reference "tailwindcss";
    .justify-container { @apply space-y-4; }
    .filter-tabs { @apply flex gap-2 mb-4; }
    .tab { @apply px-4 py-2 text-sm rounded-lg border border-slate-200 bg-white cursor-pointer hover:bg-slate-50; }
    .tab.active { @apply bg-blue-50 border-blue-300 text-blue-700 font-medium; }
    .justif-item { @apply space-y-3; }
    .justif-header { @apply flex items-center justify-between; }
    .justif-member { @apply flex flex-col; }
    .member-name { @apply text-sm font-semibold text-slate-900; }
    .session-label { @apply text-xs text-slate-500; }
    .document-info { @apply flex items-center gap-3; }
    .doc-type { @apply text-sm text-slate-700; }
    .sanction-info { @apply flex items-center gap-3 p-2 bg-slate-50 rounded-lg; }
    .sanction-label { @apply text-sm text-slate-700; }
    .checklist { @apply space-y-2 p-3 bg-blue-50 rounded-lg; }
    .checklist-title { @apply text-sm font-semibold text-slate-800; }
    .check-item { @apply flex items-center gap-2 text-sm text-slate-700 cursor-pointer; }
    .justif-actions { @apply flex gap-2 pt-2 border-t border-slate-100; }
    .decision-result { @apply flex items-center gap-2 p-2 bg-slate-50 rounded-lg; }
    .decision-label { @apply text-xs text-slate-500; }
    .decision-comment { @apply text-sm text-slate-600 mt-1; }
    .empty-state { @apply flex flex-col items-center gap-2 py-8; }
    .empty-icon { @apply text-4xl; }
    .empty-text { @apply text-sm text-slate-500; }
    .modal-content { @apply space-y-4; }
    .modal-desc { @apply text-sm text-slate-700; }
    .modal-checks { @apply space-y-2 p-3 bg-blue-50 rounded-lg; }
    .checks-title { @apply text-sm font-semibold text-slate-800 mb-2; }
    .modal-textarea { @apply w-full px-3 py-2 border border-slate-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500; }
    .modal-actions { @apply flex justify-end gap-3; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JustifyAbsenceComponent {
  private readonly mock = inject(MockDataService);

  readonly filter = signal<'pending' | 'all'>('pending');
  readonly showModal = signal(false);
  readonly modalAction = signal<'validated' | 'rejected' | 'complement_requested'>('validated');
  readonly currentJustification = signal<AbsenceJustification | null>(null);
  readonly decisionComment = signal('');
  readonly checkReadable = signal(false);
  readonly checkDated = signal(false);
  readonly checkCoversDate = signal(false);
  readonly checkAuthentic = signal(false);
  readonly checkStamp = signal(false);

  pendingCount() { return this.mock.pendingJustifications().length; }
  allCount() { return this.mock.absenceJustifications().length; }

  filteredJustifications() {
    return this.filter() === 'pending' ? this.mock.pendingJustifications() : this.mock.absenceJustifications();
  }

  statusVariant(status: string): 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' {
    switch (status) {
      case 'pending_censor': return 'warning';
      case 'pending_president': return 'info';
      case 'validated': return 'success';
      case 'rejected': return 'danger';
      case 'complement_requested': return 'warning';
      default: return 'info';
    }
  }

  statusLabel(status: string): string {
    switch (status) {
      case 'pending_censor': return 'En attente censeur';
      case 'pending_president': return 'En attente président';
      case 'validated': return 'Validé';
      case 'rejected': return 'Rejeté';
      case 'complement_requested': return 'Complément demandé';
      default: return status;
    }
  }

  modalTitle(): string {
    return this.modalAction() === 'validated' ? 'Valider le justificatif' : this.modalAction() === 'rejected' ? 'Rejeter le justificatif' : 'Demander un complément';
  }

  modalDescription(): string {
    const name = this.currentJustification()?.memberName ?? '';
    return this.modalAction() === 'validated' ? `Valider le justificatif de ${name} ?`
      : this.modalAction() === 'rejected' ? `Rejeter le justificatif de ${name} ?`
      : `Demander un complément de documents pour ${name}.`;
  }

  openDecisionModal(just: AbsenceJustification, action: 'validated' | 'rejected' | 'complement_requested'): void {
    this.currentJustification.set(just);
    this.modalAction.set(action);
    this.decisionComment.set('');
    this.checkReadable.set(false);
    this.checkDated.set(false);
    this.checkCoversDate.set(false);
    this.checkAuthentic.set(false);
    this.checkStamp.set(false);
    this.showModal.set(true);
  }

  closeModal(): void { this.showModal.set(false); }

  submitDecision(): void {
    const just = this.currentJustification();
    if (!just) return;
    const checks = {
      readable: this.checkReadable(),
      dated: this.checkDated(),
      coversDate: this.checkCoversDate(),
      authentic: this.checkAuthentic(),
      officialStamp: this.checkStamp(),
    };
    this.mock.processJustification(just.id, this.modalAction(), this.decisionComment(), checks);
    this.closeModal();
  }
}

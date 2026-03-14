import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../../../core/services/mock-data.service';
import { PageHeaderComponent } from '../../../../shared/components/layout/page-header/page-header.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CurrencyXafPipe } from '../../../../shared/pipes/currency-xaf.pipe';
import { SanctionType } from '../../../../core/enums/sanction-type.enum';

@Component({
  selector: 'app-sanction-apply',
  standalone: true,
  imports: [FormsModule, PageHeaderComponent, CardComponent, BadgeComponent, ButtonComponent, CurrencyXafPipe],
  template: `
    <app-page-header title="Appliquer une sanction" subtitle="Séance en cours: #9 - 22 Mars 2026" backLink="/sanctions" />

    <div class="apply-container">
      <!-- Session context -->
      <div class="session-context">
        <app-badge variant="success" [dot]="true">Séance active</app-badge>
        <span class="context-text">Les sanctions ne peuvent être appliquées que pendant une séance active.</span>
      </div>

      @if (!showConfirmation()) {
        <app-card>
          <div class="form-section">
            <h2 class="form-title">Sélection du membre</h2>
            <div class="search-box">
              <input type="text" class="search-input" placeholder="Rechercher un membre..." [(ngModel)]="searchTerm" />
            </div>
            @if (searchTerm()) {
              <div class="members-list">
                @for (member of filteredMembers(); track member.id) {
                  <div [class]="'member-item' + (selectedMemberId() === member.id ? ' selected' : '')" (click)="selectMember(member.id)">
                    <div class="member-info">
                      <span class="member-name">{{ member.user.firstName }} {{ member.user.lastName }}</span>
                      <app-badge [variant]="member.status === 'active' ? 'success' : 'warning'" size="sm">{{ member.status }}</app-badge>
                    </div>
                    <span class="member-role">{{ member.role }}</span>
                  </div>
                }
              </div>
            }

            @if (selectedMemberId()) {
              <div class="member-summary">
                <span class="summary-label">Sanctions aujourd'hui: <strong>0</strong></span>
                <span class="summary-label">Sanctions impayées: <strong>2</strong> (10 000 XAF)</span>
              </div>
            }
          </div>
        </app-card>

        <app-card>
          <div class="form-section">
            <h2 class="form-title">Type de sanction</h2>
            <div class="type-options">
              @for (opt of sanctionTypes; track opt.value) {
                <label class="type-option">
                  <input type="radio" name="sanctionType" [value]="opt.value" [(ngModel)]="selectedType" />
                  <span class="type-label">{{ opt.label }}</span>
                  <span class="type-amount">{{ opt.amount | currencyXaf }}</span>
                </label>
              }
              <label class="type-option">
                <input type="radio" name="sanctionType" value="custom" [(ngModel)]="selectedType" />
                <span class="type-label">Autre (personnalisée)</span>
                <input type="number" class="custom-amount" placeholder="Montant" [(ngModel)]="customAmount" [disabled]="selectedType() !== 'custom'" />
              </label>
            </div>
          </div>
        </app-card>

        <app-card>
          <div class="form-section">
            <h2 class="form-title">Niveau de gravité</h2>
            <div class="severity-options">
              <label class="severity-option"><input type="radio" name="severity" value="light" [(ngModel)]="severity" /> Léger</label>
              <label class="severity-option"><input type="radio" name="severity" value="medium" [(ngModel)]="severity" /> Moyen</label>
              <label class="severity-option"><input type="radio" name="severity" value="severe" [(ngModel)]="severity" /> Grave</label>
            </div>
          </div>
        </app-card>

        <app-card>
          <div class="form-section">
            <h2 class="form-title">Motif / Description <span class="required">*</span></h2>
            <textarea class="motif-textarea" rows="4" placeholder="Décrivez l'infraction constatée..." [(ngModel)]="reason"></textarea>
          </div>
        </app-card>

        <div class="form-actions">
          <app-button variant="outline" (clicked)="navigate('/sanctions')">Annuler</app-button>
          <app-button variant="primary" [disabled]="!canSubmit()" (clicked)="showConfirmationDialog()">Appliquer la sanction</app-button>
        </div>
      } @else {
        <!-- Confirmation -->
        <app-card>
          <div class="confirmation-section">
            <h2 class="form-title">Récapitulatif de la sanction</h2>
            <div class="recap-grid">
              <div class="recap-row"><span class="recap-label">👤 Membre</span><span class="recap-value">{{ selectedMemberName() }}</span></div>
              <div class="recap-row"><span class="recap-label">⚖️ Type</span><span class="recap-value">{{ selectedTypeLabel() }}</span></div>
              <div class="recap-row"><span class="recap-label">💰 Montant</span><span class="recap-value">{{ computedAmount() | currencyXaf }}</span></div>
              <div class="recap-row"><span class="recap-label">📊 Gravité</span><span class="recap-value">{{ severity() }}</span></div>
              <div class="recap-row"><span class="recap-label">📝 Motif</span><span class="recap-value">{{ reason() }}</span></div>
            </div>
            <p class="confirm-note">Le membre sera notifié immédiatement par SMS, Push et Email.</p>
            <div class="form-actions">
              <app-button variant="outline" (clicked)="showConfirmation.set(false)">Annuler</app-button>
              <app-button variant="primary" (clicked)="confirmSanction()">Confirmer</app-button>
            </div>
          </div>
        </app-card>
      }
    </div>
  `,
  styles: `
    @reference "tailwindcss";
    .apply-container { @apply space-y-6; }
    .session-context { @apply flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg mb-4; }
    .context-text { @apply text-sm text-slate-600; }
    .form-section { @apply space-y-4; }
    .form-title { @apply text-base font-semibold text-slate-900; }
    .required { @apply text-red-500; }
    .search-box { @apply relative; }
    .search-input { @apply w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500; }
    .members-list { @apply border border-slate-200 rounded-lg max-h-48 overflow-y-auto mt-2; }
    .member-item { @apply flex items-center justify-between p-3 cursor-pointer hover:bg-slate-50 border-b border-slate-100 last:border-none; }
    .member-item.selected { @apply bg-blue-50 border-blue-200; }
    .member-info { @apply flex items-center gap-2; }
    .member-name { @apply text-sm font-medium text-slate-800; }
    .member-role { @apply text-xs text-slate-500; }
    .member-summary { @apply flex gap-4 p-3 bg-slate-50 rounded-lg mt-2; }
    .summary-label { @apply text-sm text-slate-600; }
    .type-options { @apply space-y-2; }
    .type-option { @apply flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50; }
    .type-label { @apply flex-1 text-sm text-slate-800; }
    .type-amount { @apply text-sm font-semibold text-slate-900; }
    .custom-amount { @apply w-24 px-2 py-1 border border-slate-300 rounded text-sm; }
    .severity-options { @apply flex gap-4; }
    .severity-option { @apply flex items-center gap-2 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 text-sm; }
    .motif-textarea { @apply w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none; }
    .form-actions { @apply flex justify-end gap-3; }
    .confirmation-section { @apply space-y-4; }
    .recap-grid { @apply space-y-3 p-4 bg-slate-50 rounded-lg; }
    .recap-row { @apply flex items-center justify-between; }
    .recap-label { @apply text-sm text-slate-500; }
    .recap-value { @apply text-sm font-medium text-slate-800; }
    .confirm-note { @apply text-xs text-slate-500 italic; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SanctionApplyComponent {
  private readonly mock = inject(MockDataService);
  private readonly router = inject(Router);

  readonly searchTerm = signal('');
  readonly selectedMemberId = signal<string | null>(null);
  readonly selectedType = signal<string>('');
  readonly customAmount = signal(0);
  readonly severity = signal('');
  readonly reason = signal('');
  readonly showConfirmation = signal(false);

  readonly sanctionTypes = [
    { value: SanctionType.LATE, label: 'Retard', amount: 1000 },
    { value: SanctionType.ABSENCE, label: 'Absence non justifiée', amount: 2000 },
    { value: SanctionType.OTHER, label: 'Trouble à l\'ordre', amount: 5000 },
    { value: SanctionType.CONTRIBUTION_LATE, label: 'Non-paiement cotisation', amount: 1500 },
  ];

  filteredMembers() {
    const term = this.searchTerm().toLowerCase();
    if (!term) return [];
    return this.mock.members().filter(m =>
      m.status === 'active' && (`${m.user.firstName} ${m.user.lastName}`).toLowerCase().includes(term),
    );
  }

  selectMember(id: string): void {
    this.selectedMemberId.set(id);
  }

  selectedMemberName(): string {
    const m = this.mock.members().find(m => m.id === this.selectedMemberId());
    return m ? `${m.user.firstName} ${m.user.lastName}` : '';
  }

  selectedTypeLabel(): string {
    const t = this.sanctionTypes.find(t => t.value === this.selectedType());
    return t ? t.label : 'Personnalisée';
  }

  computedAmount(): number {
    if (this.selectedType() === 'custom') return this.customAmount();
    const t = this.sanctionTypes.find(t => t.value === this.selectedType());
    return t ? t.amount : 0;
  }

  canSubmit(): boolean {
    return !!this.selectedMemberId() && !!this.selectedType() && !!this.reason() && !!this.severity() && this.computedAmount() >= 0;
  }

  showConfirmationDialog(): void {
    this.showConfirmation.set(true);
  }

  confirmSanction(): void {
    const type = this.selectedType() === 'custom' ? SanctionType.OTHER : this.selectedType() as SanctionType;
    this.mock.applySanction(this.selectedMemberId()!, type, this.computedAmount(), this.reason(), 'sess-009');
    this.router.navigate(['/sanctions']);
  }

  navigate(path: string): void {
    this.router.navigate([path]);
  }
}

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MockDataService } from '../../../../core/services/mock-data.service';
import { PageHeaderComponent } from '../../../../shared/components/layout/page-header/page-header.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CurrencyXafPipe } from '../../../../shared/pipes/currency-xaf.pipe';

@Component({
  selector: 'app-sanction-auto-confirm',
  standalone: true,
  imports: [PageHeaderComponent, CardComponent, BadgeComponent, ButtonComponent, CurrencyXafPipe],
  template: `
    <app-page-header title="Confirmation des sanctions automatiques" subtitle="Séance #9 - 22 Mars 2026" backLink="/sanctions" />

    <div class="auto-container">
      <div class="info-banner">
        <span class="info-icon">⚠️</span>
        <span class="info-text">Ces sanctions ont été détectées automatiquement lors de la clôture des présences. Elles nécessitent votre confirmation pour être appliquées.</span>
      </div>

      <!-- Late arrivals -->
      <app-card>
        <div class="section">
          <div class="section-header">
            <h2 class="section-title">⏰ Retards détectés ({{ lateItems().length }})</h2>
            <div class="section-actions">
              <app-button variant="outline" size="sm" (clicked)="selectAllLate()">Tout sélectionner</app-button>
              <app-button variant="outline" size="sm" (clicked)="deselectAllLate()">Tout désélectionner</app-button>
            </div>
          </div>
          @for (item of lateItems(); track item.id) {
            <div [class]="'auto-item' + (item.selected ? ' selected' : '')" (click)="toggle(item.id)">
              <div class="item-check">
                <input type="checkbox" [checked]="item.selected" (click)="$event.stopPropagation()" (change)="toggle(item.id)" />
              </div>
              <div class="item-info">
                <span class="item-name">{{ item.memberName }}</span>
                <span class="item-detail">Arrivée: {{ item.arrivalTime }} (+{{ item.lateMinutes }} min)</span>
              </div>
              <span class="item-amount">{{ item.amount | currencyXaf }}</span>
              @if (item.justificationPending) {
                <app-badge variant="warning" size="sm">Justif. en attente</app-badge>
              }
            </div>
          }
        </div>
      </app-card>

      <!-- Absences -->
      <app-card>
        <div class="section">
          <div class="section-header">
            <h2 class="section-title">🚫 Absences détectées ({{ absenceItems().length }})</h2>
            <div class="section-actions">
              <app-button variant="outline" size="sm" (clicked)="selectAllAbsence()">Tout sélectionner</app-button>
              <app-button variant="outline" size="sm" (clicked)="deselectAllAbsence()">Tout désélectionner</app-button>
            </div>
          </div>
          @for (item of absenceItems(); track item.id) {
            <div [class]="'auto-item' + (item.selected ? ' selected' : '')" (click)="toggle(item.id)">
              <div class="item-check">
                <input type="checkbox" [checked]="item.selected" (click)="$event.stopPropagation()" (change)="toggle(item.id)" />
              </div>
              <div class="item-info">
                <span class="item-name">{{ item.memberName }}</span>
                <span class="item-detail">
                  {{ item.signaled ? 'Signalé' : 'Non signalé' }}
                  @if (item.justificationPending) { — justificatif en attente }
                </span>
              </div>
              <span class="item-amount">{{ item.amount | currencyXaf }}</span>
              @if (item.justificationPending) {
                <app-badge variant="warning" size="sm">Justif. en attente</app-badge>
              }
            </div>
          }
        </div>
      </app-card>

      <!-- Summary -->
      <app-card>
        <div class="summary-section">
          <h2 class="section-title">📋 Récapitulatif</h2>
          <div class="summary-grid">
            <div class="summary-item">
              <span class="summary-label">Retards sélectionnés</span>
              <span class="summary-value">{{ selectedLateCount() }}/{{ lateItems().length }} → {{ selectedLateAmount() | currencyXaf }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Absences sélectionnées</span>
              <span class="summary-value">{{ selectedAbsenceCount() }}/{{ absenceItems().length }} → {{ selectedAbsenceAmount() | currencyXaf }}</span>
            </div>
            <div class="summary-item summary-total">
              <span class="summary-label">Total</span>
              <span class="summary-value">{{ totalSelectedAmount() | currencyXaf }}</span>
            </div>
          </div>
          <p class="summary-tip">💡 Conseil: Ne confirmez pas les sanctions pour les membres ayant un justificatif en attente de validation.</p>
        </div>
      </app-card>

      <div class="form-actions">
        <app-button variant="outline" (clicked)="navigate('/sanctions')">Annuler tout</app-button>
        <app-button variant="primary" [disabled]="selectedCount() === 0" (clicked)="confirmSelected()">
          Confirmer les sanctions sélectionnées ({{ selectedCount() }})
        </app-button>
      </div>
    </div>
  `,
  styles: `
    @reference "tailwindcss";
    .auto-container { @apply space-y-6; }
    .info-banner { @apply flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg; }
    .info-icon { @apply text-xl; }
    .info-text { @apply text-sm text-slate-700; }
    .section { @apply space-y-3; }
    .section-header { @apply flex items-center justify-between; }
    .section-title { @apply text-base font-semibold text-slate-900; }
    .section-actions { @apply flex gap-2; }
    .auto-item { @apply flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50; }
    .auto-item.selected { @apply bg-blue-50 border-blue-300; }
    .item-check input { @apply w-4 h-4 rounded border-slate-300 cursor-pointer; }
    .item-info { @apply flex-1 flex flex-col; }
    .item-name { @apply text-sm font-medium text-slate-800; }
    .item-detail { @apply text-xs text-slate-500; }
    .item-amount { @apply text-sm font-semibold text-slate-900; }
    .summary-section { @apply space-y-4; }
    .summary-grid { @apply space-y-2; }
    .summary-item { @apply flex items-center justify-between py-2 border-b border-slate-100; }
    .summary-total { @apply border-t-2 border-slate-300 pt-3 font-semibold; }
    .summary-label { @apply text-sm text-slate-600; }
    .summary-value { @apply text-sm font-medium text-slate-900; }
    .summary-tip { @apply text-xs text-amber-600 italic; }
    .form-actions { @apply flex justify-end gap-3; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SanctionAutoConfirmComponent {
  private readonly mock = inject(MockDataService);
  private readonly router = inject(Router);

  lateItems() { return this.mock.autoDetectedSanctions().filter(s => s.type === 'late'); }
  absenceItems() { return this.mock.autoDetectedSanctions().filter(s => s.type === 'absence'); }

  selectedLateCount() { return this.lateItems().filter(s => s.selected).length; }
  selectedAbsenceCount() { return this.absenceItems().filter(s => s.selected).length; }
  selectedLateAmount() { return this.lateItems().filter(s => s.selected).reduce((sum, s) => sum + s.amount, 0); }
  selectedAbsenceAmount() { return this.absenceItems().filter(s => s.selected).reduce((sum, s) => sum + s.amount, 0); }
  totalSelectedAmount() { return this.selectedLateAmount() + this.selectedAbsenceAmount(); }
  selectedCount() { return this.selectedLateCount() + this.selectedAbsenceCount(); }

  toggle(id: string): void { this.mock.toggleAutoSanction(id); }
  selectAllLate(): void { this.mock.selectAllAutoSanctions('late'); }
  deselectAllLate(): void { this.mock.deselectAllAutoSanctions('late'); }
  selectAllAbsence(): void { this.mock.selectAllAutoSanctions('absence'); }
  deselectAllAbsence(): void { this.mock.deselectAllAutoSanctions('absence'); }

  confirmSelected(): void {
    this.mock.confirmAutoSanctions();
    this.router.navigate(['/sanctions']);
  }

  navigate(path: string): void { this.router.navigate([path]); }
}

import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MockDataService } from '../../../../core/services/mock-data.service';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';

@Component({
  selector: 'app-odj-preparation',
  standalone: true,
  imports: [CardComponent, BadgeComponent, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page-header">
      <div>
        <h1 class="page-title">📋 Préparation de l'Ordre du Jour</h1>
        <p class="page-subtitle">Séance #9 — 22 mars 2026</p>
      </div>
      <div class="header-actions">
        <app-badge [variant]="statusVariant()" size="sm">{{ statusLabel() }}</app-badge>
        @if (mock.odjStatus() === 'draft' || mock.odjStatus() === 'revision_requested') {
          <app-button variant="primary" (clicked)="submitOdj()">📤 Soumettre au Président</app-button>
        }
      </div>
    </div>

    @if (mock.odjStatus() === 'revision_requested') {
      <div class="revision-alert">
        <span>⚠️ <strong>Révision demandée par le Président :</strong></span>
        <p>{{ mock._odjPresidentComment() }}</p>
      </div>
    }

    @if (mock.odjStatus() === 'validated') {
      <div class="validated-alert">
        <span>✅ L'ODJ a été validé par le Président. Il est prêt pour envoi avec les convocations.</span>
      </div>
    }

    <!-- Standard + Custom Items -->
    <app-card>
      <div class="card-body">
        <div class="card-title-row">
          <h2 class="section-title">Points de l'ordre du jour ({{ mock.odjItems().length }})</h2>
        </div>
        <div class="odj-list">
          @for (item of mock.odjItems(); track item.id) {
            <div class="odj-item" [class.odj-standard]="item.isStandard" [class.odj-custom]="!item.isStandard">
              <span class="odj-order">{{ item.order }}</span>
              <div class="odj-content">
                <span class="odj-title">{{ item.title }}</span>
                @if (item.details) {
                  <span class="odj-details">{{ item.details }}</span>
                }
              </div>
              <div class="odj-actions">
                @if (item.isStandard) {
                  <app-badge variant="secondary" size="sm">Standard</app-badge>
                } @else {
                  <app-badge variant="info" size="sm">Ajouté</app-badge>
                  @if (mock.odjStatus() === 'draft' || mock.odjStatus() === 'revision_requested') {
                    <button class="remove-btn" (click)="removeItem(item.id)" type="button">✕</button>
                  }
                }
              </div>
            </div>
          }
        </div>
      </div>
    </app-card>

    <!-- Suggestions -->
    @if (mock.odjSuggestions().some(s => !s.added) && (mock.odjStatus() === 'draft' || mock.odjStatus() === 'revision_requested')) {
      <app-card>
        <div class="card-body">
          <h2 class="section-title">💡 Suggestions de points</h2>
          <p class="suggestion-hint">Points suggérés automatiquement selon les événements en cours</p>
          @for (sug of mock.odjSuggestions(); track sug.id) {
            @if (!sug.added) {
              <div class="suggestion-item">
                <div class="suggestion-content">
                  <span class="suggestion-title">{{ sug.title }}</span>
                  <span class="suggestion-reason">{{ sug.reason }}</span>
                </div>
                <app-button variant="outline" size="sm" (clicked)="addSuggestion(sug.id)">+ Ajouter</app-button>
              </div>
            }
          }
        </div>
      </app-card>
    }

    <!-- Add Custom Item -->
    @if (mock.odjStatus() === 'draft' || mock.odjStatus() === 'revision_requested') {
      <app-card>
        <div class="card-body">
          <h2 class="section-title">➕ Ajouter un point personnalisé</h2>
          <div class="add-item-row">
            <input class="add-input" type="text" placeholder="Intitulé du point..." [value]="newItemTitle()" (input)="newItemTitle.set($any($event.target).value)" />
            <app-button variant="primary" size="sm" [disabled]="!newItemTitle().trim()" (clicked)="addCustomItem()">Ajouter</app-button>
          </div>
        </div>
      </app-card>
    }
  `,
  styles: [`
    @reference "tailwindcss";
    .page-header { @apply flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6; }
    .page-title { @apply text-2xl font-bold text-slate-900; }
    .page-subtitle { @apply text-sm text-slate-500 mt-1; }
    .header-actions { @apply flex items-center gap-3; }

    .revision-alert { @apply bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4 text-sm text-amber-800; }
    .revision-alert p { @apply mt-1 italic; }
    .validated-alert { @apply bg-green-50 border border-green-200 rounded-lg p-4 mb-4 text-sm text-green-800; }

    .card-body { @apply p-2; }
    .card-title-row { @apply flex justify-between items-center mb-4; }
    .section-title { @apply text-base font-semibold text-slate-900; }

    .odj-list { @apply space-y-1; }
    .odj-item { @apply flex items-center gap-3 p-3 rounded-lg border border-slate-100; }
    .odj-standard { @apply bg-slate-50; }
    .odj-custom { @apply bg-blue-50 border-blue-100; }
    .odj-order { @apply w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-700 flex-shrink-0; }
    .odj-content { @apply flex-1 flex flex-col; }
    .odj-title { @apply text-sm font-medium text-slate-800; }
    .odj-details { @apply text-xs text-slate-500 mt-0.5; }
    .odj-actions { @apply flex items-center gap-2; }
    .remove-btn { @apply text-red-400 hover:text-red-600 text-sm bg-transparent border-none cursor-pointer; }

    .suggestion-hint { @apply text-xs text-slate-500 mb-3; }
    .suggestion-item { @apply flex items-center justify-between gap-3 p-3 border-b border-slate-100 last:border-none; }
    .suggestion-content { @apply flex flex-col; }
    .suggestion-title { @apply text-sm font-medium text-slate-800; }
    .suggestion-reason { @apply text-xs text-slate-500 mt-0.5; }

    .add-item-row { @apply flex gap-3 mt-2; }
    .add-input { @apply flex-1 px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500; }
  `],
})
export class OdjPreparationComponent {
  protected readonly mock = inject(MockDataService);
  private readonly router = inject(Router);

  readonly newItemTitle = signal('');

  statusVariant(): 'success' | 'warning' | 'info' | 'danger' {
    const s = this.mock.odjStatus();
    if (s === 'validated') return 'success';
    if (s === 'submitted') return 'info';
    if (s === 'revision_requested') return 'danger';
    return 'warning';
  }

  statusLabel(): string {
    const s = this.mock.odjStatus();
    if (s === 'validated') return 'Validé ✅';
    if (s === 'submitted') return 'En attente de validation';
    if (s === 'revision_requested') return 'Révision demandée';
    return 'Brouillon';
  }

  removeItem(id: string): void {
    this.mock.removeOdjItem(id);
  }

  addSuggestion(id: string): void {
    this.mock.addOdjSuggestion(id);
  }

  addCustomItem(): void {
    const title = this.newItemTitle().trim();
    if (title) {
      this.mock.addOdjItem(title);
      this.newItemTitle.set('');
    }
  }

  submitOdj(): void {
    this.mock.submitOdj();
  }
}

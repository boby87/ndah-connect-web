import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MockDataService } from '../../../../core/services/mock-data.service';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';

@Component({
  selector: 'app-archives',
  standalone: true,
  imports: [CardComponent, BadgeComponent, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page-header">
      <div>
        <h1 class="page-title">📂 Archives & Documents</h1>
        <p class="page-subtitle">Gestion des documents officiels de la tontine</p>
      </div>
      <div class="header-actions">
        <app-button variant="primary" (clicked)="showArchiveForm.set(true)">📤 Archiver un document</app-button>
      </div>
    </div>

    <!-- Archive Form -->
    @if (showArchiveForm()) {
      <app-card>
        <div class="card-body">
          <h2 class="section-title">➕ Archiver un nouveau document</h2>
          <div class="form-grid">
            <div class="form-field">
              <label class="form-label">Titre</label>
              <input class="form-input" type="text" [value]="archiveTitle()" (input)="archiveTitle.set($any($event.target).value)" placeholder="Ex: PV Séance #9" />
            </div>
            <div class="form-field">
              <label class="form-label">Type</label>
              <select class="form-input" [value]="archiveType()" (change)="archiveType.set($any($event.target).value)">
                <option value="minutes">Procès-verbal</option>
                <option value="report">Rapport</option>
                <option value="rules">Règlement</option>
                <option value="receipt">Reçu financier</option>
                <option value="other">Autre</option>
              </select>
            </div>
            <div class="form-field col-span-2">
              <label class="form-label">Description</label>
              <textarea class="form-input" [value]="archiveDesc()" (input)="archiveDesc.set($any($event.target).value)" rows="2" placeholder="Description du document..."></textarea>
            </div>
          </div>
          <div class="form-actions">
            <app-button variant="secondary" (clicked)="showArchiveForm.set(false)">Annuler</app-button>
            <app-button variant="primary" [disabled]="!archiveTitle().trim()" (clicked)="archiveDocument()">Archiver</app-button>
          </div>
        </div>
      </app-card>
    }

    <!-- Filter tabs -->
    <div class="filter-tabs">
      <button [class]="'tab' + (currentFilter() === 'all' ? ' tab-active' : '')" (click)="currentFilter.set('all')" type="button">Tous ({{ mock.documents().length }})</button>
      <button [class]="'tab' + (currentFilter() === 'minutes' ? ' tab-active' : '')" (click)="currentFilter.set('minutes')" type="button">PV ({{ docCount('minutes') }})</button>
      <button [class]="'tab' + (currentFilter() === 'report' ? ' tab-active' : '')" (click)="currentFilter.set('report')" type="button">Rapports ({{ docCount('report') }})</button>
      <button [class]="'tab' + (currentFilter() === 'rules' ? ' tab-active' : '')" (click)="currentFilter.set('rules')" type="button">Règlements ({{ docCount('rules') }})</button>
      <button [class]="'tab' + (currentFilter() === 'receipt' ? ' tab-active' : '')" (click)="currentFilter.set('receipt')" type="button">Reçus ({{ docCount('receipt') }})</button>
    </div>

    <!-- Document List -->
    <div class="doc-grid">
      @for (doc of filteredDocs(); track doc.id) {
        <app-card class="doc-card">
          <div class="doc-body">
            <div class="doc-icon">
              @switch (doc.type) {
                @case ('minutes') { 📝 }
                @case ('report') { 📊 }
                @case ('rules') { 📜 }
                @case ('receipt') { 💰 }
                @default { 📄 }
              }
            </div>
            <div class="doc-info">
              <span class="doc-title">{{ doc.title }}</span>
              @if (doc.description) {
                <span class="doc-desc">{{ doc.description }}</span>
              }
              <div class="doc-meta">
                <app-badge [variant]="docTypeVariant(doc.type)" size="sm">{{ docTypeLabel(doc.type) }}</app-badge>
                <span class="doc-date">{{ formatDate(doc.createdAt) }}</span>
                <span class="doc-size">{{ formatSize(doc.fileSize) }}</span>
              </div>
            </div>
          </div>
        </app-card>
      }
    </div>

    @if (filteredDocs().length === 0) {
      <app-card>
        <div class="empty-state">
          <span class="empty-icon">📂</span>
          <p class="empty-text">Aucun document dans cette catégorie</p>
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

    .card-body { @apply p-2; }
    .section-title { @apply text-base font-semibold text-slate-900 mb-4; }

    .form-grid { @apply grid grid-cols-1 sm:grid-cols-2 gap-4; }
    .col-span-2 { @apply sm:col-span-2; }
    .form-field { @apply flex flex-col gap-1; }
    .form-label { @apply text-xs font-medium text-slate-600; }
    .form-input { @apply px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500; }
    .form-actions { @apply flex justify-end gap-3 mt-4; }

    .filter-tabs { @apply flex gap-1 overflow-x-auto mb-4; }
    .tab { @apply px-4 py-2 text-sm rounded-lg border border-slate-200 bg-white text-slate-600 cursor-pointer hover:bg-slate-50 flex-shrink-0; }
    .tab-active { @apply bg-blue-50 border-blue-200 text-blue-700 font-medium; }

    .doc-grid { @apply space-y-2; }
    .doc-card { @apply cursor-pointer hover:shadow-md transition-shadow; }
    .doc-body { @apply flex items-start gap-3 p-1; }
    .doc-icon { @apply text-2xl flex-shrink-0; }
    .doc-info { @apply flex flex-col gap-1 flex-1; }
    .doc-title { @apply text-sm font-medium text-slate-800; }
    .doc-desc { @apply text-xs text-slate-500 line-clamp-1; }
    .doc-meta { @apply flex items-center gap-2 flex-wrap; }
    .doc-date { @apply text-xs text-slate-400; }
    .doc-size { @apply text-xs text-slate-400; }

    .empty-state { @apply flex flex-col items-center py-12; }
    .empty-icon { @apply text-4xl mb-2; }
    .empty-text { @apply text-slate-500; }
  `],
})
export class ArchivesComponent {
  protected readonly mock = inject(MockDataService);

  readonly currentFilter = signal('all');
  readonly showArchiveForm = signal(false);
  readonly archiveTitle = signal('');
  readonly archiveType = signal('minutes');
  readonly archiveDesc = signal('');

  docCount(type: string): number {
    return this.mock.documents().filter(d => d.type === type).length;
  }

  filteredDocs() {
    const f = this.currentFilter();
    return f === 'all' ? this.mock.documents() : this.mock.documents().filter(d => d.type === f);
  }

  docTypeVariant(type: string): 'success' | 'warning' | 'info' | 'primary' | 'secondary' {
    if (type === 'minutes') return 'primary';
    if (type === 'report') return 'info';
    if (type === 'rules') return 'warning';
    if (type === 'receipt') return 'success';
    return 'secondary';
  }

  docTypeLabel(type: string): string {
    if (type === 'minutes') return 'PV';
    if (type === 'report') return 'Rapport';
    if (type === 'rules') return 'Règlement';
    if (type === 'receipt') return 'Reçu';
    return 'Autre';
  }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  formatSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' o';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' Ko';
    return (bytes / 1048576).toFixed(1) + ' Mo';
  }

  archiveDocument(): void {
    const title = this.archiveTitle().trim();
    if (!title) return;
    this.mock.archiveDocument(title, this.archiveType(), this.archiveDesc());
    this.archiveTitle.set('');
    this.archiveDesc.set('');
    this.showArchiveForm.set(false);
  }
}

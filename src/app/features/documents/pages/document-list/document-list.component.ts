import { ChangeDetectionStrategy, Component, inject, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { PageHeaderComponent } from '../../../../shared/components/layout/page-header/page-header.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { MockDataService } from '../../../../core/services/mock-data.service';

@Component({
  selector: 'app-document-list',
  standalone: true,
  imports: [PageHeaderComponent, ButtonComponent, CardComponent, BadgeComponent],
  template: `
    <app-page-header title="Documents" />

    <div class="filter-tabs">
      <button [class]="'tab' + (filter() === 'all' ? ' active' : '')" (click)="filter.set('all')">Tous ({{ mock.documents().length }})</button>
      <button [class]="'tab' + (filter() === 'agenda' ? ' active' : '')" (click)="filter.set('agenda')">Ordres du jour</button>
      <button [class]="'tab' + (filter() === 'minutes' ? ' active' : '')" (click)="filter.set('minutes')">Procès-verbaux</button>
      <button [class]="'tab' + (filter() === 'report' ? ' active' : '')" (click)="filter.set('report')">Rapports</button>
      <button [class]="'tab' + (filter() === 'rules' ? ' active' : '')" (click)="filter.set('rules')">Règlements</button>
    </div>

    <div class="doc-list">
      @for (doc of filteredDocs(); track doc.id) {
        <app-card class="doc-card">
          <div class="card-body">
            <div class="card-top">
              <span class="doc-icon">{{ getDocIcon(doc.type) }}</span>
              <div class="doc-info">
                <h3 class="doc-title">{{ doc.title }}</h3>
                <p class="doc-desc">{{ doc.description }}</p>
              </div>
              <app-badge variant="secondary" size="sm">{{ getTypeLabel(doc.type) }}</app-badge>
            </div>
            <div class="card-meta">
              <span class="meta-item">📄 {{ doc.fileName }}</span>
              <span class="meta-item">📏 {{ formatFileSize(doc.fileSize) }}</span>
              <span class="meta-item">📅 {{ doc.createdAt }}</span>
            </div>
            @if (needsValidation(doc)) {
              <div class="validation-bar">
                <span class="validation-text">⚠️ En attente de validation du Président</span>
                <div class="validation-actions">
                  <app-button variant="primary" size="sm" (clicked)="validateDoc(doc.id)">✅ Valider</app-button>
                  <app-button variant="danger" size="sm" (clicked)="rejectDoc(doc.id)">❌ Rejeter</app-button>
                </div>
              </div>
            }
          </div>
        </app-card>
      } @empty {
        <div class="empty-state">Aucun document dans cette catégorie</div>
      }
    </div>
  `,
  styles: `@reference "tailwindcss";
    .filter-tabs { @apply flex gap-2 mb-6 flex-wrap; }
    .tab { @apply px-3 py-1.5 rounded-lg text-sm font-medium bg-white border border-slate-200 text-slate-600 cursor-pointer hover:bg-slate-50; }
    .tab.active { @apply bg-blue-600 text-white border-blue-600; }
    .doc-list { @apply flex flex-col gap-4; }
    .doc-card { @apply cursor-default; }
    .card-body { @apply p-2 flex flex-col gap-3; }
    .card-top { @apply flex items-start gap-3; }
    .doc-icon { @apply text-2xl flex-shrink-0; }
    .doc-info { @apply flex-1; }
    .doc-title { @apply font-semibold text-slate-900; }
    .doc-desc { @apply text-sm text-slate-500 mt-0.5; }
    .card-meta { @apply flex gap-4 text-xs text-slate-400; }
    .meta-item { @apply flex items-center gap-1; }
    .validation-bar { @apply bg-amber-50 rounded-lg p-3 flex justify-between items-center; }
    .validation-text { @apply text-sm text-amber-700 font-medium; }
    .validation-actions { @apply flex gap-2; }
    .empty-state { @apply text-center py-12 text-slate-400; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentListComponent {
  protected readonly router = inject(Router);
  protected readonly mock = inject(MockDataService);

  readonly filter = signal<'all' | 'agenda' | 'minutes' | 'report' | 'rules'>('all');

  readonly filteredDocs = computed(() => {
    const f = this.filter();
    return f === 'all' ? this.mock.documents() : this.mock.documents().filter(d => d.type === f);
  });

  getDocIcon(type: string): string {
    const map: Record<string, string> = { agenda: '📋', minutes: '📝', report: '📊', rules: '📜' };
    return map[type] ?? '📄';
  }

  getTypeLabel(type: string): string {
    const map: Record<string, string> = { agenda: 'Ordre du jour', minutes: 'Procès-verbal', report: 'Rapport', rules: 'Règlement' };
    return map[type] ?? type;
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    return Math.round(bytes / 1024) + ' KB';
  }

  needsValidation(doc: any): boolean {
    return doc.type === 'agenda' && this.mock.pendingValidations().some(v => v.type === 'agenda');
  }

  validateDoc(docId: string): void {
    const pv = this.mock.pendingValidations().find(v => v.type === 'agenda');
    if (pv) this.mock.approveValidation(pv.id, 'Document validé');
  }

  rejectDoc(docId: string): void {
    const pv = this.mock.pendingValidations().find(v => v.type === 'agenda');
    if (pv) this.mock.rejectValidation(pv.id, 'Document rejeté');
  }
}

import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MockDataService } from '../../../../core/services/mock-data.service';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';

@Component({
  selector: 'app-pv-editor',
  standalone: true,
  imports: [CardComponent, BadgeComponent, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page-header">
      <div>
        <h1 class="page-title">📝 Procès-Verbal</h1>
        <p class="page-subtitle">Séance #8 — 8 mars 2026</p>
      </div>
      <div class="header-actions">
        <app-badge [variant]="pvStatusVariant()" size="sm">{{ pvStatusLabel() }}</app-badge>
        @switch (mock.pvStatus()) {
          @case ('draft') {
            <app-button variant="primary" (clicked)="submitPv()">📤 Soumettre pour signature</app-button>
          }
          @case ('submitted') {
            <app-button variant="primary" (clicked)="signAsSecretary()">✍️ Signer (Secrétaire)</app-button>
          }
          @case ('secretary_signed') {
            <app-button variant="primary" (clicked)="signAsPresident()">✍️ Signer (Président)</app-button>
          }
        }
      </div>
    </div>

    <!-- Signature Progress -->
    <div class="signature-progress">
      <div [class]="'sig-step' + (stepCompleted('draft') ? ' sig-done' : '')">
        <span class="sig-icon">📝</span>
        <span class="sig-label">Rédaction</span>
      </div>
      <div class="sig-line" [class.sig-line-done]="stepCompleted('submitted')"></div>
      <div [class]="'sig-step' + (stepCompleted('submitted') ? ' sig-done' : '')">
        <span class="sig-icon">📤</span>
        <span class="sig-label">Soumis</span>
      </div>
      <div class="sig-line" [class.sig-line-done]="stepCompleted('secretary_signed')"></div>
      <div [class]="'sig-step' + (stepCompleted('secretary_signed') ? ' sig-done' : '')">
        <span class="sig-icon">✍️</span>
        <span class="sig-label">Signé Secrétaire</span>
      </div>
      <div class="sig-line" [class.sig-line-done]="stepCompleted('archived')"></div>
      <div [class]="'sig-step' + (stepCompleted('archived') ? ' sig-done' : '')">
        <span class="sig-icon">✅</span>
        <span class="sig-label">Signé & Archivé</span>
      </div>
    </div>

    <!-- PV Sections -->
    <app-card>
      <div class="card-body">
        <h2 class="section-title">📄 Sections du Procès-Verbal</h2>
        @for (section of mock.pvSections(); track section.id) {
          <div class="pv-section">
            <div class="pv-section-header">
              <span class="pv-section-order">{{ section.order }}</span>
              <span class="pv-section-title">{{ section.title }}</span>
              @if (section.isAuto) {
                <app-badge variant="info" size="sm">Auto</app-badge>
              }
            </div>
            @if (mock.pvStatus() === 'draft' || mock.pvStatus() === 'pending') {
              <textarea class="pv-textarea" [value]="section.content" (input)="updateSection(section.id, $any($event.target).value)" [rows]="getRows(section.content)" [readOnly]="section.isAuto"></textarea>
            } @else {
              <div class="pv-content">{{ section.content }}</div>
            }
          </div>
        }
      </div>
    </app-card>

    <!-- Attachments -->
    <app-card>
      <div class="card-body">
        <h2 class="section-title">📎 Pièces jointes</h2>
        @for (att of mock.pvAttachments(); track att.id) {
          <div class="attachment-row">
            <div class="att-info">
              <span class="att-name">{{ att.name }}</span>
              @if (att.isAuto) {
                <app-badge variant="info" size="sm">Auto-généré</app-badge>
              }
            </div>
            <app-badge [variant]="att.attached ? 'success' : 'secondary'" size="sm">
              {{ att.attached ? '✅ Attaché' : 'Non attaché' }}
            </app-badge>
          </div>
        }
      </div>
    </app-card>

    <!-- Meta Info -->
    <app-card>
      <div class="card-body">
        <h2 class="section-title">ℹ️ Informations</h2>
        <div class="meta-grid">
          <div class="meta-row">
            <span class="meta-label">Rédigé par :</span>
            <span>Marie NGUEMO (Secrétaire)</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">Séance du :</span>
            <span>08 mars 2026</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">Présents :</span>
            <span>{{ mock.attendanceSummary().present + mock.attendanceSummary().late }} / {{ mock.attendance().length }}</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">Signature Secrétaire :</span>
            <app-badge [variant]="mock.pvStatus() === 'secretary_signed' || mock.pvStatus() === 'archived' ? 'success' : 'secondary'" size="sm">
              {{ mock.pvStatus() === 'secretary_signed' || mock.pvStatus() === 'archived' ? '✅ Signé' : 'En attente' }}
            </app-badge>
          </div>
          <div class="meta-row">
            <span class="meta-label">Signature Président :</span>
            <app-badge [variant]="mock.pvStatus() === 'archived' ? 'success' : 'secondary'" size="sm">
              {{ mock.pvStatus() === 'archived' ? '✅ Signé' : 'En attente' }}
            </app-badge>
          </div>
        </div>
      </div>
    </app-card>
  `,
  styles: [`
    @reference "tailwindcss";
    .page-header { @apply flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6; }
    .page-title { @apply text-2xl font-bold text-slate-900; }
    .page-subtitle { @apply text-sm text-slate-500 mt-1; }
    .header-actions { @apply flex items-center gap-3 flex-wrap; }

    .signature-progress { @apply flex items-center justify-center gap-2 mb-6 py-4 bg-slate-50 rounded-xl; }
    .sig-step { @apply flex flex-col items-center gap-1 opacity-40; }
    .sig-done { @apply opacity-100; }
    .sig-icon { @apply text-xl; }
    .sig-label { @apply text-xs text-slate-600; }
    .sig-line { @apply w-12 h-0.5 bg-slate-300; }
    .sig-line-done { @apply bg-green-500; }

    .card-body { @apply p-2; }
    .section-title { @apply text-base font-semibold text-slate-900 mb-4; }

    .pv-section { @apply mb-4 last:mb-0; }
    .pv-section-header { @apply flex items-center gap-2 mb-2; }
    .pv-section-order { @apply w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-700; }
    .pv-section-title { @apply text-sm font-semibold text-slate-800; }
    .pv-textarea { @apply w-full px-3 py-2 rounded-lg border border-slate-300 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y; }
    .pv-content { @apply text-sm text-slate-700 leading-relaxed bg-slate-50 rounded-lg p-3 whitespace-pre-wrap; }

    .attachment-row { @apply flex items-center justify-between p-3 border-b border-slate-100 last:border-none; }
    .att-info { @apply flex items-center gap-2; }
    .att-name { @apply text-sm text-slate-800; }

    .meta-grid { @apply space-y-2; }
    .meta-row { @apply flex items-center justify-between text-sm; }
    .meta-label { @apply text-slate-500 font-medium; }
  `],
})
export class PvEditorComponent {
  protected readonly mock = inject(MockDataService);

  private readonly statusOrder = ['pending', 'draft', 'submitted', 'secretary_signed', 'archived'];

  pvStatusVariant(): 'success' | 'warning' | 'info' | 'danger' {
    const s = this.mock.pvStatus();
    if (s === 'archived') return 'success';
    if (s === 'secretary_signed' || s === 'submitted') return 'info';
    return 'warning';
  }

  pvStatusLabel(): string {
    const s = this.mock.pvStatus();
    if (s === 'archived') return 'Signé & Archivé ✅';
    if (s === 'secretary_signed') return 'Signé par Secrétaire';
    if (s === 'submitted') return 'Soumis pour signature';
    if (s === 'draft') return 'Brouillon';
    return 'En attente';
  }

  stepCompleted(step: string): boolean {
    const currentIdx = this.statusOrder.indexOf(this.mock.pvStatus());
    const stepIdx = this.statusOrder.indexOf(step);
    return currentIdx >= stepIdx;
  }

  updateSection(id: string, content: string): void {
    this.mock.updatePvSection(id, content);
  }

  submitPv(): void {
    this.mock.submitPv();
  }

  signAsSecretary(): void {
    this.mock.signPvAsSecretary();
  }

  signAsPresident(): void {
    this.mock.signPvAsPresident();
  }

  getRows(content: string): number {
    return Math.max(3, content.split('\n').length + 1);
  }
}

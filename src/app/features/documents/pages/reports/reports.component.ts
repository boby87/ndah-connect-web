import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UpperCasePipe } from '@angular/common';
import { MockDataService } from '../../../../core/services/mock-data.service';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [FormsModule, UpperCasePipe, CardComponent, BadgeComponent, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="reports-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">📊 Génération de Rapports</h1>
          <p class="page-subtitle">Générez et consultez les rapports de la tontine</p>
        </div>
      </div>

      <!-- Report Generator -->
      @if (!showPreview()) {
        <div class="generator-section">
          <app-card>
            <div class="generator-form">
              <h2 class="form-section-title">TYPE DE RAPPORT</h2>
              <div class="radio-group">
                @for (rt of reportTypes; track rt.value) {
                  <label class="radio-option" [class.selected]="selectedType() === rt.value">
                    <input type="radio" name="reportType" [value]="rt.value"
                      [checked]="selectedType() === rt.value"
                      (change)="selectedType.set(rt.value)">
                    <span class="radio-icon">{{ rt.icon }}</span>
                    <span class="radio-label">{{ rt.label }}</span>
                  </label>
                }
              </div>

              <h2 class="form-section-title">PÉRIODE</h2>
              <div class="radio-group">
                @for (p of periodOptions; track p.value) {
                  <label class="radio-option" [class.selected]="selectedPeriod() === p.value">
                    <input type="radio" name="period" [value]="p.value"
                      [checked]="selectedPeriod() === p.value"
                      (change)="selectedPeriod.set(p.value)">
                    <span class="radio-label">{{ p.label }}</span>
                  </label>
                }
              </div>

              <h2 class="form-section-title">OPTIONS</h2>
              <div class="checkbox-group">
                <label class="checkbox-option">
                  <input type="checkbox" [checked]="optCharts()" (change)="optCharts.set(!optCharts())">
                  <span>Inclure les graphiques</span>
                </label>
                <label class="checkbox-option">
                  <input type="checkbox" [checked]="optStats()" (change)="optStats.set(!optStats())">
                  <span>Inclure les statistiques détaillées</span>
                </label>
                <label class="checkbox-option">
                  <input type="checkbox" [checked]="optNominal()" (change)="optNominal.set(!optNominal())">
                  <span>Inclure la liste nominative</span>
                </label>
              </div>

              <h2 class="form-section-title">FORMAT</h2>
              <div class="radio-group horizontal">
                <label class="radio-option" [class.selected]="selectedFormat() === 'pdf'">
                  <input type="radio" name="format" value="pdf"
                    [checked]="selectedFormat() === 'pdf'"
                    (change)="selectedFormat.set('pdf')">
                  <span class="radio-label">📄 PDF</span>
                </label>
                <label class="radio-option" [class.selected]="selectedFormat() === 'excel'">
                  <input type="radio" name="format" value="excel"
                    [checked]="selectedFormat() === 'excel'"
                    (change)="selectedFormat.set('excel')">
                  <span class="radio-label">📗 Excel</span>
                </label>
                <label class="radio-option" [class.selected]="selectedFormat() === 'both'">
                  <input type="radio" name="format" value="both"
                    [checked]="selectedFormat() === 'both'"
                    (change)="selectedFormat.set('both')">
                  <span class="radio-label">📄📗 Les deux</span>
                </label>
              </div>

              <div class="form-actions">
                <app-button variant="outline" (clicked)="resetForm()">Annuler</app-button>
                <app-button variant="secondary" (clicked)="preview()">Prévisualiser</app-button>
                <app-button variant="primary" (clicked)="generate()">Générer le rapport</app-button>
              </div>
            </div>
          </app-card>
        </div>
      }

      <!-- Preview Panel -->
      @if (showPreview()) {
        <div class="preview-section">
          <app-card>
            <div class="preview-content">
              <div class="preview-header">
                <h2 class="preview-title">{{ previewTitle() }}</h2>
                <p class="preview-tontine">Tontine Solidarité du Grand Nord</p>
              </div>

              <div class="preview-meta">
                <span>Période: {{ periodLabel() }}</span>
                <span>Séances analysées: {{ mock.reportStats().sessionsAnalyzed }}</span>
              </div>

              <div class="preview-separator"></div>

              <h3 class="preview-section-title">STATISTIQUES GLOBALES</h3>
              <div class="stats-row">
                <div class="stat-box">
                  <span class="stat-value-lg">{{ mock.reportStats().attendanceRate }}%</span>
                  <span class="stat-label-sm">Taux de présence moyen</span>
                </div>
                <div class="stat-box">
                  <span class="stat-value-lg">{{ mock.reportStats().alwaysPresent }}</span>
                  <span class="stat-label-sm">Toujours présents</span>
                </div>
                <div class="stat-box">
                  <span class="stat-value-lg">{{ mock.reportStats().withAbsences }}</span>
                  <span class="stat-label-sm">Avec absences</span>
                </div>
              </div>

              <div class="progress-bar-container">
                <div class="progress-bar-fill" [style.width.%]="mock.reportStats().attendanceRate"></div>
                <span class="progress-label">{{ mock.reportStats().attendanceRate }}%</span>
              </div>

              <h3 class="preview-section-title">TOP 5 MEILLEURS PRÉSENTS</h3>
              <div class="ranking-list">
                @for (m of mock.reportStats().topPresent; track m.name; let i = $index) {
                  <div class="ranking-item">
                    <span class="ranking-pos">{{ i + 1 }}.</span>
                    <span class="ranking-name">{{ m.name }}</span>
                    <span class="ranking-role">({{ m.role }})</span>
                    <span class="ranking-rate">{{ m.rate }}%</span>
                  </div>
                }
              </div>

              @if (mock.reportStats().frequentAbsences.length > 0) {
                <h3 class="preview-section-title warning-title">MEMBRES AVEC ABSENCES RÉPÉTÉES</h3>
                <div class="ranking-list">
                  @for (m of mock.reportStats().frequentAbsences; track m.name; let i = $index) {
                    <div class="ranking-item warning-item">
                      <span class="ranking-pos">{{ i + 1 }}.</span>
                      <span class="ranking-name">{{ m.name }}</span>
                      <span class="ranking-detail">{{ m.absences }} absences ({{ m.rate }}%)</span>
                    </div>
                  }
                </div>
              }

              <div class="preview-separator"></div>
              <div class="preview-footer">
                <span>Généré le: {{ today }}</span>
                <span>Par: Marie NGUEMO, Secrétaire</span>
              </div>

              <div class="preview-actions">
                <app-button variant="outline" (clicked)="showPreview.set(false)">Modifier</app-button>
                <app-button variant="secondary" (clicked)="download()">📥 Télécharger</app-button>
                <app-button variant="primary" (clicked)="sendToBureau()">📤 Envoyer au Bureau</app-button>
              </div>
            </div>
          </app-card>
        </div>
      }

      <!-- Generated Reports History -->
      <div class="history-section">
        <h2 class="section-title">Rapports générés</h2>
        @if (mock._generatedReports().length === 0) {
          <app-card>
            <div class="empty-state">
              <span class="empty-icon">📊</span>
              <p>Aucun rapport généré pour le moment</p>
            </div>
          </app-card>
        } @else {
          <div class="reports-grid">
            @for (r of mock._generatedReports(); track r.id) {
              <app-card>
                <div class="report-card">
                  <div class="report-icon">{{ reportTypeIcon(r.type) }}</div>
                  <div class="report-info">
                    <h3 class="report-title">{{ r.title }}</h3>
                    <p class="report-period">{{ r.period }}</p>
                  </div>
                  <div class="report-meta">
                    <app-badge [variant]="r.format === 'pdf' ? 'danger' : r.format === 'excel' ? 'success' : 'info'">
                      {{ r.format | uppercase }}
                    </app-badge>
                    <span class="report-date">{{ r.generatedAt }}</span>
                  </div>
                </div>
              </app-card>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    @reference "tailwindcss";
    .reports-page { @apply max-w-4xl mx-auto p-4; }
    .page-header { @apply mb-6; }
    .page-title { @apply text-2xl font-bold text-slate-900; }
    .page-subtitle { @apply text-sm text-slate-500 mt-1; }
    .generator-form { @apply p-4 space-y-5; }
    .form-section-title { @apply text-xs font-bold text-slate-500 uppercase tracking-wider mb-3; }
    .radio-group { @apply space-y-2; }
    .radio-group.horizontal { @apply flex gap-4 flex-wrap; }
    .radio-option { @apply flex items-center gap-3 p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors; }
    .radio-option.selected { @apply border-blue-500 bg-blue-50; }
    .radio-option input { @apply accent-blue-600; }
    .radio-icon { @apply text-lg; }
    .radio-label { @apply text-sm text-slate-700; }
    .checkbox-group { @apply space-y-2; }
    .checkbox-option { @apply flex items-center gap-3 p-2 cursor-pointer text-sm text-slate-700; }
    .checkbox-option input { @apply accent-blue-600 w-4 h-4; }
    .form-actions { @apply flex justify-end gap-3 pt-4 border-t border-slate-200; }

    .preview-content { @apply p-6; }
    .preview-header { @apply text-center mb-4; }
    .preview-title { @apply text-xl font-bold text-slate-900; }
    .preview-tontine { @apply text-sm text-slate-500; }
    .preview-meta { @apply flex justify-center gap-6 text-sm text-slate-600 mb-4; }
    .preview-separator { @apply border-t border-slate-200 my-4; }
    .preview-section-title { @apply text-sm font-bold text-slate-700 uppercase mb-3; }
    .warning-title { @apply text-red-600; }
    .stats-row { @apply grid grid-cols-3 gap-4 mb-4; }
    .stat-box { @apply flex flex-col items-center p-3 bg-slate-50 rounded-lg; }
    .stat-value-lg { @apply text-2xl font-bold text-blue-700; }
    .stat-label-sm { @apply text-xs text-slate-500 mt-1 text-center; }
    .progress-bar-container { @apply relative w-full h-6 bg-slate-200 rounded-full overflow-hidden mb-6; }
    .progress-bar-fill { @apply h-full bg-blue-500 rounded-full transition-all duration-700; }
    .progress-label { @apply absolute inset-0 flex items-center justify-center text-xs font-bold text-white; }
    .ranking-list { @apply space-y-1 mb-4; }
    .ranking-item { @apply flex items-center gap-2 py-1 text-sm; }
    .ranking-pos { @apply font-bold text-slate-500 w-6; }
    .ranking-name { @apply font-medium text-slate-800; }
    .ranking-role { @apply text-slate-400; }
    .ranking-rate { @apply ml-auto font-bold text-green-600; }
    .ranking-detail { @apply ml-auto text-red-600 text-xs; }
    .warning-item .ranking-name { @apply text-red-700; }
    .preview-footer { @apply flex justify-between text-xs text-slate-400; }
    .preview-actions { @apply flex justify-center gap-3 pt-4 mt-4 border-t border-slate-200; }

    .history-section { @apply mt-8; }
    .section-title { @apply text-lg font-semibold text-slate-900 mb-4; }
    .reports-grid { @apply grid gap-3; }
    .report-card { @apply flex items-center gap-4 p-3; }
    .report-icon { @apply text-2xl; }
    .report-info { @apply flex-1; }
    .report-title { @apply text-sm font-medium text-slate-800; }
    .report-period { @apply text-xs text-slate-500; }
    .report-meta { @apply flex flex-col items-end gap-1; }
    .report-date { @apply text-xs text-slate-400; }
    .empty-state { @apply text-center py-8 text-slate-400; }
    .empty-icon { @apply text-4xl block mb-2; }
  `,
})
export class ReportsComponent {
  readonly mock = inject(MockDataService);

  readonly reportTypes = [
    { value: 'attendance', icon: '📊', label: 'Rapport de présences' },
    { value: 'members', icon: '👥', label: 'Liste des membres' },
    { value: 'sessions', icon: '📅', label: 'Historique des séances' },
    { value: 'adhesions', icon: '📋', label: 'Registre des adhésions/démissions' },
    { value: 'pv_summary', icon: '📝', label: 'Récapitulatif des PV' },
  ];

  readonly periodOptions = [
    { value: 'current_cycle', label: 'Cycle en cours' },
    { value: 'cycle_2', label: 'Cycle spécifique: Cycle #2 - 2026' },
    { value: 'year_2026', label: 'Année: 2026' },
    { value: 'custom', label: 'Personnalisé' },
  ];

  readonly selectedType = signal('attendance');
  readonly selectedPeriod = signal('cycle_2');
  readonly selectedFormat = signal('pdf');
  readonly optCharts = signal(true);
  readonly optStats = signal(true);
  readonly optNominal = signal(false);
  readonly showPreview = signal(false);
  readonly today = new Date().toLocaleDateString('fr-FR');

  previewTitle(): string {
    const rt = this.reportTypes.find(r => r.value === this.selectedType());
    return rt ? `${rt.label} - ${this.periodLabel()}` : 'Rapport';
  }

  periodLabel(): string {
    const p = this.periodOptions.find(o => o.value === this.selectedPeriod());
    return p?.label ?? '';
  }

  reportTypeIcon(type: string): string {
    return this.reportTypes.find(r => r.value === type)?.icon ?? '📄';
  }

  preview(): void {
    this.showPreview.set(true);
  }

  generate(): void {
    this.mock.generateReport(
      this.selectedType(), this.periodLabel(), this.selectedFormat(),
      { charts: this.optCharts(), stats: this.optStats(), nominal: this.optNominal() }
    );
    this.showPreview.set(true);
  }

  download(): void {
    alert('📥 Téléchargement du rapport en cours... (mock)');
  }

  sendToBureau(): void {
    alert('📤 Rapport envoyé au Bureau ! (mock)');
  }

  resetForm(): void {
    this.selectedType.set('attendance');
    this.selectedPeriod.set('cycle_2');
    this.selectedFormat.set('pdf');
    this.optCharts.set(true);
    this.optStats.set(true);
    this.optNominal.set(false);
    this.showPreview.set(false);
  }
}

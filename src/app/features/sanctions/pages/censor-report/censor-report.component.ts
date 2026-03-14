import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MockDataService } from '../../../../core/services/mock-data.service';
import { PageHeaderComponent } from '../../../../shared/components/layout/page-header/page-header.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CurrencyXafPipe } from '../../../../shared/pipes/currency-xaf.pipe';

@Component({
  selector: 'app-censor-report',
  standalone: true,
  imports: [PageHeaderComponent, CardComponent, BadgeComponent, ButtonComponent, CurrencyXafPipe],
  template: `
    <app-page-header title="Rapport du Censeur" subtitle="Générer le rapport de séance" backLink="/sanctions" />

    <div class="report-container">
      <!-- Stats summary -->
      <app-card>
        <div class="section">
          <h2 class="section-title">📊 Synthèse des sanctions</h2>
          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-label">Total sanctions</span>
              <span class="stat-value">{{ mock.censorStats().sanctionsThisMonth }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Retards</span>
              <span class="stat-value">{{ mock.censorStats().byType.late }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Absences</span>
              <span class="stat-value">{{ mock.censorStats().byType.absence }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Cotisation tardive</span>
              <span class="stat-value">{{ mock.censorStats().byType.contributionLate }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Autres</span>
              <span class="stat-value">{{ mock.censorStats().byType.other }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Montant total</span>
              <span class="stat-value">{{ mock.censorStats().totalAmount | currencyXaf }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Montant collecté</span>
              <span class="stat-value">{{ mock.censorStats().collectedAmount | currencyXaf }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Taux recouvrement</span>
              <span class="stat-value">{{ mock.censorStats().paymentRate }}%</span>
            </div>
          </div>
        </div>
      </app-card>

      <!-- Unpaid details -->
      <app-card>
        <div class="section">
          <h2 class="section-title">💸 Sanctions impayées</h2>
          <div class="unpaid-grid">
            <div class="unpaid-item"><span class="unpaid-label">Nombre</span><span class="unpaid-value">{{ mock.censorStats().unpaidCount }}</span></div>
            <div class="unpaid-item"><span class="unpaid-label">Montant</span><span class="unpaid-value">{{ mock.censorStats().unpaidAmount | currencyXaf }}</span></div>
          </div>
        </div>
      </app-card>

      <!-- Contestations -->
      <app-card>
        <div class="section">
          <h2 class="section-title">❗ Contestations</h2>
          <div class="unpaid-grid">
            <div class="unpaid-item"><span class="unpaid-label">En cours</span><span class="unpaid-value">{{ mock.censorStats().contestedCount }}</span></div>
            <div class="unpaid-item"><span class="unpaid-label">Modifications présence</span><span class="unpaid-value">{{ mock.censorStats().pendingModifications }}</span></div>
            <div class="unpaid-item"><span class="unpaid-label">Justificatifs</span><span class="unpaid-value">{{ mock.censorStats().pendingJustifications }}</span></div>
          </div>
        </div>
      </app-card>

      <!-- Most sanctioned -->
      <app-card>
        <div class="section">
          <h2 class="section-title">👥 Membres les plus sanctionnés</h2>
          @for (member of mock.mostSanctionedMembers(); track member.name; let i = $index) {
            <div class="member-row">
              <span class="member-rank">{{ i + 1 }}.</span>
              <span class="member-name">{{ member.name }}</span>
              <app-badge variant="danger" size="sm">{{ member.count }} sanct.</app-badge>
              <span class="member-amount">{{ member.totalAmount | currencyXaf }}</span>
            </div>
          }
        </div>
      </app-card>

      <!-- Recent communications -->
      <app-card>
        <div class="section">
          <h2 class="section-title">📨 Communications envoyées</h2>
          @for (comm of mock.censorCommunications(); track comm.id) {
            <div class="comm-item">
              <div class="comm-header">
                <span class="comm-subject">{{ comm.subject }}</span>
                <app-badge [variant]="comm.type === 'warning' ? 'danger' : 'info'" size="sm">{{ comm.type }}</app-badge>
              </div>
              <span class="comm-meta">{{ comm.recipients.length }} destinataire(s) · {{ comm.channels.join(', ') }}</span>
            </div>
          }
        </div>
      </app-card>

      @if (!reportGenerated()) {
        <div class="form-actions">
          <app-button variant="primary" (clicked)="generateReport()">📄 Générer le rapport PDF</app-button>
        </div>
      } @else {
        <app-card>
          <div class="success-state">
            <span class="success-icon">✅</span>
            <p class="success-text">Rapport généré avec succès</p>
            <app-button variant="outline" size="sm" (clicked)="reportGenerated.set(false)">Régénérer</app-button>
          </div>
        </app-card>
      }
    </div>
  `,
  styles: `
    @reference "tailwindcss";
    .report-container { @apply space-y-6; }
    .section { @apply space-y-4; }
    .section-title { @apply text-base font-semibold text-slate-900; }
    .stats-grid { @apply grid grid-cols-2 md:grid-cols-4 gap-4; }
    .stat-item { @apply flex flex-col items-center p-3 bg-slate-50 rounded-lg; }
    .stat-label { @apply text-xs text-slate-500 uppercase tracking-wide; }
    .stat-value { @apply text-lg font-bold text-slate-900; }
    .unpaid-grid { @apply grid grid-cols-3 gap-4; }
    .unpaid-item { @apply flex flex-col items-center p-3 bg-red-50 rounded-lg; }
    .unpaid-label { @apply text-xs text-slate-500; }
    .unpaid-value { @apply text-lg font-bold text-red-700; }
    .member-row { @apply flex items-center gap-3 py-2 border-b border-slate-100 last:border-none; }
    .member-rank { @apply text-sm font-bold text-slate-500 w-6; }
    .member-name { @apply flex-1 text-sm text-slate-800; }
    .member-amount { @apply text-sm font-semibold text-slate-900; }
    .comm-item { @apply flex flex-col gap-1 py-2 border-b border-slate-100 last:border-none; }
    .comm-header { @apply flex items-center justify-between; }
    .comm-subject { @apply text-sm font-medium text-slate-800; }
    .comm-meta { @apply text-xs text-slate-500; }
    .form-actions { @apply flex justify-end; }
    .success-state { @apply flex flex-col items-center gap-3 py-6; }
    .success-icon { @apply text-4xl; }
    .success-text { @apply text-sm font-medium text-green-700; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CensorReportComponent {
  protected readonly mock = inject(MockDataService);
  readonly reportGenerated = signal(false);

  generateReport(): void {
    this.reportGenerated.set(true);
  }
}

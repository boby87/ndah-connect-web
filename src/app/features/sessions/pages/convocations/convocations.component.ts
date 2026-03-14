import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MockDataService } from '../../../../core/services/mock-data.service';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';

@Component({
  selector: 'app-convocations',
  standalone: true,
  imports: [CardComponent, BadgeComponent, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page-header">
      <div>
        <h1 class="page-title">📨 Convocations</h1>
        <p class="page-subtitle">Séance #9 — 22 mars 2026</p>
      </div>
      <div class="header-actions">
        @if (!mock.convocationsSent()) {
          <app-button variant="primary" [disabled]="mock.odjStatus() !== 'validated'" (clicked)="sendConvocations()">📤 Envoyer les convocations</app-button>
        }
      </div>
    </div>

    @if (mock.odjStatus() !== 'validated' && !mock.convocationsSent()) {
      <div class="warning-alert">
        ⚠️ L'ODJ doit être <strong>validé par le Président</strong> avant l'envoi des convocations.
        <a class="alert-link" (click)="navigate('/sessions/odj/sess-009')">Aller à la préparation ODJ →</a>
      </div>
    }

    @if (mock.convocationsSent()) {
      <!-- Summary after sending -->
      <app-card>
        <div class="card-body">
          <h2 class="section-title">✅ Convocations envoyées</h2>
          <div class="send-summary">
            <div class="send-stat">
              <span class="send-icon">📱</span>
              <span class="send-value">{{ mock.convocationSummary().pushSent }}</span>
              <span class="send-label">Push</span>
            </div>
            <div class="send-stat">
              <span class="send-icon">💬</span>
              <span class="send-value">{{ mock.convocationSummary().smsSent }}</span>
              <span class="send-label">SMS</span>
            </div>
            <div class="send-stat">
              <span class="send-icon">📧</span>
              <span class="send-value">{{ mock.convocationSummary().emailSent }}</span>
              <span class="send-label">Email</span>
            </div>
            @if (mock.convocationSummary().emailFailed > 0) {
              <div class="send-stat send-failed">
                <span class="send-icon">❌</span>
                <span class="send-value">{{ mock.convocationSummary().emailFailed }}</span>
                <span class="send-label">Échecs</span>
              </div>
            }
            @if (mock.convocationSummary().candidatesSent > 0) {
              <div class="send-stat send-candidates">
                <span class="send-icon">🆕</span>
                <span class="send-value">{{ mock.convocationSummary().candidatesSent }}</span>
                <span class="send-label">Candidats</span>
              </div>
            }
          </div>
        </div>
      </app-card>

      <!-- Reminders -->
      <app-card>
        <div class="card-body">
          <h2 class="section-title">🔔 Rappels programmés</h2>
          @for (reminder of mock.convocationSummary().reminders; track reminder.type) {
            <div class="reminder-item">
              <div class="reminder-info">
                <span class="reminder-type">{{ reminder.type }}</span>
                <span class="reminder-date">{{ reminder.scheduledDate }}</span>
              </div>
              <app-badge [variant]="reminder.sent ? 'success' : 'secondary'" size="sm">
                {{ reminder.sent ? 'Envoyé' : 'Programmé' }}
              </app-badge>
            </div>
          }
        </div>
      </app-card>
    } @else {
      <!-- Before sending -->
      <app-card>
        <div class="card-body">
          <h2 class="section-title">📋 Contenu de la convocation</h2>
          <div class="convocation-preview">
            <div class="preview-section">
              <span class="preview-label">Objet :</span>
              <span>Convocation à la Séance #9 — La Solidaire de Douala</span>
            </div>
            <div class="preview-section">
              <span class="preview-label">Date :</span>
              <span>Samedi 22 mars 2026 à 15h00</span>
            </div>
            <div class="preview-section">
              <span class="preview-label">Lieu :</span>
              <span>Restaurant Le Foyer, Douala</span>
            </div>
            <div class="preview-section">
              <span class="preview-label">Bénéficiaire :</span>
              <span>Thierry ESSAMA (Tour #9)</span>
            </div>
            <div class="preview-section">
              <span class="preview-label">Ordre du jour :</span>
              <div class="odj-preview">
                @for (item of mock.odjItems(); track item.id) {
                  <span class="odj-preview-item">{{ item.order }}. {{ item.title }}</span>
                }
              </div>
            </div>
          </div>
        </div>
      </app-card>

      <app-card>
        <div class="card-body">
          <h2 class="section-title">👥 Destinataires</h2>
          <div class="recipients-info">
            <div class="recipient-row">
              <span>Membres actifs</span>
              <app-badge variant="primary" size="sm">{{ mock.activeMembers().length }}</app-badge>
            </div>
            <div class="recipient-row">
              <span>Candidats à l'adhésion</span>
              <app-badge variant="info" size="sm">{{ mock.adhesionRequests().length }}</app-badge>
            </div>
          </div>
          <p class="channels-info">📱 Push · 💬 SMS · 📧 Email</p>
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

    .warning-alert { @apply bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4 text-sm text-amber-800; }
    .alert-link { @apply text-blue-600 underline cursor-pointer ml-2; }

    .card-body { @apply p-2; }
    .section-title { @apply text-base font-semibold text-slate-900 mb-4; }

    .send-summary { @apply grid grid-cols-3 sm:grid-cols-5 gap-4 mt-2; }
    .send-stat { @apply flex flex-col items-center p-3 bg-green-50 rounded-lg; }
    .send-failed { @apply bg-red-50; }
    .send-candidates { @apply bg-blue-50; }
    .send-icon { @apply text-xl; }
    .send-value { @apply text-2xl font-bold text-slate-900; }
    .send-label { @apply text-xs text-slate-500 mt-1; }

    .reminder-item { @apply flex items-center justify-between py-3 border-b border-slate-100 last:border-none; }
    .reminder-info { @apply flex flex-col; }
    .reminder-type { @apply text-sm font-medium text-slate-800; }
    .reminder-date { @apply text-xs text-slate-500; }

    .convocation-preview { @apply space-y-3 bg-slate-50 rounded-lg p-4; }
    .preview-section { @apply flex flex-col sm:flex-row gap-1 sm:gap-2 text-sm; }
    .preview-label { @apply font-semibold text-slate-600 w-32 flex-shrink-0; }
    .odj-preview { @apply flex flex-col gap-0.5 mt-1; }
    .odj-preview-item { @apply text-sm text-slate-700; }

    .recipients-info { @apply space-y-2 mb-3; }
    .recipient-row { @apply flex items-center justify-between text-sm text-slate-700; }
    .channels-info { @apply text-xs text-slate-500 mt-3; }
  `],
})
export class ConvocationsComponent {
  protected readonly mock = inject(MockDataService);

  navigate(path: string): void {
    // Using window location for simplicity in mock
    window.location.hash = path;
  }

  sendConvocations(): void {
    this.mock.sendConvocations();
  }
}

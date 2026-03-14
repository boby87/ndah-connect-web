import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MockDataService, SecretaryAnnouncement } from '../../../../core/services/mock-data.service';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';

@Component({
  selector: 'app-announcements',
  standalone: true,
  imports: [CardComponent, BadgeComponent, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page-header">
      <div>
        <h1 class="page-title">📢 Annonces & Communications</h1>
        <p class="page-subtitle">Envoyer des messages aux membres de la tontine</p>
      </div>
      <div class="header-actions">
        <app-button variant="primary" (clicked)="showNewForm.set(true)">✉️ Nouvelle annonce</app-button>
      </div>
    </div>

    <!-- New Announcement Form -->
    @if (showNewForm()) {
      <app-card>
        <div class="card-body">
          <h2 class="section-title">✉️ Rédiger une annonce</h2>
          <div class="form-fields">
            <div class="form-field">
              <label class="form-label">Type</label>
              <select class="form-input" [value]="newType()" (change)="newType.set($any($event.target).value)">
                <option value="info">ℹ️ Information</option>
                <option value="reminder">🔔 Rappel</option>
                <option value="document">📄 Document</option>
                <option value="alert">⚠️ Alerte</option>
                <option value="celebration">🎉 Célébration</option>
              </select>
            </div>
            <div class="form-field">
              <label class="form-label">Titre</label>
              <input class="form-input" type="text" [value]="newTitle()" (input)="newTitle.set($any($event.target).value)" placeholder="Titre de l'annonce..." />
            </div>
            <div class="form-field">
              <label class="form-label">Message</label>
              <textarea class="form-input" [value]="newMessage()" (input)="newMessage.set($any($event.target).value)" rows="4" placeholder="Contenu du message..."></textarea>
            </div>
            <div class="form-row">
              <div class="form-field">
                <label class="form-label">Destinataires</label>
                <select class="form-input" [value]="newRecipients()" (change)="newRecipients.set($any($event.target).value)">
                  <option value="all">Tous les membres</option>
                  <option value="bureau">Bureau uniquement</option>
                </select>
              </div>
              <div class="form-field">
                <label class="form-label">Canaux</label>
                <div class="channels-check">
                  <label class="channel-label"><input type="checkbox" checked disabled /> Push</label>
                  <label class="channel-label"><input type="checkbox" checked /> SMS</label>
                  <label class="channel-label"><input type="checkbox" /> Email</label>
                </div>
              </div>
            </div>
          </div>
          <div class="form-actions">
            <app-button variant="secondary" (clicked)="showNewForm.set(false)">Annuler</app-button>
            <app-button variant="primary" [disabled]="!newTitle().trim() || !newMessage().trim()" (clicked)="sendAnnouncement()">📤 Envoyer</app-button>
          </div>
        </div>
      </app-card>
    }

    <!-- Quick Templates -->
    <app-card>
      <div class="card-body">
        <h2 class="section-title">🚀 Envoi rapide</h2>
        <div class="templates-grid">
          <button class="template-btn" (click)="sendQuick('Rappel séance', 'Chers membres, rappel de notre prochaine séance ce samedi 22 mars à 15h00. À bientôt !', 'reminder')" type="button">
            <span class="template-icon">📅</span>
            <span class="template-label">Rappel séance</span>
          </button>
          <button class="template-btn" (click)="sendQuick('Rappel cotisation', 'Chers membres, pensez à préparer vos cotisations pour la prochaine séance. Montant : 25 000 XAF.', 'reminder')" type="button">
            <span class="template-icon">💰</span>
            <span class="template-label">Rappel cotisation</span>
          </button>
          <button class="template-btn" (click)="sendQuick('Document disponible', 'Un nouveau document est disponible dans l\\'espace Archives. Consultez-le dès que possible.', 'document')" type="button">
            <span class="template-icon">📄</span>
            <span class="template-label">Document publié</span>
          </button>
          <button class="template-btn" (click)="sendQuick('Information importante', 'Information importante de la tontine La Solidaire de Douala. Veuillez lire attentivement.', 'alert')" type="button">
            <span class="template-icon">⚠️</span>
            <span class="template-label">Info importante</span>
          </button>
        </div>
      </div>
    </app-card>

    <!-- History -->
    <app-card>
      <div class="card-body">
        <h2 class="section-title">📜 Historique des annonces</h2>
        @for (ann of mock.announcements(); track ann.id) {
          <div class="ann-item">
            <div class="ann-header">
              <span class="ann-type-icon">
                @switch (ann.type) {
                  @case ('info') { ℹ️ }
                  @case ('reminder') { 🔔 }
                  @case ('document') { 📄 }
                  @case ('alert') { ⚠️ }
                  @case ('celebration') { 🎉 }
                }
              </span>
              <div class="ann-info">
                <span class="ann-title">{{ ann.title }}</span>
                <span class="ann-meta">
                  {{ ann.recipients === 'all' ? 'Tous les membres' : 'Bureau' }}
                  · {{ ann.channels.join(', ') }}
                  · {{ ann.sentAt ? formatDate(ann.sentAt) : 'Brouillon' }}
                </span>
              </div>
              <app-badge [variant]="ann.status === 'sent' ? 'success' : 'secondary'" size="sm">{{ ann.status === 'sent' ? 'Envoyé' : 'Brouillon' }}</app-badge>
            </div>
            <p class="ann-message">{{ ann.message }}</p>
          </div>
        }
        @if (mock.announcements().length === 0) {
          <p class="no-data">Aucune annonce envoyée pour le moment.</p>
        }
      </div>
    </app-card>
  `,
  styles: [`
    @reference "tailwindcss";
    .page-header { @apply flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6; }
    .page-title { @apply text-2xl font-bold text-slate-900; }
    .page-subtitle { @apply text-sm text-slate-500 mt-1; }
    .header-actions { @apply flex items-center gap-3; }

    .card-body { @apply p-2; }
    .section-title { @apply text-base font-semibold text-slate-900 mb-4; }

    .form-fields { @apply space-y-3; }
    .form-row { @apply grid grid-cols-1 sm:grid-cols-2 gap-3; }
    .form-field { @apply flex flex-col gap-1; }
    .form-label { @apply text-xs font-medium text-slate-600; }
    .form-input { @apply px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500; }
    .channels-check { @apply flex gap-4; }
    .channel-label { @apply flex items-center gap-1 text-sm text-slate-700; }
    .form-actions { @apply flex justify-end gap-3 mt-4; }

    .templates-grid { @apply grid grid-cols-2 sm:grid-cols-4 gap-3; }
    .template-btn { @apply flex flex-col items-center gap-2 p-4 rounded-lg border border-slate-200 hover:bg-blue-50 hover:border-blue-200 cursor-pointer transition-colors bg-white; }
    .template-icon { @apply text-2xl; }
    .template-label { @apply text-xs font-medium text-slate-700; }

    .ann-item { @apply py-3 border-b border-slate-100 last:border-none; }
    .ann-header { @apply flex items-start gap-2; }
    .ann-type-icon { @apply text-lg flex-shrink-0; }
    .ann-info { @apply flex-1 flex flex-col; }
    .ann-title { @apply text-sm font-medium text-slate-800; }
    .ann-meta { @apply text-xs text-slate-400; }
    .ann-message { @apply text-sm text-slate-600 mt-1 pl-7 line-clamp-2; }
    .no-data { @apply text-sm text-slate-400 text-center py-4; }
  `],
})
export class AnnouncementsComponent {
  protected readonly mock = inject(MockDataService);

  readonly showNewForm = signal(false);
  readonly newType = signal<SecretaryAnnouncement['type']>('info');
  readonly newTitle = signal('');
  readonly newMessage = signal('');
  readonly newRecipients = signal('all');

  sendAnnouncement(): void {
    if (!this.newTitle().trim() || !this.newMessage().trim()) return;
    this.mock.sendAnnouncement(this.newTitle(), this.newMessage(), this.newType(), this.newRecipients(), ['push', 'sms']);
    this.newTitle.set('');
    this.newMessage.set('');
    this.showNewForm.set(false);
  }

  sendQuick(title: string, message: string, type: SecretaryAnnouncement['type']): void {
    this.mock.sendAnnouncement(title, message, type, 'all', ['push', 'sms']);
  }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  }
}

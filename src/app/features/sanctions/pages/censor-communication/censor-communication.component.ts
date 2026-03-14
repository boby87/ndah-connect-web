import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../../../core/services/mock-data.service';
import { PageHeaderComponent } from '../../../../shared/components/layout/page-header/page-header.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';

@Component({
  selector: 'app-censor-communication',
  standalone: true,
  imports: [FormsModule, PageHeaderComponent, CardComponent, BadgeComponent, ButtonComponent],
  template: `
    <app-page-header title="Communications du Censeur" subtitle="Envoyer des messages et avertissements" backLink="/sanctions" />

    <div class="communication-container">
      <!-- New message form -->
      <app-card>
        <div class="section">
          <h2 class="section-title">📨 Nouveau message</h2>

          <div class="form-group">
            <label class="form-label">Type</label>
            <div class="type-options">
              <label class="radio-option"><input type="radio" name="commType" value="reminder" [(ngModel)]="commType" /> Rappel</label>
              <label class="radio-option"><input type="radio" name="commType" value="warning" [(ngModel)]="commType" /> Avertissement</label>
              <label class="radio-option"><input type="radio" name="commType" value="info" [(ngModel)]="commType" /> Information</label>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Destinataire(s)</label>
            <select class="form-select" [(ngModel)]="selectedMemberId">
              <option value="">-- Sélectionnez un membre --</option>
              @for (member of mock.members(); track member.id) {
                @if (member.status === 'active') {
                  <option [value]="member.id">{{ member.user.firstName }} {{ member.user.lastName }}</option>
                }
              }
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Objet</label>
            <input type="text" class="form-input" placeholder="Objet du message" [(ngModel)]="subject" />
          </div>

          <div class="form-group">
            <label class="form-label">Message</label>
            <textarea class="form-textarea" rows="5" placeholder="Rédigez votre message..." [(ngModel)]="messageBody"></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Canaux</label>
            <div class="channels">
              <label class="channel-check"><input type="checkbox" [(ngModel)]="channelSms" /> SMS</label>
              <label class="channel-check"><input type="checkbox" [(ngModel)]="channelPush" /> Push</label>
              <label class="channel-check"><input type="checkbox" [(ngModel)]="channelEmail" /> Email</label>
            </div>
          </div>

          <div class="form-actions">
            <app-button variant="primary" [disabled]="!canSend()" (clicked)="send()">Envoyer</app-button>
          </div>
        </div>
      </app-card>

      <!-- History -->
      <app-card>
        <div class="section">
          <h2 class="section-title">📜 Historique des communications</h2>
          @for (comm of mock.censorCommunications(); track comm.id) {
            <div class="comm-item">
              <div class="comm-header">
                <span class="comm-subject">{{ comm.subject }}</span>
                <app-badge [variant]="comm.type === 'warning' ? 'danger' : comm.type === 'reminder' ? 'warning' : 'info'" size="sm">{{ comm.type }}</app-badge>
              </div>
              <span class="comm-recipients">À: {{ comm.recipients.length === 1 ? comm.recipients[0].memberName : comm.recipients.length + ' membres' }}</span>
              <span class="comm-meta">{{ comm.channels.join(', ') }} · {{ comm.sentAt }}</span>
              <p class="comm-message">{{ comm.message }}</p>
            </div>
          } @empty {
            <p class="empty-text">Aucune communication envoyée</p>
          }
        </div>
      </app-card>
    </div>
  `,
  styles: `
    @reference "tailwindcss";
    .communication-container { @apply space-y-6; }
    .section { @apply space-y-4; }
    .section-title { @apply text-base font-semibold text-slate-900; }
    .form-group { @apply space-y-1; }
    .form-label { @apply text-sm font-medium text-slate-700; }
    .form-input { @apply w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500; }
    .form-select { @apply w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500; }
    .form-textarea { @apply w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none; }
    .type-options { @apply flex gap-4; }
    .radio-option { @apply flex items-center gap-2 text-sm text-slate-700 cursor-pointer; }
    .channels { @apply flex gap-6; }
    .channel-check { @apply flex items-center gap-2 text-sm text-slate-700 cursor-pointer; }
    .form-actions { @apply flex justify-end; }
    .comm-item { @apply flex flex-col gap-1 py-3 border-b border-slate-100 last:border-none; }
    .comm-header { @apply flex items-center justify-between; }
    .comm-subject { @apply text-sm font-medium text-slate-800; }
    .comm-recipients { @apply text-xs font-medium text-blue-600; }
    .comm-meta { @apply text-xs text-slate-400; }
    .comm-message { @apply text-sm text-slate-600 bg-slate-50 p-2 rounded mt-1; }
    .empty-text { @apply text-sm text-slate-500; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CensorCommunicationComponent {
  protected readonly mock = inject(MockDataService);

  readonly commType = signal<'reminder' | 'warning' | 'info'>('reminder');
  readonly selectedMemberId = signal('');
  readonly subject = signal('');
  readonly messageBody = signal('');
  readonly channelSms = signal(true);
  readonly channelPush = signal(true);
  readonly channelEmail = signal(false);

  canSend(): boolean {
    return !!this.selectedMemberId() && !!this.subject() && !!this.messageBody() && (this.channelSms() || this.channelPush() || this.channelEmail());
  }

  send(): void {
    const member = this.mock.members().find(m => m.id === this.selectedMemberId());
    if (!member) return;
    const channels: string[] = [];
    if (this.channelSms()) channels.push('sms');
    if (this.channelPush()) channels.push('push');
    if (this.channelEmail()) channels.push('email');

    this.mock.sendCensorCommunication(
      this.commType(),
      'individual',
      [{ memberId: member.id, memberName: `${member.user.firstName} ${member.user.lastName}` }],
      this.subject(),
      this.messageBody(),
      channels,
    );

    // Reset
    this.subject.set('');
    this.messageBody.set('');
    this.selectedMemberId.set('');
  }
}

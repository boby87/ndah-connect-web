import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../../../core/services/mock-data.service';
import { PageHeaderComponent } from '../../../../shared/components/layout/page-header/page-header.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CurrencyXafPipe } from '../../../../shared/pipes/currency-xaf.pipe';

@Component({
  selector: 'app-send-reminders',
  standalone: true,
  imports: [FormsModule, PageHeaderComponent, CardComponent, BadgeComponent, ButtonComponent, CurrencyXafPipe],
  template: `
    <app-page-header title="Envoi de rappels" subtitle="Rappeler les membres ayant des sanctions impayées" backLink="/sanctions" />

    <div class="reminders-container">
      <!-- Recipients selection -->
      <app-card>
        <div class="section">
          <h2 class="section-title">📨 Destinataires</h2>
          <div class="recipient-type">
            <label class="radio-option"><input type="radio" name="recipientType" value="individual" [(ngModel)]="recipientType" /> Individuel</label>
            <label class="radio-option"><input type="radio" name="recipientType" value="group" [(ngModel)]="recipientType" /> Groupé (tous impayés)</label>
          </div>

          @if (recipientType() === 'individual') {
            <div class="members-list">
              @for (s of unpaidSanctions(); track s.id) {
                <label class="member-check">
                  <input type="checkbox" [checked]="selectedIds().has(s.memberId)" (change)="toggleRecipient(s.memberId, s.member.user.firstName + ' ' + s.member.user.lastName)" />
                  <span class="member-name">{{ s.member.user.firstName }} {{ s.member.user.lastName }}</span>
                  <app-badge variant="danger" size="sm">{{ s.amount | currencyXaf }}</app-badge>
                </label>
              }
            </div>
          }
        </div>
      </app-card>

      <!-- Message -->
      <app-card>
        <div class="section">
          <h2 class="section-title">💬 Message</h2>
          <div class="template-selector">
            <label class="radio-option"><input type="radio" name="template" value="default" [(ngModel)]="template" (ngModelChange)="applyTemplate($event)" /> Modèle par défaut</label>
            <label class="radio-option"><input type="radio" name="template" value="urgent" [(ngModel)]="template" (ngModelChange)="applyTemplate($event)" /> Modèle urgent</label>
            <label class="radio-option"><input type="radio" name="template" value="custom" [(ngModel)]="template" /> Personnalisé</label>
          </div>
          <textarea class="message-textarea" rows="5" [(ngModel)]="message" placeholder="Saisissez le message..."></textarea>
        </div>
      </app-card>

      <!-- Channels -->
      <app-card>
        <div class="section">
          <h2 class="section-title">📱 Canaux d'envoi</h2>
          <div class="channels">
            <label class="channel-check"><input type="checkbox" [(ngModel)]="channelSms" /> SMS</label>
            <label class="channel-check"><input type="checkbox" [(ngModel)]="channelPush" /> Notification Push</label>
            <label class="channel-check"><input type="checkbox" [(ngModel)]="channelEmail" /> Email</label>
          </div>
        </div>
      </app-card>

      <div class="form-actions">
        <app-button variant="outline" (clicked)="cancel()">Annuler</app-button>
        <app-button variant="primary" [disabled]="!canSend()" (clicked)="send()">
          Envoyer ({{ recipientCount() }} destinataire(s))
        </app-button>
      </div>
    </div>
  `,
  styles: `
    @reference "tailwindcss";
    .reminders-container { @apply space-y-6; }
    .section { @apply space-y-4; }
    .section-title { @apply text-base font-semibold text-slate-900; }
    .recipient-type { @apply flex gap-4; }
    .radio-option { @apply flex items-center gap-2 text-sm text-slate-700 cursor-pointer; }
    .members-list { @apply space-y-2 mt-3; }
    .member-check { @apply flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50; }
    .member-name { @apply flex-1 text-sm font-medium text-slate-800; }
    .template-selector { @apply flex gap-4 mb-3; }
    .message-textarea { @apply w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none; }
    .channels { @apply flex gap-6; }
    .channel-check { @apply flex items-center gap-2 text-sm text-slate-700 cursor-pointer; }
    .form-actions { @apply flex justify-end gap-3; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SendRemindersComponent {
  private readonly mock = inject(MockDataService);

  readonly recipientType = signal<'individual' | 'group'>('group');
  readonly selectedIds = signal(new Set<string>());
  readonly selectedRecipients = signal<{ memberId: string; memberName: string }[]>([]);
  readonly template = signal<'default' | 'urgent' | 'custom'>('default');
  readonly message = signal('Cher membre, nous vous rappelons que vous avez une/des sanction(s) impayée(s). Merci de régulariser votre situation avant la prochaine séance.');
  readonly channelSms = signal(true);
  readonly channelPush = signal(true);
  readonly channelEmail = signal(false);

  unpaidSanctions() { return this.mock.sanctions().filter(s => s.status === 'pending'); }

  toggleRecipient(memberId: string, memberName: string): void {
    this.selectedIds.update(ids => {
      const next = new Set(ids);
      if (next.has(memberId)) { next.delete(memberId); this.selectedRecipients.update(r => r.filter(x => x.memberId !== memberId)); }
      else { next.add(memberId); this.selectedRecipients.update(r => [...r, { memberId, memberName }]); }
      return next;
    });
  }

  applyTemplate(tpl: string): void {
    if (tpl === 'default') this.message.set('Cher membre, nous vous rappelons que vous avez une/des sanction(s) impayée(s). Merci de régulariser votre situation avant la prochaine séance.');
    else if (tpl === 'urgent') this.message.set('⚠️ URGENT: Vos sanctions restent impayées. Sans régularisation avant la prochaine séance, des mesures supplémentaires pourront être prises conformément au règlement intérieur.');
  }

  recipientCount(): number {
    if (this.recipientType() === 'group') return this.unpaidSanctions().length;
    return this.selectedIds().size;
  }

  canSend(): boolean {
    return this.recipientCount() > 0 && !!this.message() && (this.channelSms() || this.channelPush() || this.channelEmail());
  }

  send(): void {
    const channels: string[] = [];
    if (this.channelSms()) channels.push('sms');
    if (this.channelPush()) channels.push('push');
    if (this.channelEmail()) channels.push('email');

    let recipients: { memberId: string; memberName: string }[];
    if (this.recipientType() === 'group') {
      recipients = this.unpaidSanctions().map(s => ({ memberId: s.memberId, memberName: `${s.member.user.firstName} ${s.member.user.lastName}` }));
    } else {
      recipients = this.selectedRecipients();
    }

    this.mock.sendCensorCommunication('reminder', this.recipientType(), recipients, 'Rappel: Sanctions impayées', this.message(), channels);
  }

  cancel(): void { history.back(); }
}

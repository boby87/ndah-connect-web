import { ChangeDetectionStrategy, Component, computed, inject, resource, signal } from '@angular/core';
import { AlertComponent } from '../../../../shared/components/ui/alert/alert.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { EmptyStateComponent } from '../../../../shared/components/ui/empty-state/empty-state.component';
import { InputComponent } from '../../../../shared/components/ui/input/input.component';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { NotificationService } from '../../../../core/services/notification.service';
import { CensorService } from '../../services/censor.service';

type Channel = 'SMS' | 'EMAIL' | 'PUSH' | 'WHATSAPP';
type CommKind = 'WARNING' | 'PAYMENT_REMINDER' | 'INFORMATION' | 'CALL_TO_ORDER';

const TEMPLATES: Record<CommKind, { subject: string; body: string }> = {
  WARNING: {
    subject: 'Avertissement formel',
    body:
      "Cher(e) {nom_membre},\n\nNous vous adressons un avertissement formel suite à votre comportement lors de la dernière séance.\n\nLe Censeur",
  },
  PAYMENT_REMINDER: {
    subject: 'Rappel — Sanctions impayées',
    body:
      "Cher(e) {nom_membre},\n\nVous avez {montant_total} XAF de sanctions impayées :\n{liste_sanctions}\n\nMerci de régulariser avant la prochaine séance.\n\nLe Censeur",
  },
  CALL_TO_ORDER: {
    subject: "Rappel à l'ordre",
    body:
      "Cher(e) {nom_membre},\n\nNous vous rappelons le respect du règlement intérieur de la tontine.\n\nLe Censeur",
  },
  INFORMATION: {
    subject: 'Information',
    body: 'Cher(e) membre,\n\n[Message d\'information]\n\nLe Censeur',
  },
};

@Component({
  selector: 'tc-censor-communications',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AlertComponent,
    BadgeComponent,
    ButtonComponent,
    CardComponent,
    EmptyStateComponent,
    InputComponent,
    DateFormatPipe,
  ],
  template: `
    <div class="space-y-6">
      <header>
        <h1 class="text-2xl font-bold text-gray-900">Communications & Rappels</h1>
        <p class="text-sm text-gray-500">
          Envoyez des avertissements ou rappels de paiement (RM-CO01). Tous les messages sont
          archivés (RM-CO02).
        </p>
      </header>

      @if (errorMessage(); as err) {
        <tc-alert kind="error">{{ err }}</tc-alert>
      }

      <div class="grid gap-6 lg:grid-cols-3">
        <aside class="lg:col-span-1">
          <tc-card title="Nouveau message">
            <form class="space-y-3" (submit)="onSubmit($event)">
              <div>
                <p class="text-sm font-medium text-gray-700 mb-1">Type</p>
                <div class="space-y-1 text-sm">
                  <label class="flex items-center gap-2">
                    <input type="radio" name="kind" [checked]="kind() === 'WARNING'" (change)="setKind('WARNING')" />
                    Avertissement
                  </label>
                  <label class="flex items-center gap-2">
                    <input type="radio" name="kind" [checked]="kind() === 'PAYMENT_REMINDER'" (change)="setKind('PAYMENT_REMINDER')" />
                    Rappel impayés
                  </label>
                  <label class="flex items-center gap-2">
                    <input type="radio" name="kind" [checked]="kind() === 'CALL_TO_ORDER'" (change)="setKind('CALL_TO_ORDER')" />
                    Rappel à l'ordre
                  </label>
                  <label class="flex items-center gap-2">
                    <input type="radio" name="kind" [checked]="kind() === 'INFORMATION'" (change)="setKind('INFORMATION')" />
                    Information
                  </label>
                </div>
              </div>

              <tc-input label="Objet" [(value)]="subject" [required]="true" />

              <div>
                <label class="text-sm font-medium text-gray-700">Message</label>
                <textarea
                  class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  rows="6"
                  [value]="body()"
                  (input)="body.set($any($event.target).value)"
                ></textarea>
                <p class="text-xs text-gray-500 mt-1">
                  Variables : {{ '{nom_membre}' }}, {{ '{montant_total}' }}, {{ '{liste_sanctions}' }}
                </p>
              </div>

              <div>
                <p class="text-sm font-medium text-gray-700 mb-1">Destinataires</p>
                <div class="space-y-1 max-h-40 overflow-y-auto rounded-lg border border-gray-100 p-2 text-sm">
                  @for (m of members(); track m.id) {
                    <label class="flex items-center gap-2">
                      <input
                        type="checkbox"
                        [checked]="recipients().has(m.id)"
                        (change)="toggleRecipient(m.id)"
                      />
                      {{ m.firstName }} {{ m.lastName }}
                    </label>
                  }
                </div>
                <p class="text-xs text-gray-500 mt-1">
                  {{ recipients().size }} destinataire(s) sélectionné(s)
                </p>
              </div>

              <div>
                <p class="text-sm font-medium text-gray-700 mb-1">Canaux</p>
                <div class="flex flex-wrap gap-3 text-sm">
                  @for (c of allChannels; track c) {
                    <label class="flex items-center gap-1">
                      <input
                        type="checkbox"
                        [checked]="channels().has(c)"
                        (change)="toggleChannel(c)"
                      />
                      {{ c }}
                    </label>
                  }
                </div>
              </div>

              <tc-button type="submit" variant="primary" [fullWidth]="true" [loading]="submitting()">
                ✈ Envoyer
              </tc-button>
            </form>
          </tc-card>
        </aside>

        <div class="lg:col-span-2">
          <tc-card title="Historique des communications">
            @if (resource.isLoading()) {
              <p class="text-sm text-gray-500">Chargement…</p>
            } @else if (communications().length === 0) {
              <tc-empty-state title="Aucun message envoyé" icon="📨" />
            } @else {
              <ul class="divide-y divide-gray-100">
                @for (c of communications(); track c.id) {
                  <li class="py-3 first:pt-0 last:pb-0">
                    <div class="flex items-start justify-between gap-3">
                      <div class="min-w-0 flex-1">
                        <div class="flex items-center gap-2 flex-wrap">
                          <p class="font-semibold text-gray-900">{{ c.subject }}</p>
                          <tc-badge [kind]="kindBadge(c.kind)">{{ kindLabel(c.kind) }}</tc-badge>
                        </div>
                        <p class="text-xs text-gray-500 mt-1">
                          Envoyé le {{ c.sentAt | tcDate: true }} par {{ c.sentByFullName }}
                        </p>
                        <p class="text-sm text-gray-700 mt-2 whitespace-pre-wrap line-clamp-3">
                          {{ c.body }}
                        </p>
                        <div class="mt-2 flex flex-wrap items-center gap-1 text-xs text-gray-600">
                          <span>Canaux :</span>
                          @for (ch of c.channels; track ch) {
                            <tc-badge kind="neutral">{{ ch }}</tc-badge>
                          }
                          <span class="ml-2">→</span>
                          <span>{{ c.recipientLabels.join(', ') }}</span>
                        </div>
                      </div>
                    </div>
                  </li>
                }
              </ul>
            }
          </tc-card>
        </div>
      </div>
    </div>
  `,
})
export class CensorCommunicationsPageComponent {
  private readonly service = inject(CensorService);
  private readonly notifications = inject(NotificationService);

  protected readonly allChannels: Channel[] = ['SMS', 'EMAIL', 'PUSH', 'WHATSAPP'];

  readonly resource = resource({
    loader: () => this.service.getCommunications(),
  });
  readonly communications = computed(() => this.resource.value() ?? []);

  readonly membersResource = resource({
    loader: () => this.service.getMembers(),
  });
  readonly members = computed(() => this.membersResource.value() ?? []);

  readonly kind = signal<CommKind>('PAYMENT_REMINDER');
  readonly subject = signal(TEMPLATES['PAYMENT_REMINDER'].subject);
  readonly body = signal(TEMPLATES['PAYMENT_REMINDER'].body);
  readonly recipients = signal<Set<string>>(new Set());
  readonly channels = signal<Set<Channel>>(new Set(['SMS', 'PUSH']));
  readonly submitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  setKind(k: CommKind): void {
    this.kind.set(k);
    this.subject.set(TEMPLATES[k].subject);
    this.body.set(TEMPLATES[k].body);
  }

  toggleRecipient(id: string): void {
    this.recipients.update((set) => {
      const next = new Set(set);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  toggleChannel(c: Channel): void {
    this.channels.update((set) => {
      const next = new Set(set);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next;
    });
  }

  kindBadge(k: string): 'info' | 'warning' | 'danger' | 'neutral' {
    if (k === 'WARNING') return 'danger';
    if (k === 'PAYMENT_REMINDER') return 'warning';
    if (k === 'CALL_TO_ORDER') return 'info';
    return 'neutral';
  }

  kindLabel(k: string): string {
    const map: Record<string, string> = {
      WARNING: 'Avertissement',
      PAYMENT_REMINDER: 'Rappel impayés',
      CALL_TO_ORDER: "Rappel à l'ordre",
      INFORMATION: 'Information',
    };
    return map[k] ?? k;
  }

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.errorMessage.set(null);
    if (!this.subject().trim() || !this.body().trim()) {
      this.errorMessage.set('Objet et message obligatoires.');
      return;
    }
    if (this.recipients().size === 0) {
      this.errorMessage.set('Sélectionnez au moins un destinataire.');
      return;
    }
    if (this.channels().size === 0) {
      this.errorMessage.set('Sélectionnez au moins un canal.');
      return;
    }

    this.submitting.set(true);
    try {
      await this.service.sendCommunication({
        kind: this.kind(),
        subject: this.subject().trim(),
        body: this.body().trim(),
        channels: Array.from(this.channels()),
        recipientMemberIds: Array.from(this.recipients()),
      });
      this.notifications.success('Message envoyé.');
      this.recipients.set(new Set());
      this.resource.reload();
    } catch (e: unknown) {
      this.errorMessage.set((e as { error?: { message?: string } })?.error?.message ?? 'Erreur.');
    } finally {
      this.submitting.set(false);
    }
  }
}

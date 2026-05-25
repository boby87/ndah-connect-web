import { ChangeDetectionStrategy, Component, computed, inject, resource, signal } from '@angular/core';
import { AlertComponent } from '../../../../shared/components/ui/alert/alert.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { EmptyStateComponent } from '../../../../shared/components/ui/empty-state/empty-state.component';
import { CurrencyXafPipe } from '../../../../shared/pipes/currency-xaf.pipe';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { NotificationService } from '../../../../core/services/notification.service';
import { SANCTION_TYPE_LABELS } from '../../../../core/enums/sanction-type.enum';
import type { Sanction } from '../../../../shared/models/entities/sanction.model';
import { CensorService } from '../../services/censor.service';

type Decision = 'ACCEPT' | 'REJECT' | 'TRANSFER_PRESIDENT';

@Component({
  selector: 'tc-censor-contestations',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AlertComponent,
    BadgeComponent,
    ButtonComponent,
    CardComponent,
    EmptyStateComponent,
    CurrencyXafPipe,
    DateFormatPipe,
  ],
  template: `
    <div class="space-y-6">
      <header>
        <h1 class="text-2xl font-bold text-gray-900">Contestations de sanctions</h1>
        <p class="text-sm text-gray-500">
          Le délai de contestation est jusqu'à la séance suivante (RM-CS01).
          Vous pouvez accepter, rejeter ou transférer au Président (RM-CS02).
          Un rejet nécessite un commentaire (RM-CS03).
        </p>
      </header>

      @if (errorMessage(); as err) {
        <tc-alert kind="error">{{ err }}</tc-alert>
      }

      @if (resource.isLoading()) {
        <p class="text-sm text-gray-500">Chargement…</p>
      } @else if (contestations().length === 0) {
        <tc-card>
          <tc-empty-state title="Aucune contestation" icon="🛡" />
        </tc-card>
      } @else {
        <ul class="space-y-3">
          @for (s of contestations(); track s.id) {
            <li>
              <tc-card>
                <div class="space-y-3">
                  <div class="flex flex-wrap items-start justify-between gap-3">
                    <div class="min-w-0 flex-1">
                      <div class="flex items-center gap-2 flex-wrap">
                        <p class="font-semibold text-gray-900">
                          {{ s.memberFullName }} — {{ SANCTION_TYPE_LABELS[s.type] }}
                        </p>
                        <tc-badge kind="warning">Contestée</tc-badge>
                      </div>
                      <p class="text-xs text-gray-500 mt-1">
                        Séance #{{ s.sessionNumber }} · {{ s.amount | xaf }} · Émise le {{ s.issuedAt | tcDate }}
                      </p>
                    </div>
                  </div>

                  <div class="rounded-lg border border-gray-100 bg-gray-50 p-3">
                    <p class="text-xs font-medium text-gray-700">Motif de la sanction</p>
                    <p class="text-sm text-gray-700">{{ s.reason }}</p>
                  </div>

                  <div class="rounded-lg border border-amber-200 bg-amber-50 p-3">
                    <p class="text-xs font-medium text-amber-900">
                      Motif de contestation — soumis le {{ s.contestedAt | tcDate: true }}
                    </p>
                    <p class="text-sm text-amber-900 mt-1">{{ s.contestReason }}</p>
                    @if (s.contestAttachmentName) {
                      <p class="text-xs text-amber-700 mt-1">
                        📎 Pièce jointe : {{ s.contestAttachmentName }}
                      </p>
                    }
                  </div>

                  @if (openId() === s.id) {
                    <div class="space-y-2 rounded-lg border border-blue-200 bg-blue-50 p-3">
                      <p class="text-sm font-medium text-blue-900">Votre décision</p>
                      <div class="space-y-1 text-sm">
                        <label class="flex items-center gap-2">
                          <input type="radio" name="dec-{{ s.id }}" [checked]="decision() === 'ACCEPT'" (change)="decision.set('ACCEPT')" />
                          ✅ Accepter — annuler la sanction
                        </label>
                        <label class="flex items-center gap-2">
                          <input type="radio" name="dec-{{ s.id }}" [checked]="decision() === 'REJECT'" (change)="decision.set('REJECT')" />
                          ❌ Rejeter — maintenir la sanction
                        </label>
                        <label class="flex items-center gap-2">
                          <input type="radio" name="dec-{{ s.id }}" [checked]="decision() === 'TRANSFER_PRESIDENT'" (change)="decision.set('TRANSFER_PRESIDENT')" />
                          🔄 Transférer au Président
                        </label>
                      </div>
                      <textarea
                        class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        rows="2"
                        placeholder="Commentaire (obligatoire si rejet)"
                        [value]="comment()"
                        (input)="comment.set($any($event.target).value)"
                      ></textarea>
                      <div class="flex gap-2">
                        <tc-button
                          variant="primary"
                          size="sm"
                          [loading]="acting() === s.id"
                          (clicked)="submit(s)"
                        >
                          ✓ Valider la décision
                        </tc-button>
                        <tc-button variant="ghost" size="sm" (clicked)="close()">Annuler</tc-button>
                      </div>
                    </div>
                  } @else {
                    <tc-button variant="primary" size="sm" (clicked)="open(s)">
                      Traiter la contestation
                    </tc-button>
                  }
                </div>
              </tc-card>
            </li>
          }
        </ul>
      }
    </div>
  `,
})
export class CensorContestationsPageComponent {
  private readonly service = inject(CensorService);
  private readonly notifications = inject(NotificationService);

  protected readonly SANCTION_TYPE_LABELS = SANCTION_TYPE_LABELS;

  readonly resource = resource({
    loader: () => this.service.getContestations(),
  });
  readonly contestations = computed(() => this.resource.value() ?? []);

  readonly openId = signal<string | null>(null);
  readonly decision = signal<Decision>('ACCEPT');
  readonly comment = signal('');
  readonly acting = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);

  open(s: Sanction): void {
    this.openId.set(s.id);
    this.decision.set('ACCEPT');
    this.comment.set('');
  }

  close(): void {
    this.openId.set(null);
  }

  async submit(s: Sanction): Promise<void> {
    if (this.decision() === 'REJECT' && !this.comment().trim()) {
      this.errorMessage.set('Le rejet nécessite un commentaire (RM-CS03).');
      return;
    }
    this.acting.set(s.id);
    this.errorMessage.set(null);
    try {
      await this.service.decideContestation(s.id, this.decision(), this.comment().trim());
      this.notifications.success('Décision enregistrée.');
      this.openId.set(null);
      this.resource.reload();
    } catch (e: unknown) {
      this.errorMessage.set((e as { error?: { message?: string } })?.error?.message ?? 'Erreur.');
    } finally {
      this.acting.set(null);
    }
  }
}

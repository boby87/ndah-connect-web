import { ChangeDetectionStrategy, Component, computed, inject, resource, signal } from '@angular/core';

import { AlertComponent } from '../../../../shared/components/ui/alert/alert.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { EmptyStateComponent } from '../../../../shared/components/ui/empty-state/empty-state.component';
import { SpinnerComponent } from '../../../../shared/components/ui/spinner/spinner.component';
import { TextareaComponent } from '../../../../shared/components/ui/textarea/textarea.component';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { NotificationService } from '../../../../core/services/notification.service';
import { PresidentService } from '../../services/president.service';
import { SecretaryService } from '../../../secretary/services/secretary.service';
import type {
  PresidencyTransfer,
  PresidencyTransferStatus,
} from '../../../../shared/models/entities/presidency-transfer.model';
import { PRESIDENCY_TRANSFER_STATUS_LABELS } from '../../../../shared/models/entities/presidency-transfer.model';
import type { Member } from '../../../../shared/models/entities/member.model';

@Component({
  selector: 'tc-presidency-transfer-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AlertComponent,
    BadgeComponent,
    ButtonComponent,
    CardComponent,
    EmptyStateComponent,
    SpinnerComponent,
    TextareaComponent,
    DateFormatPipe,
  ],
  template: `
    <div class="space-y-6">
      <header>
        <h1 class="text-2xl font-bold text-gray-900">Transférer la présidence</h1>
        <p class="text-sm text-gray-500">
          Nommez un autre membre comme Président. Il devra accepter pour que le transfert prenne effet.
        </p>
      </header>

      @if (errorMessage(); as err) {
        <tc-alert kind="error">{{ err }}</tc-alert>
      }

      <tc-alert kind="warning">
        <strong>Attention :</strong> dès que le membre désigné accepte, vous perdez immédiatement le rôle Président.
        Vous redevenez membre simple (vos autres rôles restent inchangés). Cette opération est réversible
        uniquement via un nouveau transfert initié par le nouveau Président.
      </tc-alert>

      @if (pendingTransfer(); as pt) {
        <tc-card tone="accent">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2">
                <p class="font-semibold text-gray-900">
                  Transfert en cours vers {{ pt.targetMemberFullName }}
                </p>
                <tc-badge [kind]="statusBadge(pt.status)">{{ statusLabel(pt.status) }}</tc-badge>
              </div>
              <p class="mt-1 text-sm text-gray-600">{{ pt.reason }}</p>
              <p class="mt-1 text-xs text-gray-500">
                Initié le {{ pt.initiatedAt | tcDate: true }} ·
                expire le {{ pt.expiresAt | tcDate: true }}
              </p>
            </div>
            <tc-button
              variant="danger"
              size="sm"
              [loading]="cancellingId() === pt.id"
              (clicked)="cancel(pt)"
            >
              Annuler ce transfert
            </tc-button>
          </div>
        </tc-card>
      } @else {
        <tc-card title="Nouveau transfert">
          <form class="space-y-4" (submit)="onSubmit($event)">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Membre désigné <span class="text-red-500">*</span>
              </label>
              @if (membersResource.isLoading()) {
                <tc-spinner size="sm" />
              } @else {
                <select
                  [value]="targetMemberId()"
                  (change)="setTarget($event)"
                  class="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">— Choisir un membre —</option>
                  @for (m of eligibleMembers(); track m.id) {
                    <option [value]="m.id">{{ m.firstName }} {{ m.lastName }} ({{ m.phone }})</option>
                  }
                </select>
                @if (targetMemberTouched() && !targetMemberId()) {
                  <p class="mt-1 text-xs text-red-600">Sélectionnez un membre.</p>
                }
                @if (eligibleMembers().length === 0) {
                  <p class="mt-1 text-xs text-amber-600">
                    Aucun membre actif éligible. Invitez d'abord des membres depuis
                    <em>/president/invitations</em>.
                  </p>
                }
              }
            </div>

            <tc-textarea
              label="Motif"
              placeholder="Expliquez pourquoi vous initiez ce transfert (visible par le membre désigné et l'audit)…"
              [(value)]="reason"
              [(touched)]="reasonTouched"
              [error]="reasonError()"
              [rows]="4"
              [required]="true"
            />

            <tc-button
              type="submit"
              variant="primary"
              [fullWidth]="true"
              [loading]="submitting()"
              [disabled]="eligibleMembers().length === 0"
            >
              Initier le transfert
            </tc-button>
          </form>
        </tc-card>
      }

      <section class="space-y-3">
        <h2 class="text-lg font-semibold text-gray-900">Historique des transferts</h2>
        @if (resource.isLoading()) {
          <div class="flex justify-center py-8"><tc-spinner /></div>
        } @else if (closedTransfers().length === 0) {
          <tc-card>
            <tc-empty-state
              title="Aucun transfert"
              icon="📜"
              description="Vous n'avez jamais initié de transfert de présidence."
            />
          </tc-card>
        } @else {
          <ul class="space-y-2">
            @for (t of closedTransfers(); track t.id) {
              <li>
                <tc-card>
                  <div class="flex flex-wrap items-start justify-between gap-3">
                    <div class="min-w-0 flex-1">
                      <div class="flex items-center gap-2">
                        <p class="font-medium text-gray-900">→ {{ t.targetMemberFullName }}</p>
                        <tc-badge [kind]="statusBadge(t.status)">{{ statusLabel(t.status) }}</tc-badge>
                      </div>
                      <p class="mt-1 text-sm text-gray-600">{{ t.reason }}</p>
                      <p class="mt-1 text-xs text-gray-500">
                        {{ t.initiatedAt | tcDate: true }}
                        @if (t.acceptedAt) {
                          · accepté le {{ t.acceptedAt | tcDate: true }}
                        } @else if (t.declinedAt) {
                          · refusé le {{ t.declinedAt | tcDate: true }}
                          @if (t.declineReason) {
                            ({{ t.declineReason }})
                          }
                        } @else if (t.cancelledAt) {
                          · annulé le {{ t.cancelledAt | tcDate: true }}
                          @if (t.cancelReason) {
                            ({{ t.cancelReason }})
                          }
                        }
                      </p>
                    </div>
                  </div>
                </tc-card>
              </li>
            }
          </ul>
        }
      </section>
    </div>
  `,
})
export class PresidencyTransferPageComponent {
  private readonly service = inject(PresidentService);
  private readonly secretary = inject(SecretaryService);
  private readonly notifications = inject(NotificationService);

  readonly resource = resource({
    loader: () => this.service.getPresidencyTransfers(),
  });

  readonly membersResource = resource({
    loader: () => this.secretary.getMembers(),
  });

  readonly transfers = computed<PresidencyTransfer[]>(() => this.resource.value() ?? []);
  readonly pendingTransfer = computed<PresidencyTransfer | undefined>(() =>
    this.transfers().find((t) => t.status === 'PENDING'),
  );
  readonly closedTransfers = computed(() =>
    this.transfers().filter((t) => t.status !== 'PENDING'),
  );

  readonly eligibleMembers = computed<Member[]>(() =>
    (this.membersResource.value() ?? []).filter(
      (m) => m.status === 'ACTIVE' && !m.roles.includes('PRESIDENT' as never),
    ),
  );

  // Form state
  readonly targetMemberId = signal('');
  readonly targetMemberTouched = signal(false);
  readonly reason = signal('');
  readonly reasonTouched = signal(false);

  readonly submitting = signal(false);
  readonly cancellingId = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);

  readonly reasonError = computed(() => {
    const v = this.reason().trim();
    if (!v) return 'Motif requis.';
    if (v.length < 10) return 'Au moins 10 caractères.';
    return '';
  });

  setTarget(event: Event): void {
    this.targetMemberId.set((event.target as HTMLSelectElement).value);
  }

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.targetMemberTouched.set(true);
    this.reasonTouched.set(true);
    this.errorMessage.set(null);

    if (!this.targetMemberId() || this.reasonError()) return;

    const target = this.eligibleMembers().find((m) => m.id === this.targetMemberId());
    if (!target) {
      this.errorMessage.set('Membre introuvable.');
      return;
    }

    const confirmed = window.confirm(
      `Confirmer le transfert de la présidence vers ${target.firstName} ${target.lastName} ?\n\n` +
        `Cette opération vous fera perdre le rôle Président dès qu'il aura accepté.`,
    );
    if (!confirmed) return;

    this.submitting.set(true);
    try {
      await this.service.initiatePresidencyTransfer({
        targetMemberId: this.targetMemberId(),
        reason: this.reason().trim(),
      });
      this.notifications.success(
        `Demande envoyée à ${target.firstName} ${target.lastName}. Elle expire dans 72h.`,
      );
      this.targetMemberId.set('');
      this.targetMemberTouched.set(false);
      this.reason.set('');
      this.reasonTouched.set(false);
      this.resource.reload();
    } catch (e: unknown) {
      this.errorMessage.set(
        (e as { error?: { message?: string } })?.error?.message ?? 'Erreur lors de l\'initiation.',
      );
    } finally {
      this.submitting.set(false);
    }
  }

  async cancel(t: PresidencyTransfer): Promise<void> {
    const reason = window.prompt('Annuler ce transfert ?\nMotif (optionnel) :');
    if (reason === null) return;

    this.cancellingId.set(t.id);
    this.errorMessage.set(null);
    try {
      await this.service.cancelPresidencyTransfer(t.id, reason.trim() || undefined);
      this.notifications.info('Transfert annulé.');
      this.resource.reload();
    } catch (e: unknown) {
      this.errorMessage.set(
        (e as { error?: { message?: string } })?.error?.message ?? 'Annulation impossible.',
      );
    } finally {
      this.cancellingId.set(null);
    }
  }

  statusLabel(s: PresidencyTransferStatus): string {
    return PRESIDENCY_TRANSFER_STATUS_LABELS[s];
  }

  statusBadge(s: PresidencyTransferStatus): 'success' | 'warning' | 'info' | 'danger' | 'neutral' {
    if (s === 'ACCEPTED') return 'success';
    if (s === 'PENDING') return 'warning';
    if (s === 'DECLINED') return 'danger';
    if (s === 'CANCELLED' || s === 'EXPIRED') return 'neutral';
    return 'info';
  }
}

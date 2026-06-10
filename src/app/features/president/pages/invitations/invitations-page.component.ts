import { ChangeDetectionStrategy, Component, computed, inject, resource, signal } from '@angular/core';

import { AlertComponent } from '../../../../shared/components/ui/alert/alert.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { EmptyStateComponent } from '../../../../shared/components/ui/empty-state/empty-state.component';
import { InputComponent } from '../../../../shared/components/ui/input/input.component';
import { SpinnerComponent } from '../../../../shared/components/ui/spinner/spinner.component';
import { TextareaComponent } from '../../../../shared/components/ui/textarea/textarea.component';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { NotificationService } from '../../../../core/services/notification.service';
import { PresidentService } from '../../services/president.service';
import type {
  InvitationChannel,
  InvitationStatus,
  MembershipInvitation,
} from '../../../../shared/models/entities/membership-invitation.model';
import {
  INVITATION_STATUS_LABELS,
} from '../../../../shared/models/entities/membership-invitation.model';
import type { InvitableFounderRole } from '../../../../shared/models/entities/tontine.model';

const PHONE_RE = /^\+237\d{9}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ROLE_LABELS: Record<InvitableFounderRole, string> = {
  MEMBER: 'Membre',
  SECRETARY: 'Secrétaire',
  TREASURER: 'Trésorier',
  CENSOR: 'Censeur',
  AUDITOR: 'Commissaire',
};

@Component({
  selector: 'tc-president-invitations',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AlertComponent,
    BadgeComponent,
    ButtonComponent,
    CardComponent,
    EmptyStateComponent,
    InputComponent,
    SpinnerComponent,
    TextareaComponent,
    DateFormatPipe,
  ],
  template: `
    <div class="space-y-6">
      <header>
        <h1 class="text-2xl font-bold text-gray-900">Inviter de nouveaux membres</h1>
        <p class="text-sm text-gray-500">
          Envoyez un lien d'inscription pré-rempli par SMS, e-mail ou WhatsApp.
        </p>
      </header>

      @if (errorMessage(); as err) {
        <tc-alert kind="error">{{ err }}</tc-alert>
      }

      <div class="grid gap-6 lg:grid-cols-3">
        <aside class="lg:col-span-1">
          <tc-card title="Nouvelle invitation">
            <form class="space-y-4" (submit)="onSubmit($event)">
              <tc-input
                label="Nom complet"
                [(value)]="fullName"
                [(touched)]="fullNameTouched"
                [error]="fullNameError()"
                [required]="true"
              />
              <tc-input
                label="Téléphone"
                placeholder="+237 6XX XX XX XX"
                [(value)]="phone"
                [(touched)]="phoneTouched"
                [error]="phoneError()"
                [required]="true"
              />
              <tc-input
                label="Email (optionnel)"
                type="email"
                [(value)]="email"
                [(touched)]="emailTouched"
                [error]="emailError()"
              />

              <div>
                <p class="text-sm font-medium text-gray-700 mb-1">Rôle proposé</p>
                <select
                  [value]="proposedRole()"
                  (change)="setRole($event)"
                  class="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  @for (r of allRoles; track r) {
                    <option [value]="r">{{ roleLabel(r) }}</option>
                  }
                </select>
              </div>

              <fieldset>
                <legend class="text-sm font-medium text-gray-700 mb-1">Canaux d'envoi</legend>
                <div class="flex flex-col gap-1 text-sm">
                  @for (c of allChannels; track c) {
                    <label class="flex items-center gap-2">
                      <input
                        type="checkbox"
                        [checked]="channels().includes(c)"
                        (change)="toggleChannel(c, $event)"
                      />
                      {{ channelLabel(c) }}
                    </label>
                  }
                </div>
                @if (channelsError()) {
                  <p class="mt-1 text-xs text-red-600">{{ channelsError() }}</p>
                }
              </fieldset>

              <tc-textarea
                label="Message (optionnel)"
                placeholder="Mot d'invitation personnalisé…"
                [(value)]="message"
                [rows]="3"
              />

              <tc-button type="submit" variant="primary" [fullWidth]="true" [loading]="submitting()">
                Envoyer l'invitation
              </tc-button>
            </form>
          </tc-card>
        </aside>

        <section class="lg:col-span-2 space-y-4">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <h2 class="text-lg font-semibold text-gray-900">
              Invitations en cours
              <span class="ml-1 text-sm text-gray-500">({{ activeCount() }})</span>
            </h2>
            <div class="flex gap-2">
              @for (f of filterOptions; track f.value) {
                <button
                  type="button"
                  [class]="filterClass(f.value)"
                  (click)="filter.set(f.value)"
                >
                  {{ f.label }}
                </button>
              }
            </div>
          </div>

          @if (resource.isLoading()) {
            <div class="flex justify-center py-12"><tc-spinner size="lg" /></div>
          } @else if (visibleInvitations().length === 0) {
            <tc-card>
              <tc-empty-state
                title="Aucune invitation"
                icon="📨"
                description="Utilisez le formulaire pour inviter votre premier membre."
              />
            </tc-card>
          } @else {
            <ul class="space-y-3">
              @for (inv of visibleInvitations(); track inv.id) {
                <li>
                  <tc-card>
                    <div class="flex flex-wrap items-start justify-between gap-3">
                      <div class="min-w-0 flex-1">
                        <div class="flex flex-wrap items-center gap-2">
                          <p class="font-semibold text-gray-900">{{ inv.candidateFullName }}</p>
                          <tc-badge [kind]="statusBadge(inv.status)">{{ statusLabel(inv.status) }}</tc-badge>
                          <tc-badge kind="neutral">{{ roleLabel(inv.proposedRole) }}</tc-badge>
                        </div>
                        <p class="mt-1 text-sm text-gray-600">
                          {{ inv.candidatePhone }}
                          @if (inv.candidateEmail) {
                            · {{ inv.candidateEmail }}
                          }
                        </p>
                        <p class="mt-1 text-xs text-gray-500">
                          Envoyée le {{ inv.sentAt ?? inv.invitedAt | tcDate: true }}
                          · expire le {{ inv.expiresAt | tcDate: false }}
                          @if (inv.remindersSent > 0) {
                            · {{ inv.remindersSent }} relance(s)
                          }
                        </p>
                        @if (inv.cancelReason) {
                          <p class="mt-1 text-xs text-red-600">Annulée : {{ inv.cancelReason }}</p>
                        }
                      </div>

                      @if (isActionable(inv.status)) {
                        <div class="flex gap-2">
                          <tc-button
                            variant="ghost"
                            size="sm"
                            [loading]="resendingId() === inv.id"
                            (clicked)="resend(inv)"
                          >
                            Relancer
                          </tc-button>
                          <tc-button
                            variant="danger"
                            size="sm"
                            [loading]="cancellingId() === inv.id"
                            (clicked)="cancel(inv)"
                          >
                            Annuler
                          </tc-button>
                        </div>
                      }
                    </div>
                  </tc-card>
                </li>
              }
            </ul>
          }
        </section>
      </div>
    </div>
  `,
})
export class InvitationsPageComponent {
  private readonly service = inject(PresidentService);
  private readonly notifications = inject(NotificationService);

  protected readonly allRoles: InvitableFounderRole[] = [
    'MEMBER',
    'SECRETARY',
    'TREASURER',
    'CENSOR',
    'AUDITOR',
  ];

  protected readonly allChannels: InvitationChannel[] = ['SMS', 'EMAIL', 'WHATSAPP'];

  protected readonly filterOptions: { label: string; value: 'ACTIVE' | 'ALL' | InvitationStatus }[] = [
    { label: 'En cours', value: 'ACTIVE' },
    { label: 'Toutes', value: 'ALL' },
    { label: 'Acceptées', value: 'ACCEPTED' },
    { label: 'Annulées', value: 'CANCELLED' },
  ];

  readonly resource = resource({
    loader: () => this.service.getInvitations(),
  });

  readonly invitations = computed<MembershipInvitation[]>(() => this.resource.value() ?? []);
  readonly filter = signal<'ACTIVE' | 'ALL' | InvitationStatus>('ACTIVE');

  readonly visibleInvitations = computed(() => {
    const f = this.filter();
    if (f === 'ALL') return this.invitations();
    if (f === 'ACTIVE') {
      return this.invitations().filter(
        (i) => i.status === 'PENDING' || i.status === 'SENT',
      );
    }
    return this.invitations().filter((i) => i.status === f);
  });

  readonly activeCount = computed(
    () =>
      this.invitations().filter((i) => i.status === 'PENDING' || i.status === 'SENT').length,
  );

  // ── Form state ──────────────────────────────────────────────────────────
  readonly fullName = signal('');
  readonly fullNameTouched = signal(false);
  readonly phone = signal('+237');
  readonly phoneTouched = signal(false);
  readonly email = signal('');
  readonly emailTouched = signal(false);
  readonly proposedRole = signal<InvitableFounderRole>('MEMBER');
  readonly channels = signal<InvitationChannel[]>(['SMS']);
  readonly message = signal('');

  readonly submitting = signal(false);
  readonly resendingId = signal<string | null>(null);
  readonly cancellingId = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);

  readonly fullNameError = computed(() => (this.fullName().trim() ? '' : 'Nom requis.'));
  readonly phoneError = computed(() =>
    PHONE_RE.test(this.phone().trim()) ? '' : 'Format +237 suivi de 9 chiffres.',
  );
  readonly emailError = computed(() => {
    const v = this.email().trim();
    return !v || EMAIL_RE.test(v) ? '' : 'Email invalide.';
  });
  readonly channelsError = computed(() =>
    this.channels().length === 0 ? 'Choisissez au moins un canal.' : '',
  );

  // ── Actions ─────────────────────────────────────────────────────────────
  setRole(event: Event): void {
    this.proposedRole.set((event.target as HTMLSelectElement).value as InvitableFounderRole);
  }

  toggleChannel(channel: InvitationChannel, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.channels.update((list) =>
      checked ? [...list, channel] : list.filter((c) => c !== channel),
    );
  }

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.fullNameTouched.set(true);
    this.phoneTouched.set(true);
    this.emailTouched.set(true);
    this.errorMessage.set(null);

    if (this.fullNameError() || this.phoneError() || this.emailError() || this.channelsError()) {
      return;
    }

    this.submitting.set(true);
    try {
      await this.service.inviteMember({
        candidateFullName: this.fullName().trim(),
        candidatePhone: this.phone().trim(),
        candidateEmail: this.email().trim() || undefined,
        proposedRole: this.proposedRole(),
        channels: this.channels(),
        message: this.message().trim() || undefined,
      });
      this.notifications.success(`Invitation envoyée à ${this.fullName().trim()}.`);
      this.resetForm();
      this.resource.reload();
    } catch (e: unknown) {
      this.errorMessage.set(
        (e as { error?: { message?: string } })?.error?.message ?? 'Erreur lors de l\'envoi.',
      );
    } finally {
      this.submitting.set(false);
    }
  }

  async resend(inv: MembershipInvitation): Promise<void> {
    this.resendingId.set(inv.id);
    this.errorMessage.set(null);
    try {
      await this.service.resendInvitation(inv.id);
      this.notifications.success(`Relance envoyée à ${inv.candidateFullName}.`);
      this.resource.reload();
    } catch (e: unknown) {
      this.errorMessage.set(
        (e as { error?: { message?: string } })?.error?.message ?? 'Relance impossible.',
      );
    } finally {
      this.resendingId.set(null);
    }
  }

  async cancel(inv: MembershipInvitation): Promise<void> {
    const reason = window.prompt(`Annuler l'invitation de ${inv.candidateFullName} ?\nMotif (optionnel) :`);
    if (reason === null) return;
    this.cancellingId.set(inv.id);
    this.errorMessage.set(null);
    try {
      await this.service.cancelInvitation(inv.id, reason.trim() || undefined);
      this.notifications.info('Invitation annulée.');
      this.resource.reload();
    } catch (e: unknown) {
      this.errorMessage.set(
        (e as { error?: { message?: string } })?.error?.message ?? 'Annulation impossible.',
      );
    } finally {
      this.cancellingId.set(null);
    }
  }

  private resetForm(): void {
    this.fullName.set('');
    this.fullNameTouched.set(false);
    this.phone.set('+237');
    this.phoneTouched.set(false);
    this.email.set('');
    this.emailTouched.set(false);
    this.proposedRole.set('MEMBER');
    this.channels.set(['SMS']);
    this.message.set('');
  }

  // ── Display helpers ─────────────────────────────────────────────────────
  roleLabel(r: InvitableFounderRole): string {
    return ROLE_LABELS[r];
  }

  channelLabel(c: InvitationChannel): string {
    return { SMS: 'SMS', EMAIL: 'E-mail', WHATSAPP: 'WhatsApp' }[c];
  }

  statusLabel(s: InvitationStatus): string {
    return INVITATION_STATUS_LABELS[s];
  }

  statusBadge(s: InvitationStatus): 'success' | 'warning' | 'info' | 'danger' | 'neutral' {
    if (s === 'ACCEPTED') return 'success';
    if (s === 'SENT') return 'info';
    if (s === 'PENDING') return 'warning';
    if (s === 'CANCELLED' || s === 'EXPIRED') return 'danger';
    return 'neutral';
  }

  isActionable(s: InvitationStatus): boolean {
    return s === 'PENDING' || s === 'SENT';
  }

  filterClass(value: 'ACTIVE' | 'ALL' | InvitationStatus): string {
    const base = 'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border';
    const isActive = this.filter() === value;
    return `${base} ${isActive ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`;
  }
}

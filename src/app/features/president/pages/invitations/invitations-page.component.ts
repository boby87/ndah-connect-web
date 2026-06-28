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
import type { CandidateLookup } from '../../services/president.service';
import type {
  InvitationChannel,
  InvitationStatus,
  MembershipInvitation,
} from '../../../../shared/models/entities/membership-invitation.model';
import {
  INVITATION_STATUS_LABELS,
} from '../../../../shared/models/entities/membership-invitation.model';
import type { InvitableFounderRole } from '../../../../shared/models/entities/tontine.model';
import { formatApiError } from '../../../../core/utils';

const LOCAL_PHONE_RE = /^\d{5,15}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface Country {
  code: string;
  name: string;
  dial_code: string;
}

const COUNTRIES: Country[] = [
  { code: 'CM', name: 'Cameroun', dial_code: '+237' },
  { code: 'NG', name: 'Nigeria', dial_code: '+234' },
  { code: 'SN', name: 'Sénégal', dial_code: '+221' },
  { code: 'CI', name: "Côte d'Ivoire", dial_code: '+225' },
  { code: 'GH', name: 'Ghana', dial_code: '+233' },
  { code: 'CD', name: 'Congo RDC', dial_code: '+243' },
  { code: 'CG', name: 'Congo', dial_code: '+242' },
  { code: 'GA', name: 'Gabon', dial_code: '+241' },
  { code: 'TD', name: 'Tchad', dial_code: '+235' },
  { code: 'CF', name: 'Centrafrique', dial_code: '+236' },
  { code: 'GQ', name: 'Guinée Équatoriale', dial_code: '+240' },
  { code: 'ML', name: 'Mali', dial_code: '+223' },
  { code: 'BF', name: 'Burkina Faso', dial_code: '+226' },
  { code: 'BJ', name: 'Bénin', dial_code: '+229' },
  { code: 'TG', name: 'Togo', dial_code: '+228' },
  { code: 'GN', name: 'Guinée', dial_code: '+224' },
  { code: 'MA', name: 'Maroc', dial_code: '+212' },
  { code: 'TN', name: 'Tunisie', dial_code: '+216' },
  { code: 'DZ', name: 'Algérie', dial_code: '+213' },
  { code: 'MU', name: 'Île Maurice', dial_code: '+230' },
  { code: 'FR', name: 'France', dial_code: '+33' },
  { code: 'BE', name: 'Belgique', dial_code: '+32' },
  { code: 'CH', name: 'Suisse', dial_code: '+41' },
  { code: 'CA', name: 'Canada', dial_code: '+1' },
  { code: 'US', name: 'États-Unis', dial_code: '+1' },
  { code: 'GB', name: 'Royaume-Uni', dial_code: '+44' },
  { code: 'DE', name: 'Allemagne', dial_code: '+49' },
  { code: 'ES', name: 'Espagne', dial_code: '+34' },
  { code: 'IT', name: 'Italie', dial_code: '+39' },
  { code: 'PT', name: 'Portugal', dial_code: '+351' },
];

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
              <!-- Recherche d'un utilisateur existant par lien/UUID ou téléphone -->
              <div class="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-3">
                <label class="mb-1 block text-sm font-medium text-gray-700">
                  Rechercher un utilisateur existant
                </label>
                <div class="flex gap-2">
                  <input
                    type="text"
                    class="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Lien / UUID ou +2376XXXXXXXX"
                    autocomplete="off"
                    [value]="lookupQuery()"
                    (input)="lookupQuery.set($any($event.target).value)"
                    (keydown.enter)="runLookup($event)"
                  />
                  <tc-button
                    type="button"
                    variant="secondary"
                    [loading]="lookingUp()"
                    [disabled]="!lookupQuery().trim()"
                    (clicked)="runLookup($event)"
                  >
                    Rechercher
                  </tc-button>
                </div>
                <p class="mt-1 text-xs text-gray-500">
                  Collez le lien de profil (ou l'UUID) du candidat, ou son numéro de téléphone.
                </p>
                @if (lookupError(); as le) {
                  <p class="mt-1 text-xs text-red-600">{{ le }}</p>
                }
                @if (lookupWarning(); as lw) {
                  <p class="mt-1 text-xs text-amber-600">{{ lw }}</p>
                }
                @if (lockedFromLookup()) {
                  <p class="mt-1 text-xs text-green-700">
                    ✓ Utilisateur trouvé · champs pré-remplis ·
                    <button type="button" class="text-blue-600 hover:underline" (click)="unlockManualEntry()">
                      Saisir manuellement
                    </button>
                  </p>
                }
              </div>

              <tc-input
                label="Nom complet"
                [(value)]="fullName"
                [(touched)]="fullNameTouched"
                [error]="fullNameError()"
                [required]="true"
                [disabled]="lockedFromLookup()"
              />
              <!-- Téléphone : sélecteur pays + numéro local -->
              <div>
                <label class="mb-1 block text-sm font-medium text-gray-700">
                  Téléphone <span class="text-red-500">*</span>
                </label>
                <div class="flex rounded-lg border overflow-hidden transition-colors"
                     [class]="phoneTouched() && phoneError()
                       ? 'border-red-400'
                       : 'border-gray-300 focus-within:border-blue-500'">
                  <!-- Sélecteur pays -->
                  <div class="flex items-center gap-1 px-2 bg-gray-50 border-r border-gray-300 flex-shrink-0">
                    <img
                      [src]="'https://flagcdn.com/w20/' + selectedCountryCode().toLowerCase() + '.png'"
                      [alt]="selectedCountry().name"
                      style="width: 18px; height: 12px; object-fit: cover; border-radius: 2px; flex-shrink: 0;"
                    />
                    <select
                      class="bg-transparent text-gray-700 text-sm focus:outline-none cursor-pointer py-2"
                      [disabled]="lockedFromLookup()"
                      (change)="selectedCountryCode.set($any($event.target).value)"
                    >
                      @for (c of countries; track c.code) {
                        <option [value]="c.code" [selected]="c.code === selectedCountryCode()">
                          {{ c.code }}-{{ c.dial_code.slice(1) }}
                        </option>
                      }
                    </select>
                  </div>
                  <!-- Numéro local -->
                  <input
                    type="tel"
                    placeholder="Numéro local"
                    class="flex-1 px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none placeholder-gray-400 min-w-0"
                    [class.bg-gray-50]="lockedFromLookup()"
                    [disabled]="lockedFromLookup()"
                    [value]="localPhone()"
                    (input)="localPhone.set($any($event.target).value)"
                    (blur)="phoneTouched.set(true)"
                  />
                </div>
                @if (phoneTouched() && phoneError()) {
                  <p class="mt-1 text-xs text-red-600">{{ phoneError() }}</p>
                }
              </div>
              <tc-input
                label="Email (optionnel)"
                type="email"
                [(value)]="email"
                [(touched)]="emailTouched"
                [error]="emailError()"
                [disabled]="lockedFromLookup()"
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

  protected readonly countries = COUNTRIES;

  // ── Form state ──────────────────────────────────────────────────────────
  readonly fullName = signal('');
  readonly fullNameTouched = signal(false);
  readonly selectedCountryCode = signal('CM');
  readonly selectedCountry = computed(
    () => this.countries.find(c => c.code === this.selectedCountryCode()) ?? this.countries[0],
  );
  readonly localPhone = signal('');
  readonly phoneTouched = signal(false);
  readonly fullPhone = computed(
    () => `${this.selectedCountry().dial_code}${this.localPhone().trim()}`,
  );
  readonly email = signal('');
  readonly emailTouched = signal(false);
  readonly proposedRole = signal<InvitableFounderRole>('MEMBER');
  readonly channels = signal<InvitationChannel[]>(['SMS']);
  readonly message = signal('');

  // ── Recherche d'un utilisateur existant (lookup) ──────────────────────────
  readonly lookupQuery = signal('');
  readonly lookingUp = signal(false);
  readonly lookupError = signal<string | null>(null);
  readonly lookupWarning = signal<string | null>(null);
  /** Vrai quand un utilisateur a été trouvé : nom/téléphone/email verrouillés. */
  readonly lockedFromLookup = signal(false);

  readonly submitting = signal(false);
  readonly resendingId = signal<string | null>(null);
  readonly cancellingId = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);

  readonly fullNameError = computed(() => (this.fullName().trim() ? '' : 'Nom requis.'));
  readonly phoneError = computed(() =>
    LOCAL_PHONE_RE.test(this.localPhone().replace(/[\s\-]/g, '')) ? '' : 'Numéro local invalide.',
  );
  readonly emailError = computed(() => {
    const v = this.email().trim();
    return !v || EMAIL_RE.test(v) ? '' : 'Email invalide.';
  });
  readonly channelsError = computed(() =>
    this.channels().length === 0 ? 'Choisissez au moins un canal.' : '',
  );

  // ── Recherche d'un utilisateur ────────────────────────────────────────────
  /** Décompose un numéro international en code pays + numéro local. */
  private parsePhone(full: string): { countryCode: string; localPhone: string } {
    const sorted = [...COUNTRIES].sort((a, b) => b.dial_code.length - a.dial_code.length);
    for (const c of sorted) {
      if (full.startsWith(c.dial_code)) {
        return { countryCode: c.code, localPhone: full.slice(c.dial_code.length) };
      }
    }
    return { countryCode: 'CM', localPhone: full };
  }

  /** Extrait un UUID d'une chaîne (lien collé ou UUID brut), sinon null. */
  private extractUuid(raw: string): string | null {
    const m = raw.match(
      /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/,
    );
    return m ? m[0] : null;
  }

  async runLookup(event: Event): Promise<void> {
    event.preventDefault();
    const raw = this.lookupQuery().trim();
    if (!raw) return;

    this.lookupError.set(null);
    this.lookupWarning.set(null);
    this.lookingUp.set(true);
    try {
      const uuid = this.extractUuid(raw);
      const params = uuid ? { userId: uuid } : { phone: raw.replace(/\s+/g, '') };
      const candidate: CandidateLookup = await this.service.lookupCandidate(params);

      this.fullName.set(`${candidate.firstName} ${candidate.lastName}`.trim());
      const parsed = this.parsePhone(candidate.phone || '');
      this.selectedCountryCode.set(parsed.countryCode);
      this.localPhone.set(parsed.localPhone);
      this.email.set(candidate.email ?? '');
      this.lockedFromLookup.set(true);

      if (candidate.alreadyMember) {
        this.lookupWarning.set(
          'Cet utilisateur est déjà membre de la tontine. Une invitation est inutile.',
        );
      }
    } catch (e: unknown) {
      this.lookupError.set(
        formatApiError(e, 'Aucun utilisateur trouvé. Vous pouvez saisir les informations manuellement.'),
      );
    } finally {
      this.lookingUp.set(false);
    }
  }

  unlockManualEntry(): void {
    this.lockedFromLookup.set(false);
    this.lookupWarning.set(null);
  }

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
        candidatePhone: this.fullPhone(),
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
        formatApiError(e, 'Erreur lors de l\'envoi.'),
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
        formatApiError(e, 'Relance impossible.'),
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
        formatApiError(e, 'Annulation impossible.'),
      );
    } finally {
      this.cancellingId.set(null);
    }
  }

  private resetForm(): void {
    this.fullName.set('');
    this.fullNameTouched.set(false);
    this.selectedCountryCode.set('CM');
    this.localPhone.set('');
    this.phoneTouched.set(false);
    this.email.set('');
    this.emailTouched.set(false);
    this.proposedRole.set('MEMBER');
    this.channels.set(['SMS']);
    this.message.set('');
    this.lookupQuery.set('');
    this.lookupError.set(null);
    this.lookupWarning.set(null);
    this.lockedFromLookup.set(false);
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

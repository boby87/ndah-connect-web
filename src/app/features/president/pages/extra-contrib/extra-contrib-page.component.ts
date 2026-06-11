import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, resource, signal } from '@angular/core';
import { AlertComponent } from '../../../../shared/components/ui/alert/alert.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { EmptyStateComponent } from '../../../../shared/components/ui/empty-state/empty-state.component';
import { InputComponent } from '../../../../shared/components/ui/input/input.component';
import { SpinnerComponent } from '../../../../shared/components/ui/spinner/spinner.component';
import { TextareaComponent } from '../../../../shared/components/ui/textarea/textarea.component';
import { CurrencyXafPipe } from '../../../../shared/pipes/currency-xaf.pipe';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { NotificationService } from '../../../../core/services/notification.service';
import { PresidentService } from '../../services/president.service';
import { SecretaryService } from '../../../secretary/services/secretary.service';
import type { ExtraordinaryContribution } from '../../../../shared/models/entities/extraordinary-contribution.model';
import type { Member } from '../../../../shared/models/entities/member.model';
import { formatApiError } from '../../../../core/utils';

@Component({
  selector: 'tc-extra-contrib',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DecimalPipe,
    AlertComponent,
    BadgeComponent,
    ButtonComponent,
    CardComponent,
    EmptyStateComponent,
    InputComponent,
    SpinnerComponent,
    TextareaComponent,
    CurrencyXafPipe,
    DateFormatPipe,
  ],
  template: `
    <div class="space-y-6">
      <header>
        <h1 class="text-2xl font-bold text-gray-900">Cotisations extraordinaires</h1>
        <p class="text-sm text-gray-500">
          Après vote de l'Assemblée, lancez la collecte puis ordonnez la distribution.
        </p>
      </header>

      <div class="grid gap-6 lg:grid-cols-3">
        <div class="lg:col-span-2 space-y-4">
          @if (resource.isLoading()) {
            <p class="text-sm text-gray-500">Chargement…</p>
          } @else if (items().length === 0) {
            <tc-card>
              <tc-empty-state title="Aucune collecte" icon="💰" />
            </tc-card>
          } @else {
            @for (ec of items(); track ec.id) {
              <tc-card>
                <div class="flex flex-wrap items-start justify-between gap-3">
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-2 flex-wrap">
                      <p class="font-semibold text-gray-900">{{ ec.motive }}</p>
                      <tc-badge [kind]="statusKind(ec.status)">{{ statusLabel(ec.status) }}</tc-badge>
                    </div>
                    @if (ec.beneficiaryFullName) {
                      <p class="text-sm text-gray-600 mt-1">
                        Bénéficiaire : <span class="font-semibold">{{ ec.beneficiaryFullName }}</span>
                      </p>
                    }
                    <p class="text-xs text-gray-500 mt-1">
                      Échéance : {{ ec.dueDate | tcDate }} · Voté en AG le {{ ec.votedByAssemblyAt | tcDate }}
                    </p>
                  </div>
                  <div class="text-right text-sm">
                    <p class="text-gray-500">Collecté / Attendu</p>
                    <p class="font-semibold text-gray-900">
                      {{ ec.totalCollected | xaf }} / {{ ec.totalExpected | xaf }}
                    </p>
                    <p class="text-xs text-gray-500 mt-0.5">
                      {{ progress(ec) | number: '1.0-0' }}%
                    </p>
                  </div>
                </div>

                <div class="mt-3 h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                  <div class="h-full bg-blue-500" [style.width.%]="progress(ec)"></div>
                </div>

                <details class="mt-4">
                  <summary class="text-sm text-blue-600 cursor-pointer">Voir le détail des membres</summary>
                  <ul class="mt-3 divide-y divide-gray-100 text-sm">
                    @for (m of ec.members; track m.memberId) {
                      <li class="py-2 flex items-center justify-between">
                        <span [class.italic]="m.exempted" [class.text-gray-400]="m.exempted">
                          {{ m.fullName }} {{ m.exempted ? '(exempté)' : '' }}
                        </span>
                        <span>
                          @if (m.exempted) {
                            <span class="text-gray-400">—</span>
                          } @else if (m.paid >= m.expected) {
                            <span class="text-green-600 font-medium">✓ {{ m.paid | xaf }}</span>
                          } @else if (m.paid > 0) {
                            <span class="text-amber-600 font-medium">{{ m.paid | xaf }} / {{ m.expected | xaf }}</span>
                          } @else {
                            <span class="text-red-600 font-medium">À payer : {{ m.expected | xaf }}</span>
                          }
                        </span>
                      </li>
                    }
                  </ul>
                </details>

                <div class="mt-4 flex flex-wrap gap-2">
                  @if (ec.status === 'COLLECTING') {
                    <tc-button variant="primary" [loading]="acting() === ec.id + ':close'" (clicked)="close(ec.id)">
                      Clôturer la collecte
                    </tc-button>
                  }
                  @if (ec.status === 'CLOSED') {
                    <tc-button variant="success" [loading]="acting() === ec.id + ':dist'" (clicked)="distribute(ec.id)">
                      Ordonner la distribution
                    </tc-button>
                  }
                </div>
              </tc-card>
            }
          }
        </div>

        <aside>
          <tc-card title="Lancer une cotisation">
            @if (errorMessage(); as err) {
              <tc-alert kind="error">{{ err }}</tc-alert>
            }
            <form class="space-y-4 mt-2" (submit)="onSubmit($event)">
              <tc-textarea
                label="Motif"
                [(value)]="motive"
                [(touched)]="motiveTouched"
                [error]="motiveError()"
                [rows]="3"
                hint="Évènement (décès, mariage, urgence…)"
                [required]="true"
              />
              <div class="relative">
                <label class="block text-sm font-medium text-gray-700 mb-1">Bénéficiaire</label>
                <input
                  type="text"
                  [value]="beneficiaryQuery()"
                  (input)="onBeneficiaryInput($event)"
                  (focus)="beneficiaryOpen.set(true)"
                  (blur)="beneficiaryOpen.set(false)"
                  placeholder="Rechercher un membre par nom ou téléphone…"
                  autocomplete="off"
                  class="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                @if (selectedBeneficiary(); as b) {
                  <p class="mt-1 text-xs text-green-600">
                    Sélectionné : <span class="font-medium">{{ b.firstName }} {{ b.lastName }}</span>
                    · <button type="button" class="text-blue-600 underline" (click)="clearBeneficiary()">retirer</button>
                  </p>
                } @else {
                  <p class="mt-1 text-xs text-gray-500">Optionnel — laissez vide pour une collecte générale.</p>
                }

                @if (beneficiaryOpen()) {
                  <ul
                    class="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
                  >
                    @if (membersResource.isLoading()) {
                      <li class="px-3 py-2"><tc-spinner size="sm" /></li>
                    } @else if (filteredMembers().length === 0) {
                      <li class="px-3 py-2 text-sm text-gray-500">Aucun membre trouvé.</li>
                    } @else {
                      @for (m of filteredMembers(); track m.id) {
                        <li>
                          <button
                            type="button"
                            (mousedown)="selectBeneficiary(m, $event)"
                            class="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50"
                            [class.bg-blue-50]="m.id === beneficiaryId()"
                          >
                            <span class="font-medium text-gray-900">{{ m.firstName }} {{ m.lastName }}</span>
                            <span class="text-xs text-gray-500">{{ m.phone }}</span>
                          </button>
                        </li>
                      }
                    }
                  </ul>
                }
              </div>
              <label class="flex items-center gap-2 text-sm">
                <input type="checkbox" [checked]="exempt()" (change)="exempt.set(checked($event))" />
                Exempter le bénéficiaire
              </label>
              <tc-input
                label="Montant par membre (XAF)"
                type="number"
                [(value)]="amount"
                [(touched)]="amountTouched"
                [error]="amountError()"
                [required]="true"
              />
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Date d'échéance <span class="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  [value]="dueDate()"
                  [min]="todayIso"
                  (input)="onDueDateInput($event)"
                  (blur)="dueDateTouched.set(true)"
                  class="block w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1"
                  [class.border-gray-300]="!(dueDateTouched() && dueDateError())"
                  [class.focus:border-blue-500]="!(dueDateTouched() && dueDateError())"
                  [class.focus:ring-blue-500]="!(dueDateTouched() && dueDateError())"
                  [class.border-red-500]="dueDateTouched() && dueDateError()"
                  [class.focus:ring-red-500]="dueDateTouched() && dueDateError()"
                />
                @if (dueDateTouched() && dueDateError()) {
                  <p class="mt-1 text-xs text-red-600">{{ dueDateError() }}</p>
                } @else {
                  <p class="mt-1 text-xs text-gray-500">Doit être aujourd'hui ou une date ultérieure.</p>
                }
              </div>
              <tc-button type="submit" variant="primary" [fullWidth]="true" [loading]="submitting()">
                Lancer la collecte
              </tc-button>
            </form>
          </tc-card>
        </aside>
      </div>
    </div>
  `,
})
export class ExtraContribComponent {
  private readonly service = inject(PresidentService);
  private readonly secretary = inject(SecretaryService);
  private readonly notifications = inject(NotificationService);

  readonly resource = resource({
    loader: () => this.service.getExtraordinaryContributions(),
  });

  readonly membersResource = resource({
    loader: () => this.secretary.getMembers(),
  });

  readonly items = computed(() => this.resource.value() ?? []);

  /** Date du jour au format YYYY-MM-DD (heure locale) — borne minimale de l'échéance. */
  readonly todayIso = this.localIsoDate();

  readonly motive = signal('');
  readonly motiveTouched = signal(false);
  readonly exempt = signal(true);
  readonly amount = signal('10000');
  readonly amountTouched = signal(false);
  readonly dueDate = signal('');
  readonly dueDateTouched = signal(false);

  // ─── Combobox bénéficiaire ─────────────────────────────────────────────
  /** ID du membre sélectionné — n'est renseigné qu'à la sélection explicite. */
  readonly beneficiaryId = signal('');
  /** Texte saisi dans la recherche. */
  readonly beneficiaryQuery = signal('');
  readonly beneficiaryOpen = signal(false);

  readonly members = computed<Member[]>(() => this.membersResource.value() ?? []);

  readonly selectedBeneficiary = computed<Member | undefined>(() =>
    this.members().find((m) => m.id === this.beneficiaryId()),
  );

  readonly filteredMembers = computed<Member[]>(() => {
    const q = this.beneficiaryQuery().trim().toLowerCase();
    const all = this.members();
    if (!q) return all;
    return all.filter((m) =>
      `${m.firstName} ${m.lastName} ${m.phone} ${m.matricule}`.toLowerCase().includes(q),
    );
  });

  readonly submitting = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly acting = signal<string | null>(null);

  readonly motiveError = computed(() => (this.motive().trim() ? '' : 'Motif requis.'));
  readonly amountError = computed(() => {
    const n = Number(this.amount());
    return Number.isFinite(n) && n > 0 ? '' : 'Montant invalide.';
  });
  readonly dueDateError = computed(() => {
    const v = this.dueDate();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return 'Date d\'échéance requise.';
    if (v < this.todayIso) return 'La date doit être aujourd\'hui ou ultérieure.';
    return '';
  });

  private localIsoDate(): string {
    const d = new Date();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${month}-${day}`;
  }

  onBeneficiaryInput(event: Event): void {
    this.beneficiaryQuery.set((event.target as HTMLInputElement).value);
    // Toute saisie invalide la sélection précédente : l'ID n'est stocké qu'au clic.
    this.beneficiaryId.set('');
    this.beneficiaryOpen.set(true);
  }

  selectBeneficiary(member: Member, event: Event): void {
    // mousedown se déclenche avant le blur : on empêche le défaut pour garder le focus.
    event.preventDefault();
    this.beneficiaryId.set(member.id);
    this.beneficiaryQuery.set(`${member.firstName} ${member.lastName}`);
    this.beneficiaryOpen.set(false);
  }

  clearBeneficiary(): void {
    this.beneficiaryId.set('');
    this.beneficiaryQuery.set('');
  }

  onDueDateInput(event: Event): void {
    this.dueDate.set((event.target as HTMLInputElement).value);
  }

  checked(event: Event): boolean {
    return (event.target as HTMLInputElement).checked;
  }

  progress(ec: ExtraordinaryContribution): number {
    if (ec.totalExpected === 0) return 0;
    return Math.min(100, (ec.totalCollected / ec.totalExpected) * 100);
  }

  statusLabel(status: ExtraordinaryContribution['status']): string {
    return {
      DRAFT: 'Brouillon',
      COLLECTING: 'En collecte',
      CLOSED: 'Clôturée',
      DISTRIBUTED: 'Distribuée',
      CANCELLED: 'Annulée',
    }[status];
  }

  statusKind(status: ExtraordinaryContribution['status']): 'info' | 'warning' | 'success' | 'neutral' | 'danger' {
    return ({
      DRAFT: 'neutral',
      COLLECTING: 'info',
      CLOSED: 'warning',
      DISTRIBUTED: 'success',
      CANCELLED: 'danger',
    } as const)[status];
  }

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.motiveTouched.set(true);
    this.amountTouched.set(true);
    this.dueDateTouched.set(true);
    this.errorMessage.set(null);

    if (this.motiveError() || this.amountError() || this.dueDateError()) return;

    this.submitting.set(true);
    try {
      await this.service.createExtraordinaryContribution({
        motive: this.motive().trim(),
        beneficiaryMemberId: this.beneficiaryId().trim() || undefined,
        amountPerMember: Number(this.amount()),
        dueDate: new Date(this.dueDate()).toISOString(),
        exemptBeneficiary: this.exempt(),
      });
      this.notifications.success('Cotisation extraordinaire lancée.');
      this.motive.set('');
      this.clearBeneficiary();
      this.motiveTouched.set(false);
      this.dueDate.set('');
      this.dueDateTouched.set(false);
      this.resource.reload();
    } catch (e: unknown) {
      this.errorMessage.set(formatApiError(e, 'Erreur.'));
    } finally {
      this.submitting.set(false);
    }
  }

  async close(id: string): Promise<void> {
    this.acting.set(`${id}:close`);
    try {
      await this.service.closeExtraordinaryContribution(id);
      this.notifications.success('Collecte clôturée.');
      this.resource.reload();
    } catch (e: unknown) {
      this.errorMessage.set(formatApiError(e, 'Erreur.'));
    } finally {
      this.acting.set(null);
    }
  }

  async distribute(id: string): Promise<void> {
    this.acting.set(`${id}:dist`);
    try {
      await this.service.distributeExtraordinaryContribution(id);
      this.notifications.success('Distribution ordonnée.');
      this.resource.reload();
    } catch (e: unknown) {
      this.errorMessage.set(formatApiError(e, 'Erreur.'));
    } finally {
      this.acting.set(null);
    }
  }
}

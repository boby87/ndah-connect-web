import { ChangeDetectionStrategy, Component, computed, inject, resource, signal } from '@angular/core';
import { AlertComponent } from '../../../../shared/components/ui/alert/alert.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { EmptyStateComponent } from '../../../../shared/components/ui/empty-state/empty-state.component';
import { InputComponent } from '../../../../shared/components/ui/input/input.component';
import { TextareaComponent } from '../../../../shared/components/ui/textarea/textarea.component';
import { CurrencyXafPipe } from '../../../../shared/pipes/currency-xaf.pipe';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { NotificationService } from '../../../../core/services/notification.service';
import {
  MOBILE_MONEY_PROVIDER_LABELS,
  type MobileMoneyProvider,
  type MobileMoneyStatus,
} from '../../../../shared/models/entities/treasury.model';
import { TreasurerService } from '../../services/treasurer.service';
import { formatApiError } from '../../../../core/utils';

type Tab = 'INCOMING' | 'OUTGOING' | 'RECONCILIATION';

@Component({
  selector: 'tc-mobile-money-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AlertComponent,
    BadgeComponent,
    ButtonComponent,
    CardComponent,
    EmptyStateComponent,
    InputComponent,
    TextareaComponent,
    CurrencyXafPipe,
    DateFormatPipe,
  ],
  template: `
    <div class="space-y-6">
      <header>
        <h1 class="text-2xl font-bold text-gray-900">Mobile Money</h1>
        <p class="text-sm text-gray-500">
          Approuvez les paiements entrants, initiez des paiements sortants et réconciliez avec les transactions API.
        </p>
      </header>

      @if (errorMessage(); as err) {
        <tc-alert kind="error">{{ err }}</tc-alert>
      }

      <div class="flex flex-wrap gap-2">
        @for (t of tabs; track t.value) {
          <button type="button" [class]="tabClass(t.value)" (click)="tab.set(t.value)">
            {{ t.label }}
            @if (t.value === 'INCOMING') {
              <span class="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white/20 px-1.5 text-xs">
                {{ pendingCount() }}
              </span>
            }
          </button>
        }
      </div>

      @switch (tab()) {
        @case ('INCOMING') {
          @if (resource.isLoading()) {
            <p class="text-sm text-gray-500">Chargement…</p>
          } @else if (incoming().length === 0) {
            <tc-card>
              <tc-empty-state title="Aucune transaction entrante" icon="📱" />
            </tc-card>
          } @else {
            <ul class="space-y-3">
              @for (tx of incoming(); track tx.id) {
                <li>
                  <tc-card>
                    <div class="flex flex-wrap items-start justify-between gap-3">
                      <div class="min-w-0 flex-1">
                        <div class="flex items-center gap-2 flex-wrap">
                          <p class="font-semibold text-gray-900">{{ tx.amount | xaf }}</p>
                          <tc-badge kind="info">{{ MOBILE_MONEY_PROVIDER_LABELS[tx.provider] }}</tc-badge>
                          <tc-badge [kind]="statusKind(tx.status)">{{ statusLabel(tx.status) }}</tc-badge>
                        </div>
                        <p class="text-sm text-gray-600 mt-1">
                          De : {{ tx.fromPhone }}
                          @if (tx.matchedMemberFullName) {
                            · <span class="font-medium">{{ tx.matchedMemberFullName }}</span>
                          } @else {
                            · <span class="text-amber-600 italic">Membre non identifié</span>
                          }
                        </p>
                        <p class="text-xs text-gray-500 mt-1">
                          Réf : <span class="font-mono">{{ tx.externalReference }}</span> · Reçu {{ tx.receivedAt | tcDate: true }}
                        </p>
                        @if (tx.rejectionReason) {
                          <p class="text-xs text-red-600 mt-1 italic">✗ {{ tx.rejectionReason }}</p>
                        }
                      </div>
                      @if (tx.status === 'PENDING_APPROVAL') {
                        @if (rejecting() === tx.id) {
                          <div class="w-full space-y-2 mt-2">
                            <tc-textarea label="Motif de rejet" [(value)]="rejectReason" [rows]="2" [required]="true" />
                            <div class="flex gap-2">
                              <tc-button variant="danger" [loading]="acting() === tx.id" (clicked)="confirmReject(tx.id)">
                                Confirmer rejet
                              </tc-button>
                              <tc-button variant="outline" (clicked)="rejecting.set(null)">Annuler</tc-button>
                            </div>
                          </div>
                        } @else {
                          <div class="flex flex-col gap-2 shrink-0">
                            <tc-button variant="success" size="sm" [loading]="acting() === tx.id" (clicked)="approve(tx.id)">
                              ✓ Approuver
                            </tc-button>
                            <tc-button variant="danger" size="sm" (clicked)="rejecting.set(tx.id)">
                              ✗ Rejeter
                            </tc-button>
                          </div>
                        }
                      }
                    </div>
                  </tc-card>
                </li>
              }
            </ul>
          }
        }

        @case ('OUTGOING') {
          <div class="grid gap-6 lg:grid-cols-3">
            <div class="lg:col-span-2 space-y-3">
              @if (outgoing().length === 0) {
                <tc-card>
                  <tc-empty-state title="Aucun paiement sortant" icon="📤" />
                </tc-card>
              } @else {
                @for (tx of outgoing(); track tx.id) {
                  <tc-card>
                    <div class="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div class="flex items-center gap-2 flex-wrap">
                          <p class="font-semibold text-gray-900">{{ tx.amount | xaf }}</p>
                          <tc-badge kind="info">{{ MOBILE_MONEY_PROVIDER_LABELS[tx.provider] }}</tc-badge>
                          <tc-badge [kind]="statusKind(tx.status)">{{ statusLabel(tx.status) }}</tc-badge>
                        </div>
                        <p class="text-sm text-gray-600 mt-1">Vers : {{ tx.toPhone }}</p>
                        <p class="text-xs text-gray-500 mt-1">
                          Réf : <span class="font-mono">{{ tx.externalReference }}</span> · {{ tx.receivedAt | tcDate: true }}
                        </p>
                      </div>
                    </div>
                  </tc-card>
                }
              }
            </div>

            <aside>
              <tc-card title="Nouveau paiement sortant">
                <form class="space-y-3" (submit)="onSend($event)">
                  <div>
                    <p class="text-sm font-medium text-gray-700 mb-1">Opérateur</p>
                    <div class="space-y-1 text-sm">
                      <label class="flex items-center gap-2">
                        <input type="radio" name="provider" [checked]="sendProvider() === 'MTN_MOMO'" (change)="sendProvider.set('MTN_MOMO')" />
                        MTN Mobile Money
                      </label>
                      <label class="flex items-center gap-2">
                        <input type="radio" name="provider" [checked]="sendProvider() === 'ORANGE_MONEY'" (change)="sendProvider.set('ORANGE_MONEY')" />
                        Orange Money
                      </label>
                    </div>
                  </div>
                  <tc-input label="Téléphone destinataire" type="tel" [(value)]="sendPhone" hint="+237..." [required]="true" />
                  <tc-input label="Montant" type="number" [(value)]="sendAmount" [required]="true" />
                  <tc-input label="Motif" [(value)]="sendPurpose" />
                  <tc-input
                    label="PIN sécurité"
                    type="password"
                    [(value)]="sendPin"
                    hint="Au moins 4 chiffres (RM-PS02)"
                    [required]="true"
                  />
                  <tc-button type="submit" variant="primary" [fullWidth]="true" [loading]="sending()">
                    Envoyer le paiement
                  </tc-button>
                </form>
              </tc-card>
            </aside>
          </div>
        }

        @case ('RECONCILIATION') {
          @if (reconResource.isLoading()) {
            <p class="text-sm text-gray-500">Calcul de la réconciliation…</p>
          } @else if (reconciliation(); as r) {
            <div class="grid gap-4 sm:grid-cols-3">
              <tc-card>
                <p class="text-xs uppercase text-gray-500">Transactions API</p>
                <p class="text-2xl font-bold text-gray-900">{{ r.apiTransactionsCount }}</p>
              </tc-card>
              <tc-card>
                <p class="text-xs uppercase text-gray-500">Enregistrées</p>
                <p class="text-2xl font-bold text-gray-900">{{ r.recordedCount }}</p>
              </tc-card>
              <tc-card>
                <p class="text-xs uppercase text-gray-500">Écarts</p>
                <p class="text-2xl font-bold" [class]="r.unmatchedApi.length > 0 ? 'text-amber-600' : 'text-green-600'">
                  {{ r.unmatchedApi.length }}
                </p>
              </tc-card>
            </div>
            <tc-card title="Transactions API non rapprochées">
              @if (r.unmatchedApi.length === 0) {
                <p class="text-sm text-green-600">✓ Toutes les transactions sont rapprochées.</p>
              } @else {
                <ul class="space-y-2">
                  @for (u of r.unmatchedApi; track u.id) {
                    <li class="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2 text-sm">
                      <div>
                        <p class="font-medium text-gray-900">{{ u.amount | xaf }} via {{ u.provider }}</p>
                        <p class="text-xs text-gray-500">{{ u.externalReference }} · {{ u.receivedAt | tcDate: true }}</p>
                      </div>
                      <tc-badge kind="warning">À traiter</tc-badge>
                    </li>
                  }
                </ul>
              }
            </tc-card>
          }
        }
      }
    </div>
  `,
})
export class MobileMoneyPageComponent {
  private readonly service = inject(TreasurerService);
  private readonly notifications = inject(NotificationService);

  protected readonly MOBILE_MONEY_PROVIDER_LABELS = MOBILE_MONEY_PROVIDER_LABELS;
  protected readonly tabs: { label: string; value: Tab }[] = [
    { label: 'Entrants', value: 'INCOMING' },
    { label: 'Sortants', value: 'OUTGOING' },
    { label: 'Réconciliation', value: 'RECONCILIATION' },
  ];

  readonly tab = signal<Tab>('INCOMING');

  readonly resource = resource({
    loader: () => this.service.getMobileMoney(),
  });

  readonly incoming = computed(() => (this.resource.value() ?? []).filter((t) => t.direction === 'IN'));
  readonly outgoing = computed(() => (this.resource.value() ?? []).filter((t) => t.direction === 'OUT'));
  readonly pendingCount = computed(() => this.incoming().filter((t) => t.status === 'PENDING_APPROVAL').length);

  readonly reconResource = resource({
    loader: () => this.service.getReconciliation(),
  });
  readonly reconciliation = computed(() => this.reconResource.value());

  readonly acting = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);

  // Reject inline
  readonly rejecting = signal<string | null>(null);
  readonly rejectReason = signal('');

  // Outgoing form
  readonly sendProvider = signal<MobileMoneyProvider>('MTN_MOMO');
  readonly sendPhone = signal('');
  readonly sendAmount = signal('');
  readonly sendPurpose = signal('');
  readonly sendPin = signal('');
  readonly sending = signal(false);

  tabClass(value: Tab): string {
    const base = 'inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium border';
    return `${base} ${this.tab() === value ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`;
  }

  statusKind(s: MobileMoneyStatus): 'success' | 'warning' | 'danger' | 'info' | 'neutral' {
    if (s === 'COMPLETED' || s === 'APPROVED') return 'success';
    if (s === 'PENDING_APPROVAL') return 'warning';
    if (s === 'REJECTED' || s === 'FAILED') return 'danger';
    return 'neutral';
  }

  statusLabel(s: MobileMoneyStatus): string {
    return {
      PENDING_APPROVAL: 'En attente',
      APPROVED: 'Approuvée',
      REJECTED: 'Rejetée',
      COMPLETED: 'Complétée',
      FAILED: 'Échec',
      REFUNDED: 'Remboursée',
    }[s];
  }

  async approve(id: string): Promise<void> {
    this.acting.set(id);
    this.errorMessage.set(null);
    try {
      await this.service.approveMobileMoney(id);
      this.notifications.success('Transaction approuvée.');
      this.resource.reload();
    } catch (e: unknown) {
      this.errorMessage.set(formatApiError(e, 'Erreur.'));
    } finally {
      this.acting.set(null);
    }
  }

  async confirmReject(id: string): Promise<void> {
    if (!this.rejectReason().trim()) return;
    this.acting.set(id);
    this.errorMessage.set(null);
    try {
      await this.service.rejectMobileMoney(id, this.rejectReason().trim());
      this.notifications.success('Transaction rejetée.');
      this.rejecting.set(null);
      this.rejectReason.set('');
      this.resource.reload();
    } catch (e: unknown) {
      this.errorMessage.set(formatApiError(e, 'Erreur.'));
    } finally {
      this.acting.set(null);
    }
  }

  async onSend(event: Event): Promise<void> {
    event.preventDefault();
    this.errorMessage.set(null);
    const amount = Number(this.sendAmount());
    if (!this.sendPhone() || !Number.isFinite(amount) || amount <= 0 || this.sendPin().length < 4) {
      this.errorMessage.set('Téléphone, montant et PIN (4+ chiffres) requis.');
      return;
    }
    this.sending.set(true);
    try {
      await this.service.sendMobileMoney({
        provider: this.sendProvider(),
        toPhone: this.sendPhone().trim(),
        amount,
        purpose: this.sendPurpose().trim(),
        pin: this.sendPin(),
      });
      this.notifications.success('Paiement envoyé.');
      this.sendPhone.set('');
      this.sendAmount.set('');
      this.sendPurpose.set('');
      this.sendPin.set('');
      this.resource.reload();
    } catch (e: unknown) {
      this.errorMessage.set(formatApiError(e, 'Erreur.'));
    } finally {
      this.sending.set(false);
    }
  }
}

import { ChangeDetectionStrategy, Component, computed, inject, resource, signal } from '@angular/core';
import { AlertComponent } from '../../../../shared/components/ui/alert/alert.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { EmptyStateComponent } from '../../../../shared/components/ui/empty-state/empty-state.component';
import { InputComponent } from '../../../../shared/components/ui/input/input.component';
import { CurrencyXafPipe } from '../../../../shared/pipes/currency-xaf.pipe';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { NotificationService } from '../../../../core/services/notification.service';
import {
  PAYMENT_METHOD_LABELS,
  PaymentMethod,
} from '../../../../core/enums/payment-method.enum';
import { TreasurerService } from '../../services/treasurer.service';

@Component({
  selector: 'tc-distributions-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AlertComponent,
    BadgeComponent,
    ButtonComponent,
    CardComponent,
    EmptyStateComponent,
    InputComponent,
    CurrencyXafPipe,
    DateFormatPipe,
  ],
  template: `
    <div class="space-y-6">
      <header>
        <h1 class="text-2xl font-bold text-gray-900">Distribution de la cagnotte</h1>
        <p class="text-sm text-gray-500">
          La distribution s'effectue pendant une séance active (RM-DC01).
          Les prélèvements vers les caisses Secours et Fonctionnement sont automatiques (RM-DC03).
          Le bénéficiaire confirme avec un OTP (RM-DC04).
        </p>
      </header>

      @if (errorMessage(); as err) {
        <tc-alert kind="error">{{ err }}</tc-alert>
      }

      <div class="grid gap-6 lg:grid-cols-3">
        <div class="lg:col-span-2 space-y-3">
          <tc-card title="Séances en cours / éligibles">
            @if (sessionsResource.isLoading()) {
              <p class="text-sm text-gray-500">Chargement…</p>
            } @else if (sessions().length === 0) {
              <tc-empty-state title="Aucune séance" icon="📅" />
            } @else {
              <ul class="space-y-2">
                @for (s of sessions(); track s.id) {
                  <li>
                    <button
                      type="button"
                      class="w-full text-left rounded-lg border p-3 transition-colors"
                      [class.border-blue-500]="selectedSessionId() === s.id"
                      [class.bg-blue-50]="selectedSessionId() === s.id"
                      [class.border-gray-200]="selectedSessionId() !== s.id"
                      (click)="selectedSessionId.set(s.id)"
                    >
                      <div class="flex items-center justify-between">
                        <div>
                          <p class="font-semibold text-gray-900">Séance #{{ s.number }}</p>
                          <p class="text-xs text-gray-500">{{ s.scheduledAt | tcDate: true }}</p>
                        </div>
                        <tc-badge [kind]="s.status === 'IN_PROGRESS' ? 'warning' : s.status === 'COMPLETED' ? 'success' : 'neutral'">
                          {{ s.status }}
                        </tc-badge>
                      </div>
                      @if (s.beneficiaryFullName) {
                        <p class="text-xs text-gray-700 mt-1">
                          Bénéficiaire : <span class="font-semibold">{{ s.beneficiaryFullName }}</span> · {{ s.cagnotteAmount | xaf }}
                        </p>
                      }
                    </button>
                  </li>
                }
              </ul>
            }
          </tc-card>

          <tc-card title="Historique des distributions">
            @if (distributionsResource.isLoading()) {
              <p class="text-sm text-gray-500">Chargement…</p>
            } @else if (distributions().length === 0) {
              <tc-empty-state title="Aucune distribution" icon="🎁" />
            } @else {
              <ul class="divide-y divide-gray-100">
                @for (d of distributions(); track d.id) {
                  <li class="py-3 first:pt-0 last:pb-0">
                    <div class="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p class="font-semibold text-gray-900">Séance #{{ d.sessionNumber }} → {{ d.beneficiaryFullName }}</p>
                        <p class="text-xs text-gray-500">
                          Brut {{ d.grossAmount | xaf }} · Secours {{ d.deductionEmergency | xaf }} · Fonctionnement {{ d.deductionOperations | xaf }}
                        </p>
                      </div>
                      <div class="text-right">
                        <p class="text-lg font-bold text-green-600">{{ d.netAmount | xaf }}</p>
                        @if (d.beneficiaryConfirmed) {
                          <tc-badge kind="success">✓ Confirmé</tc-badge>
                        }
                      </div>
                    </div>
                  </li>
                }
              </ul>
            }
          </tc-card>
        </div>

        <aside>
          <tc-card title="Distribuer la cagnotte">
            @if (selectedSessionId()) {
              <form class="space-y-4" (submit)="onSubmit($event)">
                <div>
                  <p class="text-sm font-medium text-gray-700 mb-1">Méthode de paiement</p>
                  <div class="space-y-1 text-sm">
                    @for (m of methods; track m) {
                      <label class="flex items-center gap-2">
                        <input type="radio" name="method" [checked]="method() === m" (change)="method.set(m)" />
                        {{ methodLabel(m) }}
                      </label>
                    }
                  </div>
                </div>
                <tc-input
                  label="OTP du bénéficiaire"
                  [(value)]="otp"
                  [(touched)]="otpTouched"
                  [error]="otpError()"
                  hint="Code à 4-6 chiffres reçu par le bénéficiaire"
                  [required]="true"
                />
                <tc-button type="submit" variant="success" [fullWidth]="true" [loading]="submitting()">
                  ✓ Confirmer la distribution
                </tc-button>
              </form>
            } @else {
              <p class="text-sm text-gray-500">Sélectionnez une séance dans la liste pour effectuer la distribution.</p>
            }
          </tc-card>
        </aside>
      </div>
    </div>
  `,
})
export class DistributionsPageComponent {
  private readonly service = inject(TreasurerService);
  private readonly notifications = inject(NotificationService);

  protected readonly methods: PaymentMethod[] = [PaymentMethod.CASH, PaymentMethod.MOBILE_MONEY, PaymentMethod.ORANGE_MONEY];

  readonly sessionsResource = resource({
    loader: () => this.service.getSessions(),
  });

  readonly sessions = computed(() =>
    [...(this.sessionsResource.value() ?? [])].filter(
      (s) => s.beneficiaryMemberId && (s.status === 'IN_PROGRESS' || s.status === 'COMPLETED'),
    ),
  );

  readonly distributionsResource = resource({
    loader: () => this.service.getDistributions(),
  });

  readonly distributions = computed(() => this.distributionsResource.value() ?? []);

  readonly selectedSessionId = signal<string | null>(null);
  readonly method = signal<PaymentMethod>(PaymentMethod.MOBILE_MONEY);
  readonly otp = signal('');
  readonly otpTouched = signal(false);

  readonly submitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly otpError = computed(() =>
    /^\d{4,6}$/.test(this.otp()) ? '' : 'OTP : 4 à 6 chiffres.',
  );

  methodLabel(m: PaymentMethod): string {
    return PAYMENT_METHOD_LABELS[m];
  }

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.otpTouched.set(true);
    this.errorMessage.set(null);
    if (!this.selectedSessionId() || this.otpError()) return;

    this.submitting.set(true);
    try {
      await this.service.createDistribution({
        sessionId: this.selectedSessionId()!,
        paymentMethod: this.method(),
        otp: this.otp(),
      });
      this.notifications.success('Cagnotte distribuée.');
      this.otp.set('');
      this.otpTouched.set(false);
      this.distributionsResource.reload();
      this.sessionsResource.reload();
    } catch (e: unknown) {
      this.errorMessage.set((e as { error?: { message?: string } })?.error?.message ?? 'Erreur.');
    } finally {
      this.submitting.set(false);
    }
  }
}

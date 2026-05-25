import { ChangeDetectionStrategy, Component, computed, inject, resource, signal } from '@angular/core';
import { AlertComponent } from '../../../../shared/components/ui/alert/alert.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { InputComponent } from '../../../../shared/components/ui/input/input.component';
import { SpinnerComponent } from '../../../../shared/components/ui/spinner/spinner.component';
import { CurrencyXafPipe } from '../../../../shared/pipes/currency-xaf.pipe';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { NotificationService } from '../../../../core/services/notification.service';
import { PresidentService } from '../../services/president.service';

@Component({
  selector: 'tc-cycle-close',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AlertComponent,
    ButtonComponent,
    CardComponent,
    InputComponent,
    SpinnerComponent,
    CurrencyXafPipe,
    DateFormatPipe,
  ],
  template: `
    <div class="space-y-6">
      <header>
        <h1 class="text-2xl font-bold text-gray-900">Clôture du cycle</h1>
        <p class="text-sm text-gray-500">
          Vérifiez les prérequis et signez la clôture. Tous les membres seront notifiés du nouveau planning.
        </p>
      </header>

      @if (errorMessage(); as err) {
        <tc-alert kind="error">{{ err }}</tc-alert>
      }

      @if (resource.isLoading()) {
        <div class="flex justify-center py-12"><tc-spinner size="lg" /></div>
      } @else if (cc(); as c) {
        <div class="grid gap-6 lg:grid-cols-3">
          <div class="lg:col-span-2 space-y-6">
            <tc-card title="Prérequis de clôture" [subtitle]="'Cycle #' + c.cycleNumber">
              <ul class="space-y-2">
                @for (item of c.checklist; track item.key) {
                  <li class="flex items-center justify-between gap-3 rounded-lg border border-gray-100 px-3 py-2">
                    <div class="flex items-center gap-2">
                      <span [class]="badgeForCheck(item.status)">
                        {{ item.status === 'DONE' ? '✓' : item.status === 'BLOCKED' ? '✗' : '⏳' }}
                      </span>
                      <span class="text-sm text-gray-900">{{ item.label }}</span>
                    </div>
                    @if (item.status !== 'DONE') {
                      <tc-button variant="ghost" size="sm" (clicked)="markDone(item.key)">
                        Marquer fait
                      </tc-button>
                    }
                  </li>
                }
              </ul>
            </tc-card>

            <tc-card title="Bilan du cycle">
              <dl class="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <dt class="text-gray-500">Cotisations collectées</dt>
                  <dd class="font-semibold text-gray-900">{{ c.summary.totalCollected | xaf }}</dd>
                </div>
                <div>
                  <dt class="text-gray-500">Distributions</dt>
                  <dd class="font-semibold text-gray-900">{{ c.summary.totalDistributed | xaf }}</dd>
                </div>
                <div>
                  <dt class="text-gray-500">Prêts en cours (reportés)</dt>
                  <dd class="font-semibold text-amber-600">{{ c.summary.totalLoansOutstanding | xaf }}</dd>
                </div>
                <div>
                  <dt class="text-gray-500">Sanctions perçues</dt>
                  <dd class="font-semibold text-gray-900">{{ c.summary.totalSanctionsCollected | xaf }}</dd>
                </div>
                <div>
                  <dt class="text-gray-500">Résultat net</dt>
                  <dd class="font-semibold" [class]="c.summary.netResult >= 0 ? 'text-green-600' : 'text-red-600'">
                    {{ c.summary.netResult | xaf }}
                  </dd>
                </div>
                <div>
                  <dt class="text-gray-500">Membres maintenus</dt>
                  <dd class="font-semibold text-gray-900">{{ c.summary.membersRetained }}</dd>
                </div>
              </dl>
            </tc-card>
          </div>

          <aside>
            <tc-card title="Signature de clôture">
              @if (c.status === 'CLOSED') {
                <tc-alert kind="success" title="Cycle clôturé">
                  Signé le {{ c.presidentSignedAt | tcDate: true }}.
                </tc-alert>
                @if (c.nextCycleStartDate) {
                  <p class="mt-3 text-sm">
                    Prochain cycle débute le <span class="font-semibold">{{ c.nextCycleStartDate | tcDate }}</span>
                  </p>
                  <p class="text-xs text-gray-500 mt-1">Mode de tirage : {{ drawModeLabel(c.nextCycleDrawMode) }}</p>
                }
              } @else {
                <p class="text-sm text-gray-600 mb-3">
                  Tous les prérequis doivent être validés (incluant l'avis du Commissaire) avant signature.
                </p>
                <div class="space-y-3">
                  <tc-input
                    label="Démarrage du prochain cycle (YYYY-MM-DD)"
                    [(value)]="nextStart"
                    [(touched)]="nextStartTouched"
                    [error]="nextStartError()"
                    [required]="true"
                  />
                  <div>
                    <p class="text-sm font-medium text-gray-700 mb-1">Mode de tirage des tours</p>
                    <div class="space-y-1 text-sm">
                      @for (m of drawModes; track m.value) {
                        <label class="flex items-center gap-2">
                          <input type="radio" name="draw" [checked]="drawMode() === m.value" (change)="drawMode.set(m.value)" />
                          {{ m.label }}
                        </label>
                      }
                    </div>
                  </div>
                  <tc-button
                    variant="primary"
                    [fullWidth]="true"
                    [loading]="signing()"
                    [disabled]="!canSign()"
                    (clicked)="sign()"
                  >
                    Signer la clôture
                  </tc-button>
                  @if (!canSign()) {
                    <p class="text-xs text-amber-600">
                      Tous les prérequis doivent être marqués comme faits.
                    </p>
                  }
                </div>
              }
            </tc-card>
          </aside>
        </div>
      } @else {
        <tc-card>Données indisponibles.</tc-card>
      }
    </div>
  `,
})
export class CycleClosePageComponent {
  private readonly service = inject(PresidentService);
  private readonly notifications = inject(NotificationService);

  readonly resource = resource({
    loader: () => this.service.getCycleClose(),
  });

  readonly cc = computed(() => this.resource.value());

  readonly nextStart = signal('');
  readonly nextStartTouched = signal(false);
  readonly drawMode = signal<'RANDOM' | 'SENIORITY' | 'ASSEMBLY_VOTE'>('RANDOM');

  readonly signing = signal(false);
  readonly errorMessage = signal<string | null>(null);

  protected readonly drawModes: { value: 'RANDOM' | 'SENIORITY' | 'ASSEMBLY_VOTE'; label: string }[] = [
    { value: 'RANDOM', label: 'Tirage au sort' },
    { value: 'SENIORITY', label: 'Ancienneté' },
    { value: 'ASSEMBLY_VOTE', label: 'Vote en Assemblée' },
  ];

  readonly nextStartError = computed(() =>
    /^\d{4}-\d{2}-\d{2}$/.test(this.nextStart()) ? '' : 'Format YYYY-MM-DD requis.',
  );

  readonly canSign = computed(() => {
    const c = this.cc();
    if (!c) return false;
    return c.checklist.every((i) => i.status === 'DONE');
  });

  drawModeLabel(value: 'RANDOM' | 'SENIORITY' | 'ASSEMBLY_VOTE' | undefined): string {
    return this.drawModes.find((m) => m.value === value)?.label ?? '—';
  }

  badgeForCheck(status: 'PENDING' | 'DONE' | 'BLOCKED'): string {
    const base = 'inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold';
    return `${base} ${({
      DONE: 'bg-green-100 text-green-700',
      PENDING: 'bg-amber-100 text-amber-700',
      BLOCKED: 'bg-red-100 text-red-700',
    } as Record<typeof status, string>)[status]}`;
  }

  async markDone(key: string): Promise<void> {
    try {
      await this.service.markCycleCheck(key);
      this.resource.reload();
    } catch (e: unknown) {
      this.errorMessage.set((e as { error?: { message?: string } })?.error?.message ?? 'Erreur.');
    }
  }

  async sign(): Promise<void> {
    this.nextStartTouched.set(true);
    if (this.nextStartError() || !this.canSign()) return;

    this.signing.set(true);
    this.errorMessage.set(null);
    try {
      await this.service.signCycleClose(new Date(this.nextStart()).toISOString(), this.drawMode());
      this.notifications.success('Cycle clôturé.');
      this.resource.reload();
    } catch (e: unknown) {
      this.errorMessage.set((e as { error?: { message?: string } })?.error?.message ?? 'Erreur.');
    } finally {
      this.signing.set(false);
    }
  }
}

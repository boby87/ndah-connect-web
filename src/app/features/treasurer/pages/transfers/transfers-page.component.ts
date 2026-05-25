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
import type { CashBoxTransferStatus } from '../../../../shared/models/entities/treasury.model';
import { TreasurerService } from '../../services/treasurer.service';

const TRANSFER_STATUS_LABELS: Record<CashBoxTransferStatus, string> = {
  DRAFT: 'Brouillon',
  PENDING_PRESIDENT: 'En attente Président',
  PENDING_AUDITOR: 'En attente Commissaire',
  APPROVED: 'Approuvé',
  REJECTED: 'Rejeté',
  COMPLETED: 'Effectué',
};

@Component({
  selector: 'tc-transfers-page',
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
        <h1 class="text-2xl font-bold text-gray-900">Transferts entre caisses</h1>
        <p class="text-sm text-gray-500">
          Double validation requise : Président + Commissaire (RM-TC02). La justification est obligatoire (RM-TC03).
        </p>
      </header>

      @if (errorMessage(); as err) {
        <tc-alert kind="error">{{ err }}</tc-alert>
      }

      <div class="grid gap-6 lg:grid-cols-3">
        <div class="lg:col-span-2 space-y-3">
          @if (transfersResource.isLoading()) {
            <p class="text-sm text-gray-500">Chargement…</p>
          } @else if (transfers().length === 0) {
            <tc-card>
              <tc-empty-state title="Aucun transfert" icon="↔" />
            </tc-card>
          } @else {
            @for (t of transfers(); track t.id) {
              <tc-card>
                <div class="flex flex-wrap items-start justify-between gap-3">
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-2 flex-wrap">
                      <p class="font-semibold text-gray-900">
                        {{ t.fromCashBoxName }} → {{ t.toCashBoxName }}
                      </p>
                      <tc-badge [kind]="statusKind(t.status)">{{ TRANSFER_STATUS_LABELS[t.status] }}</tc-badge>
                    </div>
                    <p class="text-2xl font-bold text-gray-900 mt-1">{{ t.amount | xaf }}</p>
                    <p class="text-sm text-gray-600 mt-1">{{ t.justification }}</p>
                    <p class="text-xs text-gray-500 mt-1">
                      Demandé par {{ t.requestedByFullName }} le {{ t.requestedAt | tcDate: true }}
                    </p>
                    @if (t.presidentApprovedAt) {
                      <p class="text-xs text-green-600 mt-0.5">✓ Président : {{ t.presidentApprovedAt | tcDate }}</p>
                    }
                    @if (t.auditorApprovedAt) {
                      <p class="text-xs text-green-600 mt-0.5">✓ Commissaire : {{ t.auditorApprovedAt | tcDate }}</p>
                    }
                    @if (t.rejectionReason) {
                      <p class="text-xs text-red-600 mt-0.5 italic">✗ Rejeté : {{ t.rejectionReason }}</p>
                    }
                  </div>
                </div>
              </tc-card>
            }
          }
        </div>

        <aside>
          <tc-card title="Nouveau transfert">
            <form class="space-y-4" (submit)="onSubmit($event)">
              <div>
                <p class="text-sm font-medium text-gray-700 mb-1">Caisse source</p>
                <div class="space-y-1 text-sm">
                  @for (box of boxes(); track box.id) {
                    <label class="flex items-center gap-2">
                      <input type="radio" name="from" [checked]="fromId() === box.id" (change)="fromId.set(box.id)" />
                      {{ box.name }} <span class="text-xs text-gray-500">({{ box.balance | xaf }})</span>
                    </label>
                  }
                </div>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-700 mb-1">Caisse destination</p>
                <div class="space-y-1 text-sm">
                  @for (box of boxes(); track box.id) {
                    <label class="flex items-center gap-2" [class.opacity-50]="box.id === fromId()">
                      <input type="radio" name="to" [checked]="toId() === box.id" [disabled]="box.id === fromId()" (change)="toId.set(box.id)" />
                      {{ box.name }}
                    </label>
                  }
                </div>
              </div>
              <tc-input
                label="Montant (XAF)"
                type="number"
                [(value)]="amount"
                [(touched)]="amountTouched"
                [error]="amountError()"
                [required]="true"
              />
              <tc-textarea
                label="Justification"
                [(value)]="justification"
                [(touched)]="justifTouched"
                [error]="justifError()"
                [rows]="3"
                [required]="true"
              />
              <tc-button type="submit" variant="primary" [fullWidth]="true" [loading]="submitting()">
                Demander le transfert
              </tc-button>
            </form>
          </tc-card>
        </aside>
      </div>
    </div>
  `,
})
export class TransfersPageComponent {
  private readonly service = inject(TreasurerService);
  private readonly notifications = inject(NotificationService);

  protected readonly TRANSFER_STATUS_LABELS = TRANSFER_STATUS_LABELS;

  readonly transfersResource = resource({
    loader: () => this.service.getTransfers(),
  });

  readonly transfers = computed(() => this.transfersResource.value() ?? []);

  readonly boxesResource = resource({
    loader: () => this.service.getCashBoxes(),
  });

  readonly boxes = computed(() => this.boxesResource.value() ?? []);

  readonly fromId = signal<string | null>(null);
  readonly toId = signal<string | null>(null);
  readonly amount = signal('');
  readonly amountTouched = signal(false);
  readonly justification = signal('');
  readonly justifTouched = signal(false);

  readonly submitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly amountError = computed(() => {
    const n = Number(this.amount());
    return Number.isFinite(n) && n > 0 ? '' : 'Montant invalide.';
  });
  readonly justifError = computed(() =>
    this.justification().trim() ? '' : 'Justification obligatoire (RM-TC03).',
  );

  statusKind(s: CashBoxTransferStatus): 'success' | 'warning' | 'danger' | 'info' | 'neutral' {
    if (s === 'COMPLETED' || s === 'APPROVED') return 'success';
    if (s === 'REJECTED') return 'danger';
    if (s === 'PENDING_PRESIDENT' || s === 'PENDING_AUDITOR') return 'warning';
    return 'neutral';
  }

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.amountTouched.set(true);
    this.justifTouched.set(true);
    this.errorMessage.set(null);

    if (!this.fromId() || !this.toId()) {
      this.errorMessage.set('Sélectionnez les caisses source et destination.');
      return;
    }
    if (this.amountError() || this.justifError()) return;

    this.submitting.set(true);
    try {
      await this.service.createTransfer({
        fromCashBoxId: this.fromId()!,
        toCashBoxId: this.toId()!,
        amount: Number(this.amount()),
        justification: this.justification().trim(),
      });
      this.notifications.success('Transfert créé, en attente de validation.');
      this.amount.set('');
      this.justification.set('');
      this.amountTouched.set(false);
      this.justifTouched.set(false);
      this.transfersResource.reload();
      this.boxesResource.reload();
    } catch (e: unknown) {
      this.errorMessage.set((e as { error?: { message?: string } })?.error?.message ?? 'Erreur.');
    } finally {
      this.submitting.set(false);
    }
  }
}

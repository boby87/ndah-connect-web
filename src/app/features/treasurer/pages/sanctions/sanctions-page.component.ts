import { ChangeDetectionStrategy, Component, computed, inject, resource, signal } from '@angular/core';
import { AlertComponent } from '../../../../shared/components/ui/alert/alert.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { EmptyStateComponent } from '../../../../shared/components/ui/empty-state/empty-state.component';
import { CurrencyXafPipe } from '../../../../shared/pipes/currency-xaf.pipe';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { StatusLabelPipe } from '../../../../shared/pipes/status-label.pipe';
import { NotificationService } from '../../../../core/services/notification.service';
import {
  SANCTION_TYPE_LABELS,
  SanctionStatus,
} from '../../../../core/enums/sanction-type.enum';
import { PaymentMethod } from '../../../../core/enums/payment-method.enum';
import { TreasurerService } from '../../services/treasurer.service';
import type { Sanction } from '../../../../shared/models/entities/sanction.model';

@Component({
  selector: 'tc-treasurer-sanctions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AlertComponent,
    BadgeComponent,
    ButtonComponent,
    CardComponent,
    EmptyStateComponent,
    CurrencyXafPipe,
    DateFormatPipe,
    StatusLabelPipe,
  ],
  template: `
    <div class="space-y-6">
      <header>
        <h1 class="text-2xl font-bold text-gray-900">Sanctions — Encaissement & Remboursement</h1>
        <p class="text-sm text-gray-500">
          Encaissez les sanctions appliquées par le Censeur. Remboursez celles qui ont été annulées par le Président (RM-RS01).
        </p>
      </header>

      @if (errorMessage(); as err) {
        <tc-alert kind="error">{{ err }}</tc-alert>
      }

      @if (resource.isLoading()) {
        <p class="text-sm text-gray-500">Chargement…</p>
      } @else if (sanctions().length === 0) {
        <tc-card>
          <tc-empty-state title="Aucune sanction" icon="⚖" />
        </tc-card>
      } @else {
        <ul class="space-y-3">
          @for (s of sanctions(); track s.id) {
            <li>
              <tc-card>
                <div class="flex flex-wrap items-start justify-between gap-3">
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-2 flex-wrap">
                      <p class="font-semibold text-gray-900">{{ SANCTION_TYPE_LABELS[s.type] }}</p>
                      <tc-badge [kind]="statusKind(s.status)">{{ s.status | statusLabel: 'sanction' }}</tc-badge>
                    </div>
                    <p class="text-sm text-gray-700 mt-1">{{ s.reason }}</p>
                    <p class="text-xs text-gray-500 mt-1">
                      Émise le {{ s.issuedAt | tcDate }} · Membre : {{ s.memberId }}
                    </p>
                  </div>
                  <div class="text-right shrink-0">
                    <p class="text-xl font-bold text-gray-900">{{ s.amount | xaf }}</p>
                    <div class="mt-2 flex flex-col gap-1">
                      @if (s.status === 'CONFIRMED' || s.status === 'PENDING') {
                        <tc-button variant="success" size="sm" [loading]="acting() === s.id + ':collect'" (clicked)="collect(s.id)">
                          ✓ Encaisser
                        </tc-button>
                      }
                      @if (s.status === 'WAIVED') {
                        <tc-button variant="primary" size="sm" [loading]="acting() === s.id + ':refund'" (clicked)="refund(s.id)">
                          ↩ Rembourser
                        </tc-button>
                      }
                    </div>
                  </div>
                </div>
              </tc-card>
            </li>
          }
        </ul>
      }
    </div>
  `,
})
export class TreasurerSanctionsPageComponent {
  private readonly service = inject(TreasurerService);
  private readonly notifications = inject(NotificationService);

  protected readonly SANCTION_TYPE_LABELS = SANCTION_TYPE_LABELS;

  readonly resource = resource({
    loader: () => this.service.getSanctions(),
  });

  readonly sanctions = computed(() => this.resource.value() ?? []);

  readonly acting = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);

  statusKind(s: Sanction['status']): 'success' | 'warning' | 'danger' | 'info' | 'neutral' {
    if (s === SanctionStatus.PAID) return 'success';
    if (s === SanctionStatus.CONFIRMED) return 'info';
    if (s === SanctionStatus.PENDING || s === SanctionStatus.CONTESTED) return 'warning';
    if (s === SanctionStatus.WAIVED) return 'neutral';
    return 'neutral';
  }

  async collect(id: string): Promise<void> {
    this.acting.set(`${id}:collect`);
    this.errorMessage.set(null);
    try {
      await this.service.collectSanction(id, PaymentMethod.CASH);
      this.notifications.success('Sanction encaissée.');
      this.resource.reload();
    } catch (e: unknown) {
      this.errorMessage.set((e as { error?: { message?: string } })?.error?.message ?? 'Erreur.');
    } finally {
      this.acting.set(null);
    }
  }

  async refund(id: string): Promise<void> {
    this.acting.set(`${id}:refund`);
    this.errorMessage.set(null);
    try {
      await this.service.refundSanction(id);
      this.notifications.success('Sanction remboursée.');
      this.resource.reload();
    } catch (e: unknown) {
      this.errorMessage.set((e as { error?: { message?: string } })?.error?.message ?? 'Erreur.');
    } finally {
      this.acting.set(null);
    }
  }
}

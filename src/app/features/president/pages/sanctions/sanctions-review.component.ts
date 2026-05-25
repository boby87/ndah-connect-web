import { ChangeDetectionStrategy, Component, computed, inject, resource, signal } from '@angular/core';
import { AlertComponent } from '../../../../shared/components/ui/alert/alert.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { EmptyStateComponent } from '../../../../shared/components/ui/empty-state/empty-state.component';
import { SpinnerComponent } from '../../../../shared/components/ui/spinner/spinner.component';
import { TextareaComponent } from '../../../../shared/components/ui/textarea/textarea.component';
import { CurrencyXafPipe } from '../../../../shared/pipes/currency-xaf.pipe';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { StatusLabelPipe } from '../../../../shared/pipes/status-label.pipe';
import { NotificationService } from '../../../../core/services/notification.service';
import {
  SANCTION_TYPE_LABELS,
  SanctionStatus,
  SanctionType,
} from '../../../../core/enums/sanction-type.enum';
import { PresidentService } from '../../services/president.service';

@Component({
  selector: 'tc-sanctions-review',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AlertComponent,
    BadgeComponent,
    ButtonComponent,
    CardComponent,
    EmptyStateComponent,
    SpinnerComponent,
    TextareaComponent,
    CurrencyXafPipe,
    DateFormatPipe,
    StatusLabelPipe,
  ],
  template: `
    <div class="space-y-6">
      <header>
        <h1 class="text-2xl font-bold text-gray-900">Sanctions à examiner</h1>
        <p class="text-sm text-gray-500">
          Confirmez ou levez une sanction. Les sanctions contestées par les membres apparaissent en premier.
        </p>
      </header>

      @if (errorMessage(); as err) {
        <tc-alert kind="error">{{ err }}</tc-alert>
      }

      @if (resource.isLoading()) {
        <div class="flex justify-center py-12"><tc-spinner size="lg" /></div>
      } @else if (sanctions().length === 0) {
        <tc-card>
          <tc-empty-state title="Aucune sanction à arbitrer" icon="✓" description="Toutes les sanctions sont résolues." />
        </tc-card>
      } @else {
        <ul class="space-y-3">
          @for (s of sanctions(); track s.id) {
            <li>
              <tc-card>
                <div class="flex flex-wrap items-start justify-between gap-3">
                  <div class="min-w-0 flex-1">
                    <div class="flex flex-wrap items-center gap-2">
                      <p class="font-semibold text-gray-900">{{ typeLabel(s.type) }}</p>
                      <tc-badge [kind]="statusKind(s.status)">
                        {{ s.status | statusLabel: 'sanction' }}
                      </tc-badge>
                    </div>
                    <p class="mt-1 text-sm text-gray-700">{{ s.reason }}</p>
                    <p class="mt-1 text-xs text-gray-500">
                      Émise le {{ s.issuedAt | tcDate }} — Montant : <span class="font-semibold">{{ s.amount | xaf }}</span>
                    </p>
                    @if (s.contestReason) {
                      <div class="mt-3 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2">
                        <p class="text-xs font-semibold text-amber-700">Contestation du membre :</p>
                        <p class="text-sm text-amber-900">« {{ s.contestReason }} »</p>
                        @if (s.contestedAt) {
                          <p class="text-xs text-amber-700 mt-1">{{ s.contestedAt | tcDate: true }}</p>
                        }
                      </div>
                    }
                  </div>
                </div>

                @if (activeForm() === s.id) {
                  <div class="mt-4 space-y-3 border-t border-gray-100 pt-4">
                    <tc-textarea
                      label="Motif de la décision"
                      [(value)]="waiveReason"
                      [(touched)]="waiveTouched"
                      [error]="waiveError()"
                      [rows]="3"
                    />
                    <div class="flex gap-2">
                      <tc-button variant="success" [loading]="actingId() === s.id" (clicked)="confirmWaive(s.id)">
                        Lever la sanction
                      </tc-button>
                      <tc-button variant="outline" (clicked)="cancelForm()">Annuler</tc-button>
                    </div>
                  </div>
                } @else {
                  <div class="mt-4 flex flex-wrap gap-2 border-t border-gray-100 pt-4">
                    <tc-button variant="success" [loading]="actingId() === s.id" (clicked)="openWaiveForm(s.id)">
                      Lever la sanction
                    </tc-button>
                    <tc-button variant="primary" [loading]="actingId() === s.id" (clicked)="confirm(s.id)">
                      Confirmer la sanction
                    </tc-button>
                  </div>
                }
              </tc-card>
            </li>
          }
        </ul>
      }
    </div>
  `,
})
export class SanctionsReviewComponent {
  private readonly service = inject(PresidentService);
  private readonly notifications = inject(NotificationService);

  readonly resource = resource({
    loader: () => this.service.getSanctionsForReview(),
  });

  readonly sanctions = computed(() =>
    [...(this.resource.value() ?? [])].sort((a, b) => {
      if (a.status === SanctionStatus.CONTESTED && b.status !== SanctionStatus.CONTESTED) return -1;
      if (b.status === SanctionStatus.CONTESTED && a.status !== SanctionStatus.CONTESTED) return 1;
      return new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime();
    }),
  );

  readonly activeForm = signal<string | null>(null);
  readonly waiveReason = signal('');
  readonly waiveTouched = signal(false);
  readonly actingId = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);

  readonly waiveError = computed(() =>
    this.waiveReason().trim().length === 0 ? 'Motif obligatoire.' : '',
  );

  typeLabel(type: SanctionType): string {
    return SANCTION_TYPE_LABELS[type];
  }

  statusKind(status: SanctionStatus): 'warning' | 'danger' | 'neutral' {
    if (status === SanctionStatus.CONTESTED) return 'warning';
    if (status === SanctionStatus.PENDING) return 'danger';
    return 'neutral';
  }

  openWaiveForm(id: string): void {
    this.activeForm.set(id);
    this.waiveReason.set('');
    this.waiveTouched.set(false);
  }

  cancelForm(): void {
    this.activeForm.set(null);
  }

  async confirmWaive(id: string): Promise<void> {
    this.waiveTouched.set(true);
    if (this.waiveError()) return;

    this.actingId.set(id);
    this.errorMessage.set(null);
    try {
      await this.service.waiveSanction(id, this.waiveReason());
      this.notifications.success('Sanction levée.');
      this.activeForm.set(null);
      this.resource.reload();
    } catch (error: unknown) {
      const msg =
        (error as { error?: { message?: string } })?.error?.message ?? "Impossible de lever la sanction.";
      this.errorMessage.set(msg);
    } finally {
      this.actingId.set(null);
    }
  }

  async confirm(id: string): Promise<void> {
    this.actingId.set(id);
    this.errorMessage.set(null);
    try {
      await this.service.confirmSanction(id);
      this.notifications.info('Sanction confirmée.');
      this.resource.reload();
    } catch (error: unknown) {
      const msg =
        (error as { error?: { message?: string } })?.error?.message ?? 'Impossible de confirmer la sanction.';
      this.errorMessage.set(msg);
    } finally {
      this.actingId.set(null);
    }
  }
}

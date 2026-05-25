import { ChangeDetectionStrategy, Component, computed, inject, resource, signal } from '@angular/core';
import { AlertComponent } from '../../../../shared/components/ui/alert/alert.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { EmptyStateComponent } from '../../../../shared/components/ui/empty-state/empty-state.component';
import { InputComponent } from '../../../../shared/components/ui/input/input.component';
import { TextareaComponent } from '../../../../shared/components/ui/textarea/textarea.component';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { NotificationService } from '../../../../core/services/notification.service';
import {
  EMERGENCY_BLOCK_TARGET_LABELS,
  type EmergencyBlock,
  type EmergencyBlockTarget,
} from '../../../../shared/models/entities/emergency-block.model';
import { PresidentService } from '../../services/president.service';

const TARGETS: EmergencyBlockTarget[] = [
  'CASH_BOX',
  'LOAN_DISBURSEMENT',
  'TRANSFER',
  'MEMBER_ACCOUNT',
  'WHOLE_TONTINE',
];

@Component({
  selector: 'tc-emergency-blocks',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AlertComponent,
    BadgeComponent,
    ButtonComponent,
    CardComponent,
    EmptyStateComponent,
    InputComponent,
    TextareaComponent,
    DateFormatPipe,
  ],
  template: `
    <div class="space-y-6">
      <header>
        <h1 class="text-2xl font-bold text-gray-900">Blocage d'urgence</h1>
        <p class="text-sm text-gray-500">
          Suspendez immédiatement une opération. Le Bureau et le Commissaire sont notifiés.
        </p>
      </header>

      <tc-alert kind="warning" title="Action critique">
        Réservé aux situations d'urgence (suspicion de fraude, audit, anomalie grave). Le blocage prend effet immédiatement.
      </tc-alert>

      @if (errorMessage(); as err) {
        <tc-alert kind="error">{{ err }}</tc-alert>
      }

      <div class="grid gap-6 lg:grid-cols-3">
        <div class="lg:col-span-2 space-y-3">
          @if (resource.isLoading()) {
            <p class="text-sm text-gray-500">Chargement…</p>
          } @else if (blocks().length === 0) {
            <tc-card>
              <tc-empty-state title="Aucun blocage" icon="🟢" description="Toutes les opérations sont autorisées." />
            </tc-card>
          } @else {
            @for (b of blocks(); track b.id) {
              <tc-card>
                <div class="flex flex-wrap items-start justify-between gap-3">
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-2 flex-wrap">
                      <p class="font-semibold text-gray-900">{{ targetLabel(b.target) }}</p>
                      @if (b.targetRef) {
                        <span class="text-xs text-gray-500">— {{ b.targetRef }}</span>
                      }
                      <tc-badge [kind]="b.status === 'ACTIVE' ? 'danger' : 'success'">
                        {{ b.status === 'ACTIVE' ? '🔴 Actif' : '✓ Levé' }}
                      </tc-badge>
                    </div>
                    <p class="mt-1 text-sm text-gray-700">{{ b.reason }}</p>
                    <p class="text-xs text-gray-500 mt-1">
                      Activé par {{ b.activatedByFullName }} le {{ b.activatedAt | tcDate: true }}
                    </p>
                    @if (b.liftedAt) {
                      <p class="text-xs text-green-600 mt-1">
                        Levé le {{ b.liftedAt | tcDate: true }} — {{ b.liftReason }}
                      </p>
                    }
                  </div>
                  @if (b.status === 'ACTIVE') {
                    @if (liftingId() === b.id) {
                      <div class="w-full space-y-2 mt-2">
                        <tc-textarea label="Motif de levée" [(value)]="liftReason" [rows]="2" [required]="true" />
                        <div class="flex gap-2">
                          <tc-button variant="success" [loading]="actingId() === b.id" (clicked)="confirmLift(b.id)">
                            Lever le blocage
                          </tc-button>
                          <tc-button variant="outline" (clicked)="liftingId.set(null)">Annuler</tc-button>
                        </div>
                      </div>
                    } @else {
                      <tc-button variant="success" size="sm" (clicked)="liftingId.set(b.id)">
                        Lever
                      </tc-button>
                    }
                  }
                </div>
              </tc-card>
            }
          }
        </div>

        <aside>
          <tc-card title="Activer un blocage">
            <form class="space-y-4" (submit)="onSubmit($event)">
              <div>
                <p class="text-sm font-medium text-gray-700 mb-1">Cible</p>
                <div class="space-y-1 text-sm">
                  @for (t of targets; track t) {
                    <label class="flex items-center gap-2">
                      <input type="radio" name="target" [checked]="target() === t" (change)="target.set(t)" />
                      {{ targetLabel(t) }}
                    </label>
                  }
                </div>
              </div>
              <tc-input
                label="Référence (optionnel)"
                [(value)]="targetRef"
                hint="ex: ID prêt, ID membre…"
              />
              <tc-textarea
                label="Motif"
                [(value)]="reason"
                [(touched)]="reasonTouched"
                [error]="reasonError()"
                [rows]="4"
                [required]="true"
              />
              <tc-button type="submit" variant="danger" [fullWidth]="true" [loading]="submitting()">
                Activer le blocage
              </tc-button>
            </form>
          </tc-card>
        </aside>
      </div>
    </div>
  `,
})
export class EmergencyBlocksPageComponent {
  private readonly service = inject(PresidentService);
  private readonly notifications = inject(NotificationService);

  protected readonly targets = TARGETS;

  readonly resource = resource({
    loader: () => this.service.getEmergencyBlocks(),
  });

  readonly blocks = computed(() => this.resource.value() ?? []);

  readonly target = signal<EmergencyBlockTarget>('LOAN_DISBURSEMENT');
  readonly targetRef = signal('');
  readonly reason = signal('');
  readonly reasonTouched = signal(false);

  readonly submitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly liftingId = signal<string | null>(null);
  readonly liftReason = signal('');
  readonly actingId = signal<string | null>(null);

  readonly reasonError = computed(() => (this.reason().trim() ? '' : 'Motif requis.'));

  targetLabel(t: EmergencyBlockTarget): string {
    return EMERGENCY_BLOCK_TARGET_LABELS[t];
  }

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.reasonTouched.set(true);
    this.errorMessage.set(null);

    if (this.reasonError()) return;

    this.submitting.set(true);
    try {
      await this.service.createEmergencyBlock({
        target: this.target(),
        targetRef: this.targetRef().trim() || undefined,
        reason: this.reason().trim(),
      });
      this.notifications.warning('Blocage d\'urgence activé.');
      this.reason.set('');
      this.targetRef.set('');
      this.reasonTouched.set(false);
      this.resource.reload();
    } catch (e: unknown) {
      this.errorMessage.set((e as { error?: { message?: string } })?.error?.message ?? 'Erreur.');
    } finally {
      this.submitting.set(false);
    }
  }

  async confirmLift(id: string): Promise<void> {
    if (!this.liftReason().trim()) return;
    this.actingId.set(id);
    try {
      await this.service.liftEmergencyBlock(id, this.liftReason().trim());
      this.notifications.success('Blocage levé.');
      this.liftingId.set(null);
      this.liftReason.set('');
      this.resource.reload();
    } catch (e: unknown) {
      this.errorMessage.set((e as { error?: { message?: string } })?.error?.message ?? 'Erreur.');
    } finally {
      this.actingId.set(null);
    }
  }
}

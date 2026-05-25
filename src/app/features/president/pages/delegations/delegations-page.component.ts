import { ChangeDetectionStrategy, Component, computed, inject, resource, signal } from '@angular/core';
import { AlertComponent } from '../../../../shared/components/ui/alert/alert.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { EmptyStateComponent } from '../../../../shared/components/ui/empty-state/empty-state.component';
import { InputComponent } from '../../../../shared/components/ui/input/input.component';
import { TextareaComponent } from '../../../../shared/components/ui/textarea/textarea.component';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { RoleLabelPipe } from '../../../../shared/pipes/role-label.pipe';
import { NotificationService } from '../../../../core/services/notification.service';
import {
  DELEGATION_POWER_LABELS,
  type Delegation,
  type DelegationPower,
} from '../../../../shared/models/entities/delegation.model';
import { PresidentService } from '../../services/president.service';

const POWERS: DelegationPower[] = [
  'VALIDATE_DOCUMENTS',
  'VALIDATE_FINANCIAL_OPS',
  'PRESIDE_SESSION',
  'WAIVE_SANCTIONS',
  'PUBLISH_ANNOUNCEMENTS',
  'LAUNCH_VOTE',
];

@Component({
  selector: 'tc-delegations-page',
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
    RoleLabelPipe,
  ],
  template: `
    <div class="space-y-6">
      <header>
        <h1 class="text-2xl font-bold text-gray-900">Délégations de pouvoirs</h1>
        <p class="text-sm text-gray-500">
          Confiez temporairement certains de vos pouvoirs à un membre du Bureau. Le Vice-Président est le délégataire naturel.
        </p>
      </header>

      @if (errorMessage(); as err) {
        <tc-alert kind="error">{{ err }}</tc-alert>
      }

      <div class="grid gap-6 lg:grid-cols-3">
        <div class="lg:col-span-2 space-y-3">
          @if (resource.isLoading()) {
            <p class="text-sm text-gray-500">Chargement…</p>
          } @else if (delegations().length === 0) {
            <tc-card>
              <tc-empty-state title="Aucune délégation" icon="🤝" description="Créez votre première délégation." />
            </tc-card>
          } @else {
            @for (d of delegations(); track d.id) {
              <tc-card>
                <div class="flex flex-wrap items-start justify-between gap-3">
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-2 flex-wrap">
                      <p class="font-semibold text-gray-900">{{ d.delegateeFullName }}</p>
                      <tc-badge kind="info">{{ d.delegateeRole | roleLabel }}</tc-badge>
                      <tc-badge [kind]="statusKind(d.status)">{{ statusLabel(d.status) }}</tc-badge>
                    </div>
                    <p class="mt-1 text-sm text-gray-700">{{ d.reason }}</p>
                    <p class="text-xs text-gray-500 mt-1">
                      Du {{ d.startsAt | tcDate }} au {{ d.endsAt | tcDate }}
                    </p>
                  </div>
                  @if (d.status === 'ACTIVE') {
                    @if (revokingId() === d.id) {
                      <div class="w-full space-y-2 mt-2">
                        <tc-textarea label="Motif de révocation" [(value)]="revokeReason" [rows]="2" [required]="true" />
                        <div class="flex gap-2">
                          <tc-button variant="danger" [loading]="actingId() === d.id" (clicked)="confirmRevoke(d.id)">
                            Confirmer
                          </tc-button>
                          <tc-button variant="outline" (clicked)="revokingId.set(null)">Annuler</tc-button>
                        </div>
                      </div>
                    } @else {
                      <tc-button variant="outline" size="sm" (clicked)="revokingId.set(d.id)">
                        Révoquer
                      </tc-button>
                    }
                  }
                </div>
                <div class="mt-3 flex flex-wrap gap-1">
                  @for (p of d.powers; track p) {
                    <span class="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
                      {{ powerLabel(p) }}
                    </span>
                  }
                </div>
                @if (d.revokedAt) {
                  <p class="mt-3 text-xs text-red-600 italic">
                    Révoquée le {{ d.revokedAt | tcDate: true }} — {{ d.revokedReason }}
                  </p>
                }
              </tc-card>
            }
          }
        </div>

        <aside>
          <tc-card title="Nouvelle délégation">
            <form class="space-y-4" (submit)="onSubmit($event)">
              <tc-input
                label="ID utilisateur du délégataire"
                [(value)]="userId"
                [(touched)]="userIdTouched"
                [error]="userIdError()"
                hint="ex: user-2 (Béatrice)"
                [required]="true"
              />
              <tc-textarea label="Motif" [(value)]="reason" [(touched)]="reasonTouched" [error]="reasonError()" [rows]="2" [required]="true" />
              <tc-input label="Début (YYYY-MM-DD)" [(value)]="startsAt" [required]="true" />
              <tc-input label="Fin (YYYY-MM-DD)" [(value)]="endsAt" [required]="true" />

              <div>
                <p class="text-sm font-medium text-gray-700 mb-1">Pouvoirs délégués</p>
                <div class="space-y-1">
                  @for (p of powersList; track p) {
                    <label class="flex items-center gap-2 text-sm">
                      <input type="checkbox" [checked]="selectedPowers().includes(p)" (change)="togglePower(p, $event)" />
                      {{ powerLabel(p) }}
                    </label>
                  }
                </div>
                @if (powersError()) {
                  <p class="text-xs text-red-600 mt-1">{{ powersError() }}</p>
                }
              </div>

              <tc-button type="submit" variant="primary" [fullWidth]="true" [loading]="submitting()">
                Créer la délégation
              </tc-button>
            </form>
          </tc-card>
        </aside>
      </div>
    </div>
  `,
})
export class DelegationsPageComponent {
  private readonly service = inject(PresidentService);
  private readonly notifications = inject(NotificationService);

  protected readonly powersList = POWERS;

  readonly resource = resource({
    loader: () => this.service.getDelegations(),
  });

  readonly delegations = computed(() => this.resource.value() ?? []);

  readonly userId = signal('');
  readonly userIdTouched = signal(false);
  readonly reason = signal('');
  readonly reasonTouched = signal(false);
  readonly startsAt = signal('');
  readonly endsAt = signal('');
  readonly selectedPowers = signal<DelegationPower[]>([]);

  readonly submitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly revokingId = signal<string | null>(null);
  readonly revokeReason = signal('');
  readonly actingId = signal<string | null>(null);

  readonly userIdError = computed(() => (this.userId().trim() ? '' : 'ID requis.'));
  readonly reasonError = computed(() => (this.reason().trim() ? '' : 'Motif requis.'));
  readonly powersError = computed(() =>
    this.selectedPowers().length === 0 ? 'Sélectionnez au moins un pouvoir.' : '',
  );

  powerLabel(p: DelegationPower): string {
    return DELEGATION_POWER_LABELS[p];
  }

  togglePower(p: DelegationPower, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.selectedPowers.update((list) => (checked ? [...list, p] : list.filter((x) => x !== p)));
  }

  statusLabel(s: Delegation['status']): string {
    return { ACTIVE: 'Active', REVOKED: 'Révoquée', EXPIRED: 'Expirée' }[s];
  }
  statusKind(s: Delegation['status']): 'success' | 'danger' | 'neutral' {
    return { ACTIVE: 'success', REVOKED: 'danger', EXPIRED: 'neutral' }[s] as 'success' | 'danger' | 'neutral';
  }

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.userIdTouched.set(true);
    this.reasonTouched.set(true);
    this.errorMessage.set(null);

    if (this.userIdError() || this.reasonError() || this.powersError()) return;

    this.submitting.set(true);
    try {
      await this.service.createDelegation({
        delegateeUserId: this.userId().trim(),
        reason: this.reason().trim(),
        startsAt: new Date(this.startsAt() || new Date().toISOString()).toISOString(),
        endsAt: new Date(this.endsAt() || new Date(Date.now() + 7 * 24 * 3600_000).toISOString()).toISOString(),
        powers: this.selectedPowers(),
      });
      this.notifications.success('Délégation créée.');
      this.userId.set('');
      this.reason.set('');
      this.selectedPowers.set([]);
      this.resource.reload();
    } catch (e: unknown) {
      this.errorMessage.set((e as { error?: { message?: string } })?.error?.message ?? 'Erreur.');
    } finally {
      this.submitting.set(false);
    }
  }

  async confirmRevoke(id: string): Promise<void> {
    if (!this.revokeReason().trim()) return;
    this.actingId.set(id);
    try {
      await this.service.revokeDelegation(id, this.revokeReason().trim());
      this.notifications.success('Délégation révoquée.');
      this.revokingId.set(null);
      this.revokeReason.set('');
      this.resource.reload();
    } catch (e: unknown) {
      this.errorMessage.set((e as { error?: { message?: string } })?.error?.message ?? 'Erreur.');
    } finally {
      this.actingId.set(null);
    }
  }
}

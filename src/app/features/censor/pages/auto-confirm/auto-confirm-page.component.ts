import { ChangeDetectionStrategy, Component, computed, inject, resource, signal } from '@angular/core';
import { AlertComponent } from '../../../../shared/components/ui/alert/alert.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { EmptyStateComponent } from '../../../../shared/components/ui/empty-state/empty-state.component';
import { CurrencyXafPipe } from '../../../../shared/pipes/currency-xaf.pipe';
import { NotificationService } from '../../../../core/services/notification.service';
import { SanctionType } from '../../../../core/enums/sanction-type.enum';
import { CensorService } from '../../services/censor.service';

@Component({
  selector: 'tc-censor-auto-confirm',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AlertComponent,
    BadgeComponent,
    ButtonComponent,
    CardComponent,
    EmptyStateComponent,
    CurrencyXafPipe,
  ],
  template: `
    <div class="space-y-6">
      <header>
        <h1 class="text-2xl font-bold text-gray-900">
          Confirmation des sanctions automatiques
        </h1>
        <p class="text-sm text-gray-500">
          Le système a détecté les retards et absences (RM-CA01). Vous devez confirmer manuellement
          chaque sanction avant qu'elle ne soit appliquée (RM-CA02).
        </p>
      </header>

      @if (errorMessage(); as err) {
        <tc-alert kind="error">{{ err }}</tc-alert>
      }

      <tc-alert kind="info">
        💡 Conseil : ne confirmez pas les sanctions pour les membres ayant un justificatif en attente
        de validation.
      </tc-alert>

      @if (resource.isLoading()) {
        <p class="text-sm text-gray-500">Chargement…</p>
      } @else if (groups().lateness.length === 0 && groups().absence.length === 0) {
        <tc-card>
          <tc-empty-state
            title="Aucune sanction à confirmer"
            description="Toutes les sanctions auto-détectées ont déjà été traitées."
            icon="✅"
          />
        </tc-card>
      } @else {
        @if (groups().lateness.length > 0) {
          <tc-card title="Retards détectés ({{ groups().lateness.length }})">
            <ul class="space-y-2">
              @for (s of groups().lateness; track s.id) {
                <li class="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2">
                  <label class="flex items-center gap-2 flex-1">
                    <input
                      type="checkbox"
                      [checked]="selected().has(s.id)"
                      (change)="toggle(s.id)"
                    />
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ s.memberFullName }}</p>
                      <p class="text-xs text-gray-500">{{ s.reason }}</p>
                    </div>
                  </label>
                  <span class="font-semibold text-amber-600">{{ s.amount | xaf }}</span>
                </li>
              }
            </ul>
            <div class="mt-3 flex gap-2 text-xs">
              <button class="text-blue-600 hover:underline" (click)="selectAll('lateness')">
                Tout sélectionner
              </button>
              <button class="text-gray-600 hover:underline" (click)="deselectAll('lateness')">
                Tout désélectionner
              </button>
            </div>
          </tc-card>
        }

        @if (groups().absence.length > 0) {
          <tc-card title="Absences détectées ({{ groups().absence.length }})">
            <ul class="space-y-2">
              @for (s of groups().absence; track s.id) {
                <li class="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2">
                  <label class="flex items-center gap-2 flex-1">
                    <input
                      type="checkbox"
                      [checked]="selected().has(s.id)"
                      (change)="toggle(s.id)"
                    />
                    <div class="flex items-center gap-2">
                      <p class="text-sm font-medium text-gray-900">{{ s.memberFullName }}</p>
                      @if (s.reason.includes('justificatif')) {
                        <tc-badge kind="warning">Justif. en attente</tc-badge>
                      }
                    </div>
                  </label>
                  <span class="font-semibold text-amber-600">{{ s.amount | xaf }}</span>
                </li>
              }
            </ul>
            <div class="mt-3 flex gap-2 text-xs">
              <button class="text-blue-600 hover:underline" (click)="selectAll('absence')">
                Tout sélectionner
              </button>
              <button class="text-gray-600 hover:underline" (click)="deselectAll('absence')">
                Tout désélectionner
              </button>
            </div>
          </tc-card>
        }

        <tc-card>
          <div class="flex items-center justify-between gap-3">
            <div>
              <p class="text-sm font-medium text-gray-700">
                {{ selected().size }} sanction(s) sélectionnée(s)
              </p>
              <p class="text-xs text-gray-500">
                Total : {{ selectedAmount() | xaf }}
              </p>
            </div>
            <tc-button
              variant="success"
              [loading]="submitting()"
              [disabled]="selected().size === 0"
              (clicked)="confirmAll()"
            >
              ✓ Confirmer les sanctions sélectionnées
            </tc-button>
          </div>
        </tc-card>
      }
    </div>
  `,
})
export class CensorAutoConfirmPageComponent {
  private readonly service = inject(CensorService);
  private readonly notifications = inject(NotificationService);

  readonly resource = resource({
    loader: () => this.service.getAutoDetectedSanctions(),
  });

  readonly all = computed(() => this.resource.value() ?? []);

  readonly groups = computed(() => ({
    lateness: this.all().filter((s) => s.type === SanctionType.LATENESS),
    absence: this.all().filter((s) => s.type === SanctionType.ABSENCE),
  }));

  readonly selected = signal<Set<string>>(new Set());
  readonly submitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly selectedAmount = computed(() => {
    const set = this.selected();
    return this.all()
      .filter((s) => set.has(s.id))
      .reduce((sum, s) => sum + s.amount, 0);
  });

  toggle(id: string): void {
    this.selected.update((set) => {
      const next = new Set(set);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  selectAll(kind: 'lateness' | 'absence'): void {
    this.selected.update((set) => {
      const next = new Set(set);
      for (const s of this.groups()[kind]) next.add(s.id);
      return next;
    });
  }

  deselectAll(kind: 'lateness' | 'absence'): void {
    this.selected.update((set) => {
      const next = new Set(set);
      for (const s of this.groups()[kind]) next.delete(s.id);
      return next;
    });
  }

  async confirmAll(): Promise<void> {
    if (this.selected().size === 0) return;
    this.submitting.set(true);
    this.errorMessage.set(null);
    try {
      const ids = Array.from(this.selected());
      await this.service.confirmSanctions(ids);
      this.notifications.success(`${ids.length} sanction(s) confirmée(s).`);
      this.selected.set(new Set());
      this.resource.reload();
    } catch (e: unknown) {
      this.errorMessage.set((e as { error?: { message?: string } })?.error?.message ?? 'Erreur.');
    } finally {
      this.submitting.set(false);
    }
  }
}

import { ChangeDetectionStrategy, Component, computed, inject, resource, signal } from '@angular/core';
import { AlertComponent } from '../../../../shared/components/ui/alert/alert.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { CurrencyXafPipe } from '../../../../shared/pipes/currency-xaf.pipe';
import { NotificationService } from '../../../../core/services/notification.service';
import { SanctionType } from '../../../../core/enums/sanction-type.enum';
import type { SanctionSeverity } from '../../../../shared/models/entities/sanction.model';
import { CensorService } from '../../services/censor.service';

interface SanctionLine {
  type: SanctionType;
  customLabel: string;
  amount: number;
  reason: string;
  severity: SanctionSeverity;
  isFinancial: boolean;
}

const DEFAULT_LINE = (): SanctionLine => ({
  type: SanctionType.LATENESS,
  customLabel: 'Retard',
  amount: 500,
  reason: '',
  severity: 'LOW',
  isFinancial: true,
});

@Component({
  selector: 'tc-censor-multiple-sanctions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AlertComponent, ButtonComponent, CardComponent, CurrencyXafPipe],
  template: `
    <div class="space-y-6">
      <header>
        <h1 class="text-2xl font-bold text-gray-900">Sanctions multiples</h1>
        <p class="text-sm text-gray-500">
          Appliquez plusieurs sanctions au même membre lors d'une même séance (RM-SM01).
          Chaque sanction nécessite son propre motif (RM-SM02).
        </p>
      </header>

      @if (errorMessage(); as err) {
        <tc-alert kind="error">{{ err }}</tc-alert>
      }

      <tc-card>
        <form class="space-y-4" (submit)="onSubmit($event)">
          <div>
            <label class="text-sm font-medium text-gray-700">Membre concerné</label>
            <select
              class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              [value]="memberId()"
              (change)="memberId.set($any($event.target).value)"
            >
              <option value="">— Sélectionner —</option>
              @for (m of members(); track m.id) {
                <option [value]="m.id">{{ m.firstName }} {{ m.lastName }}</option>
              }
            </select>
          </div>

          <div class="space-y-3">
            @for (line of lines(); track $index) {
              <div class="rounded-lg border border-gray-200 p-3 space-y-2">
                <div class="flex items-center justify-between">
                  <p class="font-semibold text-gray-900">Sanction {{ $index + 1 }}</p>
                  @if (lines().length > 1) {
                    <button
                      type="button"
                      class="text-xs text-red-600 hover:underline"
                      (click)="removeLine($index)"
                    >
                      Supprimer
                    </button>
                  }
                </div>
                <div class="grid gap-2 sm:grid-cols-3">
                  <select
                    class="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    [value]="line.type"
                    (change)="updateField($index, 'type', $any($event.target).value)"
                  >
                    <option value="LATENESS">Retard</option>
                    <option value="ABSENCE">Absence</option>
                    <option value="DISCIPLINE">Discipline</option>
                    <option value="CONTRIBUTION_LATE">Retard cotisation</option>
                    <option value="OTHER">Autre</option>
                  </select>
                  <input
                    type="number"
                    class="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    placeholder="Montant XAF"
                    [value]="line.amount"
                    (input)="updateField($index, 'amount', +$any($event.target).value)"
                  />
                  <select
                    class="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    [value]="line.severity"
                    (change)="updateField($index, 'severity', $any($event.target).value)"
                  >
                    <option value="LOW">Léger</option>
                    <option value="MEDIUM">Moyen</option>
                    <option value="HIGH">Grave</option>
                  </select>
                </div>
                <textarea
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  rows="2"
                  placeholder="Motif (obligatoire)"
                  [value]="line.reason"
                  (input)="updateField($index, 'reason', $any($event.target).value)"
                ></textarea>
              </div>
            }

            <button
              type="button"
              class="w-full rounded-lg border-2 border-dashed border-gray-300 py-2 text-sm text-gray-600 hover:bg-gray-50"
              (click)="addLine()"
            >
              ➕ Ajouter une autre sanction
            </button>
          </div>

          <div class="rounded-lg border border-gray-200 bg-gray-50 p-3">
            <p class="text-sm font-medium text-gray-700">Récapitulatif</p>
            <p class="text-xs text-gray-600 mt-1">
              {{ lines().length }} sanction(s) — Total : {{ totalAmount() | xaf }}
            </p>
          </div>

          <div class="flex gap-2">
            <tc-button type="submit" variant="primary" [loading]="submitting()">
              ✓ Appliquer toutes les sanctions
            </tc-button>
          </div>
        </form>
      </tc-card>
    </div>
  `,
})
export class CensorMultipleSanctionsPageComponent {
  private readonly service = inject(CensorService);
  private readonly notifications = inject(NotificationService);

  readonly membersResource = resource({
    loader: () => this.service.getMembers(),
  });
  readonly members = computed(() => this.membersResource.value() ?? []);

  readonly memberId = signal('');
  readonly lines = signal<SanctionLine[]>([DEFAULT_LINE()]);
  readonly submitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly totalAmount = computed(() => this.lines().reduce((sum, l) => sum + (l.amount || 0), 0));

  addLine(): void {
    this.lines.update((arr) => [...arr, DEFAULT_LINE()]);
  }

  removeLine(i: number): void {
    this.lines.update((arr) => arr.filter((_, idx) => idx !== i));
  }

  updateField(i: number, field: keyof SanctionLine, value: unknown): void {
    this.lines.update((arr) =>
      arr.map((l, idx) =>
        idx === i
          ? {
              ...l,
              [field]: value,
              isFinancial: field === 'amount' ? Number(value) > 0 : l.isFinancial,
            }
          : l,
      ),
    );
  }

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.errorMessage.set(null);
    if (!this.memberId()) {
      this.errorMessage.set('Sélectionnez un membre.');
      return;
    }
    if (this.lines().some((l) => !l.reason.trim())) {
      this.errorMessage.set('Chaque sanction nécessite son propre motif (RM-SM02).');
      return;
    }

    this.submitting.set(true);
    try {
      await this.service.applyMultipleSanctions({
        memberId: this.memberId(),
        sanctions: this.lines().map((l) => ({
          type: l.type,
          amount: l.amount,
          reason: l.reason.trim(),
          severity: l.severity,
          customLabel: l.customLabel,
          isFinancial: l.amount > 0,
        })),
      });
      this.notifications.success(`${this.lines().length} sanction(s) appliquée(s).`);
      this.lines.set([DEFAULT_LINE()]);
      this.memberId.set('');
    } catch (e: unknown) {
      this.errorMessage.set((e as { error?: { message?: string } })?.error?.message ?? 'Erreur.');
    } finally {
      this.submitting.set(false);
    }
  }
}

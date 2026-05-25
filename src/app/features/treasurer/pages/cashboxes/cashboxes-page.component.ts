import { ChangeDetectionStrategy, Component, computed, inject, resource, signal } from '@angular/core';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { EmptyStateComponent } from '../../../../shared/components/ui/empty-state/empty-state.component';
import { SpinnerComponent } from '../../../../shared/components/ui/spinner/spinner.component';
import { CurrencyXafPipe } from '../../../../shared/pipes/currency-xaf.pipe';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { CASH_BOX_TYPE_LABELS } from '../../../../shared/models/entities/treasury.model';
import { TreasurerService } from '../../services/treasurer.service';

@Component({
  selector: 'tc-cashboxes-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BadgeComponent,
    CardComponent,
    EmptyStateComponent,
    SpinnerComponent,
    CurrencyXafPipe,
    DateFormatPipe,
  ],
  template: `
    <div class="space-y-6">
      <header>
        <h1 class="text-2xl font-bold text-gray-900">Caisses</h1>
        <p class="text-sm text-gray-500">
          Trois caisses par défaut : Principale, Secours, Fonctionnement (RM-GC01).
          Sélectionnez une caisse pour voir son historique détaillé.
        </p>
      </header>

      @if (boxesResource.isLoading()) {
        <div class="flex justify-center py-12"><tc-spinner size="lg" /></div>
      } @else {
        <section class="grid gap-4 sm:grid-cols-3">
          @for (box of boxes(); track box.id) {
            <button
              type="button"
              class="text-left rounded-xl border bg-white p-5 shadow-sm transition-colors"
              [class.border-blue-500]="selectedId() === box.id"
              [class.ring-2]="selectedId() === box.id"
              [class.ring-blue-200]="selectedId() === box.id"
              [class.border-gray-200]="selectedId() !== box.id"
              [class.hover:border-blue-300]="selectedId() !== box.id"
              (click)="selectedId.set(box.id)"
            >
              <div class="flex items-center justify-between">
                <p class="font-semibold text-gray-900">{{ box.name }}</p>
                <tc-badge kind="info">{{ CASH_BOX_TYPE_LABELS[box.type] }}</tc-badge>
              </div>
              <p class="mt-3 text-3xl font-bold text-gray-900">{{ box.balance | xaf }}</p>
              @if (box.thresholdMin) {
                <p class="mt-1 text-xs" [class]="box.balance < box.thresholdMin ? 'text-red-600' : 'text-gray-500'">
                  Seuil min : {{ box.thresholdMin | xaf }}
                </p>
              }
            </button>
          }
        </section>

        @if (selectedId(); as id) {
          <tc-card title="Historique des mouvements">
            @if (movementsResource.isLoading()) {
              <p class="text-sm text-gray-500">Chargement…</p>
            } @else if (movements().length === 0) {
              <tc-empty-state title="Aucun mouvement" icon="∅" />
            } @else {
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="text-left text-xs uppercase tracking-wider text-gray-500 border-b border-gray-200">
                      <th class="py-3">Date</th>
                      <th class="py-3">Nature</th>
                      <th class="py-3">Description</th>
                      <th class="py-3">Référence</th>
                      <th class="py-3 text-right">Montant</th>
                      <th class="py-3 text-right">Solde après</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (mv of movements(); track mv.id) {
                      <tr class="border-b border-gray-100">
                        <td class="py-3 text-gray-600">{{ mv.recordedAt | tcDate: true }}</td>
                        <td class="py-3">
                          <tc-badge [kind]="mv.direction === 'IN' ? 'success' : 'danger'">
                            {{ mv.direction === 'IN' ? 'Entrée' : 'Sortie' }}
                          </tc-badge>
                        </td>
                        <td class="py-3 text-gray-700">{{ mv.description }}</td>
                        <td class="py-3 font-mono text-xs text-gray-500">{{ mv.reference ?? '—' }}</td>
                        <td class="py-3 text-right" [class]="mv.direction === 'IN' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'">
                          {{ mv.direction === 'IN' ? '+' : '-' }}{{ mv.amount | xaf }}
                        </td>
                        <td class="py-3 text-right font-medium text-gray-900">{{ mv.balanceAfter | xaf }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            }
          </tc-card>
        }
      }
    </div>
  `,
})
export class CashBoxesPageComponent {
  protected readonly CASH_BOX_TYPE_LABELS = CASH_BOX_TYPE_LABELS;
  private readonly service = inject(TreasurerService);

  readonly selectedId = signal<string | null>(null);

  readonly boxesResource = resource({
    loader: () => this.service.getCashBoxes(),
  });

  readonly boxes = computed(() => this.boxesResource.value() ?? []);

  readonly movementsResource = resource({
    params: () => this.selectedId(),
    loader: ({ params }) => (params ? this.service.getCashBoxMovements(params) : Promise.resolve([])),
  });

  readonly movements = computed(() => this.movementsResource.value() ?? []);
}

import { ChangeDetectionStrategy, Component, computed, inject, resource, signal } from '@angular/core';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { EmptyStateComponent } from '../../../../shared/components/ui/empty-state/empty-state.component';
import { SpinnerComponent } from '../../../../shared/components/ui/spinner/spinner.component';
import { CurrencyXafPipe } from '../../../../shared/pipes/currency-xaf.pipe';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { TreasurerService } from '../../services/treasurer.service';

@Component({
  selector: 'tc-bilan-page',
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
        <h1 class="text-2xl font-bold text-gray-900">Bilan de séance</h1>
        <p class="text-sm text-gray-500">
          Présentez le bilan financier pendant la séance (RM-BS02). Double signature requise : Trésorier + Président (RM-BS03).
        </p>
      </header>

      <div class="grid gap-6 lg:grid-cols-3">
        <div class="lg:col-span-1 space-y-2">
          <p class="text-sm font-medium text-gray-700">Sélectionnez une séance</p>
          @if (sessionsResource.isLoading()) {
            <p class="text-sm text-gray-500">Chargement…</p>
          } @else {
            @for (s of sessions(); track s.id) {
              <button
                type="button"
                class="w-full text-left rounded-lg border p-3 transition-colors"
                [class.border-blue-500]="selectedId() === s.id"
                [class.bg-blue-50]="selectedId() === s.id"
                [class.border-gray-200]="selectedId() !== s.id"
                (click)="selectedId.set(s.id)"
              >
                <p class="font-semibold text-gray-900">Séance #{{ s.number }}</p>
                <p class="text-xs text-gray-500">{{ s.scheduledAt | tcDate: true }}</p>
                <tc-badge kind="info">{{ s.status }}</tc-badge>
              </button>
            }
          }
        </div>

        <div class="lg:col-span-2">
          @if (!selectedId()) {
            <tc-card>
              <tc-empty-state title="Aucune séance sélectionnée" icon="👈" />
            </tc-card>
          } @else if (reportResource.isLoading()) {
            <div class="flex justify-center py-12"><tc-spinner size="lg" /></div>
          } @else if (report(); as r) {
            <tc-card title="Bilan financier" [subtitle]="'Séance #' + r.sessionNumber">
              <dl class="grid gap-3 text-sm sm:grid-cols-2">
                <div class="rounded-lg bg-green-50 p-3">
                  <dt class="text-xs uppercase text-green-700 font-semibold">Total recettes</dt>
                  <dd class="text-xl font-bold text-green-700 mt-1">{{ r.totalIncome | xaf }}</dd>
                  <ul class="mt-2 space-y-0.5 text-xs text-green-900">
                    <li>Cotisations : {{ r.totalContributions | xaf }}</li>
                    <li>Cotisations extra : {{ r.totalExtraContributions | xaf }}</li>
                    <li>Sanctions : {{ r.totalSanctions | xaf }}</li>
                    <li>Remboursements prêts : {{ r.totalRepayments | xaf }}</li>
                  </ul>
                </div>
                <div class="rounded-lg bg-red-50 p-3">
                  <dt class="text-xs uppercase text-red-700 font-semibold">Total décaissements</dt>
                  <dd class="text-xl font-bold text-red-700 mt-1">{{ r.totalOutflows | xaf }}</dd>
                  <ul class="mt-2 space-y-0.5 text-xs text-red-900">
                    <li>Distribution cagnotte : {{ r.totalDistribution | xaf }}</li>
                    <li>Dépenses : {{ r.totalExpenses | xaf }}</li>
                    <li>Décaissements prêts : {{ r.totalDisbursements | xaf }}</li>
                  </ul>
                </div>
              </dl>

              <div class="mt-4 rounded-lg bg-gray-50 px-3 py-3 flex items-center justify-between">
                <span class="text-sm font-medium text-gray-700">Résultat net</span>
                <span class="text-xl font-bold" [class]="r.netResult >= 0 ? 'text-green-600' : 'text-red-600'">
                  {{ r.netResult | xaf }}
                </span>
              </div>

              <h3 class="mt-4 text-sm font-semibold text-gray-700">Soldes des caisses</h3>
              <ul class="mt-2 space-y-1 text-sm">
                @for (b of r.cashBoxBalances; track b.name) {
                  <li class="flex justify-between">
                    <span>{{ b.name }}</span>
                    <span class="font-semibold text-gray-900">{{ b.balance | xaf }}</span>
                  </li>
                }
              </ul>

              <div class="mt-4 flex flex-wrap gap-2 text-xs">
                @if (r.signedByTreasurer) {
                  <tc-badge kind="success">✓ Signé Trésorier — {{ r.treasurerSignedAt | tcDate }}</tc-badge>
                } @else {
                  <tc-badge kind="warning">⏳ En attente signature Trésorier</tc-badge>
                }
                @if (r.signedByPresident) {
                  <tc-badge kind="success">✓ Signé Président — {{ r.presidentSignedAt | tcDate }}</tc-badge>
                } @else {
                  <tc-badge kind="warning">⏳ En attente signature Président</tc-badge>
                }
              </div>
            </tc-card>
          } @else {
            <tc-card>Aucun bilan disponible.</tc-card>
          }
        </div>
      </div>
    </div>
  `,
})
export class BilanPageComponent {
  private readonly service = inject(TreasurerService);

  readonly sessionsResource = resource({
    loader: () => this.service.getSessions(),
  });

  readonly sessions = computed(() =>
    [...(this.sessionsResource.value() ?? [])].sort(
      (a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime(),
    ),
  );

  readonly selectedId = signal<string | null>(null);

  readonly reportResource = resource({
    params: () => this.selectedId(),
    loader: ({ params }) => (params ? this.service.getSessionReport(params) : Promise.resolve(null)),
  });

  readonly report = computed(() => this.reportResource.value());
}

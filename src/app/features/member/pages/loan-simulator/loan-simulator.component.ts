import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { InputComponent } from '../../../../shared/components/ui/input/input.component';
import { CurrencyXafPipe } from '../../../../shared/pipes/currency-xaf.pipe';
import { simulateLoan } from '../../services/loan-simulator';

@Component({
  selector: 'tc-loan-simulator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CardComponent, InputComponent, CurrencyXafPipe],
  template: `
    <div class="space-y-6">
      <header>
        <h1 class="text-2xl font-bold text-gray-900">Simulateur de prêt</h1>
        <p class="text-sm text-gray-500">
          Estimez votre mensualité et le coût total avant d'introduire une demande officielle.
        </p>
      </header>

      <section class="grid gap-6 lg:grid-cols-3">
        <tc-card title="Paramètres" subtitle="Ajustez les valeurs">
          <div class="space-y-4">
            <tc-input
              label="Montant souhaité (XAF)"
              type="number"
              [value]="principalText()"
              (valueChange)="onPrincipalChange($event)"
            />
            <tc-input
              label="Taux d'intérêt annuel (%)"
              type="number"
              [value]="rateText()"
              (valueChange)="onRateChange($event)"
            />
            <tc-input
              label="Durée (mois)"
              type="number"
              [value]="durationText()"
              (valueChange)="onDurationChange($event)"
            />
          </div>
        </tc-card>

        <tc-card title="Résumé">
          <dl class="space-y-3 text-sm">
            <div class="flex items-center justify-between">
              <dt class="text-gray-500">Mensualité</dt>
              <dd class="text-xl font-bold text-blue-600">{{ simulation().monthlyPayment | xaf }}</dd>
            </div>
            <div class="flex items-center justify-between">
              <dt class="text-gray-500">Intérêts totaux</dt>
              <dd class="font-medium text-amber-600">{{ simulation().totalInterest | xaf }}</dd>
            </div>
            <div class="flex items-center justify-between">
              <dt class="text-gray-500">Total à rembourser</dt>
              <dd class="font-medium text-gray-900">{{ simulation().totalDue | xaf }}</dd>
            </div>
            <div class="flex items-center justify-between">
              <dt class="text-gray-500">Durée</dt>
              <dd class="font-medium text-gray-900">{{ simulation().durationMonths }} mois</dd>
            </div>
          </dl>
        </tc-card>

        <tc-card title="Conseil">
          <p class="text-sm text-gray-600">
            La majorité des tontines plafonnent le ratio
            <span class="font-medium">mensualité / contribution mensuelle</span> à 3.
            Vérifiez que la mensualité reste compatible avec votre cotisation.
          </p>
        </tc-card>
      </section>

      <tc-card title="Tableau d'amortissement">
        @if (simulation().schedule.length === 0) {
          <p class="text-sm text-gray-500">Renseignez des valeurs valides pour afficher le tableau.</p>
        } @else {
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="text-left text-xs uppercase tracking-wider text-gray-500 border-b border-gray-200">
                  <th class="py-2">Mois</th>
                  <th class="py-2">Mensualité</th>
                  <th class="py-2">Capital</th>
                  <th class="py-2">Intérêt</th>
                  <th class="py-2">Solde restant</th>
                </tr>
              </thead>
              <tbody>
                @for (row of simulation().schedule; track row.month) {
                  <tr class="border-b border-gray-100">
                    <td class="py-2">#{{ row.month }}</td>
                    <td class="py-2">{{ row.payment | xaf }}</td>
                    <td class="py-2 text-gray-700">{{ row.principal | xaf }}</td>
                    <td class="py-2 text-amber-600">{{ row.interest | xaf }}</td>
                    <td class="py-2 font-medium text-gray-900">{{ row.remainingBalance | xaf }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </tc-card>
    </div>
  `,
})
export class LoanSimulatorComponent {
  readonly principal = signal(300000);
  readonly annualInterestRate = signal(0.1);
  readonly durationMonths = signal(6);

  readonly principalText = computed(() => String(this.principal()));
  readonly rateText = computed(() => String(this.annualInterestRate() * 100));
  readonly durationText = computed(() => String(this.durationMonths()));

  readonly simulation = computed(() =>
    simulateLoan({
      principal: this.principal(),
      annualInterestRate: this.annualInterestRate(),
      durationMonths: this.durationMonths(),
    }),
  );

  onPrincipalChange(value: string): void {
    const n = Number(value);
    if (Number.isFinite(n)) this.principal.set(Math.max(0, n));
  }

  onRateChange(value: string): void {
    const n = Number(value);
    if (Number.isFinite(n)) this.annualInterestRate.set(Math.max(0, n / 100));
  }

  onDurationChange(value: string): void {
    const n = parseInt(value, 10);
    if (Number.isFinite(n)) this.durationMonths.set(Math.max(1, n));
  }
}

import { ChangeDetectionStrategy, Component, computed, inject, resource } from '@angular/core';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { SpinnerComponent } from '../../../../shared/components/ui/spinner/spinner.component';
import { CurrencyXafPipe } from '../../../../shared/pipes/currency-xaf.pipe';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { StatusLabelPipe } from '../../../../shared/pipes/status-label.pipe';
import { ContributionStatus } from '../../../../core/enums/contribution-status.enum';
import { MemberService } from '../../services/member.service';
import type { Contribution } from '../../../../shared/models/entities/contribution.model';

@Component({
  selector: 'tc-my-contributions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BadgeComponent, CardComponent, SpinnerComponent, CurrencyXafPipe, DateFormatPipe, StatusLabelPipe],
  template: `
    <div class="space-y-6">
      <header>
        <h1 class="text-2xl font-bold text-gray-900">Mes cotisations</h1>
        <p class="text-sm text-gray-500">Historique complet de vos versements.</p>
      </header>

      @if (resource.isLoading()) {
        <div class="flex justify-center py-12"><tc-spinner size="lg" /></div>
      } @else {
        <section class="grid gap-4 sm:grid-cols-3">
          <tc-card>
            <p class="text-xs uppercase tracking-wider text-gray-500">Versé</p>
            <p class="mt-2 text-xl font-bold text-green-600">{{ totalPaid() | xaf }}</p>
          </tc-card>
          <tc-card>
            <p class="text-xs uppercase tracking-wider text-gray-500">À payer</p>
            <p class="mt-2 text-xl font-bold text-amber-600">{{ totalPending() | xaf }}</p>
          </tc-card>
          <tc-card>
            <p class="text-xs uppercase tracking-wider text-gray-500">Total cotisations</p>
            <p class="mt-2 text-xl font-bold text-gray-900">{{ contributions().length }}</p>
          </tc-card>
        </section>

        <tc-card title="Historique" subtitle="Détail de chaque cotisation">
          @if (contributions().length === 0) {
            <p class="text-sm text-gray-500">Aucune cotisation enregistrée pour le moment.</p>
          } @else {
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="text-left text-xs uppercase tracking-wider text-gray-500 border-b border-gray-200">
                    <th class="py-3">Référence</th>
                    <th class="py-3">Attendu</th>
                    <th class="py-3">Payé</th>
                    <th class="py-3">Statut</th>
                    <th class="py-3">Date de paiement</th>
                  </tr>
                </thead>
                <tbody>
                  @for (item of contributions(); track item.id) {
                    <tr class="border-b border-gray-100">
                      <td class="py-3 font-mono text-xs text-gray-600">{{ item.reference ?? '—' }}</td>
                      <td class="py-3">{{ item.expectedAmount | xaf }}</td>
                      <td class="py-3 font-medium text-gray-900">{{ item.paidAmount | xaf }}</td>
                      <td class="py-3">
                        <tc-badge [kind]="badgeKind(item.status)">
                          {{ item.status | statusLabel: 'contribution' }}
                        </tc-badge>
                      </td>
                      <td class="py-3 text-gray-700">{{ item.paidAt | tcDate: true }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
        </tc-card>
      }
    </div>
  `,
})
export class MyContributionsComponent {
  private readonly memberService = inject(MemberService);

  readonly resource = resource({
    loader: () => this.memberService.getContributions(),
  });

  readonly contributions = computed(() => this.resource.value() ?? []);

  readonly totalPaid = computed(() =>
    this.contributions().reduce((sum, c) => sum + (c.paidAmount ?? 0), 0),
  );

  readonly totalPending = computed(() =>
    this.contributions()
      .filter((c) => c.status === ContributionStatus.PENDING || c.status === ContributionStatus.LATE)
      .reduce((sum, c) => sum + Math.max(0, c.expectedAmount - c.paidAmount), 0),
  );

  badgeKind(status: Contribution['status']): 'success' | 'warning' | 'danger' | 'neutral' {
    switch (status) {
      case ContributionStatus.PAID:
        return 'success';
      case ContributionStatus.PARTIAL:
      case ContributionStatus.PENDING:
        return 'warning';
      case ContributionStatus.LATE:
        return 'danger';
      default:
        return 'neutral';
    }
  }
}

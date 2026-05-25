import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, resource } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { SpinnerComponent } from '../../../../shared/components/ui/spinner/spinner.component';
import { CurrencyXafPipe } from '../../../../shared/pipes/currency-xaf.pipe';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { StatusLabelPipe } from '../../../../shared/pipes/status-label.pipe';
import { LoanStatus } from '../../../../core/enums/loan-status.enum';
import { MemberService } from '../../services/member.service';
import type { Loan } from '../../../../shared/models/entities/loan.model';

@Component({
  selector: 'tc-my-loans',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DecimalPipe,
    RouterLink,
    BadgeComponent,
    ButtonComponent,
    CardComponent,
    SpinnerComponent,
    CurrencyXafPipe,
    DateFormatPipe,
    StatusLabelPipe,
  ],
  template: `
    <div class="space-y-6">
      <header class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Mes prêts</h1>
          <p class="text-sm text-gray-500">Historique et suivi des remboursements.</p>
        </div>
        <a routerLink="/member/loan-simulator">
          <tc-button variant="primary">Simuler un prêt</tc-button>
        </a>
      </header>

      @if (resource.isLoading()) {
        <div class="flex justify-center py-12"><tc-spinner size="lg" /></div>
      } @else if (loans().length === 0) {
        <tc-card>
          <p class="text-sm text-gray-500">Vous n'avez aucun prêt enregistré.</p>
        </tc-card>
      } @else {
        <div class="grid gap-4 lg:grid-cols-2">
          @for (loan of loans(); track loan.id) {
            <tc-card>
              <div class="flex items-start justify-between gap-4">
                <div>
                  <p class="text-xs uppercase tracking-wider text-gray-500">Principal</p>
                  <p class="text-2xl font-bold text-gray-900">{{ loan.principal | xaf }}</p>
                </div>
                <tc-badge [kind]="badgeKind(loan.status)">
                  {{ loan.status | statusLabel: 'loan' }}
                </tc-badge>
              </div>
              <dl class="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt class="text-gray-500">Mensualité</dt>
                  <dd class="font-medium text-gray-900">{{ loan.monthlyPayment | xaf }}</dd>
                </div>
                <div>
                  <dt class="text-gray-500">Durée</dt>
                  <dd class="font-medium text-gray-900">{{ loan.durationMonths }} mois</dd>
                </div>
                <div>
                  <dt class="text-gray-500">Remboursé</dt>
                  <dd class="font-medium text-green-600">{{ loan.totalRepaid | xaf }}</dd>
                </div>
                <div>
                  <dt class="text-gray-500">Restant</dt>
                  <dd class="font-medium text-amber-600">{{ remaining(loan) | xaf }}</dd>
                </div>
                <div class="col-span-2">
                  <dt class="text-gray-500">Échéance</dt>
                  <dd class="font-medium text-gray-900">{{ loan.dueDate | tcDate }}</dd>
                </div>
              </dl>
              <div class="mt-4">
                <div class="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                  <div class="h-full bg-green-500" [style.width.%]="progressPercent(loan)"></div>
                </div>
                <p class="mt-1 text-xs text-gray-500">{{ progressPercent(loan) | number: '1.0-0' }}% remboursé</p>
              </div>
            </tc-card>
          }
        </div>
      }
    </div>
  `,
})
export class MyLoansComponent {
  private readonly memberService = inject(MemberService);

  readonly resource = resource({
    loader: () => this.memberService.getLoans(),
  });

  readonly loans = computed(() => this.resource.value() ?? []);

  remaining(loan: Loan): number {
    return Math.max(0, loan.totalDue - loan.totalRepaid);
  }

  progressPercent(loan: Loan): number {
    if (loan.totalDue <= 0) return 0;
    return Math.min(100, (loan.totalRepaid / loan.totalDue) * 100);
  }

  badgeKind(status: Loan['status']): 'success' | 'warning' | 'danger' | 'info' | 'neutral' {
    switch (status) {
      case LoanStatus.REPAID:
      case LoanStatus.APPROVED:
        return 'success';
      case LoanStatus.REPAYING:
      case LoanStatus.DISBURSED:
        return 'info';
      case LoanStatus.REJECTED:
      case LoanStatus.DEFAULTED:
        return 'danger';
      case LoanStatus.REQUESTED:
      case LoanStatus.COMMITTEE_REVIEW:
      case LoanStatus.GUARANTOR_PENDING:
        return 'warning';
      default:
        return 'neutral';
    }
  }
}

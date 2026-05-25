import { ChangeDetectionStrategy, Component, computed, inject, resource } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AlertComponent } from '../../../../shared/components/ui/alert/alert.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { IconComponent } from '../../../../shared/components/ui/icon/icon.component';
import { SpinnerComponent } from '../../../../shared/components/ui/spinner/spinner.component';
import { StatCardComponent } from '../../../../shared/components/ui/stat-card/stat-card.component';
import { CurrencyXafPipe } from '../../../../shared/pipes/currency-xaf.pipe';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { CensorService } from '../../services/censor.service';

@Component({
  selector: 'tc-censor-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    AlertComponent,
    BadgeComponent,
    CardComponent,
    IconComponent,
    SpinnerComponent,
    StatCardComponent,
    CurrencyXafPipe,
  ],
  templateUrl: './censor-dashboard.component.html',
  styleUrl: './censor-dashboard.component.scss',
})
export class CensorDashboardComponent {
  protected readonly auth = inject(AuthService);
  private readonly service = inject(CensorService);

  readonly dashboardResource = resource({
    loader: () => this.service.getDashboard(),
  });

  readonly data = computed(() => this.dashboardResource.value());

  typeLabel(t: string): string {
    const map: Record<string, string> = {
      ABSENCE: 'Absences',
      LATENESS: 'Retards',
      CONTRIBUTION_LATE: 'Retards cotisation',
      LOAN_DEFAULT: 'Défaut prêt',
      DISCIPLINE: 'Discipline',
      OTHER: 'Autres',
    };
    return map[t] ?? t;
  }
}

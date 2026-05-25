import { ChangeDetectionStrategy, Component, computed, inject, resource } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { IconComponent } from '../../../../shared/components/ui/icon/icon.component';
import { SpinnerComponent } from '../../../../shared/components/ui/spinner/spinner.component';
import { StatCardComponent } from '../../../../shared/components/ui/stat-card/stat-card.component';
import { CurrencyXafPipe } from '../../../../shared/pipes/currency-xaf.pipe';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { TreasurerService } from '../../services/treasurer.service';

@Component({
  selector: 'tc-treasurer-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    BadgeComponent,
    CardComponent,
    IconComponent,
    SpinnerComponent,
    StatCardComponent,
    CurrencyXafPipe,
    DateFormatPipe,
  ],
  templateUrl: './treasurer-dashboard.component.html',
  styleUrl: './treasurer-dashboard.component.scss',
})
export class TreasurerDashboardComponent {
  protected readonly auth = inject(AuthService);
  private readonly service = inject(TreasurerService);

  readonly dashboardResource = resource({
    loader: () => this.service.getDashboard(),
  });

  readonly data = computed(() => this.dashboardResource.value());
}

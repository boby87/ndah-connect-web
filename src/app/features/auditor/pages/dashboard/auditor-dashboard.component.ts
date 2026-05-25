import { ChangeDetectionStrategy, Component, computed, inject, resource } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AlertComponent } from '../../../../shared/components/ui/alert/alert.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { IconComponent } from '../../../../shared/components/ui/icon/icon.component';
import { SpinnerComponent } from '../../../../shared/components/ui/spinner/spinner.component';
import { StatCardComponent } from '../../../../shared/components/ui/stat-card/stat-card.component';
import { CurrencyXafPipe } from '../../../../shared/pipes/currency-xaf.pipe';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { AuditorService } from '../../services/auditor.service';

@Component({
  selector: 'tc-auditor-dashboard',
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
    DateFormatPipe,
  ],
  templateUrl: './auditor-dashboard.component.html',
  styleUrl: './auditor-dashboard.component.scss',
})
export class AuditorDashboardComponent {
  protected readonly auth = inject(AuthService);
  private readonly service = inject(AuditorService);

  readonly dashboardResource = resource({
    loader: () => this.service.getDashboard(),
  });

  readonly data = computed(() => this.dashboardResource.value());
}

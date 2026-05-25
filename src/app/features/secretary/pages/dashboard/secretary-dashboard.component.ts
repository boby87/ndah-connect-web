import { ChangeDetectionStrategy, Component, computed, inject, resource } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { EmptyStateComponent } from '../../../../shared/components/ui/empty-state/empty-state.component';
import { IconComponent } from '../../../../shared/components/ui/icon/icon.component';
import { SpinnerComponent } from '../../../../shared/components/ui/spinner/spinner.component';
import { StatCardComponent } from '../../../../shared/components/ui/stat-card/stat-card.component';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { SecretaryService } from '../../services/secretary.service';

@Component({
  selector: 'tc-secretary-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    BadgeComponent,
    CardComponent,
    EmptyStateComponent,
    IconComponent,
    SpinnerComponent,
    StatCardComponent,
    DateFormatPipe,
  ],
  templateUrl: './secretary-dashboard.component.html',
  styleUrl: './secretary-dashboard.component.scss',
})
export class SecretaryDashboardComponent {
  protected readonly auth = inject(AuthService);
  private readonly service = inject(SecretaryService);

  readonly dashboardResource = resource({
    loader: () => this.service.getDashboard(),
  });

  readonly data = computed(() => this.dashboardResource.value());
}

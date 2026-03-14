import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStore } from '../../../../store/auth/auth.store';
import { TontineStore } from '../../../../store/tontine/tontine.store';
import { MockDataService } from '../../../../core/services/mock-data.service';
import { CurrencyXafPipe } from '../../../../shared/pipes/currency-xaf.pipe';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';

@Component({
  selector: 'app-dashboard-censor',
  standalone: true,
  imports: [CurrencyXafPipe, CardComponent, BadgeComponent, ButtonComponent],
  templateUrl: './dashboard-censor.component.html',
  styleUrl: './dashboard-censor.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardCensorComponent {
  protected readonly authStore = inject(AuthStore);
  protected readonly tontineStore = inject(TontineStore);
  protected readonly mock = inject(MockDataService);
  private readonly router = inject(Router);

  navigate(path: string): void {
    this.router.navigate([path]);
  }

  dismissCensorAlert(id: string): void {
    this.mock.dismissCensorAlert(id);
  }
}

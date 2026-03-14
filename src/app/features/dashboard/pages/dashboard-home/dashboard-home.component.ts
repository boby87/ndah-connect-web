import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStore } from '../../../../store/auth/auth.store';
import { MockDataService } from '../../../../core/services/mock-data.service';
import { CurrencyXafPipe } from '../../../../shared/pipes/currency-xaf.pipe';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CurrencyXafPipe, CardComponent, BadgeComponent, ButtonComponent],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardHomeComponent {
  protected readonly authStore = inject(AuthStore);
  protected readonly mock = inject(MockDataService);
  private readonly router = inject(Router);

  navigate(path: string): void {
    this.router.navigate([path]);
  }

  dismissAlert(id: string): void {
    this.mock.dismissAlert(id);
  }
}

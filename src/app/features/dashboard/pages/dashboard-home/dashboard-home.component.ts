import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStore } from '../../../../store/auth/auth.store';
import { TontineStore } from '../../../../store/tontine/tontine.store';
import { MockDataService } from '../../../../core/services/mock-data.service';
import { CurrencyXafPipe } from '../../../../shared/pipes/currency-xaf.pipe';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { UserRole } from '../../../../core/enums/user-role.enum';

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
  protected readonly tontineStore = inject(TontineStore);
  protected readonly mock = inject(MockDataService);
  private readonly router = inject(Router);

  protected readonly UserRole = UserRole;

  get isSecretary(): boolean {
    return this.tontineStore.currentMemberRole() === UserRole.SECRETARY;
  }

  navigate(path: string): void {
    this.router.navigate([path]);
  }

  dismissAlert(id: string): void {
    this.mock.dismissAlert(id);
  }

  dismissSecretaryAlert(id: string): void {
    this.mock.dismissSecretaryAlert(id);
  }
}

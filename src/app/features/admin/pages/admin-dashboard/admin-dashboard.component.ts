import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { PageHeaderComponent } from '../../../../shared/components/layout/page-header/page-header.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { SpinnerComponent } from '../../../../shared/components/ui/spinner/spinner.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    PageHeaderComponent,
    CardComponent,
    SpinnerComponent,
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardComponent {
  private readonly router = inject(Router);

  readonly isLoading = signal(false);

  navigateTo(path: string): void {
    this.router.navigate(['/admin', path]);
  }
}

import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { PageHeaderComponent } from '../../../../shared/components/layout/page-header/page-header.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { SpinnerComponent } from '../../../../shared/components/ui/spinner/spinner.component';

@Component({
  selector: 'app-audit-dashboard',
  standalone: true,
  imports: [
    PageHeaderComponent,
    CardComponent,
    SpinnerComponent,
  ],
  templateUrl: './audit-dashboard.component.html',
  styleUrl: './audit-dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuditDashboardComponent {
  private readonly router = inject(Router);

  readonly isLoading = signal(false);

  navigateTo(path: string): void {
    this.router.navigate(['/audit', path]);
  }
}

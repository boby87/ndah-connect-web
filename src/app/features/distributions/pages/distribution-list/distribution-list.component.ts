import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { PageHeaderComponent } from '../../../../shared/components/layout/page-header/page-header.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { SpinnerComponent } from '../../../../shared/components/ui/spinner/spinner.component';
import { EmptyStateComponent } from '../../../../shared/components/layout/empty-state/empty-state.component';

@Component({
  selector: 'app-distribution-list',
  standalone: true,
  imports: [
    DecimalPipe,
    PageHeaderComponent,
    ButtonComponent,
    CardComponent,
    SpinnerComponent,
    EmptyStateComponent,
  ],
  templateUrl: './distribution-list.component.html',
  styleUrl: './distribution-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DistributionListComponent {
  private readonly router = inject(Router);

  readonly distributions = signal<any[]>([]);
  readonly isLoading = signal(false);

  navigateToProcess(): void {
    this.router.navigate(['/distributions/process']);
  }

  navigateToDetail(id: string): void {
    this.router.navigate(['/distributions', id]);
  }
}

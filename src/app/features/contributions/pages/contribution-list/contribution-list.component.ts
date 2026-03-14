import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { PageHeaderComponent } from '../../../../shared/components/layout/page-header/page-header.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { SpinnerComponent } from '../../../../shared/components/ui/spinner/spinner.component';
import { EmptyStateComponent } from '../../../../shared/components/layout/empty-state/empty-state.component';

@Component({
  selector: 'app-contribution-list',
  standalone: true,
  imports: [
    DecimalPipe,
    PageHeaderComponent,
    ButtonComponent,
    CardComponent,
    SpinnerComponent,
    EmptyStateComponent,
  ],
  templateUrl: './contribution-list.component.html',
  styleUrl: './contribution-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContributionListComponent {
  private readonly router = inject(Router);

  readonly contributions = signal<any[]>([]);
  readonly isLoading = signal(false);

  navigateToCollect(): void {
    this.router.navigate(['/contributions/collect']);
  }
}

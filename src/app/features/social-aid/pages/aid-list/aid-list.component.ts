import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { PageHeaderComponent } from '../../../../shared/components/layout/page-header/page-header.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { SpinnerComponent } from '../../../../shared/components/ui/spinner/spinner.component';
import { EmptyStateComponent } from '../../../../shared/components/layout/empty-state/empty-state.component';

@Component({
  selector: 'app-aid-list',
  standalone: true,
  imports: [
    PageHeaderComponent,
    ButtonComponent,
    CardComponent,
    SpinnerComponent,
    EmptyStateComponent,
  ],
  templateUrl: './aid-list.component.html',
  styleUrl: './aid-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AidListComponent {
  private readonly router = inject(Router);

  readonly aids = signal<any[]>([]);
  readonly isLoading = signal(false);

  navigateToRequest(): void {
    this.router.navigate(['/social-aid/request']);
  }
}

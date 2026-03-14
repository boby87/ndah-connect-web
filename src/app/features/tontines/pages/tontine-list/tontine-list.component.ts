import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { PageHeaderComponent } from '../../../../shared/components/layout/page-header/page-header.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { SearchInputComponent } from '../../../../shared/components/forms/search-input/search-input.component';
import { SpinnerComponent } from '../../../../shared/components/ui/spinner/spinner.component';
import { EmptyStateComponent } from '../../../../shared/components/layout/empty-state/empty-state.component';
import { TontineStore } from '../../../../store';

@Component({
  selector: 'app-tontine-list',
  standalone: true,
  imports: [
    DecimalPipe,
    PageHeaderComponent,
    ButtonComponent,
    CardComponent,
    SearchInputComponent,
    SpinnerComponent,
    EmptyStateComponent,
  ],
  templateUrl: './tontine-list.component.html',
  styleUrl: './tontine-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TontineListComponent {
  private readonly router = inject(Router);
  private readonly tontineStore = inject(TontineStore);

  readonly tontines = this.tontineStore.tontines;
  readonly isLoading = this.tontineStore.isLoading;
  readonly searchQuery = signal('');

  onSearch(query: string): void {
    this.searchQuery.set(query);
  }

  navigateToCreate(): void {
    this.router.navigate(['/tontines/create']);
  }

  navigateToDetail(id: string): void {
    this.router.navigate(['/tontines', id]);
  }
}

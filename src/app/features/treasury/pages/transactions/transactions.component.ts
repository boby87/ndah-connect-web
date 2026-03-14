import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PageHeaderComponent } from '../../../../shared/components/layout/page-header/page-header.component';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [PageHeaderComponent],
  template: `
    <app-page-header title="Transactions" backLink="/treasury" />
    <div class="page-placeholder"><p>Contenu à implémenter</p></div>
  `,
  styles: `@reference "tailwindcss"; .page-placeholder { @apply p-6 text-slate-500; }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsComponent {}

import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SpinnerComponent } from '../../../components/ui/spinner/spinner.component';

@Component({
  selector: 'app-loading-state',
  standalone: true,
  imports: [SpinnerComponent],
  template: `
    <div class="loading-state">
      <app-spinner size="lg" />
      @if (message()) {
        <p class="loading-message">{{ message() }}</p>
      }
    </div>
  `,
  styles: `@reference "tailwindcss"; 
    .loading-state { @apply flex flex-col items-center justify-center py-16 gap-4; }
    .loading-message { @apply text-sm text-slate-500; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingStateComponent {
  readonly message = input('Chargement...');
}

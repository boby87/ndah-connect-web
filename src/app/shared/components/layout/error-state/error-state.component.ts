import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-error-state',
  standalone: true,
  template: `
    <div class="error-state">
      <span class="error-icon">⚠️</span>
      <h3 class="error-title">{{ title() }}</h3>
      <p class="error-description">{{ message() }}</p>
      @if (showRetry()) {
        <button class="error-retry" (click)="retry.emit()" type="button">Réessayer</button>
      }
    </div>
  `,
  styles: `@reference "tailwindcss"; 
    .error-state { @apply flex flex-col items-center justify-center py-16 text-center; }
    .error-icon { @apply text-5xl mb-4; }
    .error-title { @apply text-lg font-semibold text-slate-700 mb-2; }
    .error-description { @apply text-sm text-slate-500 max-w-sm mb-4; }
    .error-retry { @apply px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors cursor-pointer; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorStateComponent {
  readonly title = input('Erreur');
  readonly message = input('Une erreur est survenue. Veuillez réessayer.');
  readonly showRetry = input(true);
  readonly retry = output<void>();
}

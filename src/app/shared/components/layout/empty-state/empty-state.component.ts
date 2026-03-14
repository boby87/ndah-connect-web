import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `
    <div class="empty-state">
      @if (icon()) {
        <span class="empty-icon">{{ icon() }}</span>
      }
      <h3 class="empty-title">{{ title() }}</h3>
      @if (description()) {
        <p class="empty-description">{{ description() }}</p>
      }
      @if (actionLabel()) {
        <button class="empty-action" (click)="action.emit()" type="button">{{ actionLabel() }}</button>
      }
    </div>
  `,
  styles: `@reference "tailwindcss"; 
    .empty-state { @apply flex flex-col items-center justify-center py-16 text-center; }
    .empty-icon { @apply text-5xl mb-4; }
    .empty-title { @apply text-lg font-semibold text-slate-700 mb-2; }
    .empty-description { @apply text-sm text-slate-500 max-w-sm mb-4; }
    .empty-action { @apply px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors cursor-pointer; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyStateComponent {
  readonly icon = input('');
  readonly title = input('Aucune donnée');
  readonly description = input('');
  readonly actionLabel = input('');
  readonly action = output<void>();
}

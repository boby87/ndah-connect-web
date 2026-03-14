import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  template: `
    <div class="progress-bar">
      @if (label()) {
        <div class="progress-label">
          <span>{{ label() }}</span>
          @if (showPercentage()) {
            <span>{{ value() }}%</span>
          }
        </div>
      }
      <div [class]="'progress-track progress-track-' + size()">
        <div [class]="'progress-fill progress-fill-' + variant()" [style.width.%]="clampedValue()"></div>
      </div>
    </div>
  `,
  styles: `@reference "tailwindcss"; 
    .progress-label { @apply flex justify-between text-sm text-slate-600 mb-1; }
    .progress-track { @apply w-full bg-slate-200 rounded-full overflow-hidden; }
    .progress-track-sm { @apply h-1; }
    .progress-track-md { @apply h-2; }
    .progress-track-lg { @apply h-3; }
    .progress-fill { @apply h-full rounded-full transition-all duration-300; }
    .progress-fill-primary { @apply bg-blue-600; }
    .progress-fill-success { @apply bg-green-500; }
    .progress-fill-warning { @apply bg-amber-500; }
    .progress-fill-danger { @apply bg-red-500; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressBarComponent {
  readonly value = input(0);
  readonly variant = input<'primary' | 'success' | 'warning' | 'danger'>('primary');
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly label = input('');
  readonly showPercentage = input(false);

  protected clampedValue(): number {
    return Math.min(100, Math.max(0, this.value()));
  }
}

import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-chip',
  standalone: true,
  template: `
    <span [class]="'chip chip-' + variant() + ' chip-' + size()">
      <ng-content />
      @if (removable()) {
        <button class="chip-remove" (click)="removed.emit()" type="button">&times;</button>
      }
    </span>
  `,
  styles: `@reference "tailwindcss"; 
    .chip { @apply inline-flex items-center gap-1 rounded-full font-medium; }
    .chip-sm { @apply px-2 py-0.5 text-xs; }
    .chip-md { @apply px-3 py-1 text-xs; }
    .chip-lg { @apply px-4 py-1.5 text-sm; }
    .chip-primary { @apply bg-blue-100 text-blue-700; }
    .chip-success { @apply bg-green-100 text-green-700; }
    .chip-warning { @apply bg-amber-100 text-amber-700; }
    .chip-danger { @apply bg-red-100 text-red-700; }
    .chip-default { @apply bg-slate-100 text-slate-700; }
    .chip-remove { @apply ml-0.5 hover:opacity-70 cursor-pointer; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChipComponent {
  readonly variant = input<'primary' | 'success' | 'warning' | 'danger' | 'default'>('default');
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly removable = input(false);
  readonly removed = output<void>();
}

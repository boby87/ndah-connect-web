import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-tooltip',
  standalone: true,
  template: `
    <span class="tooltip-wrapper">
      <ng-content />
      <span class="tooltip-text" [class]="'tooltip-' + position()">{{ text() }}</span>
    </span>
  `,
  styles: `@reference "tailwindcss"; 
    .tooltip-wrapper { @apply relative inline-flex; }
    .tooltip-wrapper:hover .tooltip-text { @apply visible opacity-100; }
    .tooltip-text {
      @apply invisible opacity-0 absolute z-50 px-2 py-1 text-xs text-white bg-slate-900 rounded whitespace-nowrap transition-opacity duration-200;
    }
    .tooltip-top { @apply bottom-full left-1/2 -translate-x-1/2 mb-1; }
    .tooltip-bottom { @apply top-full left-1/2 -translate-x-1/2 mt-1; }
    .tooltip-left { @apply right-full top-1/2 -translate-y-1/2 mr-1; }
    .tooltip-right { @apply left-full top-1/2 -translate-y-1/2 ml-1; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TooltipComponent {
  readonly text = input('');
  readonly position = input<'top' | 'bottom' | 'left' | 'right'>('top');
}

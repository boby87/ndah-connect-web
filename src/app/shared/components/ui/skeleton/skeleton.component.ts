import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  template: `<div [class]="'skeleton skeleton-' + variant()" [style.width]="width()" [style.height]="height()"></div>`,
  styles: `@reference "tailwindcss"; .skeleton { @apply animate-pulse rounded bg-slate-200; } .skeleton-text { @apply h-4 rounded; } .skeleton-circle { @apply rounded-full; } .skeleton-rect { @apply rounded-lg; }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkeletonComponent {
  readonly variant = input<'text' | 'circle' | 'rect'>('text');
  readonly width = input('100%');
  readonly height = input('1rem');
}

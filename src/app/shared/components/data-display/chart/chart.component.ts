import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-chart',
  standalone: true,
  template: `<div class="chart-container"><ng-content /></div>`,
  styles: `@reference "tailwindcss"; .chart-container { @apply w-full h-full min-h-[200px]; }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartComponent {}

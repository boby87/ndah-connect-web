import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type StatTrend = 'UP' | 'DOWN' | 'FLAT';
export type StatTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

@Component({
  selector: 'tc-stat-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './stat-card.component.html',
  styleUrl: './stat-card.component.scss',
})
export class StatCardComponent {
  readonly label = input.required<string>();
  readonly value = input.required<string | number>();
  readonly sublabel = input<string>('');
  readonly tone = input<StatTone>('neutral');
  readonly trend = input<StatTrend | null>(null);
  readonly trendIsPositive = input<boolean>(true);
  readonly icon = input<string>('');

  readonly valueClass = computed(() => `tc-stat__value tc-stat__value--${this.tone()}`);
  readonly trendClass = computed(
    () => `tc-stat__trend tc-stat__trend--${this.trendIsPositive() ? 'pos' : 'neg'}`,
  );
}

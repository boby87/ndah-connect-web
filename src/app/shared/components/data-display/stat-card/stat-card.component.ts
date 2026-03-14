import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  templateUrl: './stat-card.component.html',
  styleUrl: './stat-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatCardComponent {
  readonly title = input('');
  readonly value = input<string | number>('');
  readonly icon = input('');
  readonly trend = input<'up' | 'down' | 'neutral'>('neutral');
  readonly trendValue = input('');
}

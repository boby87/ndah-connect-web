import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type BadgeKind = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

@Component({
  selector: 'tc-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.scss',
})
export class BadgeComponent {
  readonly kind = input<BadgeKind>('neutral');
  readonly classes = computed(() => `tc-badge tc-badge--${this.kind()}`);
}

import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type AlertKind = 'info' | 'success' | 'warning' | 'error';

@Component({
  selector: 'tc-alert',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss',
})
export class AlertComponent {
  readonly kind = input<AlertKind>('info');
  readonly title = input<string>('');
  readonly classes = computed(() => `tc-alert tc-alert--${this.kind()}`);
}

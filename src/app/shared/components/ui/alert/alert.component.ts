import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-alert',
  standalone: true,
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertComponent {
  readonly type = input<'success' | 'error' | 'warning' | 'info'>('info');
  readonly message = input.required<string>();
  readonly closable = input(false);

  readonly closed = output<void>();
}

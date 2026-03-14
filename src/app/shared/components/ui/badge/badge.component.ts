import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-badge',
  standalone: true,
  template: `
    <span [class]="'badge badge-' + variant() + ' badge-' + size()" [class.badge-dot]="dot()">
      @if (dot()) {
        <span class="dot"></span>
      }
      <ng-content />
    </span>
  `,
  styleUrl: './badge.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeComponent {
  readonly variant = input<'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'>('primary');
  readonly size = input<'sm' | 'md'>('md');
  readonly dot = input(false);
}

import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
  readonly variant = input<'default' | 'outlined' | 'flat'>('default');
  readonly padding = input<'none' | 'sm' | 'md' | 'lg'>('md');
  readonly shadow = input<'none' | 'sm' | 'md' | 'lg'>('sm');
}

import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'tc-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  readonly title = input<string>('');
  readonly subtitle = input<string>('');
  readonly eyebrow = input<string>('');
  readonly padded = input(true);
  readonly tone = input<'default' | 'soft' | 'accent'>('default');
}

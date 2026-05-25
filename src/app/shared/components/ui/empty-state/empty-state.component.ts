import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'tc-empty-state',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.scss',
})
export class EmptyStateComponent {
  readonly title = input.required<string>();
  readonly description = input<string>('');
  readonly icon = input<string>('∅');
}

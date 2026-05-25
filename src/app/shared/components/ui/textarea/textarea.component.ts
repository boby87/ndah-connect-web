import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';

let textareaIdCounter = 0;

@Component({
  selector: 'tc-textarea',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './textarea.component.html',
  styleUrl: './textarea.component.scss',
})
export class TextareaComponent {
  readonly textareaId = `tc-textarea-${++textareaIdCounter}`;

  readonly value = model<string>('');
  readonly label = input<string>('');
  readonly placeholder = input<string>('');
  readonly hint = input<string>('');
  readonly error = input<string>('');
  readonly rows = input<number>(4);
  readonly disabled = input(false);
  readonly required = input(false);

  readonly touched = model<boolean>(false);

  readonly hasError = computed(() => !!this.error() && this.touched());

  onInput(event: Event): void {
    this.value.set((event.target as HTMLTextAreaElement).value);
  }
}

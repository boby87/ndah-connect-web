import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';

let inputIdCounter = 0;

export type InputType = 'text' | 'email' | 'password' | 'tel' | 'number' | 'search' | 'url';

@Component({
  selector: 'tc-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
})
export class InputComponent {
  readonly inputId = `tc-input-${++inputIdCounter}`;

  readonly value = model<string>('');
  readonly label = input<string>('');
  readonly type = input<InputType>('text');
  readonly placeholder = input<string>('');
  readonly hint = input<string>('');
  readonly error = input<string>('');
  readonly prefix = input<string>('');
  readonly disabled = input(false);
  readonly readonly = input(false);
  readonly required = input(false);
  readonly autocomplete = input<string>('off');

  readonly touched = model<boolean>(false);

  readonly hasError = computed(() => !!this.error() && this.touched());

  onInput(event: Event): void {
    this.value.set((event.target as HTMLInputElement).value);
  }
}

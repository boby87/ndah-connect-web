import { ChangeDetectionStrategy, Component, computed, input, model, signal } from '@angular/core';

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
  readonly icon = input<'user' | 'lock' | 'search' | 'phone' | ''>('');
  readonly disabled = input(false);
  readonly readonly = input(false);
  readonly required = input(false);
  readonly autocomplete = input<string>('off');

  readonly touched = model<boolean>(false);

  readonly hasError = computed(() => !!this.error() && this.touched());
  readonly hasLeadingIcon = computed(() => !!this.icon() || !!this.prefix());

  /** Affiche/masque le mot de passe (icône œil) pour les champs de type password. */
  readonly showPassword = signal(false);
  readonly isPassword = computed(() => this.type() === 'password');
  readonly effectiveType = computed(() =>
    this.isPassword() && this.showPassword() ? 'text' : this.type(),
  );

  onInput(event: Event): void {
    this.value.set((event.target as HTMLInputElement).value);
  }

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }
}

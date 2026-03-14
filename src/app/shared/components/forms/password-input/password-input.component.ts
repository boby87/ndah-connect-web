import { ChangeDetectionStrategy, Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-password-input',
  standalone: true,
  templateUrl: './password-input.component.html',
  styleUrl: './password-input.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => PasswordInputComponent), multi: true },
  ],
})
export class PasswordInputComponent implements ControlValueAccessor {
  readonly label = input('Mot de passe');
  readonly placeholder = input('Entrez votre mot de passe');
  readonly error = input('');
  readonly showStrength = input(false);
  readonly isDisabled = signal(false);

  protected value = signal('');
  protected isVisible = signal(false);
  private onChange: (v: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(v: string): void { this.value.set(v ?? ''); }
  registerOnChange(fn: (v: string) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(d: boolean): void { this.isDisabled.set(d); }

  toggleVisibility(): void { this.isVisible.set(!this.isVisible()); }

  onInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.value.set(val);
    this.onChange(val);
  }

  onBlur(): void { this.onTouched(); }

  get strength(): number {
    const v = this.value();
    if (!v) return 0;
    let s = 0;
    if (v.length >= 8) s++;
    if (/[a-z]/.test(v) && /[A-Z]/.test(v)) s++;
    if (/\d/.test(v)) s++;
    if (/[^a-zA-Z0-9]/.test(v)) s++;
    return s;
  }

  get strengthLabel(): string {
    const labels = ['', 'Faible', 'Moyen', 'Bon', 'Fort'];
    return labels[this.strength] ?? '';
  }
}

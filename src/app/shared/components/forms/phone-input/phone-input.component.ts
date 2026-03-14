import { ChangeDetectionStrategy, Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-phone-input',
  standalone: true,
  templateUrl: './phone-input.component.html',
  styleUrl: './phone-input.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => PhoneInputComponent), multi: true },
  ],
})
export class PhoneInputComponent implements ControlValueAccessor {
  readonly label = input('Numéro de téléphone');
  readonly error = input('');
  readonly isDisabled = signal(false);

  protected value = signal('');
  private onChange: (v: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(v: string): void { this.value.set(v ?? ''); }
  registerOnChange(fn: (v: string) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(d: boolean): void { this.isDisabled.set(d); }

  onInput(event: Event): void {
    let raw = (event.target as HTMLInputElement).value.replace(/\D/g, '');
    if (raw.length > 9) raw = raw.substring(0, 9);
    this.value.set(raw);
    this.onChange(raw);
  }

  onBlur(): void { this.onTouched(); }

  get formatted(): string {
    const v = this.value();
    if (!v) return '';
    return v.replace(/(\d{3})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4').trim();
  }
}

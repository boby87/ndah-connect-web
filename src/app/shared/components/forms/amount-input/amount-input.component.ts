import { ChangeDetectionStrategy, Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-amount-input',
  standalone: true,
  template: `
    @if (label()) {
      <label class="amount-label">{{ label() }}</label>
    }
    <div class="amount-field" [class.amount-error]="error()">
      <input
        type="text"
        inputmode="numeric"
        class="amount-input"
        [placeholder]="placeholder()"
        [disabled]="isDisabled()"
        [value]="formatted"
        (input)="onInput($event)"
        (blur)="onBlur()"
      />
      <span class="amount-suffix">{{ currency() }}</span>
    </div>
    @if (error()) {
      <span class="amount-error-msg">{{ error() }}</span>
    }
  `,
  styles: `@reference "tailwindcss"; 
    :host { @apply block; }
    .amount-label { @apply block text-sm font-medium text-slate-700 mb-1; }
    .amount-field { @apply flex items-center rounded-lg border border-slate-300 bg-white overflow-hidden focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-colors; &.amount-error { @apply border-red-500; } }
    .amount-input { @apply flex-1 px-3 py-2 text-sm text-slate-900 outline-none bg-transparent text-right disabled:cursor-not-allowed; }
    .amount-suffix { @apply px-3 py-2 text-sm text-slate-500 bg-slate-50 border-l border-slate-300 select-none; }
    .amount-error-msg { @apply block mt-1 text-xs text-red-500; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => AmountInputComponent), multi: true },
  ],
})
export class AmountInputComponent implements ControlValueAccessor {
  readonly label = input('');
  readonly placeholder = input('0');
  readonly currency = input('XAF');
  readonly error = input('');
  readonly isDisabled = signal(false);

  protected value = signal(0);
  private onChange: (v: number) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(v: number): void { this.value.set(v ?? 0); }
  registerOnChange(fn: (v: number) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(d: boolean): void { this.isDisabled.set(d); }

  get formatted(): string {
    const v = this.value();
    return v ? v.toLocaleString('fr-FR') : '';
  }

  onInput(event: Event): void {
    const raw = (event.target as HTMLInputElement).value.replace(/\D/g, '');
    const num = parseInt(raw, 10) || 0;
    this.value.set(num);
    this.onChange(num);
  }

  onBlur(): void { this.onTouched(); }
}

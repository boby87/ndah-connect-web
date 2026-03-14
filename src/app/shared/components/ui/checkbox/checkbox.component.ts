import { ChangeDetectionStrategy, Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-checkbox',
  standalone: true,
  template: `
    <label class="checkbox-wrapper">
      <input type="checkbox" [checked]="checked()" [disabled]="isDisabled()" (change)="toggle()" class="checkbox-input" />
      <span class="checkbox-label">{{ label() }}</span>
    </label>
  `,
  styles: `@reference "tailwindcss"; 
    .checkbox-wrapper { @apply inline-flex items-center gap-2 cursor-pointer; }
    .checkbox-input { @apply w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer; }
    .checkbox-label { @apply text-sm text-slate-700 select-none; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => CheckboxComponent), multi: true },
  ],
})
export class CheckboxComponent implements ControlValueAccessor {
  readonly label = input('');
  readonly isDisabled = signal(false);
  protected checked = signal(false);
  private onChange: (v: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(v: boolean): void { this.checked.set(!!v); }
  registerOnChange(fn: (v: boolean) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(d: boolean): void { this.isDisabled.set(d); }

  toggle(): void {
    const val = !this.checked();
    this.checked.set(val);
    this.onChange(val);
    this.onTouched();
  }
}

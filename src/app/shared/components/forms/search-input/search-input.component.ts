import { ChangeDetectionStrategy, Component, forwardRef, input, output, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-search-input',
  standalone: true,
  template: `
    <div class="search-field">
      <span class="search-icon">🔍</span>
      <input
        type="search"
        class="search-input"
        [placeholder]="placeholder()"
        [value]="value()"
        (input)="onInput($event)"
      />
      @if (value()) {
        <button class="search-clear" (click)="clear()" type="button">&times;</button>
      }
    </div>
  `,
  styles: `@reference "tailwindcss"; 
    .search-field { @apply flex items-center rounded-lg border border-slate-300 bg-white overflow-hidden focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-colors; }
    .search-icon { @apply pl-3 text-slate-400 text-sm; }
    .search-input { @apply flex-1 px-2 py-2 text-sm text-slate-900 outline-none bg-transparent; }
    .search-clear { @apply pr-3 text-slate-400 hover:text-slate-700 cursor-pointer; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => SearchInputComponent), multi: true },
  ],
})
export class SearchInputComponent implements ControlValueAccessor {
  readonly placeholder = input('Rechercher...');
  readonly searchChange = output<string>();

  protected value = signal('');
  private onChange: (v: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(v: string): void { this.value.set(v ?? ''); }
  registerOnChange(fn: (v: string) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }

  onInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.value.set(val);
    this.onChange(val);
    this.searchChange.emit(val);
  }

  clear(): void {
    this.value.set('');
    this.onChange('');
    this.searchChange.emit('');
  }
}

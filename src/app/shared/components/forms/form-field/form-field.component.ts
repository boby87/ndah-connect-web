import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-form-field',
  standalone: true,
  template: `
    <div class="form-field">
      @if (label()) {
        <label class="form-label">
          {{ label() }}
          @if (required()) {
            <span class="text-red-500">*</span>
          }
        </label>
      }
      <ng-content />
      @if (hint() && !error()) {
        <span class="form-hint">{{ hint() }}</span>
      }
      @if (error()) {
        <span class="form-error">{{ error() }}</span>
      }
    </div>
  `,
  styles: `@reference "tailwindcss"; 
    .form-field { @apply flex flex-col gap-1; }
    .form-label { @apply text-sm font-medium text-slate-700; }
    .form-hint { @apply text-xs text-slate-500; }
    .form-error { @apply text-xs text-red-500; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormFieldComponent {
  readonly label = input('');
  readonly hint = input('');
  readonly error = input('');
  readonly required = input(false);
}

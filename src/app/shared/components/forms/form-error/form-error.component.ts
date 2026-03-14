import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-form-error',
  standalone: true,
  template: `@if (show()) { <span class="form-error-msg">{{ message() }}</span> }`,
  styles: `@reference "tailwindcss"; .form-error-msg { @apply text-xs text-red-500 mt-0.5; }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormErrorComponent {
  readonly message = input('');
  readonly show = input(false);
}

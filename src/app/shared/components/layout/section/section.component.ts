import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-section',
  standalone: true,
  template: `
    <section class="section">
      @if (title()) {
        <h2 class="section-title">{{ title() }}</h2>
      }
      @if (description()) {
        <p class="section-description">{{ description() }}</p>
      }
      <div class="section-content">
        <ng-content />
      </div>
    </section>
  `,
  styles: `@reference "tailwindcss"; 
    .section { @apply mb-8; }
    .section-title { @apply text-lg font-semibold text-slate-900 mb-1; }
    .section-description { @apply text-sm text-slate-500 mb-4; }
    .section-content { @apply mt-4; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionComponent {
  readonly title = input('');
  readonly description = input('');
}

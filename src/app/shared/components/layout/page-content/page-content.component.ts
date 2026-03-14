import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-page-content',
  standalone: true,
  template: `<div class="page-content"><ng-content /></div>`,
  styles: `@reference "tailwindcss"; .page-content { @apply p-6; }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageContentComponent {}

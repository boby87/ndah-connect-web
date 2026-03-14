import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-calendar',
  standalone: true,
  template: `<div class="calendar-placeholder"><ng-content /></div>`,
  styles: `@reference "tailwindcss"; .calendar-placeholder { @apply w-full min-h-[300px] border border-slate-200 rounded-lg p-4; }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent {}

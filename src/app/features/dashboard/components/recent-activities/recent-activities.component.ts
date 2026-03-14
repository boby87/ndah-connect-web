import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TimelineComponent, TimelineItem } from '../../../../shared/components/data-display/timeline/timeline.component';

@Component({
  selector: 'app-recent-activities',
  standalone: true,
  imports: [TimelineComponent],
  template: `
    <div class="recent-activities">
      <h3 class="section-title">Activités récentes</h3>
      <app-timeline [items]="activities()" />
    </div>
  `,
  styles: `@reference "tailwindcss"; .section-title { @apply text-lg font-semibold text-slate-900 mb-3; }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecentActivitiesComponent {
  readonly activities = input<TimelineItem[]>([]);
}

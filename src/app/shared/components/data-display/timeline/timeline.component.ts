import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  date: string;
  icon?: string;
  color?: 'blue' | 'green' | 'red' | 'amber' | 'slate';
}

@Component({
  selector: 'app-timeline',
  standalone: true,
  template: `
    <div class="timeline">
      @for (item of items(); track item.id) {
        <div class="timeline-item">
          <div [class]="'timeline-dot dot-' + (item.color ?? 'blue')">{{ item.icon ?? '●' }}</div>
          <div class="timeline-content">
            <h4 class="timeline-title">{{ item.title }}</h4>
            @if (item.description) {
              <p class="timeline-desc">{{ item.description }}</p>
            }
            <span class="timeline-date">{{ item.date }}</span>
          </div>
        </div>
      }
    </div>
  `,
  styles: `@reference "tailwindcss"; 
    .timeline { @apply relative flex flex-col gap-6 pl-6 border-l-2 border-slate-200; }
    .timeline-item { @apply relative flex gap-3; }
    .timeline-dot { @apply absolute -left-[1.75rem] w-5 h-5 rounded-full flex items-center justify-center text-xs text-white; &.dot-blue { @apply bg-blue-500; } &.dot-green { @apply bg-green-500; } &.dot-red { @apply bg-red-500; } &.dot-amber { @apply bg-amber-500; } &.dot-slate { @apply bg-slate-400; } }
    .timeline-content { @apply flex flex-col; }
    .timeline-title { @apply text-sm font-medium text-slate-900; }
    .timeline-desc { @apply text-xs text-slate-500 mt-0.5; }
    .timeline-date { @apply text-xs text-slate-400 mt-1; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineComponent {
  readonly items = input<TimelineItem[]>([]);
}

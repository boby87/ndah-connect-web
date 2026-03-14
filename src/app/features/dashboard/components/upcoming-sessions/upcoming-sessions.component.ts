import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';

@Component({
  selector: 'app-upcoming-sessions',
  standalone: true,
  imports: [CardComponent],
  template: `
    <div class="upcoming-sessions">
      <h3 class="section-title">Prochaines séances</h3>
      @for (session of sessions(); track session.id) {
        <app-card class="session-item">
          <div class="session-info">
            <span class="session-date">{{ session.date }}</span>
            <span class="session-location">{{ session.location ?? 'Lieu à confirmer' }}</span>
          </div>
        </app-card>
      } @empty {
        <p class="empty-text">Aucune séance prévue</p>
      }
    </div>
  `,
  styles: `@reference "tailwindcss"; 
    .section-title { @apply text-lg font-semibold text-slate-900 mb-3; }
    .session-item { @apply mb-2; }
    .session-info { @apply flex justify-between text-sm; }
    .session-date { @apply font-medium text-slate-900; }
    .session-location { @apply text-slate-500; }
    .empty-text { @apply text-sm text-slate-400; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpcomingSessionsComponent {
  readonly sessions = input<{ id: string; date: string; location?: string }[]>([]);
}

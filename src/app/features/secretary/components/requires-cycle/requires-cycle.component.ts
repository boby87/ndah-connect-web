import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SpinnerComponent } from '../../../../shared/components/ui/spinner/spinner.component';
import type { SecretaryContextState } from '../../services/secretary-context.service';

@Component({
  selector: 'tc-requires-cycle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterLink, SpinnerComponent],
  template: `
    @if (state() === 'loading') {
      <div class="flex justify-center py-20">
        <tc-spinner size="lg" />
      </div>
    } @else {
      <div class="flex flex-col items-center gap-5 py-20 text-center">
        <div class="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-5xl">
          {{ state() === 'no-cycle' ? '🔒' : '📅' }}
        </div>
        <div class="space-y-1">
          <h2 class="text-xl font-semibold text-gray-700">
            {{ state() === 'no-cycle' ? 'Aucun cycle actif' : 'Aucune séance planifiée' }}
          </h2>
          <p class="max-w-sm text-sm text-gray-500">
            @if (state() === 'no-cycle') {
              Créez d'abord un <strong>cycle actif</strong> depuis la planification des séances.
            } @else {
              Le cycle est actif, mais vous devez planifier au moins une
              <strong>séance</strong> avant d'accéder à cette fonctionnalité.
            }
          </p>
        </div>
        <a
          routerLink="/secretary/sessions"
          class="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm
                 transition hover:bg-emerald-700"
        >
          Aller à la planification des séances
        </a>
      </div>
    }
  `,
})
export class RequiresCycleComponent {
  readonly state = input.required<SecretaryContextState>();
}

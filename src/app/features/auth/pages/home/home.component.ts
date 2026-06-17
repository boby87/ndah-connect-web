import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';

@Component({
  selector: 'tc-home-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ButtonComponent],
  template: `
    <div>
      <!-- Logo -->
      <div class="flex justify-center mb-5">
        <img
          src="/assets/images/logos/logo_tontine_connect.png"
          alt="Tontine Connect"
          width="160"
          height="auto"
          style="max-width: 160px;"
        />
      </div>

      <div class="text-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900 leading-tight">Bienvenue !</h1>
        <p class="text-base text-gray-700 font-medium mt-0.5">La tontine réinventée</p>
        <p class="text-sm text-gray-500 mt-1">Gérez vos cercles d'épargne en toute simplicité.</p>
      </div>

      <!-- Features -->
      <ul class="space-y-3 mb-7">
        @for (feature of features; track feature.label) {
          <li class="flex items-start gap-3">
            <span
              class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
              style="background: var(--brand-100); color: var(--brand-600);"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </span>
            <div>
              <p class="text-sm font-semibold text-gray-800">{{ feature.label }}</p>
              <p class="text-xs text-gray-500">{{ feature.desc }}</p>
            </div>
          </li>
        }
      </ul>

      <!-- CTA -->
      <div class="space-y-3">
        <tc-button variant="primary" [fullWidth]="true" routerLink="/auth/login">
          Se connecter
        </tc-button>
        <button
          type="button"
          routerLink="/auth/register"
          style="border-radius: var(--radius-md); padding: 0.6rem 1.2rem; font-size: 0.9rem; border: 1px solid rgba(28,26,47,0.12);"
          class="flex w-full items-center justify-center font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
        >
          Créer un compte
        </button>
      </div>
    </div>
  `,
})
export class HomePageComponent {
  readonly features = [
    {
      label: 'Gestion des cotisations',
      desc: 'Suivez les paiements et les arriérés en temps réel.',
    },
    {
      label: 'Distributions automatisées',
      desc: 'Calculez et validez les tours de distribution facilement.',
    },
    {
      label: 'Prêts & remboursements',
      desc: 'Gérez les demandes de prêt avec tableau d\'amortissement.',
    },
    {
      label: 'Rapports financiers',
      desc: 'Exportez vos états financiers en PDF à tout moment.',
    },
  ];
}

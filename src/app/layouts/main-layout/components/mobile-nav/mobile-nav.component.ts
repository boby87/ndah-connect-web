import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UiStore } from '../../../../store/ui/ui.store';

@Component({
  selector: 'app-mobile-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="mobile-nav">
      <a routerLink="/dashboard" routerLinkActive="active" class="mobile-nav-item">📊<span>Accueil</span></a>
      <a routerLink="/tontines" routerLinkActive="active" class="mobile-nav-item">🏦<span>Tontines</span></a>
      <a routerLink="/contributions" routerLinkActive="active" class="mobile-nav-item">💰<span>Cotisations</span></a>
      <a routerLink="/sessions" routerLinkActive="active" class="mobile-nav-item">📅<span>Séances</span></a>
      <a routerLink="/settings" routerLinkActive="active" class="mobile-nav-item">⚙️<span>Plus</span></a>
    </nav>
  `,
  styles: `@reference "tailwindcss"; 
    .mobile-nav { @apply fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 flex justify-around py-2 sm:hidden; }
    .mobile-nav-item { @apply flex flex-col items-center gap-0.5 text-xs text-slate-500 no-underline; &.active { @apply text-blue-600; } }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileNavComponent {}

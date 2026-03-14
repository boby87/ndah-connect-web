import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TontineStore } from '../../../../store/tontine/tontine.store';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';

@Component({
  selector: 'app-quick-actions',
  standalone: true,
  imports: [ButtonComponent],
  template: `
    <div class="quick-actions">
      <h3 class="section-title">Actions rapides</h3>
      <div class="actions-grid">
        <app-button variant="outline" icon="💰" (clicked)="navigate('/contributions')">Nouvelle cotisation</app-button>
        <app-button variant="outline" icon="📅" (clicked)="navigate('/sessions')">Voir séances</app-button>
        <app-button variant="outline" icon="🏧" (clicked)="navigate('/loans')">Demander un prêt</app-button>
        <app-button variant="outline" icon="👥" (clicked)="navigate('/members')">Voir membres</app-button>
      </div>
    </div>
  `,
  styles: `@reference "tailwindcss"; 
    .section-title { @apply text-lg font-semibold text-slate-900 mb-3; }
    .actions-grid { @apply grid grid-cols-2 sm:grid-cols-4 gap-3; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickActionsComponent {
  private readonly router = inject(Router);

  navigate(path: string): void {
    this.router.navigate([path]);
  }
}

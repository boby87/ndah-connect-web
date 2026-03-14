import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { PageHeaderComponent } from '../../../../shared/components/layout/page-header/page-header.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { MockDataService } from '../../../../core/services/mock-data.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-vote-create',
  standalone: true,
  imports: [PageHeaderComponent, CardComponent, ButtonComponent, FormsModule],
  template: `
    <app-page-header title="Créer un vote" backLink="/votes" />

    <div class="create-layout">
      <app-card>
        <div class="form">
          <h3 class="form-title">Nouveau vote</h3>

          <div class="form-group">
            <label class="form-label">Titre du vote *</label>
            <input class="form-input" [(ngModel)]="title" placeholder="Ex: Augmentation de la cotisation" />
          </div>

          <div class="form-group">
            <label class="form-label">Description</label>
            <textarea class="form-textarea" [(ngModel)]="description" rows="3" placeholder="Décrivez le contexte du vote..."></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Type de majorité *</label>
            <select class="form-input" [(ngModel)]="voteType">
              <option value="majority">Majorité simple (50% + 1)</option>
              <option value="two_thirds">Deux tiers (67%)</option>
              <option value="unanimous">Unanimité</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Options de vote</label>
            @for (opt of options(); track $index) {
              <div class="option-row">
                <input class="form-input option-input" [ngModel]="opt" (ngModelChange)="updateOption($index, $event)" [placeholder]="'Option ' + ($index + 1)" />
                @if (options().length > 2) {
                  <button class="remove-btn" (click)="removeOption($index)">✕</button>
                }
              </div>
            }
            <app-button variant="outline" size="sm" (clicked)="addOption()">+ Ajouter une option</app-button>
          </div>

          <div class="form-actions">
            <app-button variant="outline" (clicked)="router.navigate(['/votes'])">Annuler</app-button>
            <app-button variant="secondary" (clicked)="saveDraft()">💾 Sauvegarder en brouillon</app-button>
            <app-button variant="primary" (clicked)="createAndLaunch()" [disabled]="!title.trim()">🗳️ Créer et lancer le vote</app-button>
          </div>
        </div>
      </app-card>
    </div>
  `,
  styles: `@reference "tailwindcss";
    .create-layout { @apply max-w-2xl; }
    .form { @apply p-4 flex flex-col gap-4; }
    .form-title { @apply text-lg font-semibold text-slate-900; }
    .form-group { @apply flex flex-col gap-1.5; }
    .form-label { @apply text-sm font-medium text-slate-700; }
    .form-input { @apply border border-slate-300 rounded-lg px-3 py-2 text-sm; }
    .form-textarea { @apply border border-slate-300 rounded-lg px-3 py-2 text-sm resize-y; }
    .option-row { @apply flex gap-2 items-center; }
    .option-input { @apply flex-1; }
    .remove-btn { @apply w-8 h-8 rounded-full bg-red-100 text-red-600 text-xs font-bold cursor-pointer hover:bg-red-200; }
    .form-actions { @apply flex gap-2 justify-end pt-4 border-t; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VoteCreateComponent {
  protected readonly router = inject(Router);
  protected readonly mock = inject(MockDataService);

  title = '';
  description = '';
  voteType: 'majority' | 'two_thirds' | 'unanimous' = 'majority';
  options = signal<string[]>(['Pour', 'Contre', 'Abstention']);

  addOption(): void {
    this.options.update(opts => [...opts, '']);
  }

  removeOption(index: number): void {
    this.options.update(opts => opts.filter((_, i) => i !== index));
  }

  updateOption(index: number, value: string): void {
    this.options.update(opts => opts.map((o, i) => i === index ? value : o));
  }

  saveDraft(): void {
    this.mock.launchVote(this.title, this.description, this.voteType, this.options().filter(o => o.trim()));
    this.router.navigate(['/votes']);
  }

  createAndLaunch(): void {
    if (this.title.trim()) {
      this.mock.launchVote(this.title, this.description, this.voteType, this.options().filter(o => o.trim()));
      this.router.navigate(['/votes']);
    }
  }
}

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TontineStore } from '../../../../store/tontine/tontine.store';
import { Tontine } from '../../../../shared/models/entities/tontine.model';

@Component({
  selector: 'app-tontine-selector',
  standalone: true,
  template: `
    @if (tontineStore.tontines().length > 0) {
      <select class="tontine-select" (change)="onSelect($event)">
        @for (tontine of tontineStore.tontines(); track tontine.id) {
          <option [value]="tontine.id" [selected]="tontine.id === tontineStore.currentTontine()?.id">
            {{ tontine.name }}
          </option>
        }
      </select>
    }
  `,
  styles: `@reference "tailwindcss"; 
    .tontine-select {
      @apply px-3 py-1.5 text-sm rounded-lg border border-slate-300 bg-white text-slate-700
             focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none cursor-pointer max-w-[200px];
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TontineSelectorComponent {
  protected readonly tontineStore = inject(TontineStore);

  onSelect(event: Event): void {
    const id = (event.target as HTMLSelectElement).value;
    const tontine = this.tontineStore.tontines().find(t => t.id === id);
    if (tontine) {
      this.tontineStore.setCurrentTontine(tontine);
    }
  }
}

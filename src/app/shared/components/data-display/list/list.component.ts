import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

export interface ListItem {
  id: string;
  title: string;
  subtitle?: string;
  icon?: string;
  trailing?: string;
}

@Component({
  selector: 'app-list',
  standalone: true,
  template: `
    <div class="list">
      @for (item of items(); track item.id) {
        <div class="list-item" (click)="itemClick.emit(item)">
          @if (item.icon) {
            <span class="list-icon">{{ item.icon }}</span>
          }
          <div class="list-content">
            <span class="list-title">{{ item.title }}</span>
            @if (item.subtitle) {
              <span class="list-subtitle">{{ item.subtitle }}</span>
            }
          </div>
          @if (item.trailing) {
            <span class="list-trailing">{{ item.trailing }}</span>
          }
        </div>
      } @empty {
        <div class="list-empty">{{ emptyMessage() }}</div>
      }
    </div>
  `,
  styles: `@reference "tailwindcss"; 
    .list { @apply divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden; }
    .list-item { @apply flex items-center gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors; }
    .list-icon { @apply text-lg; }
    .list-content { @apply flex-1 flex flex-col; }
    .list-title { @apply text-sm font-medium text-slate-900; }
    .list-subtitle { @apply text-xs text-slate-500; }
    .list-trailing { @apply text-sm text-slate-500; }
    .list-empty { @apply px-4 py-8 text-center text-sm text-slate-500; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent {
  readonly items = input<ListItem[]>([]);
  readonly emptyMessage = input('Aucun élément');
  readonly itemClick = output<ListItem>();
}

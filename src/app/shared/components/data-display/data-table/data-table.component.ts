import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

export interface DataTableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableComponent {
  readonly columns = input<DataTableColumn[]>([]);
  readonly data = input<Record<string, unknown>[]>([]);
  readonly loading = input(false);
  readonly emptyMessage = input('Aucune donnée disponible');
  readonly rowClick = output<Record<string, unknown>>();
  readonly sortChange = output<{ key: string; direction: 'asc' | 'desc' }>();

  protected sortKey = '';
  protected sortDirection: 'asc' | 'desc' = 'asc';

  sort(column: DataTableColumn): void {
    if (!column.sortable) return;
    if (this.sortKey === column.key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = column.key;
      this.sortDirection = 'asc';
    }
    this.sortChange.emit({ key: this.sortKey, direction: this.sortDirection });
  }

  onRowClick(row: Record<string, unknown>): void {
    this.rowClick.emit(row);
  }
}

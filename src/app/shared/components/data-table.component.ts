import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  width?: string;
  format?: (value: any) => string;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
      <table class="w-full">
        <thead class="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
          <tr>
            @for (column of columns; track column.key) {
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-900" [style.width]="column.width">
                {{ column.label }}
              </th>
            }
            @if (actions && actions.length > 0) {
              <th class="px-6 py-4 text-center text-sm font-semibold text-gray-900">Actions</th>
            }
          </tr>
        </thead>
        <tbody>
          @for (item of data; track getKey(item); let isOdd = $odd) {
            <tr [ngClass]="isOdd ? 'bg-white' : 'bg-gray-50'" class="border-b border-gray-100 hover:bg-blue-50 transition-colors duration-150">
              @for (column of columns; track column.key) {
                <td class="px-6 py-4 text-sm text-gray-700">
                  {{ column.format ? column.format(item[column.key]) : item[column.key] }}
                </td>
              }
              @if (actions && actions.length > 0) {
                <td class="px-6 py-4 text-center text-sm">
                  <div class="flex gap-2 justify-center flex-wrap">
                    @for (action of actions; track action.label) {
                      <button (click)="action.onClick(item)" [ngClass]="getActionButtonClass(action.variant)" class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105">
                        {{ action.label }}
                      </button>
                    }
                  </div>
                </td>
              }
            </tr>
          }
          @if (data.length === 0) {
            <tr>
              <td [attr.colspan]="columns.length + (actions?.length || 0)" class="px-6 py-8 text-center text-gray-500">
                Aucune donnée disponible
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: []
})
export class DataTableComponent<T> {
  @Input() data!: T[];
  @Input() columns!: TableColumn<T>[];
  @Input() actions?: Array<{
    label: string;
    onClick: (item: T) => void;
    variant?: 'primary' | 'secondary' | 'danger';
  }>;

  getKey(item: T): any {
    return (item as any).id || item;
  }

  getActionButtonClass(variant?: string): string {
    const variants: Record<string, string> = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-200',
      secondary: 'bg-gray-300 text-gray-700 hover:bg-gray-400 focus:ring-4 focus:ring-gray-200',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-4 focus:ring-red-200'
    };
    return variants[variant || 'secondary'];
  }
}


import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
n    <span [ngClass]="getClasses()" class="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold">
      <span class="w-2 h-2 rounded-full" [ngClass]="getStatusIndicator()"></span>
      {{ label }}
    </span>
  `,
  styles: []
})
export class StatusBadgeComponent {
  @Input() status: 'active' | 'inactive' | 'pending' | 'completed' | 'suspended' | 'approved' | 'closed' = 'active';
  @Input() label: string = '';

  getClasses(): string {
    const statusClasses: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      pending: 'bg-amber-100 text-amber-800',
      completed: 'bg-blue-100 text-blue-800',
      suspended: 'bg-red-100 text-red-800',
      approved: 'bg-emerald-100 text-emerald-800',
      closed: 'bg-slate-100 text-slate-800'
    };
    return statusClasses[this.status];
  }

  getStatusIndicator(): string {
    const indicatorClasses: Record<string, string> = {
      active: 'bg-green-500',
      inactive: 'bg-gray-500',
      pending: 'bg-amber-500',
      completed: 'bg-blue-500',
      suspended: 'bg-red-500',
      approved: 'bg-emerald-500',
      closed: 'bg-slate-500'
    };
    return indicatorClasses[this.status];
  }
}


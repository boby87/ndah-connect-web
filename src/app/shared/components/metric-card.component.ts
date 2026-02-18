import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardMetric } from '../models';

@Component({
  selector: 'app-metric-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-200">
      <div class="flex justify-between items-start">
        <div class="flex-1">
          <p class="text-gray-600 text-sm font-medium uppercase tracking-wide">{{ metric.label }}</p>
          <p class="text-3xl font-bold mt-3 text-gray-900">
            {{ metric.currency ? metric.currency + ' ' : '' }}{{ formatNumber(metric.value) }}
          </p>
          @if (metric.trend !== undefined) {
            <p class="text-sm mt-3 flex items-center gap-1" [ngClass]="metric.trend >= 0 ? 'text-green-600' : 'text-red-600'">
              <span class="font-bold">{{ metric.trend >= 0 ? '↑' : '↓' }} {{ Math.abs(metric.trend) }}%</span>
              @if (metric.trendLabel) {
                <span class="text-gray-500">{{ metric.trendLabel }}</span>
              }
            </p>
          }
        </div>
        @if (metric.icon) {
          <div [ngClass]="getIconBg()" class="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ml-4">
            {{ getIconSymbol() }}
          </div>
        }
      </div>
    </div>
  `,
  styles: []
})
export class MetricCardComponent {
  @Input() metric!: DashboardMetric;
  Math = Math;

  formatNumber(value: number): string {
    return new Intl.NumberFormat('fr-FR', {
      maximumFractionDigits: 0
    }).format(value);
  }

  getBorderColor(): string {
    const colors: Record<string, string> = {
      green: 'border-green-200',
      blue: 'border-blue-200',
      orange: 'border-orange-200',
      red: 'border-red-200',
      purple: 'border-purple-200'
    };
    return colors[this.metric.color || 'blue'];
  }

  getIconBg(): string {
    const colors: Record<string, string> = {
      green: 'bg-green-100 text-green-600',
      blue: 'bg-blue-100 text-blue-600',
      orange: 'bg-orange-100 text-orange-600',
      red: 'bg-red-100 text-red-600',
      purple: 'bg-purple-100 text-purple-600'
    };
    return colors[this.metric.color || 'blue'];
  }

  getIconSymbol(): string {
    const icons: Record<string, string> = {
      users: '👥',
      wallet: '💰',
      'trending-up': '📈',
      percent: '%'
    };
    return icons[this.metric.icon || 'wallet'];
  }
}


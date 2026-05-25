import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, resource } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AlertComponent } from '../../../../shared/components/ui/alert/alert.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { EmptyStateComponent } from '../../../../shared/components/ui/empty-state/empty-state.component';
import { IconComponent } from '../../../../shared/components/ui/icon/icon.component';
import { SpinnerComponent } from '../../../../shared/components/ui/spinner/spinner.component';
import { StatCardComponent } from '../../../../shared/components/ui/stat-card/stat-card.component';
import { CurrencyXafPipe } from '../../../../shared/pipes/currency-xaf.pipe';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { PresidentService } from '../../services/president.service';
import type { PresidentDashboard } from '../../../../shared/models/entities/announcement.model';

@Component({
  selector: 'tc-president-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DecimalPipe,
    RouterLink,
    AlertComponent,
    BadgeComponent,
    CardComponent,
    EmptyStateComponent,
    IconComponent,
    SpinnerComponent,
    StatCardComponent,
    CurrencyXafPipe,
    DateFormatPipe,
  ],
  templateUrl: './president-dashboard.component.html',
  styleUrl: './president-dashboard.component.scss',
})
export class PresidentDashboardComponent {
  protected readonly auth = inject(AuthService);
  private readonly service = inject(PresidentService);

  readonly dashboardResource = resource({
    loader: () => this.service.getDashboard(),
  });

  readonly data = computed(() => this.dashboardResource.value());

  alertKind(level: 'CRITICAL' | 'WARNING' | 'INFO'): 'error' | 'warning' | 'info' {
    switch (level) {
      case 'CRITICAL':
        return 'error';
      case 'WARNING':
        return 'warning';
      default:
        return 'info';
    }
  }

  priorityKind(priority: 'CRITICAL' | 'HIGH' | 'NORMAL' | 'LOW'): 'danger' | 'warning' | 'info' | 'neutral' {
    switch (priority) {
      case 'CRITICAL':
        return 'danger';
      case 'HIGH':
        return 'warning';
      case 'NORMAL':
        return 'info';
      default:
        return 'neutral';
    }
  }

  priorityLabel(priority: 'CRITICAL' | 'HIGH' | 'NORMAL' | 'LOW'): string {
    return { CRITICAL: 'Critique', HIGH: 'Haute', NORMAL: 'Normale', LOW: 'Basse' }[priority];
  }

  categoryLabel(category: string): string {
    const map: Record<string, string> = {
      FINANCIAL_OPERATION: 'Opération financière',
      DOCUMENT: 'Document',
      ADHESION: 'Adhésion',
      RESIGNATION: 'Démission',
    };
    return map[category] ?? category;
  }

  decisionKind(decision: 'APPROVED' | 'REJECTED' | 'BLOCKED'): 'success' | 'danger' | 'warning' {
    switch (decision) {
      case 'APPROVED':
        return 'success';
      case 'REJECTED':
        return 'danger';
      default:
        return 'warning';
    }
  }

  decisionLabel(decision: 'APPROVED' | 'REJECTED' | 'BLOCKED'): string {
    return { APPROVED: 'Approuvé', REJECTED: 'Refusé', BLOCKED: 'Bloqué' }[decision];
  }

  trendTone(perf: PresidentDashboard['performance'][number]): string {
    if (perf.trend === 'FLAT') return 'tc-trend tc-trend--flat';
    const good = perf.trend === perf.positiveTrend;
    return good ? 'tc-trend tc-trend--pos' : 'tc-trend tc-trend--neg';
  }

  deltaText(perf: PresidentDashboard['performance'][number]): string {
    const delta = perf.current - perf.previous;
    const sign = delta > 0 ? '+' : '';
    return `${sign}${delta}${perf.unit ?? ''}`;
  }

  bucketBadge(bucket: 'TODAY' | 'THIS_WEEK' | 'UPCOMING'): string {
    return 'tc-bucket tc-bucket--' + bucket.toLowerCase();
  }

  bucketShort(bucket: 'TODAY' | 'THIS_WEEK' | 'UPCOMING'): string {
    return { TODAY: 'AUJ', THIS_WEEK: 'SEM', UPCOMING: 'PROCH' }[bucket];
  }

  nextSessionValue(d: PresidentDashboard): string {
    if (d.kpi.nextSessionInDays === undefined) return '—';
    if (d.kpi.nextSessionInDays === 0) return "Aujourd'hui";
    return `J-${d.kpi.nextSessionInDays}`;
  }
}

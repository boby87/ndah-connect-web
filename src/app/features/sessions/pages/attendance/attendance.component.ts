import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MockDataService, AttendanceRecord } from '../../../../core/services/mock-data.service';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CardComponent, BadgeComponent, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page-header">
      <div>
        <h1 class="page-title">📋 Pointage des membres</h1>
        <p class="page-subtitle">Séance #9 — 22 mars 2026</p>
      </div>
      <div class="header-actions">
        @if (!mock.attendanceFinalized()) {
          <app-button variant="primary" (clicked)="finalizeAttendance()">🔒 Finaliser le pointage</app-button>
        } @else {
          <app-badge variant="success">Pointage finalisé ✅</app-badge>
        }
      </div>
    </div>

    <!-- Summary -->
    <div class="summary-grid">
      <div class="summary-card card-present">
        <span class="summary-count">{{ mock.attendanceSummary().present }}</span>
        <span class="summary-label">Présents</span>
      </div>
      <div class="summary-card card-late">
        <span class="summary-count">{{ mock.attendanceSummary().late }}</span>
        <span class="summary-label">Retardataires</span>
      </div>
      <div class="summary-card card-excused">
        <span class="summary-count">{{ mock.attendanceSummary().absentExcused }}</span>
        <span class="summary-label">Abs. excusés</span>
      </div>
      <div class="summary-card card-unexcused">
        <span class="summary-count">{{ mock.attendanceSummary().absentUnexcused }}</span>
        <span class="summary-label">Abs. non excusés</span>
      </div>
    </div>

    <!-- Quorum -->
    <div class="quorum-info">
      @if (mock.attendanceSummary().quorumReached) {
        <span class="quorum-ok">✅ Quorum atteint ({{ mock.attendanceSummary().present + mock.attendanceSummary().late }}/{{ mock.quorumRequired() }} requis)</span>
      } @else {
        <span class="quorum-ko">⚠️ Quorum non atteint ({{ mock.attendanceSummary().present + mock.attendanceSummary().late }}/{{ mock.quorumRequired() }} requis)</span>
      }
    </div>

    <!-- Attendance List -->
    <app-card>
      <div class="card-body">
        <h2 class="section-title">👥 Liste des membres ({{ mock.attendance().length }})</h2>
        <div class="attendance-list">
          @for (record of mock.attendance(); track record.memberId) {
            <div [class]="'att-row att-' + record.status">
              <div class="att-info">
                <span class="att-name">{{ record.memberName }}</span>
                @if (record.arrivalTime) {
                  <span class="att-time">Arrivée : {{ record.arrivalTime }}</span>
                }
                @if (record.lateMinutes && record.lateMinutes > 0) {
                  <span class="att-late-info">{{ record.lateMinutes }} min de retard</span>
                }
                @if (record.absenceReason) {
                  <span class="att-reason">{{ record.absenceReason }}</span>
                }
              </div>
              <div class="att-actions">
                <app-badge [variant]="statusVariant(record.status)" size="sm">{{ statusLabel(record.status) }}</app-badge>
                @if (record.hasJustification) {
                  <app-badge variant="info" size="sm">📎 Justif.</app-badge>
                }
                @if (!mock.attendanceFinalized()) {
                  <select class="status-select" [value]="record.status" (change)="updateStatus(record.memberId, $any($event.target).value)">
                    <option value="present">Présent</option>
                    <option value="late">En retard</option>
                    <option value="absent_excused">Absent excusé</option>
                    <option value="absent_unexcused">Absent non excusé</option>
                  </select>
                }
              </div>
            </div>
          }
        </div>
      </div>
    </app-card>

    <!-- Auto-sanction info -->
    @if (mock.attendanceFinalized()) {
      <app-card>
        <div class="card-body">
          <h2 class="section-title">⚖️ Sanctions automatiques</h2>
          <p class="auto-info">Les sanctions suivantes seront appliquées automatiquement :</p>
          <div class="sanction-list">
            @for (record of mock.attendance(); track record.memberId) {
              @if (record.status === 'absent_unexcused') {
                <div class="sanction-row">
                  <span class="sanction-name">{{ record.memberName }}</span>
                  <span class="sanction-type">Absence non excusée</span>
                  <app-badge variant="danger" size="sm">5 000 XAF</app-badge>
                </div>
              }
              @if (record.status === 'late' && record.lateMinutes && record.lateMinutes > 15) {
                <div class="sanction-row">
                  <span class="sanction-name">{{ record.memberName }}</span>
                  <span class="sanction-type">Retard > 15 min</span>
                  <app-badge variant="warning" size="sm">2 000 XAF</app-badge>
                </div>
              }
            }
          </div>
        </div>
      </app-card>
    }
  `,
  styles: [`
    @reference "tailwindcss";
    .page-header { @apply flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6; }
    .page-title { @apply text-2xl font-bold text-slate-900; }
    .page-subtitle { @apply text-sm text-slate-500 mt-1; }
    .header-actions { @apply flex items-center gap-3; }

    .summary-grid { @apply grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4; }
    .summary-card { @apply flex flex-col items-center p-4 rounded-xl; }
    .summary-count { @apply text-3xl font-bold; }
    .summary-label { @apply text-xs mt-1 text-slate-600; }
    .card-present { @apply bg-green-50; }
    .card-present .summary-count { @apply text-green-700; }
    .card-late { @apply bg-amber-50; }
    .card-late .summary-count { @apply text-amber-700; }
    .card-excused { @apply bg-blue-50; }
    .card-excused .summary-count { @apply text-blue-700; }
    .card-unexcused { @apply bg-red-50; }
    .card-unexcused .summary-count { @apply text-red-700; }

    .quorum-info { @apply mb-6 text-center; }
    .quorum-ok { @apply text-green-700 text-sm font-medium; }
    .quorum-ko { @apply text-amber-700 text-sm font-medium; }

    .card-body { @apply p-2; }
    .section-title { @apply text-base font-semibold text-slate-900 mb-3; }

    .attendance-list { @apply space-y-1; }
    .att-row { @apply flex items-center justify-between p-3 rounded-lg border-b border-slate-100 last:border-none; }
    .att-present { @apply bg-green-50/50; }
    .att-late { @apply bg-amber-50/50; }
    .att-absent_excused { @apply bg-blue-50/50; }
    .att-absent_unexcused { @apply bg-red-50/50; }
    .att-info { @apply flex flex-col gap-0.5; }
    .att-name { @apply text-sm font-medium text-slate-800; }
    .att-time { @apply text-xs text-slate-500; }
    .att-late-info { @apply text-xs text-amber-600; }
    .att-reason { @apply text-xs text-slate-500 italic; }
    .att-actions { @apply flex items-center gap-2; }
    .status-select { @apply text-xs border border-slate-300 rounded px-2 py-1; }

    .auto-info { @apply text-sm text-slate-600 mb-3; }
    .sanction-list { @apply space-y-1; }
    .sanction-row { @apply flex items-center justify-between p-2 rounded bg-slate-50; }
    .sanction-name { @apply text-sm font-medium text-slate-800; }
    .sanction-type { @apply text-xs text-slate-500; }
  `],
})
export class AttendanceComponent {
  protected readonly mock = inject(MockDataService);

  statusVariant(status: string): 'success' | 'warning' | 'info' | 'danger' {
    if (status === 'present') return 'success';
    if (status === 'late') return 'warning';
    if (status === 'absent_excused') return 'info';
    return 'danger';
  }

  statusLabel(status: string): string {
    if (status === 'present') return 'Présent';
    if (status === 'late') return 'En retard';
    if (status === 'absent_excused') return 'Absent excusé';
    if (status === 'absent_unexcused') return 'Absent non excusé';
    return status;
  }

  updateStatus(memberId: string, status: AttendanceRecord['status']): void {
    this.mock.updateAttendance(memberId, status);
  }

  finalizeAttendance(): void {
    this.mock.finalizeAttendance();
  }
}

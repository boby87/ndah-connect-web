import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  resource,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { SpinnerComponent } from '../../../../shared/components/ui/spinner/spinner.component';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { CycleStatus, CYCLE_STATUS_LABELS } from '../../../../core/enums/cycle-status.enum';
import { SessionStatus, SESSION_STATUS_LABELS } from '../../../../core/enums/session-status.enum';
import { MemberService } from '../../services/member.service';
import type { Cycle } from '../../../../shared/models/entities/cycle.model';
import type { MemberSessionView } from '../../../../shared/models/entities/member-session-view.model';

@Component({
  selector: 'tc-my-sessions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [BadgeComponent, CardComponent, SpinnerComponent, DateFormatPipe],
  templateUrl: './my-sessions.component.html',
})
export class MySessionsComponent {
  private readonly memberService = inject(MemberService);
  private readonly router = inject(Router);

  protected readonly CycleStatus = CycleStatus;
  protected readonly CYCLE_STATUS_LABELS = CYCLE_STATUS_LABELS;
  protected readonly SESSION_STATUS_LABELS = SESSION_STATUS_LABELS;
  protected readonly SessionStatus = SessionStatus;

  readonly cyclesResource = resource({ loader: () => this.memberService.getCycles() });
  readonly cycles = computed(() =>
    (this.cyclesResource.value() ?? []).slice().sort((a, b) => b.number - a.number),
  );

  readonly expandedCycleId = signal<string>('');
  readonly selectedCycleId = signal<string | undefined>(undefined);

  readonly sessionsResource = resource<MemberSessionView[], string | undefined>({
    params: () => this.selectedCycleId(),
    loader: async ({ params: cycleId }) => {
      if (!cycleId) return [];
      return this.memberService.getSessionsByCycle(cycleId);
    },
  });
  readonly sessions = computed(() => this.sessionsResource.value() ?? []);

  protected toggleCycle(cycleId: string): void {
    if (this.expandedCycleId() === cycleId) {
      this.expandedCycleId.set('');
      this.selectedCycleId.set(undefined);
    } else {
      this.expandedCycleId.set(cycleId);
      this.selectedCycleId.set(cycleId);
    }
  }

  protected openSession(sessionId: string): void {
    this.router.navigate(['/member/sessions', sessionId]);
  }

  protected cycleLabel(c: Cycle): string {
    return `Cycle ${c.number} — ${new Date(c.startDate).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}`;
  }

  protected cycleKind(status: CycleStatus): 'success' | 'warning' | 'neutral' {
    if (status === CycleStatus.ACTIVE) return 'success';
    if (status === CycleStatus.CLOSURE_REQUESTED) return 'warning';
    return 'neutral';
  }

  protected sessionKind(status: SessionStatus): 'success' | 'warning' | 'info' | 'neutral' {
    if (status === SessionStatus.COMPLETED || status === SessionStatus.VALIDATED) return 'success';
    if (status === SessionStatus.IN_PROGRESS) return 'info';
    if (status === SessionStatus.CANCELLED) return 'warning';
    return 'neutral';
  }
}

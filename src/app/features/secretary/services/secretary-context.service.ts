import { Injectable, computed, inject, resource } from '@angular/core';
import { CycleStatus } from '../../../core/enums/cycle-status.enum';
import type { Session } from '../../../shared/models/entities/session.model';
import { SecretaryService } from './secretary.service';

export type SecretaryContextState = 'loading' | 'no-cycle' | 'no-session' | 'ready';

@Injectable({ providedIn: 'root' })
export class SecretaryContextService {
  private readonly secretaryService = inject(SecretaryService);

  readonly cyclesResource = resource({
    loader: () => this.secretaryService.getCycles(),
  });

  readonly cycles = computed(() => this.cyclesResource.value() ?? []);

  readonly activeCycle = computed(() =>
    this.cycles().find(c => c.status === CycleStatus.ACTIVE) ?? null,
  );

  readonly sessionsResource = resource<Session[], string | undefined>({
    params: () => this.activeCycle()?.id,
    loader: async ({ params: cycleId }) => {
      if (!cycleId) return [];
      return this.secretaryService.getSessionsByCycle(cycleId);
    },
  });

  readonly sessions = computed(() => this.sessionsResource.value() ?? []);

  readonly contextState = computed((): SecretaryContextState => {
    if (this.cyclesResource.isLoading() || this.sessionsResource.isLoading()) return 'loading';
    if (!this.activeCycle()) return 'no-cycle';
    if (this.sessions().length === 0) return 'no-session';
    return 'ready';
  });
}

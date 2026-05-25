import { ChangeDetectionStrategy, Component, computed, inject, resource } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { EmptyStateComponent } from '../../../../shared/components/ui/empty-state/empty-state.component';
import { SpinnerComponent } from '../../../../shared/components/ui/spinner/spinner.component';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { SecretaryService } from '../../services/secretary.service';
import type { MinutesDraftStatus } from '../../../../shared/models/entities/minutes-draft.model';

const STATUS_LABELS: Record<MinutesDraftStatus, string> = {
  DRAFT: 'Brouillon',
  SECRETARY_SIGNED: 'Signé Secrétaire',
  PRESIDENT_SIGNED: 'Signé Président',
  PUBLISHED: 'Publié',
  CHANGES_REQUESTED: 'Modifications demandées',
};

@Component({
  selector: 'tc-minutes-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, BadgeComponent, CardComponent, EmptyStateComponent, SpinnerComponent, DateFormatPipe],
  templateUrl: './minutes-list.component.html',
})
export class MinutesListComponent {
  private readonly service = inject(SecretaryService);

  protected readonly STATUS_LABELS = STATUS_LABELS;

  readonly resource = resource({
    loader: () => this.service.getMinutesDrafts(),
  });

  readonly drafts = computed(() =>
    [...(this.resource.value() ?? [])].sort(
      (a, b) => new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime(),
    ),
  );

  statusKind(s: MinutesDraftStatus): 'success' | 'info' | 'warning' | 'neutral' {
    if (s === 'PUBLISHED' || s === 'PRESIDENT_SIGNED') return 'success';
    if (s === 'SECRETARY_SIGNED') return 'info';
    if (s === 'CHANGES_REQUESTED') return 'warning';
    return 'neutral';
  }
}

import { ChangeDetectionStrategy, Component, computed, inject, resource, signal } from '@angular/core';
import { AlertComponent } from '../../../../shared/components/ui/alert/alert.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { EmptyStateComponent } from '../../../../shared/components/ui/empty-state/empty-state.component';
import { TextareaComponent } from '../../../../shared/components/ui/textarea/textarea.component';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { NotificationService } from '../../../../core/services/notification.service';
import { SecretaryService } from '../../services/secretary.service';
import type { MembershipFileKind } from '../../../../shared/models/entities/membership.model';
import { formatApiError } from '../../../../core/utils';

type Tab = 'ALL' | MembershipFileKind;

const KIND_LABELS: Record<MembershipFileKind, string> = {
  ADHESION: 'Adhésion',
  RESIGNATION: 'Démission',
  EXCLUSION: 'Radiation',
};

@Component({
  selector: 'tc-membership-review',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AlertComponent,
    BadgeComponent,
    ButtonComponent,
    CardComponent,
    EmptyStateComponent,
    TextareaComponent,
    DateFormatPipe,
  ],
  templateUrl: './membership-review.component.html',
})
export class MembershipReviewComponent {
  private readonly service = inject(SecretaryService);
  private readonly notifications = inject(NotificationService);

  protected readonly KIND_LABELS = KIND_LABELS;

  readonly active = signal<Tab>('ALL');

  readonly tabs: { label: string; value: Tab }[] = [
    { label: 'Tout', value: 'ALL' },
    { label: 'Adhésions', value: 'ADHESION' },
    { label: 'Démissions', value: 'RESIGNATION' },
    { label: 'Radiations', value: 'EXCLUSION' },
  ];

  readonly resource = resource({
    loader: () => this.service.getMembershipFiles(),
  });

  readonly items = computed(() => this.resource.value() ?? []);

  readonly visibleItems = computed(() => {
    const f = this.active();
    if (f === 'ALL') return this.items();
    return this.items().filter((i) => i.kind === f);
  });

  readonly activeFile = signal<string | null>(null);
  readonly rejectMode = signal(false);
  readonly comment = signal('');
  readonly commentTouched = signal(false);
  readonly acting = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);

  readonly commentError = computed(() =>
    this.comment().trim().length === 0 ? 'Commentaire obligatoire.' : '',
  );

  countFor(value: Tab): number {
    if (value === 'ALL') return this.items().length;
    return this.items().filter((i) => i.kind === value).length;
  }

  tabClass(value: Tab): string {
    const base = 'inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium border';
    return `${base} ${this.active() === value ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`;
  }

  kindKind(k: MembershipFileKind): 'info' | 'warning' | 'danger' {
    return ({ ADHESION: 'info', RESIGNATION: 'warning', EXCLUSION: 'danger' } as const)[k];
  }

  canAct(status: string): boolean {
    return status === 'SUBMITTED' || status === 'BUREAU_REVIEW';
  }

  open(id: string): void {
    this.activeFile.set(id);
    this.rejectMode.set(false);
    this.comment.set('');
    this.commentTouched.set(false);
  }

  cancel(): void {
    this.activeFile.set(null);
  }

  async forward(id: string): Promise<void> {
    this.acting.set(`${id}:fwd`);
    this.errorMessage.set(null);
    try {
      await this.service.reviewMembership(id, 'FORWARD', this.comment().trim() || undefined);
      this.notifications.success('Dossier transmis.');
      this.activeFile.set(null);
      this.resource.reload();
    } catch (e: unknown) {
      this.errorMessage.set(formatApiError(e, 'Erreur.'));
    } finally {
      this.acting.set(null);
    }
  }

  async reject(id: string): Promise<void> {
    this.rejectMode.set(true);
    this.commentTouched.set(true);
    if (this.commentError()) return;
    this.acting.set(`${id}:rej`);
    this.errorMessage.set(null);
    try {
      await this.service.reviewMembership(id, 'REJECT', this.comment().trim());
      this.notifications.success('Dossier rejeté.');
      this.activeFile.set(null);
      this.resource.reload();
    } catch (e: unknown) {
      this.errorMessage.set(formatApiError(e, 'Erreur.'));
    } finally {
      this.acting.set(null);
    }
  }
}

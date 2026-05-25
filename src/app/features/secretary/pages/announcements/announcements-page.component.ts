import { ChangeDetectionStrategy, Component, computed, inject, resource, signal } from '@angular/core';
import { AlertComponent } from '../../../../shared/components/ui/alert/alert.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { EmptyStateComponent } from '../../../../shared/components/ui/empty-state/empty-state.component';
import { InputComponent } from '../../../../shared/components/ui/input/input.component';
import { TextareaComponent } from '../../../../shared/components/ui/textarea/textarea.component';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { NotificationService } from '../../../../core/services/notification.service';
import { SecretaryService } from '../../services/secretary.service';
import type {
  AnnouncementAudience,
} from '../../../../shared/models/entities/announcement.model';

type Channel = 'IN_APP' | 'SMS' | 'EMAIL';

const AUDIENCE_OPTIONS: { value: AnnouncementAudience; label: string }[] = [
  { value: 'ALL', label: 'Toute la tontine' },
  { value: 'BUREAU', label: 'Bureau uniquement' },
  { value: 'MEMBERS', label: 'Membres uniquement' },
];

const CHANNEL_LABELS: Record<Channel, string> = {
  IN_APP: 'Notification in-app',
  SMS: 'SMS',
  EMAIL: 'Email',
};

@Component({
  selector: 'tc-secretary-announcements',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AlertComponent,
    BadgeComponent,
    ButtonComponent,
    CardComponent,
    EmptyStateComponent,
    InputComponent,
    TextareaComponent,
    DateFormatPipe,
  ],
  templateUrl: './announcements-page.component.html',
})
export class SecretaryAnnouncementsComponent {
  private readonly service = inject(SecretaryService);
  private readonly notifications = inject(NotificationService);

  protected readonly audienceOptions = AUDIENCE_OPTIONS;
  protected readonly channels: Channel[] = ['IN_APP', 'SMS', 'EMAIL'];

  readonly resource = resource({
    loader: () => this.service.getAnnouncements(),
  });

  readonly announcements = computed(() => this.resource.value() ?? []);

  readonly title = signal('');
  readonly titleTouched = signal(false);
  readonly body = signal('');
  readonly bodyTouched = signal(false);
  readonly audience = signal<AnnouncementAudience>('ALL');
  readonly selectedChannels = signal<Channel[]>(['IN_APP']);

  readonly submitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly titleError = computed(() => (this.title().trim() ? '' : 'Titre requis.'));
  readonly bodyError = computed(() => (this.body().trim() ? '' : 'Message requis.'));
  readonly channelsError = computed(() =>
    this.selectedChannels().length === 0 ? 'Au moins un canal requis.' : '',
  );

  audienceLabel(value: AnnouncementAudience): string {
    return AUDIENCE_OPTIONS.find((o) => o.value === value)?.label ?? value;
  }

  channelLabel(c: Channel | string): string {
    return CHANNEL_LABELS[c as Channel] ?? c;
  }

  toggleChannel(c: Channel, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.selectedChannels.update((list) =>
      isChecked ? [...list, c] : list.filter((x) => x !== c),
    );
  }

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.titleTouched.set(true);
    this.bodyTouched.set(true);
    this.errorMessage.set(null);

    if (this.titleError() || this.bodyError() || this.channelsError()) return;

    this.submitting.set(true);
    try {
      await this.service.createAnnouncement({
        title: this.title().trim(),
        body: this.body().trim(),
        audience: this.audience(),
        channels: this.selectedChannels(),
      });
      this.notifications.success('Annonce publiée.');
      this.title.set('');
      this.body.set('');
      this.titleTouched.set(false);
      this.bodyTouched.set(false);
      this.resource.reload();
    } catch (e: unknown) {
      this.errorMessage.set((e as { error?: { message?: string } })?.error?.message ?? 'Erreur.');
    } finally {
      this.submitting.set(false);
    }
  }
}

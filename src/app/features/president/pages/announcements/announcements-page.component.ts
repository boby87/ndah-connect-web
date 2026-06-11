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
import { PresidentService } from '../../services/president.service';
import type {
  AnnouncementAudience,
  AnnouncementChannel,
} from '../../../../shared/models/entities/announcement.model';
import { formatApiError } from '../../../../core/utils';

const AUDIENCE_OPTIONS: { value: AnnouncementAudience; label: string }[] = [
  { value: 'ALL', label: 'Toute la tontine' },
  { value: 'BUREAU', label: 'Bureau uniquement' },
  { value: 'MEMBERS', label: 'Membres uniquement' },
];

const CHANNEL_OPTIONS: { value: AnnouncementChannel; label: string }[] = [
  { value: 'IN_APP', label: 'Notification in-app' },
  { value: 'SMS', label: 'SMS' },
  { value: 'EMAIL', label: 'Email' },
];

@Component({
  selector: 'tc-announcements-page',
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
  template: `
    <div class="space-y-6">
      <header>
        <h1 class="text-2xl font-bold text-gray-900">Annonces</h1>
        <p class="text-sm text-gray-500">
          Communiquez officiellement avec les membres de la tontine.
        </p>
      </header>

      <div class="grid gap-6 lg:grid-cols-3">
        <div class="lg:col-span-2">
          <tc-card title="Historique des annonces">
            @if (resource.isLoading()) {
              <p class="text-sm text-gray-500">Chargement…</p>
            } @else if (announcements().length === 0) {
              <tc-empty-state title="Aucune annonce" icon="📢" description="Publiez votre première annonce." />
            } @else {
              <ul class="divide-y divide-gray-100">
                @for (a of announcements(); track a.id) {
                  <li class="py-4 first:pt-0 last:pb-0">
                    <div class="flex flex-wrap items-start justify-between gap-2">
                      <p class="font-semibold text-gray-900">{{ a.title }}</p>
                      <span class="text-xs text-gray-500">{{ a.publishedAt | tcDate: true }}</span>
                    </div>
                    <p class="mt-1 text-sm text-gray-700 whitespace-pre-wrap">{{ a.body }}</p>
                    <div class="mt-2 flex flex-wrap items-center gap-2 text-xs">
                      <tc-badge kind="info">{{ audienceLabel(a.audience) }}</tc-badge>
                      @for (c of a.channels; track c) {
                        <tc-badge kind="neutral">{{ channelLabel(c) }}</tc-badge>
                      }
                      <span class="text-gray-400">· par {{ a.authorFullName }}</span>
                    </div>
                  </li>
                }
              </ul>
            }
          </tc-card>
        </div>

        <aside>
          <tc-card title="Publier une annonce">
            @if (errorMessage(); as err) {
              <tc-alert kind="error">{{ err }}</tc-alert>
            }
            <form class="space-y-4 mt-2" (submit)="onSubmit($event)">
              <tc-input
                label="Titre"
                [(value)]="title"
                [(touched)]="titleTouched"
                [error]="titleError()"
                [required]="true"
              />
              <tc-textarea
                label="Message"
                [(value)]="body"
                [(touched)]="bodyTouched"
                [error]="bodyError()"
                [required]="true"
                [rows]="5"
              />

              <div>
                <p class="text-sm font-medium text-gray-700 mb-1">Audience</p>
                <div class="space-y-1">
                  @for (opt of audienceOptions; track opt.value) {
                    <label class="flex items-center gap-2 text-sm">
                      <input type="radio" name="audience" [checked]="audience() === opt.value" (change)="audience.set(opt.value)" />
                      {{ opt.label }}
                    </label>
                  }
                </div>
              </div>

              <div>
                <p class="text-sm font-medium text-gray-700 mb-1">Canaux de diffusion</p>
                <div class="space-y-1">
                  @for (opt of channelOptions; track opt.value) {
                    <label class="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        [checked]="channels().includes(opt.value)"
                        (change)="toggleChannel(opt.value, $event)"
                      />
                      {{ opt.label }}
                    </label>
                  }
                </div>
                @if (channelsError()) {
                  <p class="text-xs text-red-600 mt-1">{{ channelsError() }}</p>
                }
              </div>

              <tc-button type="submit" variant="primary" [fullWidth]="true" [loading]="submitting()">
                Publier
              </tc-button>
            </form>
          </tc-card>
        </aside>
      </div>
    </div>
  `,
})
export class AnnouncementsPageComponent {
  private readonly service = inject(PresidentService);
  private readonly notifications = inject(NotificationService);

  readonly audienceOptions = AUDIENCE_OPTIONS;
  readonly channelOptions = CHANNEL_OPTIONS;

  readonly resource = resource({
    loader: () => this.service.getAnnouncements(),
  });

  readonly announcements = computed(() => this.resource.value() ?? []);

  readonly title = signal('');
  readonly body = signal('');
  readonly audience = signal<AnnouncementAudience>('ALL');
  readonly channels = signal<AnnouncementChannel[]>(['IN_APP']);
  readonly titleTouched = signal(false);
  readonly bodyTouched = signal(false);
  readonly submitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly titleError = computed(() =>
    this.title().trim().length === 0 ? 'Titre requis.' : '',
  );
  readonly bodyError = computed(() =>
    this.body().trim().length === 0 ? 'Message requis.' : '',
  );
  readonly channelsError = computed(() =>
    this.channels().length === 0 ? 'Choisissez au moins un canal.' : '',
  );

  audienceLabel(audience: AnnouncementAudience): string {
    return AUDIENCE_OPTIONS.find((o) => o.value === audience)?.label ?? audience;
  }

  channelLabel(channel: AnnouncementChannel): string {
    return CHANNEL_OPTIONS.find((o) => o.value === channel)?.label ?? channel;
  }

  toggleChannel(channel: AnnouncementChannel, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.channels.update((list) => (checked ? [...list, channel] : list.filter((c) => c !== channel)));
  }

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.titleTouched.set(true);
    this.bodyTouched.set(true);
    this.errorMessage.set(null);

    if (this.titleError() || this.bodyError() || this.channelsError()) {
      return;
    }

    this.submitting.set(true);
    try {
      await this.service.createAnnouncement({
        title: this.title().trim(),
        body: this.body().trim(),
        audience: this.audience(),
        channels: this.channels(),
      });
      this.notifications.success('Annonce publiée.');
      this.title.set('');
      this.body.set('');
      this.titleTouched.set(false);
      this.bodyTouched.set(false);
      this.resource.reload();
    } catch (error: unknown) {
      const msg =
        formatApiError(error, 'Publication impossible.');
      this.errorMessage.set(msg);
    } finally {
      this.submitting.set(false);
    }
  }
}

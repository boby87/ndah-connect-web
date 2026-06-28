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
import { SecretaryContextService } from '../../services/secretary-context.service';
import { RequiresCycleComponent } from '../../components/requires-cycle/requires-cycle.component';
import {
  CONVOCATION_CHANNEL_LABELS,
  type Convocation,
  type ConvocationChannel,
} from '../../../../shared/models/entities/convocation.model';
import { SecretaryService } from '../../services/secretary.service';
import { formatApiError } from '../../../../core/utils';

const CHANNELS: ConvocationChannel[] = ['IN_APP', 'SMS', 'EMAIL', 'WHATSAPP'];

@Component({
  selector: 'tc-convocations-page',
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
    RequiresCycleComponent,
  ],
  templateUrl: './convocations-page.component.html',
})
export class ConvocationsPageComponent {
  private readonly service = inject(SecretaryService);
  private readonly notifications = inject(NotificationService);

  protected readonly ctx = inject(SecretaryContextService);

  protected readonly channels = CHANNELS;
  protected readonly CONVOCATION_CHANNEL_LABELS = CONVOCATION_CHANNEL_LABELS;

  readonly resource = resource({
    loader: () => this.service.getConvocations(),
  });

  readonly convocations = computed(() => this.resource.value() ?? []);

  readonly sessionId = signal('session-2');
  readonly sessionTouched = signal(false);
  readonly message = signal('Vous êtes convoqué(e) à la prochaine séance ordinaire de notre tontine.');
  readonly messageTouched = signal(false);
  readonly selectedChannels = signal<ConvocationChannel[]>(['IN_APP', 'SMS']);
  readonly includeCandidates = signal(false);
  readonly scheduleFor = signal('');

  readonly submitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly sessionError = computed(() => (this.sessionId().trim() ? '' : 'Séance requise.'));
  readonly messageError = computed(() => (this.message().trim() ? '' : 'Message requis.'));
  readonly channelsError = computed(() =>
    this.selectedChannels().length === 0 ? 'Au moins un canal requis.' : '',
  );

  checked(event: Event): boolean {
    return (event.target as HTMLInputElement).checked;
  }

  toggleChannel(ch: ConvocationChannel, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.selectedChannels.update((list) =>
      isChecked ? [...list, ch] : list.filter((c) => c !== ch),
    );
  }

  statusLabel(s: Convocation['status']): string {
    return { DRAFT: 'Brouillon', SCHEDULED: 'Programmée', SENT: 'Envoyée' }[s];
  }

  statusKind(s: Convocation['status']): 'neutral' | 'info' | 'success' {
    return { DRAFT: 'neutral', SCHEDULED: 'info', SENT: 'success' }[s] as 'neutral' | 'info' | 'success';
  }

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.sessionTouched.set(true);
    this.messageTouched.set(true);
    this.errorMessage.set(null);

    if (this.sessionError() || this.messageError() || this.channelsError()) return;

    this.submitting.set(true);
    try {
      await this.service.createConvocation({
        sessionId: this.sessionId().trim(),
        channels: this.selectedChannels(),
        audienceMemberIds: ['member-1', 'member-2', 'member-3'], // tous membres actifs
        includeCandidates: this.includeCandidates(),
        message: this.message().trim(),
        scheduledAt: this.scheduleFor()
          ? new Date(this.scheduleFor()).toISOString()
          : undefined,
      });
      this.notifications.success('Convocation enregistrée.');
      this.scheduleFor.set('');
      this.resource.reload();
    } catch (e: unknown) {
      this.errorMessage.set(formatApiError(e, 'Erreur.'));
    } finally {
      this.submitting.set(false);
    }
  }
}

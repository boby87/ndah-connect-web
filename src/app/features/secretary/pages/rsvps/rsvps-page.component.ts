import { DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  resource,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { AlertComponent } from '../../../../shared/components/ui/alert/alert.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { SpinnerComponent } from '../../../../shared/components/ui/spinner/spinner.component';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { NotificationService } from '../../../../core/services/notification.service';
import {
  RSVP_STATUS_LABELS,
  type RsvpStatus,
} from '../../../../shared/models/entities/rsvp.model';
import { SecretaryService } from '../../services/secretary.service';
import { formatApiError } from '../../../../core/utils';

@Component({
  selector: 'tc-rsvps-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DecimalPipe,
    RouterLink,
    AlertComponent,
    ButtonComponent,
    CardComponent,
    SpinnerComponent,
    DateFormatPipe,
  ],
  templateUrl: './rsvps-page.component.html',
})
export class RsvpsPageComponent {
  readonly id = input.required<string>();
  protected readonly RSVP_STATUS_LABELS = RSVP_STATUS_LABELS;
  protected readonly statuses: RsvpStatus[] = ['CONFIRMED', 'TENTATIVE', 'DECLINED', 'PENDING'];

  private readonly service = inject(SecretaryService);
  private readonly notifications = inject(NotificationService);

  readonly resource = resource({
    params: () => this.id(),
    loader: ({ params }) => this.service.getRsvps(params),
  });

  readonly summary = computed(() => this.resource.value());

  readonly actingMember = signal<string | null>(null);
  readonly remindLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  rsvpButtonClass(current: RsvpStatus, target: RsvpStatus): string {
    const base = 'rounded-full px-3 py-1 text-xs border transition-colors';
    if (current === target) {
      const color = {
        CONFIRMED: 'bg-green-600 text-white border-green-600',
        TENTATIVE: 'bg-amber-500 text-white border-amber-500',
        DECLINED: 'bg-red-600 text-white border-red-600',
        PENDING: 'bg-gray-400 text-white border-gray-400',
      };
      return `${base} ${color[target]}`;
    }
    return `${base} bg-white text-gray-700 border-gray-300 hover:bg-gray-50`;
  }

  async setStatus(memberId: string, status: RsvpStatus): Promise<void> {
    this.actingMember.set(memberId);
    this.errorMessage.set(null);
    try {
      await this.service.setRsvp(this.id(), memberId, status);
      this.resource.reload();
    } catch (e: unknown) {
      this.errorMessage.set(formatApiError(e, 'Erreur.'));
    } finally {
      this.actingMember.set(null);
    }
  }

  async remindPending(): Promise<void> {
    this.remindLoading.set(true);
    try {
      const result = await this.service.remindPendingRsvps(this.id());
      this.notifications.success(`${result.remindersSent} rappel(s) envoyé(s).`);
    } catch (e: unknown) {
      this.errorMessage.set(formatApiError(e, 'Erreur.'));
    } finally {
      this.remindLoading.set(false);
    }
  }
}

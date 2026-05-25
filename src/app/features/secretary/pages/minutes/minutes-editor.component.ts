import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  resource,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { AlertComponent } from '../../../../shared/components/ui/alert/alert.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { SpinnerComponent } from '../../../../shared/components/ui/spinner/spinner.component';
import { TextareaComponent } from '../../../../shared/components/ui/textarea/textarea.component';
import { CurrencyXafPipe } from '../../../../shared/pipes/currency-xaf.pipe';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { NotificationService } from '../../../../core/services/notification.service';
import { SecretaryService } from '../../services/secretary.service';
import type { MinutesSection } from '../../../../shared/models/entities/minutes-draft.model';

@Component({
  selector: 'tc-minutes-editor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    AlertComponent,
    BadgeComponent,
    ButtonComponent,
    CardComponent,
    SpinnerComponent,
    TextareaComponent,
    CurrencyXafPipe,
    DateFormatPipe,
  ],
  templateUrl: './minutes-editor.component.html',
})
export class MinutesEditorComponent {
  readonly id = input.required<string>();

  private readonly service = inject(SecretaryService);
  private readonly notifications = inject(NotificationService);

  readonly resource = resource({
    params: () => this.id(),
    loader: ({ params }) => this.service.getMinutes(params),
  });

  readonly draft = computed(() => this.resource.value());
  readonly editableSections = signal<MinutesSection[]>([]);

  readonly saving = signal(false);
  readonly signing = signal(false);
  readonly errorMessage = signal<string | null>(null);

  constructor() {
    effect(() => {
      const d = this.draft();
      if (d && this.editableSections().length === 0) {
        this.editableSections.set(d.sections.map((s) => ({ ...s })));
      }
    });
  }

  updateSection(index: number, content: string): void {
    this.editableSections.update((list) =>
      list.map((s, i) => (i === index ? { ...s, content } : s)),
    );
  }

  async save(): Promise<void> {
    this.saving.set(true);
    this.errorMessage.set(null);
    try {
      await this.service.saveMinutes(this.id(), this.editableSections());
      this.notifications.success('PV sauvegardé.');
      this.resource.reload();
    } catch (e: unknown) {
      this.errorMessage.set((e as { error?: { message?: string } })?.error?.message ?? 'Erreur.');
    } finally {
      this.saving.set(false);
    }
  }

  async sign(): Promise<void> {
    this.signing.set(true);
    this.errorMessage.set(null);
    try {
      await this.service.saveMinutes(this.id(), this.editableSections());
      await this.service.signMinutes(this.id());
      this.notifications.success('PV signé. En attente du Président.');
      this.resource.reload();
    } catch (e: unknown) {
      this.errorMessage.set((e as { error?: { message?: string } })?.error?.message ?? 'Erreur.');
    } finally {
      this.signing.set(false);
    }
  }
}

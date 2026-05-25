import { ChangeDetectionStrategy, Component, computed, inject, resource, signal } from '@angular/core';
import { AlertComponent } from '../../../../shared/components/ui/alert/alert.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { EmptyStateComponent } from '../../../../shared/components/ui/empty-state/empty-state.component';
import { InputComponent } from '../../../../shared/components/ui/input/input.component';
import { CurrencyXafPipe } from '../../../../shared/pipes/currency-xaf.pipe';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { PhoneFormatPipe } from '../../../../shared/pipes/phone-format.pipe';
import { StatusLabelPipe } from '../../../../shared/pipes/status-label.pipe';
import { NotificationService } from '../../../../core/services/notification.service';
import { MemberStatus } from '../../../../core/enums/member-status.enum';
import { SecretaryService } from '../../services/secretary.service';

@Component({
  selector: 'tc-members-registry',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AlertComponent,
    BadgeComponent,
    ButtonComponent,
    CardComponent,
    EmptyStateComponent,
    InputComponent,
    CurrencyXafPipe,
    DateFormatPipe,
    PhoneFormatPipe,
    StatusLabelPipe,
  ],
  templateUrl: './members-registry.component.html',
})
export class MembersRegistryComponent {
  private readonly service = inject(SecretaryService);
  private readonly notifications = inject(NotificationService);

  readonly resource = resource({
    loader: () => this.service.getMembers(),
  });

  readonly members = computed(() =>
    [...(this.resource.value() ?? [])].sort((a, b) => a.lastName.localeCompare(b.lastName)),
  );

  readonly editingId = signal<string | null>(null);
  readonly editMatricule = signal('');
  readonly editPhone = signal('');
  readonly editEmail = signal('');

  readonly saving = signal(false);
  readonly errorMessage = signal<string | null>(null);

  statusKind(s: MemberStatus): 'success' | 'warning' | 'danger' | 'neutral' {
    if (s === MemberStatus.ACTIVE) return 'success';
    if (s === MemberStatus.PENDING) return 'warning';
    if (s === MemberStatus.SUSPENDED || s === MemberStatus.EXCLUDED) return 'danger';
    return 'neutral';
  }

  edit(member: { id: string; matricule: string; phone: string; email?: string }): void {
    this.editingId.set(member.id);
    this.editMatricule.set(member.matricule);
    this.editPhone.set(member.phone);
    this.editEmail.set(member.email ?? '');
  }

  cancel(): void {
    this.editingId.set(null);
  }

  async save(id: string): Promise<void> {
    this.saving.set(true);
    this.errorMessage.set(null);
    try {
      await this.service.patchMember(id, {
        matricule: this.editMatricule().trim(),
        phone: this.editPhone().trim(),
        email: this.editEmail().trim() || undefined,
      });
      this.notifications.success('Registre mis à jour.');
      this.editingId.set(null);
      this.resource.reload();
    } catch (e: unknown) {
      this.errorMessage.set((e as { error?: { message?: string } })?.error?.message ?? 'Erreur.');
    } finally {
      this.saving.set(false);
    }
  }
}

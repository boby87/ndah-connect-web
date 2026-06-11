import { ChangeDetectionStrategy, Component, computed, inject, resource, signal } from '@angular/core';
import { AlertComponent } from '../../../../shared/components/ui/alert/alert.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { EmptyStateComponent } from '../../../../shared/components/ui/empty-state/empty-state.component';
import { InputComponent } from '../../../../shared/components/ui/input/input.component';
import { CurrencyXafPipe } from '../../../../shared/pipes/currency-xaf.pipe';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { NotificationService } from '../../../../core/services/notification.service';
import type {
  CertificationDecision,
  CertificationScope,
} from '../../../../shared/models/entities/auditor.model';
import { AuditorService } from '../../services/auditor.service';
import { formatApiError } from '../../../../core/utils';

@Component({
  selector: 'tc-auditor-certifications',
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
  ],
  templateUrl: './certifications-page.component.html',
})
export class AuditorCertificationsPageComponent {
  private readonly service = inject(AuditorService);
  private readonly notifications = inject(NotificationService);

  readonly resource = resource({
    loader: () => this.service.getCertifications(),
  });
  readonly certifications = computed(() => this.resource.value() ?? []);

  readonly scope = signal<CertificationScope>('CYCLE');
  readonly periodLabel = signal('');
  readonly decision = signal<CertificationDecision>('CERTIFIED');
  readonly reserves = signal('');
  readonly otp = signal('');
  readonly submitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  decisionBadge(d: CertificationDecision): 'success' | 'warning' | 'danger' {
    if (d === 'CERTIFIED') return 'success';
    if (d === 'CERTIFIED_WITH_RESERVES') return 'warning';
    return 'danger';
  }

  decisionLabel(d: CertificationDecision): string {
    const map = {
      CERTIFIED: 'Certifié',
      CERTIFIED_WITH_RESERVES: 'Avec réserves',
      REFUSED: 'Refusé',
    };
    return map[d];
  }

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.errorMessage.set(null);
    if (!this.periodLabel().trim()) {
      this.errorMessage.set('Libellé période requis.');
      return;
    }
    if (!/^\d{4,6}$/.test(this.otp())) {
      this.errorMessage.set('OTP : 4 à 6 chiffres.');
      return;
    }
    if (this.decision() !== 'CERTIFIED' && !this.reserves().trim()) {
      this.errorMessage.set('Réserves obligatoires pour cette décision.');
      return;
    }
    this.submitting.set(true);
    try {
      await this.service.certify({
        scope: this.scope(),
        periodLabel: this.periodLabel().trim(),
        decision: this.decision(),
        reserves: this.reserves().trim() || undefined,
        otp: this.otp(),
      });
      this.notifications.success('Comptes certifiés.');
      this.periodLabel.set('');
      this.reserves.set('');
      this.otp.set('');
      this.resource.reload();
    } catch (e: unknown) {
      this.errorMessage.set(formatApiError(e, 'Erreur.'));
    } finally {
      this.submitting.set(false);
    }
  }
}

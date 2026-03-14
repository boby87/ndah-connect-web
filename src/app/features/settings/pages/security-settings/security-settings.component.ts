import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { PageHeaderComponent } from '../../../../shared/components/layout/page-header/page-header.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { PasswordChangeFormComponent, PasswordChangeValue }
  from '../../components/password-change-form/password-change-form.component';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-security-settings',
  standalone: true,
  imports: [PageHeaderComponent, CardComponent, PasswordChangeFormComponent],
  template: `
    <app-page-header title="Sécurité" subtitle="Gérez votre mot de passe et la sécurité de votre compte" backLink="/settings" />
    <div class="security-container">
      <app-password-change-form
        [isLoading]="isSubmitting()"
        (formSubmit)="onPasswordChange($event)"
      />

      <app-card>
        <div card-header>
          <h3 class="section-title">Sessions actives</h3>
          <p class="section-desc">Gérez vos appareils connectés.</p>
        </div>
        <div class="session-list">
          <div class="session-item">
            <div class="session-info">
              <span class="session-device">🖥️ Cet appareil</span>
              <span class="session-detail">Navigateur actuel · Connecté maintenant</span>
            </div>
            <span class="session-active">Actif</span>
          </div>
        </div>
      </app-card>
    </div>
  `,
  styles: `
    @reference "tailwindcss";
    .security-container { @apply p-6 max-w-4xl flex flex-col gap-6; }
    .section-title { @apply text-lg font-semibold text-slate-900 dark:text-white; }
    .section-desc { @apply text-sm text-slate-500 dark:text-slate-400 mt-1; }
    .session-list { @apply p-4; }
    .session-item { @apply flex items-center justify-between py-3; }
    .session-info { @apply flex flex-col gap-1; }
    .session-device { @apply text-sm font-medium text-slate-900 dark:text-white; }
    .session-detail { @apply text-xs text-slate-400; }
    .session-active { @apply text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecuritySettingsComponent {
  private readonly notification = inject(NotificationService);

  readonly isSubmitting = signal(false);

  async onPasswordChange(value: PasswordChangeValue): Promise<void> {
    this.isSubmitting.set(true);
    try {
      // Future: call AuthService.changePassword(value)
      await new Promise(resolve => setTimeout(resolve, 500));
      this.notification.success('Mot de passe mis à jour avec succès !');
    } catch {
      this.notification.error('Erreur lors du changement de mot de passe.');
    } finally {
      this.isSubmitting.set(false);
    }
  }
}

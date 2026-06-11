import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { isStrongPassword } from '../../../../core/utils/validation.utils';
import { AlertComponent } from '../../../../shared/components/ui/alert/alert.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { InputComponent } from '../../../../shared/components/ui/input/input.component';
import { formatApiError } from '../../../../core/utils';

@Component({
  selector: 'tc-reset-password-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, InputComponent, ButtonComponent, AlertComponent],
  template: `
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Nouveau mot de passe</h1>
      <p class="text-sm text-gray-500 mt-1">
        Définissez votre nouveau mot de passe en utilisant le code reçu.
      </p>

      <form class="mt-8 space-y-4" (submit)="onSubmit($event)">
        @if (errorMessage()) {
          <tc-alert kind="error">{{ errorMessage() }}</tc-alert>
        }
        <tc-input label="Email ou téléphone" [(value)]="identifier" [required]="true" />
        <tc-input label="Code reçu" [(value)]="code" placeholder="000000" [required]="true" />
        <tc-input
          label="Nouveau mot de passe"
          type="password"
          [(value)]="password"
          [error]="passwordError()"
          [(touched)]="passwordTouched"
          [required]="true"
        />
        <tc-button type="submit" variant="primary" [fullWidth]="true" [loading]="submitting()">
          Réinitialiser
        </tc-button>
        <p class="text-center text-sm text-gray-600">
          <a routerLink="/auth/login" class="text-blue-600 hover:underline font-medium">Retour à la connexion</a>
        </p>
      </form>
    </div>
  `,
})
export class ResetPasswordPageComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly identifier = signal(this.route.snapshot.queryParamMap.get('identifier') ?? '');
  readonly code = signal('');
  readonly password = signal('');
  readonly passwordTouched = signal(false);
  readonly submitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly passwordError = computed(() =>
    this.password() && !isStrongPassword(this.password()) ? 'Mot de passe trop faible.' : '',
  );

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.passwordTouched.set(true);
    this.errorMessage.set(null);

    if (!this.identifier() || !this.code() || this.passwordError() || !this.password()) {
      this.errorMessage.set('Veuillez compléter le formulaire correctement.');
      return;
    }

    this.submitting.set(true);
    try {
      await this.auth.resetPassword({
        identifier: this.identifier(),
        code: this.code(),
        newPassword: this.password(),
      });
      await this.router.navigateByUrl('/auth/login');
    } catch (error: unknown) {
      const message =
        formatApiError(error, 'Réinitialisation impossible.');
      this.errorMessage.set(message);
    } finally {
      this.submitting.set(false);
    }
  }
}

import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { AlertComponent } from '../../../../shared/components/ui/alert/alert.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { InputComponent } from '../../../../shared/components/ui/input/input.component';

@Component({
  selector: 'tc-forgot-password-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, InputComponent, ButtonComponent, AlertComponent],
  template: `
    <div>
      <!-- Logo -->
      <div class="flex justify-center mb-5">
        <img
          src="/assets/images/logos/logo_tontine_connect.png"
          alt="Tontine Connect"
          width="160"
          height="auto"
          style="max-width: 160px;"
        />
      </div>

      <div class="text-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900 leading-tight">Mot de passe oublié</h1>
        <p class="text-base text-gray-700 font-medium mt-0.5">Réinitialisez votre accès</p>
        <p class="text-sm text-gray-500 mt-1">Nous vous enverrons un code de réinitialisation.</p>
      </div>

      <form class="space-y-4" (submit)="onSubmit($event)">
        @if (success()) {
          <tc-alert kind="success">{{ success() }}</tc-alert>
        }

        <tc-input
          placeholder="Email ou numéro de téléphone"
          [(value)]="identifier"
          [required]="true"
          icon="user"
        />

        <tc-button type="submit" variant="primary" [fullWidth]="true" [loading]="submitting()">
          Envoyer le code
        </tc-button>

        <p class="text-center text-sm text-gray-600">
          <a routerLink="/auth/login" class="font-semibold hover:underline" style="color: var(--brand-700)">
            Retour à la connexion
          </a>
        </p>
      </form>
    </div>
  `,
})
export class ForgotPasswordPageComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly identifier = signal('');
  readonly submitting = signal(false);
  readonly success = signal<string | null>(null);

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    if (!this.identifier().trim()) return;

    this.submitting.set(true);
    try {
      await this.auth.forgotPassword(this.identifier());
      this.success.set('Si le compte existe, un code de réinitialisation vous a été envoyé.');
      setTimeout(
        () =>
          this.router.navigate(['/auth/reset-password'], {
            queryParams: { identifier: this.identifier() },
          }),
        1500,
      );
    } finally {
      this.submitting.set(false);
    }
  }
}

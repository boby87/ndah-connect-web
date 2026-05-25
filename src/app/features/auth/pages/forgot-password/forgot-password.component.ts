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
      <h1 class="text-2xl font-bold text-gray-900">Mot de passe oublié</h1>
      <p class="text-sm text-gray-500 mt-1">
        Indiquez votre email ou téléphone, nous vous enverrons un code de réinitialisation.
      </p>

      <form class="mt-8 space-y-4" (submit)="onSubmit($event)">
        @if (success()) {
          <tc-alert kind="success">{{ success() }}</tc-alert>
        }
        <tc-input
          label="Email ou téléphone"
          [(value)]="identifier"
          [required]="true"
        />
        <tc-button type="submit" variant="primary" [fullWidth]="true" [loading]="submitting()">
          Envoyer le code
        </tc-button>
        <p class="text-center text-sm text-gray-600">
          <a routerLink="/auth/login" class="text-blue-600 hover:underline font-medium">Retour à la connexion</a>
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

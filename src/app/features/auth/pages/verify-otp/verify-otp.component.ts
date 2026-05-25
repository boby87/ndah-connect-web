import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { AlertComponent } from '../../../../shared/components/ui/alert/alert.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { InputComponent } from '../../../../shared/components/ui/input/input.component';

@Component({
  selector: 'tc-verify-otp-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, InputComponent, ButtonComponent, AlertComponent],
  template: `
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Vérification du code</h1>
      <p class="text-sm text-gray-500 mt-1">
        Saisissez le code à 6 chiffres envoyé à <span class="font-medium">{{ identifier() }}</span>.
      </p>
      <p class="text-xs text-amber-600 mt-1">
        (En mode mock, le code est imprimé dans la console du navigateur.)
      </p>

      <form class="mt-8 space-y-4" (submit)="onSubmit($event)">
        @if (errorMessage()) {
          <tc-alert kind="error">{{ errorMessage() }}</tc-alert>
        }
        <tc-input
          label="Code OTP"
          [(value)]="code"
          placeholder="000000"
          hint="Code à 6 chiffres"
          [required]="true"
        />
        <tc-button type="submit" variant="primary" [fullWidth]="true" [loading]="submitting()">
          Vérifier le code
        </tc-button>
        <p class="text-center text-sm text-gray-600">
          <a routerLink="/auth/login" class="text-blue-600 hover:underline font-medium">Retour à la connexion</a>
        </p>
      </form>
    </div>
  `,
})
export class VerifyOtpPageComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly identifier = signal(this.route.snapshot.queryParamMap.get('identifier') ?? '');
  readonly code = signal('');
  readonly submitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.errorMessage.set(null);

    if (!/^\d{6}$/.test(this.code())) {
      this.errorMessage.set('Le code doit comporter 6 chiffres.');
      return;
    }

    this.submitting.set(true);
    try {
      await this.auth.verifyOtp({ identifier: this.identifier(), code: this.code() });
      await this.router.navigateByUrl('/dashboard');
    } catch (error: unknown) {
      const message =
        (error as { error?: { message?: string } })?.error?.message ?? 'Code invalide.';
      this.errorMessage.set(message);
    } finally {
      this.submitting.set(false);
    }
  }
}

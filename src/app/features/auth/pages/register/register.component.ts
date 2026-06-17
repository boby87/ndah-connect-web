import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { isValidCameroonPhone, isValidEmail, isStrongPassword } from '../../../../core/utils/validation.utils';
import { AlertComponent } from '../../../../shared/components/ui/alert/alert.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { InputComponent } from '../../../../shared/components/ui/input/input.component';
import { formatApiError } from '../../../../core/utils';

@Component({
  selector: 'tc-register-page',
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
        <h1 class="text-2xl font-bold text-gray-900 leading-tight">Créer un compte</h1>
        <p class="text-base text-gray-700 font-medium mt-0.5">Rejoignez votre tontine</p>
        <p class="text-sm text-gray-500 mt-1">Inscrivez-vous en quelques minutes.</p>
      </div>

      <form class="space-y-4" (submit)="onSubmit($event)">
        @if (errorMessage()) {
          <tc-alert kind="error">{{ errorMessage() }}</tc-alert>
        }

        <div class="grid grid-cols-2 gap-3">
          <tc-input
            placeholder="Prénom"
            [(value)]="firstName"
            [required]="true"
            icon="user"
          />
          <tc-input
            placeholder="Nom"
            [(value)]="lastName"
            [required]="true"
          />
        </div>

        <tc-input
          type="tel"
          placeholder="+237 6XX XX XX XX"
          [(value)]="phone"
          [(touched)]="phoneTouched"
          [error]="phoneError()"
          [required]="true"
          icon="phone"
        />

        <tc-input
          type="email"
          placeholder="Adresse email"
          [(value)]="email"
          [(touched)]="emailTouched"
          [error]="emailError()"
          [required]="true"
        />

        <tc-input
          type="password"
          placeholder="Mot de passe"
          [(value)]="password"
          [(touched)]="passwordTouched"
          [error]="passwordError()"
          hint="Min. 8 caractères avec majuscule, minuscule et chiffre."
          [required]="true"
          icon="lock"
        />

        <tc-button type="submit" variant="primary" [fullWidth]="true" [loading]="submitting()">
          Créer mon compte
        </tc-button>

        <p class="text-center text-sm text-gray-600">
          Déjà inscrit ?
          <a routerLink="/auth/login" class="font-semibold hover:underline" style="color: var(--brand-700)">
            Se connecter
          </a>
        </p>
      </form>
    </div>
  `,
})
export class RegisterPageComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly firstName = signal('');
  readonly lastName = signal('');
  readonly phone = signal('');
  readonly email = signal('');
  readonly password = signal('');

  readonly phoneTouched = signal(false);
  readonly emailTouched = signal(false);
  readonly passwordTouched = signal(false);
  readonly submitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly phoneError = computed(() =>
    this.phone() && !isValidCameroonPhone(this.phone()) ? 'Numéro camerounais invalide.' : '',
  );
  readonly emailError = computed(() =>
    this.email() && !isValidEmail(this.email()) ? 'Email invalide.' : '',
  );
  readonly passwordError = computed(() =>
    this.password() && !isStrongPassword(this.password())
      ? 'Mot de passe trop faible.'
      : '',
  );

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.phoneTouched.set(true);
    this.emailTouched.set(true);
    this.passwordTouched.set(true);
    this.errorMessage.set(null);

    if (
      !this.firstName() ||
      !this.lastName() ||
      this.phoneError() ||
      this.emailError() ||
      this.passwordError()
    ) {
      this.errorMessage.set('Veuillez corriger les erreurs du formulaire.');
      return;
    }

    this.submitting.set(true);
    try {
      const { identifier } = await this.auth.register({
        firstName: this.firstName(),
        lastName: this.lastName(),
        phone: this.phone(),
        email: this.email(),
        password: this.password(),
      });
      await this.router.navigate(['/auth/verify-otp'], { queryParams: { identifier } });
    } catch (error: unknown) {
      const message =
        formatApiError(error, 'Inscription impossible.');
      this.errorMessage.set(message);
    } finally {
      this.submitting.set(false);
    }
  }
}

import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { AlertComponent } from '../../../../shared/components/ui/alert/alert.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { InputComponent } from '../../../../shared/components/ui/input/input.component';
import { formatApiError } from '../../../../core/utils';

@Component({
  selector: 'tc-login-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, InputComponent, ButtonComponent, AlertComponent],
  template: `
    <div>
      <!-- Logo + marque -->
      <div class="flex flex-col items-center text-center gap-2 mb-5">
        <img
          src="/assets/images/logos/logo-concept-1-cycle.svg"
          alt=""
          width="48"
          height="48"
          class="rounded-xl"
        />
        <span class="text-base font-extrabold tracking-wide text-gray-900">TONTINE CONNECT</span>
      </div>

      <h1 class="text-2xl font-bold text-gray-900 text-center leading-tight">
        Bienvenue !<br />Simplifiez vos tontines
      </h1>
      <p class="text-sm text-gray-500 mt-1 text-center">
        Connectez-vous pour gérer vos cercles
      </p>

      <form class="mt-6 space-y-4" (submit)="onSubmit($event)">
        @if (errorMessage()) {
          <tc-alert kind="error">{{ errorMessage() }}</tc-alert>
        }

        <tc-input
          label="Numéro de téléphone ou Email"
          type="text"
          autocomplete="username"
          [(value)]="identifier"
          [required]="true"
          [error]="identifierError()"
          [(touched)]="identifierTouched"
          placeholder="+237699112233 ou achille@example.cm"
        />

        <tc-input
          label="Mot de passe"
          type="password"
          autocomplete="current-password"
          [(value)]="password"
          [required]="true"
          [error]="passwordError()"
          [(touched)]="passwordTouched"
          placeholder="Votre mot de passe"
        />

        <tc-button type="submit" variant="primary" [fullWidth]="true" [loading]="submitting()">
          Se connecter
        </tc-button>

        <p class="text-center text-sm">
          <a routerLink="/auth/forgot-password" class="text-gray-600 hover:underline">
            Mot de passe oublié ?
          </a>
        </p>

        <p class="text-center text-sm text-gray-600">
          Pas encore membre ?
          <a routerLink="/auth/register" class="font-medium hover:underline" style="color: var(--brand-700)">
            S'inscrire
          </a>
        </p>

        <div class="flex items-center gap-3 text-xs text-gray-400">
          <span class="h-px flex-1 bg-gray-200"></span>
          <span>Ou continuer avec :</span>
          <span class="h-px flex-1 bg-gray-200"></span>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <button
            type="button"
            (click)="onSocial('Google')"
            class="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35 24 35c-6.1 0-11-4.9-11-11s4.9-11 11-11c2.8 0 5.4 1.1 7.3 2.8l5.7-5.7C33.6 6.1 29.1 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z"/>
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c2.8 0 5.4 1.1 7.3 2.8l5.7-5.7C33.6 6.1 29.1 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
              <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35 26.7 36 24 36c-5.3 0-9.7-2.6-11.3-7l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
              <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.6l6.2 5.2C40.9 35.7 44 30.3 44 24c0-1.3-.1-2.3-.4-3.5z"/>
            </svg>
            Google
          </button>
          <button
            type="button"
            (click)="onSocial('Facebook')"
            class="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2" aria-hidden="true">
              <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6.02 4.39 11.01 10.13 11.93v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.69.24 2.69.24v2.97h-1.52c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.08 24 18.09 24 12.07z"/>
            </svg>
            Facebook
          </button>
        </div>
      </form>
    </div>
  `,
})
export class LoginPageComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly notifications = inject(NotificationService);

  readonly identifier = signal('');
  readonly password = signal('');
  readonly rememberMe = signal(false);
  readonly identifierTouched = signal(false);
  readonly passwordTouched = signal(false);
  readonly submitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly identifierError = computed(() =>
    this.identifier().trim().length === 0 ? 'Champ requis.' : '',
  );
  readonly passwordError = computed(() =>
    this.password().length === 0 ? 'Champ requis.' : '',
  );

  onSocial(provider: 'Google' | 'Facebook'): void {
    this.notifications.info(
      `La connexion via ${provider} sera bientôt disponible.`,
      'Bientôt disponible',
    );
  }

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.identifierTouched.set(true);
    this.passwordTouched.set(true);
    this.errorMessage.set(null);

    if (this.identifierError() || this.passwordError()) {
      return;
    }

    this.submitting.set(true);
    try {
      await this.auth.login({
        identifier: this.identifier().trim(),
        password: this.password(),
        rememberMe: this.rememberMe(),
      });
      this.notifications.success('Bienvenue !', 'Connexion réussie');
      await this.router.navigateByUrl('/dashboard');
    } catch (error: unknown) {
      const message =
        formatApiError(error, 'Connexion impossible. Vérifiez vos identifiants.');
      this.errorMessage.set(message);
    } finally {
      this.submitting.set(false);
    }
  }
}

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
      <div class="flex items-center gap-3 mb-6 lg:hidden">
        <img
          src="/assets/images/logos/logo-concept-1-cycle.svg"
          alt=""
          width="48"
          height="48"
          class="rounded-xl"
        />
        <span class="text-lg font-bold text-gray-900">TontineConnect</span>
      </div>
      <h1 class="text-2xl font-bold text-gray-900">Connexion</h1>
      <p class="text-sm text-gray-500 mt-1">
        Accédez à votre espace TontineConnect.
      </p>

      <form class="mt-8 space-y-4" (submit)="onSubmit($event)">
        @if (errorMessage()) {
          <tc-alert kind="error">{{ errorMessage() }}</tc-alert>
        }

        <tc-input
          label="Email ou téléphone"
          type="text"
          autocomplete="username"
          [(value)]="identifier"
          [required]="true"
          [error]="identifierError()"
          [(touched)]="identifierTouched"
          placeholder="achille@example.cm ou +237699112233"
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

        <div class="flex items-center justify-between text-sm">
          <label class="flex items-center gap-2 text-gray-600">
            <input type="checkbox" [checked]="rememberMe()" (change)="onRememberToggle($event)" />
            Se souvenir de moi
          </label>
          <a routerLink="/auth/forgot-password" class="text-blue-600 hover:underline">
            Mot de passe oublié ?
          </a>
        </div>

        <tc-button type="submit" variant="primary" [fullWidth]="true" [loading]="submitting()">
          Se connecter
        </tc-button>

        <p class="text-center text-sm text-gray-600">
          Pas encore inscrit ?
          <a routerLink="/auth/register" class="text-blue-600 hover:underline font-medium">Créer un compte</a>
        </p>

        <div class="rounded-lg border border-dashed border-gray-300 p-3 text-xs text-gray-500">
          <p class="font-semibold mb-1">Comptes de démonstration</p>
          <p>achille&#64;example.cm / password (Président)</p>
          <p>beatrice&#64;example.cm / password (Secrétaire)</p>
          <p>joseph&#64;example.cm / password (Membre)</p>
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

  onRememberToggle(event: Event): void {
    this.rememberMe.set((event.target as HTMLInputElement).checked);
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

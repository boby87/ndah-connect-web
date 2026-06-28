import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { AlertComponent } from '../../../../shared/components/ui/alert/alert.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { InputComponent } from '../../../../shared/components/ui/input/input.component';

interface Country {
  code: string;
  name: string;
  dial_code: string;
  flag: string;
}

const COUNTRIES: Country[] = [
  { code: 'CM', name: 'Cameroun', dial_code: '+237', flag: '🇨🇲' },
  { code: 'NG', name: 'Nigeria', dial_code: '+234', flag: '🇳🇬' },
  { code: 'SN', name: 'Sénégal', dial_code: '+221', flag: '🇸🇳' },
  { code: 'CI', name: "Côte d'Ivoire", dial_code: '+225', flag: '🇨🇮' },
  { code: 'GH', name: 'Ghana', dial_code: '+233', flag: '🇬🇭' },
  { code: 'CD', name: 'Congo RDC', dial_code: '+243', flag: '🇨🇩' },
  { code: 'CG', name: 'Congo', dial_code: '+242', flag: '🇨🇬' },
  { code: 'GA', name: 'Gabon', dial_code: '+241', flag: '🇬🇦' },
  { code: 'TD', name: 'Tchad', dial_code: '+235', flag: '🇹🇩' },
  { code: 'CF', name: 'Centrafrique', dial_code: '+236', flag: '🇨🇫' },
  { code: 'GQ', name: 'Guinée Équatoriale', dial_code: '+240', flag: '🇬🇶' },
  { code: 'ML', name: 'Mali', dial_code: '+223', flag: '🇲🇱' },
  { code: 'BF', name: 'Burkina Faso', dial_code: '+226', flag: '🇧🇫' },
  { code: 'BJ', name: 'Bénin', dial_code: '+229', flag: '🇧🇯' },
  { code: 'TG', name: 'Togo', dial_code: '+228', flag: '🇹🇬' },
  { code: 'GN', name: 'Guinée', dial_code: '+224', flag: '🇬🇳' },
  { code: 'MA', name: 'Maroc', dial_code: '+212', flag: '🇲🇦' },
  { code: 'TN', name: 'Tunisie', dial_code: '+216', flag: '🇹🇳' },
  { code: 'DZ', name: 'Algérie', dial_code: '+213', flag: '🇩🇿' },
  { code: 'MU', name: 'Île Maurice', dial_code: '+230', flag: '🇲🇺' },
  { code: 'FR', name: 'France', dial_code: '+33', flag: '🇫🇷' },
  { code: 'BE', name: 'Belgique', dial_code: '+32', flag: '🇧🇪' },
  { code: 'CH', name: 'Suisse', dial_code: '+41', flag: '🇨🇭' },
  { code: 'CA', name: 'Canada', dial_code: '+1', flag: '🇨🇦' },
  { code: 'US', name: 'États-Unis', dial_code: '+1', flag: '🇺🇸' },
  { code: 'GB', name: 'Royaume-Uni', dial_code: '+44', flag: '🇬🇧' },
  { code: 'DE', name: 'Allemagne', dial_code: '+49', flag: '🇩🇪' },
  { code: 'ES', name: 'Espagne', dial_code: '+34', flag: '🇪🇸' },
  { code: 'IT', name: 'Italie', dial_code: '+39', flag: '🇮🇹' },
  { code: 'PT', name: 'Portugal', dial_code: '+351', flag: '🇵🇹' },
];

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
        <p class="text-sm text-gray-500 mt-1">
          @if (useEmail()) {
            Entrez votre email pour recevoir un code.
          } @else {
            Entrez votre numéro pour recevoir un code par SMS.
          }
        </p>
      </div>

      <form class="space-y-4" (submit)="onSubmit($event)">
        @if (success()) {
          <tc-alert kind="success">{{ success() }}</tc-alert>
        }

        <!-- Mode téléphone -->
        @if (!useEmail()) {
          <div>
            <div class="flex rounded-lg border overflow-hidden transition-colors border-gray-300 focus-within:border-[var(--brand-600)]">
              <!-- Sélecteur pays -->
              <div class="flex items-center gap-2 px-3 bg-gray-50 border-r border-gray-300">
                <img
                  [src]="'https://flagcdn.com/w20/' + selectedCountryCode().toLowerCase() + '.png'"
                  [alt]="selectedCountry().name"
                  class="w-5 flex-shrink-0"
                  style="height: 14px; object-fit: cover; border-radius: 2px;"
                />
                <select
                  class="bg-transparent text-gray-700 text-sm focus:outline-none cursor-pointer"
                  (change)="selectedCountryCode.set($any($event.target).value)"
                >
                  @for (country of countries; track country.code) {
                    <option
                      [value]="country.code"
                      [selected]="country.code === selectedCountryCode()"
                    >{{ country.code }}-{{ country.dial_code.slice(1) }}</option>
                  }
                </select>
              </div>
              <!-- Numéro local -->
              <input
                type="tel"
                placeholder="Numéro local"
                class="flex-1 px-3 py-2.5 text-sm text-gray-900 bg-white focus:outline-none placeholder-gray-400 min-w-0"
                [value]="localPhone()"
                (input)="localPhone.set($any($event.target).value)"
              />
            </div>
          </div>
        }

        <!-- Mode email -->
        @if (useEmail()) {
          <tc-input
            type="email"
            placeholder="votre@email.com"
            [(value)]="emailIdentifier"
            [required]="true"
            icon="user"
          />
        }

        <!-- Toggle mode -->
        <div class="text-center">
          <button
            type="button"
            (click)="toggleMode()"
            class="text-sm font-semibold hover:underline cursor-pointer"
            style="color: var(--brand-700); background: none; border: none;"
          >
            @if (useEmail()) {
              ← Utiliser mon numéro de téléphone
            } @else {
              Utiliser mon email à la place →
            }
          </button>
        </div>

        <tc-button
          type="submit"
          variant="primary"
          [fullWidth]="true"
          [loading]="submitting()"
          [disabled]="!canSubmit()"
        >
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

  readonly countries = COUNTRIES;
  readonly selectedCountryCode = signal('CM');
  readonly selectedCountry = computed(
    () => this.countries.find(c => c.code === this.selectedCountryCode()) ?? this.countries[0],
  );

  readonly localPhone = signal('');
  readonly emailIdentifier = signal('');
  readonly useEmail = signal(false);
  readonly submitting = signal(false);
  readonly success = signal<string | null>(null);

  readonly fullPhone = computed(
    () => `${this.selectedCountry().dial_code}${this.localPhone().trim()}`,
  );

  readonly canSubmit = computed(() => {
    if (this.useEmail()) return this.emailIdentifier().trim().length > 0;
    return this.localPhone().trim().length > 0;
  });

  toggleMode(): void {
    this.useEmail.set(!this.useEmail());
    this.localPhone.set('');
    this.emailIdentifier.set('');
    this.success.set(null);
  }

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    if (!this.canSubmit()) return;

    const identifier = this.useEmail()
      ? this.emailIdentifier().trim()
      : this.fullPhone();

    this.submitting.set(true);
    try {
      await this.auth.forgotPassword(identifier);
      this.success.set('Si le compte existe, un code de réinitialisation vous a été envoyé.');
      setTimeout(
        () =>
          this.router.navigate(['/auth/reset-password'], {
            queryParams: { identifier },
          }),
        1500,
      );
    } finally {
      this.submitting.set(false);
    }
  }
}

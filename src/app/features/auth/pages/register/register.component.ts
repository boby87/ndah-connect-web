import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { isValidEmail, isStrongPassword } from '../../../../core/utils/validation.utils';
import { AlertComponent } from '../../../../shared/components/ui/alert/alert.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { InputComponent } from '../../../../shared/components/ui/input/input.component';
import { formatApiError } from '../../../../core/utils';

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
  { code: 'MU', name: 'Île Maurice', dial_code: '+230', flag: '🇲🇺' },
];

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

        <!-- Téléphone : sélecteur de pays + numéro local -->
        <div>
          <div class="flex rounded-lg border overflow-hidden transition-colors"
               [class]="phoneTouched() && phoneError()
                 ? 'border-red-400'
                 : 'border-gray-300 focus-within:border-[var(--brand-600)]'">
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
              (blur)="phoneTouched.set(true)"
            />
          </div>
          @if (phoneTouched() && phoneError()) {
            <p class="text-red-500 text-xs mt-1">{{ phoneError() }}</p>
          }
        </div>

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

  readonly countries = COUNTRIES;
  readonly selectedCountryCode = signal('CM');
  readonly selectedCountry = computed(
    () => this.countries.find(c => c.code === this.selectedCountryCode()) ?? this.countries[0],
  );

  readonly firstName = signal('');
  readonly lastName = signal('');
  readonly localPhone = signal('');
  readonly email = signal('');
  readonly password = signal('');

  readonly phoneTouched = signal(false);
  readonly emailTouched = signal(false);
  readonly passwordTouched = signal(false);
  readonly submitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly fullPhone = computed(
    () => `${this.selectedCountry().dial_code}${this.localPhone().trim()}`,
  );

  readonly phoneError = computed(() => {
    const digits = this.localPhone().replace(/[\s\-]/g, '');
    return digits && !/^\d{5,15}$/.test(digits) ? 'Numéro de téléphone invalide.' : '';
  });

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
      !this.localPhone() ||
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
        phone: this.fullPhone(),
        email: this.email(),
        password: this.password(),
      });
      await this.router.navigate(['/auth/verify-otp'], { queryParams: { identifier } });
    } catch (error: unknown) {
      this.errorMessage.set(formatApiError(error, 'Inscription impossible.'));
    } finally {
      this.submitting.set(false);
    }
  }
}

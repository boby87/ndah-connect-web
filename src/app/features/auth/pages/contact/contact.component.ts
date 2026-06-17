import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { InputComponent } from '../../../../shared/components/ui/input/input.component';
import { AlertComponent } from '../../../../shared/components/ui/alert/alert.component';

@Component({
  selector: 'tc-contact-page',
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
        <h1 class="text-2xl font-bold text-gray-900 leading-tight">Contactez-nous</h1>
        <p class="text-base text-gray-700 font-medium mt-0.5">Nous sommes à votre écoute</p>
        <p class="text-sm text-gray-500 mt-1">Réponse sous 24h par email ou téléphone.</p>
      </div>

      <!-- Contact info -->
      <div class="flex justify-center gap-5 mb-6">
        <div class="flex items-center gap-1.5 text-xs text-gray-500">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
          +237 6XX XX XX XX
        </div>
        <div class="flex items-center gap-1.5 text-xs text-gray-500">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="20" height="16" x="2" y="4" rx="2"/>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
          </svg>
          contact&#64;tontineconnect.cm
        </div>
      </div>

      <form class="space-y-4" (submit)="onSubmit($event)">
        @if (success()) {
          <tc-alert kind="success">{{ success() }}</tc-alert>
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
          type="email"
          placeholder="Adresse email"
          [(value)]="email"
          [required]="true"
        />

        <tc-input
          type="tel"
          placeholder="Téléphone (optionnel)"
          [(value)]="phone"
          icon="phone"
        />

        <textarea
          [value]="message()"
          (input)="message.set($any($event.target).value)"
          placeholder="Votre message…"
          rows="4"
          style="border-radius: var(--radius-md); padding: 0.6rem 0.85rem; font-size: 0.875rem; border: 1px solid rgba(28,26,47,0.10); outline: none; resize: none; width: 100%; font-family: inherit; color: var(--text-strong); transition: border-color 0.15s ease, box-shadow 0.15s ease;"
          class="placeholder-gray-400"
        ></textarea>

        <tc-button type="submit" variant="primary" [fullWidth]="true" [loading]="submitting()">
          Envoyer le message
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
export class ContactPageComponent {
  readonly firstName = signal('');
  readonly lastName = signal('');
  readonly email = signal('');
  readonly phone = signal('');
  readonly message = signal('');
  readonly submitting = signal(false);
  readonly success = signal<string | null>(null);

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    if (!this.firstName() || !this.email() || !this.message()) return;

    this.submitting.set(true);
    await new Promise((r) => setTimeout(r, 900));
    this.success.set('Votre message a bien été envoyé. Nous vous répondrons sous 24h.');
    this.firstName.set('');
    this.lastName.set('');
    this.email.set('');
    this.phone.set('');
    this.message.set('');
    this.submitting.set(false);
  }
}

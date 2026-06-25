import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { InvitationApiService, type InvitationPreview } from '../../services/invitation-api.service';
import { AlertComponent } from '../../../../shared/components/ui/alert/alert.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { InputComponent } from '../../../../shared/components/ui/input/input.component';
import { SpinnerComponent } from '../../../../shared/components/ui/spinner/spinner.component';
import { formatApiError } from '../../../../core/utils';

type PageState = 'loading' | 'expired' | 'accepted' | 'valid' | 'submitting' | 'success' | 'error';

const ROLE_LABELS: Record<string, string> = {
  PRESIDENT: 'Président(e)',
  VICE_PRESIDENT: 'Vice-Président(e)',
  SECRETARY: 'Secrétaire',
  TREASURER: 'Trésorier(ère)',
  AUDITOR: 'Commissaire aux Comptes',
  CENSOR: 'Censeur',
  MEMBER: 'Membre',
};

@Component({
  selector: 'tc-invitation-accept-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, AlertComponent, ButtonComponent, InputComponent, SpinnerComponent],
  templateUrl: './invitation-accept.component.html',
  styleUrl: './invitation-accept.component.scss',
})
export class InvitationAcceptPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  private readonly invApi = inject(InvitationApiService);

  private readonly token = this.route.snapshot.paramMap.get('token') ?? '';

  protected readonly state = signal<PageState>('loading');
  protected readonly preview = signal<InvitationPreview | null>(null);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly password = signal('');
  protected readonly passwordTouched = signal(false);
  protected readonly isAuthenticated = this.auth.isAuthenticated;

  protected readonly roleLabel = computed(() => {
    const role = this.preview()?.proposedRole as string | undefined;
    return role ? (ROLE_LABELS[role] ?? role) : '';
  });

  protected readonly passwordError = computed(() => {
    if (!this.passwordTouched()) return '';
    if (!this.password()) return 'Mot de passe requis.';
    if (this.password().length < 8) return 'Minimum 8 caractères.';
    return '';
  });

  constructor() {
    void this.loadPreview();
  }

  private async loadPreview(): Promise<void> {
    try {
      const p = await this.invApi.preview(this.token);
      this.preview.set(p);
      if (p.alreadyAccepted) this.state.set('accepted');
      else if (p.expired) this.state.set('expired');
      else this.state.set('valid');
    } catch {
      this.state.set('error');
    }
  }

  protected async submit(event: Event): Promise<void> {
    event.preventDefault();
    this.passwordTouched.set(true);
    if (this.passwordError()) return;

    this.state.set('submitting');
    this.errorMessage.set(null);
    try {
      const result = await this.invApi.accept(this.token, this.password());
      this.auth.applySession(result.session);
      this.state.set('success');
      setTimeout(() => void this.router.navigate(['/dashboard']), 2000);
    } catch (err: unknown) {
      this.errorMessage.set(formatApiError(err, "Impossible d'accepter l'invitation. Vérifiez votre mot de passe."));
      this.state.set('valid');
    }
  }
}

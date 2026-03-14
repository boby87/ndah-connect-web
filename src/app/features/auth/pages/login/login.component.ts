import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, MOCK_PROFILES, MockProfile } from '../../../../core/auth/services/auth.service';
import { AuthStore } from '../../../../store/auth/auth.store';
import { TontineStore } from '../../../../store/tontine/tontine.store';
import { MockDataService } from '../../../../core/services/mock-data.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { PhoneInputComponent } from '../../../../shared/components/forms/phone-input/phone-input.component';
import { PasswordInputComponent } from '../../../../shared/components/forms/password-input/password-input.component';
import { FormFieldComponent } from '../../../../shared/components/forms/form-field/form-field.component';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, ButtonComponent, PhoneInputComponent, PasswordInputComponent, FormFieldComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly authStore = inject(AuthStore);
  private readonly tontineStore = inject(TontineStore);
  private readonly mock = inject(MockDataService);
  private readonly router = inject(Router);
  private readonly notification = inject(NotificationService);

  protected readonly isMock = environment.useMock;
  protected readonly mockProfiles = MOCK_PROFILES;
  protected isLoading = false;

  readonly form = this.fb.nonNullable.group({
    phoneNumber: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  async onSubmit(): Promise<void> {
    if (this.form.invalid) return;

    this.isLoading = true;
    try {
      const user = await this.authService.login(this.form.getRawValue());
      this.initMockStore();
      this.authStore.setUser(user);
      this.router.navigate(['/dashboard']);
    } catch {
      this.notification.error('Identifiants invalides. Veuillez réessayer.');
    } finally {
      this.isLoading = false;
    }
  }

  loginAsProfile(profile: MockProfile): void {
    const user = this.authService.mockLoginAs(profile.id);
    this.initMockStore();
    this.authStore.setUser(user);
    this.router.navigate(['/dashboard']);
  }

  private initMockStore(): void {
    const role = this.authService.getMockRole();
    this.tontineStore.setTontines([this.mock.tontine]);
    this.tontineStore.setCurrentTontine(this.mock.tontine);
    const member = this.mock.members().find(m => m.role === role);
    if (member) this.tontineStore.setCurrentMember(member);
  }
}

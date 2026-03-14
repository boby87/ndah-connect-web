import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { PhoneInputComponent } from '../../../../shared/components/forms/phone-input/phone-input.component';
import { PasswordInputComponent } from '../../../../shared/components/forms/password-input/password-input.component';
import { FormFieldComponent } from '../../../../shared/components/forms/form-field/form-field.component';

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
  private readonly router = inject(Router);
  private readonly notification = inject(NotificationService);

  protected isLoading = false;

  readonly form = this.fb.nonNullable.group({
    phoneNumber: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  async onSubmit(): Promise<void> {
    if (this.form.invalid) return;

    this.isLoading = true;
    try {
      await this.authService.login(this.form.getRawValue());
      this.router.navigate(['/dashboard']);
    } catch {
      this.notification.error('Identifiants invalides. Veuillez réessayer.');
    } finally {
      this.isLoading = false;
    }
  }
}

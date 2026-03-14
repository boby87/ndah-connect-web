import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { passwordMatchValidator } from '../../../../shared/validators/password-match.validator';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { PhoneInputComponent } from '../../../../shared/components/forms/phone-input/phone-input.component';
import { PasswordInputComponent } from '../../../../shared/components/forms/password-input/password-input.component';
import { FormFieldComponent } from '../../../../shared/components/forms/form-field/form-field.component';
import { InputComponent } from '../../../../shared/components/ui/input/input.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, ButtonComponent, PhoneInputComponent, PasswordInputComponent, FormFieldComponent, InputComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly notification = inject(NotificationService);

  protected isLoading = false;

  readonly form = this.fb.nonNullable.group({
    phoneNumber: ['', [Validators.required]],
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    passwordConfirmation: ['', [Validators.required]],
  }, { validators: [passwordMatchValidator('password', 'passwordConfirmation')] });

  async onSubmit(): Promise<void> {
    if (this.form.invalid) return;

    this.isLoading = true;
    try {
      await this.authService.register(this.form.getRawValue());
      this.notification.success('Compte créé avec succès ! Vérifiez votre téléphone.');
      this.router.navigate(['/auth/verify-otp'], { queryParams: { phone: this.form.value.phoneNumber } });
    } catch {
      this.notification.error('Erreur lors de la création du compte.');
    } finally {
      this.isLoading = false;
    }
  }
}

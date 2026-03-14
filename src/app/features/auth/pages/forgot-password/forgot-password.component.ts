import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { PhoneInputComponent } from '../../../../shared/components/forms/phone-input/phone-input.component';
import { FormFieldComponent } from '../../../../shared/components/forms/form-field/form-field.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, ButtonComponent, PhoneInputComponent, FormFieldComponent],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly notification = inject(NotificationService);

  protected isLoading = false;

  readonly form = this.fb.nonNullable.group({
    phoneNumber: ['', [Validators.required]],
  });

  async onSubmit(): Promise<void> {
    if (this.form.invalid) return;

    this.isLoading = true;
    try {
      await this.authService.forgotPassword(this.form.getRawValue().phoneNumber);
      this.notification.success('Un code de réinitialisation a été envoyé.');
      this.router.navigate(['/auth/reset-password'], { queryParams: { phone: this.form.value.phoneNumber } });
    } catch {
      this.notification.error('Erreur. Vérifiez votre numéro de téléphone.');
    } finally {
      this.isLoading = false;
    }
  }
}

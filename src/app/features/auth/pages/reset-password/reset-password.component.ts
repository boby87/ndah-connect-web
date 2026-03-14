import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { passwordMatchValidator } from '../../../../shared/validators/password-match.validator';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { PasswordInputComponent } from '../../../../shared/components/forms/password-input/password-input.component';
import { FormFieldComponent } from '../../../../shared/components/forms/form-field/form-field.component';
import { InputComponent } from '../../../../shared/components/ui/input/input.component';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, ButtonComponent, PasswordInputComponent, FormFieldComponent, InputComponent],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly notification = inject(NotificationService);

  protected isLoading = false;

  readonly form = this.fb.nonNullable.group({
    code: ['', [Validators.required, Validators.minLength(6)]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    passwordConfirmation: ['', [Validators.required]],
  }, { validators: [passwordMatchValidator('password', 'passwordConfirmation')] });

  ngOnInit(): void {
    const code = this.route.snapshot.queryParams['code'];
    if (code) {
      this.form.patchValue({ code });
    }
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) return;

    this.isLoading = true;
    try {
      const phone = this.route.snapshot.queryParams['phone'] ?? '';
      await this.authService.resetPassword({ phoneNumber: phone, ...this.form.getRawValue() });
      this.notification.success('Mot de passe réinitialisé avec succès !');
      this.router.navigate(['/auth/login']);
    } catch {
      this.notification.error('Erreur lors de la réinitialisation.');
    } finally {
      this.isLoading = false;
    }
  }
}

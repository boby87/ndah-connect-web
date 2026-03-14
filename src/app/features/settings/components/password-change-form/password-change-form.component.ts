import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PasswordInputComponent } from '../../../../shared/components/forms/password-input/password-input.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { passwordMatchValidator } from '../../../../shared/validators';

export interface PasswordChangeValue {
  currentPassword: string;
  password: string;
  passwordConfirmation: string;
}

@Component({
  selector: 'app-password-change-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    PasswordInputComponent,
    ButtonComponent,
    CardComponent,
  ],
  templateUrl: './password-change-form.component.html',
  styleUrl: './password-change-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordChangeFormComponent {
  private readonly fb = inject(FormBuilder);

  readonly isLoading = input(false);
  readonly formSubmit = output<PasswordChangeValue>();

  readonly submitted = signal(false);

  readonly form: FormGroup = this.fb.group(
    {
      currentPassword: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordConfirmation: ['', [Validators.required]],
    },
    { validators: passwordMatchValidator('password', 'passwordConfirmation') },
  );

  getError(field: string): string {
    const control = this.form.get(field);
    if (!control || !control.errors || (!control.touched && !this.submitted())) return '';

    if (control.errors['required']) return 'Ce champ est requis';
    if (control.errors['minlength']) return `Minimum ${control.errors['minlength'].requiredLength} caractères`;
    return '';
  }

  get passwordMismatch(): boolean {
    return this.form.errors?.['passwordMismatch'] && (this.submitted() || this.form.get('passwordConfirmation')?.touched);
  }

  onSubmit(): void {
    this.submitted.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.formSubmit.emit(this.form.value as PasswordChangeValue);
  }
}

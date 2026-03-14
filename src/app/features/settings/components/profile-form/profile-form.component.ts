import { ChangeDetectionStrategy, Component, inject, input, output, signal, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '../../../../shared/components/ui/input/input.component';
import { SelectComponent } from '../../../../shared/components/ui/select/select.component';
import { PhoneInputComponent } from '../../../../shared/components/forms/phone-input/phone-input.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { User } from '../../../../shared/models/entities';
import { phoneValidator } from '../../../../shared/validators';

export interface ProfileFormValue {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | '';
  address: string;
  profession: string;
}

@Component({
  selector: 'app-profile-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputComponent,
    SelectComponent,
    PhoneInputComponent,
    ButtonComponent,
    CardComponent,
  ],
  templateUrl: './profile-form.component.html',
  styleUrl: './profile-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);

  readonly user = input<User | null>(null);
  readonly isLoading = input(false);

  readonly formSubmit = output<ProfileFormValue>();

  readonly submitted = signal(false);

  readonly genderOptions = [
    { value: 'male', label: 'Homme' },
    { value: 'female', label: 'Femme' },
  ];

  readonly form: FormGroup = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    email: ['', [Validators.email]],
    phoneNumber: ['', [Validators.required, phoneValidator]],
    dateOfBirth: [''],
    gender: [''],
    address: ['', [Validators.maxLength(200)]],
    profession: ['', [Validators.maxLength(100)]],
  });

  ngOnInit(): void {
    const u = this.user();
    if (u) {
      this.form.patchValue({
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email ?? '',
        phoneNumber: u.phoneNumber,
        dateOfBirth: u.dateOfBirth ?? '',
        gender: u.gender ?? '',
        address: u.address ?? '',
        profession: u.profession ?? '',
      });
    }
  }

  getError(field: string): string {
    const control = this.form.get(field);
    if (!control || !control.errors || (!control.touched && !this.submitted())) return '';

    if (control.errors['required']) return 'Ce champ est requis';
    if (control.errors['minlength']) return `Minimum ${control.errors['minlength'].requiredLength} caractères`;
    if (control.errors['maxlength']) return `Maximum ${control.errors['maxlength'].requiredLength} caractères`;
    if (control.errors['email']) return 'Adresse email invalide';
    if (control.errors['phone']) return control.errors['phone'].message;
    return '';
  }

  onSubmit(): void {
    this.submitted.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.formSubmit.emit(this.form.value as ProfileFormValue);
  }
}

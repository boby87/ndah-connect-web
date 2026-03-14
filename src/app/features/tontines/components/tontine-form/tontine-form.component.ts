import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '../../../../shared/components/ui/input/input.component';
import { SelectComponent } from '../../../../shared/components/ui/select/select.component';
import { TextareaComponent } from '../../../../shared/components/ui/textarea/textarea.component';
import { AmountInputComponent } from '../../../../shared/components/forms/amount-input/amount-input.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { Tontine } from '../../../../shared/models/entities';

export interface TontineFormValue {
  name: string;
  description: string;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  contributionAmount: number;
  cycleDurationSessions: number;
  minMembers: number;
  maxMembers: number | null;
  lateToleranceMinutes: number;
  absencePenaltyAmount: number;
  latePenaltyAmount: number;
  loanInterestRate: number;
  potDeductionRate: number;
}

@Component({
  selector: 'app-tontine-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputComponent,
    SelectComponent,
    TextareaComponent,
    AmountInputComponent,
    ButtonComponent,
    CardComponent,
  ],
  templateUrl: './tontine-form.component.html',
  styleUrl: './tontine-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TontineFormComponent {
  private readonly fb = inject(FormBuilder);

  readonly initialData = input<Partial<Tontine> | null>(null);
  readonly submitLabel = input('Créer la tontine');
  readonly isLoading = input(false);

  readonly formSubmit = output<TontineFormValue>();
  readonly cancelled = output<void>();

  readonly submitted = signal(false);

  readonly frequencyOptions = [
    { value: 'weekly', label: 'Hebdomadaire' },
    { value: 'biweekly', label: 'Bi-mensuelle' },
    { value: 'monthly', label: 'Mensuelle' },
  ];

  readonly form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    description: ['', [Validators.maxLength(500)]],
    frequency: ['monthly', [Validators.required]],
    contributionAmount: [null, [Validators.required, Validators.min(1000)]],
    cycleDurationSessions: [12, [Validators.required, Validators.min(2), Validators.max(52)]],
    minMembers: [5, [Validators.required, Validators.min(2)]],
    maxMembers: [null],
    lateToleranceMinutes: [15, [Validators.required, Validators.min(0), Validators.max(120)]],
    absencePenaltyAmount: [2000, [Validators.required, Validators.min(0)]],
    latePenaltyAmount: [1000, [Validators.required, Validators.min(0)]],
    loanInterestRate: [5, [Validators.required, Validators.min(0), Validators.max(100)]],
    potDeductionRate: [3, [Validators.required, Validators.min(0), Validators.max(100)]],
  });

  ngOnInit(): void {
    const data = this.initialData();
    if (data) {
      this.form.patchValue(data);
    }
  }

  getError(field: string): string {
    const control = this.form.get(field);
    if (!control || !control.errors || (!control.touched && !this.submitted())) return '';

    if (control.errors['required']) return 'Ce champ est requis';
    if (control.errors['minlength']) return `Minimum ${control.errors['minlength'].requiredLength} caractères`;
    if (control.errors['maxlength']) return `Maximum ${control.errors['maxlength'].requiredLength} caractères`;
    if (control.errors['min']) return `La valeur minimale est ${control.errors['min'].min}`;
    if (control.errors['max']) return `La valeur maximale est ${control.errors['max'].max}`;
    return '';
  }

  onSubmit(): void {
    this.submitted.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.formSubmit.emit(this.form.value as TontineFormValue);
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}

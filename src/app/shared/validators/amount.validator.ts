import { AbstractControl, ValidationErrors } from '@angular/forms';

export function amountValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  const amount = Number(control.value);
  if (isNaN(amount) || amount <= 0) {
    return { amount: { message: 'Le montant doit être un nombre positif' } };
  }
  return null;
}

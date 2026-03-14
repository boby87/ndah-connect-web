import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordMatchValidator(
  passwordField = 'password',
  confirmField = 'passwordConfirmation'
): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const password = group.get(passwordField)?.value;
    const confirm = group.get(confirmField)?.value;

    if (!password || !confirm) return null;
    return password === confirm ? null : { passwordMismatch: true };
  };
}

import { AbstractControl, ValidationErrors } from '@angular/forms';
import { REGEX } from '../../core/constants';

export function phoneValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  const valid = REGEX.CAMEROON_PHONE.test(control.value);
  return valid ? null : { phone: { message: 'Numéro de téléphone camerounais invalide' } };
}

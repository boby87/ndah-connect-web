import { REGEX } from '../constants';

export function isValidCameroonPhone(phone: string): boolean {
  return REGEX.CAMEROON_PHONE.test(phone);
}

export function isValidEmail(email: string): boolean {
  return REGEX.EMAIL.test(email);
}

export function isValidPassword(password: string): boolean {
  return REGEX.PASSWORD.test(password);
}

export function isValidAmount(amount: number): boolean {
  return amount > 0 && Number.isFinite(amount);
}

import { REGEX } from '../constants/regex.constants';

export const isValidCameroonPhone = (value: string): boolean => REGEX.phoneCm.test(value.trim());

export const normalizeCameroonPhone = (value: string): string => {
  const digits = value.replace(/\D/g, '');
  if (digits.startsWith('237')) return `+${digits}`;
  if (digits.length === 9) return `+237${digits}`;
  return value;
};

export const isValidEmail = (value: string): boolean => REGEX.email.test(value.trim());

export const isStrongPassword = (value: string): boolean => REGEX.strongPassword.test(value);

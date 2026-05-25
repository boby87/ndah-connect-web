import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'phone', pure: true })
export class PhoneFormatPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '—';
    const digits = value.replace(/\D/g, '');
    const local = digits.startsWith('237') ? digits.slice(3) : digits;
    if (local.length !== 9) return value;
    return `+237 ${local.slice(0, 1)} ${local.slice(1, 3)} ${local.slice(3, 5)} ${local.slice(5, 7)} ${local.slice(7, 9)}`;
  }
}

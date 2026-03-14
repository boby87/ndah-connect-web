import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'phoneFormat', standalone: true })
export class PhoneFormatPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '';
    const cleaned = value.replace(/\D/g, '');
    const digits = cleaned.startsWith('237') ? cleaned.substring(3) : cleaned;
    if (digits.length !== 9) return value;
    return `${digits.substring(0, 3)} ${digits.substring(3, 5)} ${digits.substring(5, 7)} ${digits.substring(7, 9)}`;
  }
}

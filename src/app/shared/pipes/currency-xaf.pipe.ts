import { Pipe, PipeTransform } from '@angular/core';
import { formatCurrencyXAF } from '../../core/utils/currency.utils';

@Pipe({ name: 'currencyXaf', standalone: true })
export class CurrencyXafPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value === null || value === undefined) return '';
    return formatCurrencyXAF(value);
  }
}

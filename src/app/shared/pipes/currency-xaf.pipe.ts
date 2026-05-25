import { Pipe, PipeTransform } from '@angular/core';
import { formatXAF } from '../../core/utils/currency.utils';

@Pipe({ name: 'xaf', pure: true })
export class CurrencyXafPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    return formatXAF(value);
  }
}

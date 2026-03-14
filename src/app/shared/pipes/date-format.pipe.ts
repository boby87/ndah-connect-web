import { Pipe, PipeTransform } from '@angular/core';
import { formatDate } from '../../core/utils/date.utils';

@Pipe({ name: 'dateFormat', standalone: true })
export class DateFormatPipe implements PipeTransform {
  transform(value: string | Date | null | undefined, format = 'dd/MM/yyyy'): string {
    if (!value) return '';
    return formatDate(value, format);
  }
}

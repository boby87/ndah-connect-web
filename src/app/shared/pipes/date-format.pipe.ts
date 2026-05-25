import { Pipe, PipeTransform } from '@angular/core';
import { formatDate, formatDateTime } from '../../core/utils/date.utils';

@Pipe({ name: 'tcDate', pure: true })
export class DateFormatPipe implements PipeTransform {
  transform(value: string | Date | null | undefined, withTime = false): string {
    return withTime ? formatDateTime(value) : formatDate(value);
  }
}

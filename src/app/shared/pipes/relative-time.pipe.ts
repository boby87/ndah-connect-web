import { Pipe, PipeTransform } from '@angular/core';
import { getRelativeTime } from '../../core/utils/date.utils';

@Pipe({ name: 'relativeTime', standalone: true })
export class RelativeTimePipe implements PipeTransform {
  transform(value: string | Date | null | undefined): string {
    if (!value) return '';
    return getRelativeTime(value);
  }
}

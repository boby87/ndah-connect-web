import { Pipe, PipeTransform } from '@angular/core';
import { USER_ROLE_LABELS, UserRole } from '../../core/enums/user-role.enum';

@Pipe({ name: 'roleLabel', pure: true })
export class RoleLabelPipe implements PipeTransform {
  transform(value: UserRole | null | undefined): string {
    if (!value) return '—';
    return USER_ROLE_LABELS[value] ?? value;
  }
}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'initials', pure: true })
export class InitialsPipe implements PipeTransform {
  transform(firstName?: string | null, lastName?: string | null): string {
    const a = (firstName ?? '').trim().charAt(0).toUpperCase();
    const b = (lastName ?? '').trim().charAt(0).toUpperCase();
    return `${a}${b}` || '?';
  }
}

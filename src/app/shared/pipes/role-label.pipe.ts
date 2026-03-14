import { Pipe, PipeTransform } from '@angular/core';

const ROLE_LABELS: Record<string, string> = {
  president: 'Président',
  vice_president: 'Vice-Président',
  secretary: 'Secrétaire',
  treasurer: 'Trésorier',
  censor: 'Censeur',
  auditor: 'Commissaire aux Comptes',
  member: 'Membre',
};

@Pipe({ name: 'roleLabel', standalone: true })
export class RoleLabelPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '';
    return ROLE_LABELS[value] || value;
  }
}

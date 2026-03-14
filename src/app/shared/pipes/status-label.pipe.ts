import { Pipe, PipeTransform } from '@angular/core';

const STATUS_LABELS: Record<string, string> = {
  pending: 'En attente',
  active: 'Actif',
  suspended: 'Suspendu',
  resigned: 'Démissionné',
  banned: 'Exclu',
  confirmed: 'Confirmé',
  failed: 'Échoué',
  refunded: 'Remboursé',
  scheduled: 'Programmée',
  opened: 'Ouverte',
  closed: 'Clôturée',
  cancelled: 'Annulée',
  requested: 'Demandé',
  guarantors_pending: 'Garants en attente',
  auditor_review: 'Examen commissaire',
  president_review: 'Examen président',
  approved: 'Approuvé',
  disbursed: 'Décaissé',
  repaying: 'En remboursement',
  completed: 'Terminé',
  defaulted: 'En défaut',
  paid: 'Payé',
  contested: 'Contesté',
  signed: 'Signé',
  distributed: 'Distribué',
  draft: 'Brouillon',
  open: 'Ouvert',
};

@Pipe({ name: 'statusLabel', standalone: true })
export class StatusLabelPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '';
    return STATUS_LABELS[value] || value;
  }
}

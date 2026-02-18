export class CurrencyFormatter {
  static format(value: number, currency: string = 'XAF'): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0
    }).format(value);
  }

  static formatSimple(value: number): string {
    return new Intl.NumberFormat('fr-FR', {
      maximumFractionDigits: 0
    }).format(value);
  }
}

export class DateFormatter {
  static format(date: Date): string {
    return new Intl.DateTimeFormat('fr-FR').format(new Date(date));
  }

  static formatWithTime(date: Date): string {
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  }

  static formatRelative(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Aujourd\'hui';
    if (days === 1) return 'Hier';
    if (days < 7) return `il y a ${days} jours`;
    if (days < 30) return `il y a ${Math.floor(days / 7)} semaines`;
    if (days < 365) return `il y a ${Math.floor(days / 30)} mois`;

    return this.format(date);
  }
}

export class StatusFormatter {
  static formatMemberStatus(status: string): string {
    const statuses: Record<string, string> = {
      active: 'Actif',
      inactive: 'Inactif',
      suspended: 'Suspendu'
    };
    return statuses[status] || status;
  }

  static formatEventStatus(status: string): string {
    const statuses: Record<string, string> = {
      pending: 'En attente',
      approved: 'Approuvé',
      completed: 'Complété',
      rejected: 'Rejeté'
    };
    return statuses[status] || status;
  }

  static formatFundStatus(status: string): string {
    const statuses: Record<string, string> = {
      active: 'Actif',
      closed: 'Fermé'
    };
    return statuses[status] || status;
  }

  static formatEventType(type: string): string {
    const types: Record<string, string> = {
      birth: 'Naissance',
      marriage: 'Mariage',
      bereavement: 'Deuil',
      illness: 'Maladie',
      other: 'Autre'
    };
    return types[type] || type;
  }
}


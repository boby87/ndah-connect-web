import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { PageHeaderComponent } from '../../../../shared/components/layout/page-header/page-header.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { StorageService } from '../../../../core/services/storage.service';
import { NotificationService } from '../../../../core/services/notification.service';

interface NotifCategory {
  key: string;
  label: string;
  description: string;
}

interface NotifPreferences {
  [key: string]: { push: boolean; email: boolean };
}

const NOTIF_PREFS_KEY = 'notification_preferences';

@Component({
  selector: 'app-notification-preferences',
  standalone: true,
  imports: [PageHeaderComponent, CardComponent, ButtonComponent],
  templateUrl: './notification-preferences.component.html',
  styleUrl: './notification-preferences.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationPreferencesComponent implements OnInit {
  private readonly storage = inject(StorageService);
  private readonly notification = inject(NotificationService);

  readonly isSubmitting = signal(false);

  readonly categories: NotifCategory[] = [
    { key: 'sessions', label: 'Séances', description: 'Rappels de séances, changements de date, ouverture/clôture' },
    { key: 'contributions', label: 'Cotisations', description: 'Rappels de paiement, confirmations, arriérés' },
    { key: 'loans', label: 'Prêts', description: 'Demandes, approbations, échéances de remboursement' },
    { key: 'distributions', label: 'Distributions', description: 'Attributions de pot, signatures requises' },
    { key: 'sanctions', label: 'Sanctions', description: 'Nouvelles sanctions, contestations, paiements' },
    { key: 'members', label: 'Membres', description: 'Adhésions, démissions, changements de rôle' },
    { key: 'votes', label: 'Votes', description: 'Nouveaux votes, résultats, rappels de participation' },
    { key: 'general', label: 'Annonces générales', description: 'Informations et annonces de la tontine' },
  ];

  readonly preferences = signal<NotifPreferences>(this.getDefaultPreferences());

  ngOnInit(): void {
    const saved = this.storage.getObject<NotifPreferences>(NOTIF_PREFS_KEY);
    if (saved) {
      this.preferences.set({ ...this.getDefaultPreferences(), ...saved });
    }
  }

  togglePush(key: string): void {
    this.preferences.update(prefs => ({
      ...prefs,
      [key]: { ...prefs[key], push: !prefs[key].push },
    }));
  }

  toggleEmail(key: string): void {
    this.preferences.update(prefs => ({
      ...prefs,
      [key]: { ...prefs[key], email: !prefs[key].email },
    }));
  }

  getPref(key: string): { push: boolean; email: boolean } {
    return this.preferences()[key] ?? { push: true, email: false };
  }

  save(): void {
    this.isSubmitting.set(true);
    // Simulate API save
    setTimeout(() => {
      this.storage.setObject(NOTIF_PREFS_KEY, this.preferences());
      this.notification.success('Préférences de notifications mises à jour.');
      this.isSubmitting.set(false);
    }, 300);
  }

  private getDefaultPreferences(): NotifPreferences {
    const prefs: NotifPreferences = {};
    for (const cat of this.categories) {
      prefs[cat.key] = { push: true, email: false };
    }
    return prefs;
  }
}

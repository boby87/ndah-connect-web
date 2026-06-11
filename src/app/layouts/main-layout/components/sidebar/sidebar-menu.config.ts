import { UserRole } from '../../../../core/enums/user-role.enum';

export interface MenuItem {
  label: string;
  icon: string;
  route: string;
  roles?: UserRole[];
}

export interface MenuSection {
  title?: string;
  items: MenuItem[];
}

const presidentOnly = [UserRole.PRESIDENT];
const secretaryOnly = [UserRole.SECRETARY];
const treasurerOnly = [UserRole.TREASURER];
const censorOnly = [UserRole.CENSOR];
const auditorOnly = [UserRole.AUDITOR];

export const SIDEBAR_MENU: MenuSection[] = [
  {
    items: [
      { label: 'Tableau de bord', icon: 'home', route: '/dashboard' },
    ],
  },
  {
    title: 'Trésorerie',
    items: [
      { label: 'Tableau Trésorier', icon: 'wallet', route: '/treasurer/dashboard', roles: treasurerOnly },
      { label: 'Cotisations', icon: 'coins', route: '/treasurer/contributions', roles: treasurerOnly },
      { label: 'Mobile Money', icon: 'smartphone', route: '/treasurer/mobile-money', roles: treasurerOnly },
      { label: 'Caisses', icon: 'piggy-bank', route: '/treasurer/cashboxes', roles: treasurerOnly },
      { label: 'Transferts', icon: 'arrow-right-left', route: '/treasurer/transfers', roles: treasurerOnly },
      { label: 'Dépenses', icon: 'receipt', route: '/treasurer/expenses', roles: treasurerOnly },
      { label: 'Distribution cagnotte', icon: 'gift', route: '/treasurer/distributions', roles: treasurerOnly },
      { label: 'Prêts', icon: 'landmark', route: '/treasurer/loans', roles: treasurerOnly },
      { label: 'Sanctions', icon: 'scale', route: '/treasurer/sanctions', roles: treasurerOnly },
      { label: 'Bilan de séance', icon: 'pie-chart', route: '/treasurer/bilan', roles: treasurerOnly },
      { label: 'Rapports', icon: 'bar-chart', route: '/treasurer/reports', roles: treasurerOnly },
    ],
  },
  {
    title: 'Secrétariat',
    items: [
      { label: 'Tableau Secrétaire', icon: 'clipboard', route: '/secretary/dashboard', roles: secretaryOnly },
      { label: 'Ordres du jour', icon: 'list', route: '/secretary/agendas', roles: secretaryOnly },
      { label: 'Convocations', icon: 'mail', route: '/secretary/convocations', roles: secretaryOnly },
      { label: 'Procès-verbaux', icon: 'file-text', route: '/secretary/minutes', roles: secretaryOnly },
      { label: 'Dossiers membres', icon: 'user-plus', route: '/secretary/membership', roles: secretaryOnly },
      { label: 'Registre des membres', icon: 'address-book', route: '/secretary/members', roles: secretaryOnly },
      { label: 'Archives', icon: 'archive', route: '/secretary/archives', roles: secretaryOnly },
      { label: 'Annonces', icon: 'megaphone', route: '/secretary/announcements', roles: secretaryOnly },
      { label: 'Rapports', icon: 'bar-chart', route: '/secretary/reports', roles: secretaryOnly },
    ],
  },
  {
    title: 'Discipline (Censeur)',
    items: [
      { label: 'Tableau Censeur', icon: 'scale', route: '/censor/dashboard', roles: censorOnly },
      { label: 'Sanctions', icon: 'gavel', route: '/censor/sanctions', roles: censorOnly },
      { label: 'Confirmer sanctions auto', icon: 'check-square', route: '/censor/auto-confirm', roles: censorOnly },
      { label: 'Contestations', icon: 'shield', route: '/censor/contestations', roles: censorOnly },
      { label: 'Modifications présence', icon: 'edit', route: '/censor/attendance-modifications', roles: censorOnly },
      { label: 'Justificatifs', icon: 'file-text', route: '/censor/justifications', roles: censorOnly },
      { label: 'Sanctions impayées', icon: 'clock', route: '/censor/unpaid', roles: censorOnly },
      { label: 'Communications', icon: 'mail', route: '/censor/communications', roles: censorOnly },
      { label: 'Rapports', icon: 'bar-chart', route: '/censor/reports', roles: censorOnly },
    ],
  },
  {
    title: 'Audit (Commissaire aux Comptes)',
    items: [
      { label: 'Tableau Commissaire', icon: 'shield-check', route: '/auditor/dashboard', roles: auditorOnly },
      { label: 'Validations financières', icon: 'check-square', route: '/auditor/validations', roles: auditorOnly },
      { label: 'Données financières', icon: 'database', route: '/auditor/financial-data', roles: auditorOnly },
      { label: 'Bilans de séance', icon: 'clipboard-check', route: '/auditor/balance-reviews', roles: auditorOnly },
      { label: 'Contrôles périodiques', icon: 'search', route: '/auditor/controls', roles: auditorOnly },
      { label: 'Audits', icon: 'file-search', route: '/auditor/audits', roles: auditorOnly },
      { label: 'Anomalies', icon: 'alert-triangle', route: '/auditor/anomalies', roles: auditorOnly },
      { label: 'Éclaircissements', icon: 'help-circle', route: '/auditor/clarifications', roles: auditorOnly },
      { label: 'Recommandations', icon: 'lightbulb', route: '/auditor/recommendations', roles: auditorOnly },
      { label: 'Certifications', icon: 'award', route: '/auditor/certifications', roles: auditorOnly },
      { label: 'Rapports', icon: 'bar-chart', route: '/auditor/reports', roles: auditorOnly },
      { label: 'Export données', icon: 'download', route: '/auditor/export', roles: auditorOnly },
    ],
  },
  {
    title: 'Présidence',
    items: [
      { label: 'Tableau Président', icon: 'crown', route: '/president/dashboard', roles: presidentOnly },
      { label: 'Validations', icon: 'check-square', route: '/president/validations', roles: presidentOnly },
      { label: 'Séances', icon: 'calendar-check', route: '/president/sessions', roles: presidentOnly },
      { label: 'Membres (dossiers)', icon: 'user-check', route: '/president/membership', roles: presidentOnly },
      { label: 'Inviter un membre', icon: 'user-plus', route: '/president/invitations', roles: presidentOnly },
      { label: 'Paramètres tontine', icon: 'edit', route: '/president/tontine-settings', roles: presidentOnly },
      { label: 'Cotisations extraord.', icon: 'banknote', route: '/president/extra-contributions', roles: presidentOnly },
      { label: 'Médiation conflits', icon: 'handshake', route: '/president/conflicts', roles: presidentOnly },
      { label: 'Sanctions à arbitrer', icon: 'gavel', route: '/president/sanctions', roles: presidentOnly },
      { label: 'Votes', icon: 'ballot', route: '/president/votes', roles: presidentOnly },
      { label: 'Annonces', icon: 'megaphone', route: '/president/announcements', roles: presidentOnly },
      { label: 'Délégations', icon: 'users-2', route: '/president/delegations', roles: presidentOnly },
      { label: 'Clôture de cycle', icon: 'flag', route: '/president/cycle-close', roles: presidentOnly },
      { label: 'Blocage d\'urgence', icon: 'shield-alert', route: '/president/emergency', roles: presidentOnly },
      { label: 'Rapports', icon: 'bar-chart', route: '/president/reports', roles: presidentOnly },
    ],
  },
  {
    title: 'Mon espace',
    items: [
      { label: 'Mes cotisations', icon: 'wallet', route: '/member/contributions' },
      { label: 'Mon planning', icon: 'calendar', route: '/member/planning' },
      { label: 'Mes prêts', icon: 'banknote', route: '/member/loans' },
      { label: 'Simulateur de prêt', icon: 'calculator', route: '/member/loan-simulator' },
      { label: 'Créer une tontine', icon: 'plus-circle', route: '/member/create-tontine' },
    ],
  },
];

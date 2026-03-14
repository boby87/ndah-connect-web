import { UserRole } from '../../../../core/enums/user-role.enum';

export interface SidebarMenuItem {
  id: string;
  label: string;
  icon: string;
  route?: string;
  roles?: UserRole[];
  children?: SidebarMenuItem[];
}

export const SIDEBAR_MENU: SidebarMenuItem[] = [
  { id: 'dashboard', label: 'Tableau de bord', icon: '📊', route: '/dashboard' },
  {
    id: 'tontines',
    label: 'Tontines',
    icon: '🏦',
    children: [
      { id: 'tontines-list', label: 'Mes tontines', icon: '🏦', route: '/tontines' },
      { id: 'members', label: 'Membres', icon: '👥', route: '/members' },
    ],
  },
  {
    id: 'finances',
    label: 'Finances',
    icon: '💰',
    children: [
      { id: 'contributions', label: 'Cotisations', icon: '💰', route: '/contributions' },
      { id: 'distributions', label: 'Distributions', icon: '🎯', route: '/distributions' },
      { id: 'loans', label: 'Prêts', icon: '🏧', route: '/loans' },
      {
        id: 'treasury',
        label: 'Trésorerie',
        icon: '💼',
        route: '/treasury',
        roles: [UserRole.TREASURER, UserRole.PRESIDENT, UserRole.AUDITOR],
      },
    ],
  },
  {
    id: 'activities',
    label: 'Activités',
    icon: '📅',
    children: [
      { id: 'sessions', label: 'Séances', icon: '📅', route: '/sessions' },
      { id: 'votes', label: 'Votes', icon: '🗳️', route: '/votes' },
      { id: 'social-aid', label: 'Aide sociale', icon: '🤝', route: '/social-aid' },
    ],
  },
  {
    id: 'compliance',
    label: 'Conformité',
    icon: '⚖️',
    children: [
      { id: 'sanctions', label: 'Sanctions', icon: '⚖️', route: '/sanctions' },
      {
        id: 'audit',
        label: 'Audit',
        icon: '🔍',
        route: '/audit',
        roles: [UserRole.AUDITOR, UserRole.PRESIDENT],
      },
    ],
  },
  {
    id: 'documents',
    label: 'Documents',
    icon: '📄',
    children: [
      { id: 'documents-list', label: 'Documents', icon: '📄', route: '/documents' },
      {
        id: 'archives',
        label: 'Archives',
        icon: '📂',
        route: '/documents/archives',
        roles: [UserRole.SECRETARY, UserRole.PRESIDENT],
      },
      {
        id: 'reports',
        label: 'Rapports',
        icon: '📊',
        route: '/documents/reports',
        roles: [UserRole.SECRETARY],
      },
    ],
  },
  {
    id: 'communication',
    label: 'Communication',
    icon: '🔔',
    children: [
      { id: 'notifications', label: 'Notifications', icon: '🔔', route: '/notifications' },
      {
        id: 'announcements',
        label: 'Annonces',
        icon: '📢',
        route: '/notifications/announcements',
        roles: [UserRole.SECRETARY],
      },
    ],
  },
  { id: 'settings', label: 'Paramètres', icon: '⚙️', route: '/settings' },
];

import { UserRole } from '../../../../core/enums/user-role.enum';

export interface SidebarMenuItem {
  label: string;
  icon: string;
  route: string;
  roles?: UserRole[];
  children?: SidebarMenuItem[];
}

export const SIDEBAR_MENU: SidebarMenuItem[] = [
  { label: 'Tableau de bord', icon: '📊', route: '/dashboard' },
  { label: 'Tontines', icon: '🏦', route: '/tontines' },
  { label: 'Membres', icon: '👥', route: '/members' },
  { label: 'Séances', icon: '📅', route: '/sessions' },
  { label: 'Cotisations', icon: '💰', route: '/contributions' },
  { label: 'Distributions', icon: '🎯', route: '/distributions' },
  { label: 'Prêts', icon: '🏧', route: '/loans' },
  {
    label: 'Trésorerie',
    icon: '💼',
    route: '/treasury',
    roles: [UserRole.TREASURER, UserRole.PRESIDENT, UserRole.AUDITOR],
  },
  { label: 'Sanctions', icon: '⚖️', route: '/sanctions' },
  { label: 'Votes', icon: '🗳️', route: '/votes' },
  { label: 'Documents', icon: '📄', route: '/documents' },
  { label: 'Aide sociale', icon: '🤝', route: '/social-aid' },
  {
    label: 'Audit',
    icon: '🔍',
    route: '/audit',
    roles: [UserRole.AUDITOR, UserRole.PRESIDENT],
  },
  { label: 'Notifications', icon: '🔔', route: '/notifications' },
  { label: 'Paramètres', icon: '⚙️', route: '/settings' },
];

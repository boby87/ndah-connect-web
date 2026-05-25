export enum UserRole {
  PRESIDENT = 'PRESIDENT',
  SECRETARY = 'SECRETARY',
  TREASURER = 'TREASURER',
  CENSOR = 'CENSOR',
  AUDITOR = 'AUDITOR',
  MEMBER = 'MEMBER',
}

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.PRESIDENT]: 'Président',
  [UserRole.SECRETARY]: 'Secrétaire',
  [UserRole.TREASURER]: 'Trésorier',
  [UserRole.CENSOR]: 'Censeur',
  [UserRole.AUDITOR]: 'Commissaire aux Comptes',
  [UserRole.MEMBER]: 'Membre',
};

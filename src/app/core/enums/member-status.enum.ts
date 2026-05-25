export enum MemberStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  RESIGNED = 'RESIGNED',
  EXCLUDED = 'EXCLUDED',
}

export const MEMBER_STATUS_LABELS: Record<MemberStatus, string> = {
  [MemberStatus.PENDING]: 'En attente',
  [MemberStatus.ACTIVE]: 'Actif',
  [MemberStatus.SUSPENDED]: 'Suspendu',
  [MemberStatus.RESIGNED]: 'Démissionnaire',
  [MemberStatus.EXCLUDED]: 'Exclu',
};

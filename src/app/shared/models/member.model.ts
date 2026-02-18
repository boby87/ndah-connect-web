export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  joinDate: Date;
  status: 'active' | 'inactive' | 'suspended';
  photo?: string;
  quartier: string;
  totalContribution: number;
  totalLoans: number;
  lastPaymentDate?: Date;
  discipline?: {
    attendance: number;
    status: 'bon' | 'moyen' | 'mauvais';
  };
}

export interface MemberProfile extends Member {
  totalEpargne: number;
  capaciteEmprunt: number;
  pretsCours: number;
  dettesAmende: number;
  historiqueFinancier: Array<{
    date: Date;
    description: string;
    montant: number;
    type: 'pret' | 'remboursement' | 'cotisation' | 'amende';
  }>;
}


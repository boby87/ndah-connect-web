import { Injectable } from '@angular/core';
import { signal, computed, Signal } from '@angular/core';
import { Member, MemberProfile } from '../models';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  // Signals
  private membersSignal = signal<Member[]>([
    {
      id: '1',
      firstName: 'Jean-Paul',
      lastName: 'Kamga',
      email: 'jean.kamga@example.com',
      phone: '+237 123456789',
      joinDate: new Date('2022-01-15'),
      status: 'active',
      quartier: 'Yaoundé',
      totalContribution: 1000000,
      totalLoans: 500000
    },
    {
      id: '2',
      firstName: 'Marie-Claire',
      lastName: 'Fotso',
      email: 'marie.fotso@example.com',
      phone: '+237 987654321',
      joinDate: new Date('2022-06-20'),
      status: 'inactive',
      quartier: 'Douala',
      totalContribution: 750000,
      totalLoans: 300000
    },
    {
      id: '3',
      firstName: 'Emmanuel',
      lastName: 'Tagne',
      email: 'emmanuel.tagne@example.com',
      phone: '+237 555666777',
      joinDate: new Date('2023-03-10'),
      status: 'active',
      quartier: 'Bamenda',
      totalContribution: 500000,
      totalLoans: 200000
    },
    {
      id: '4',
      firstName: 'Célestine',
      lastName: 'Ngueko',
      email: 'celestine.ngueko@example.com',
      phone: '+237 777888999',
      joinDate: new Date('2023-05-20'),
      status: 'suspended',
      quartier: 'Douala',
      totalContribution: 600000,
      totalLoans: 250000
    },
    {
      id: '5',
      firstName: 'Thérèse',
      lastName: 'Maffo',
      email: 'therese.maffo@example.com',
      phone: '+237 444555666',
      joinDate: new Date('2022-02-10'),
      status: 'active',
      quartier: 'Yaoundé',
      totalContribution: 800000,
      totalLoans: 400000
    },
    {
      id: '6',
      firstName: 'Sophie',
      lastName: 'Tchatchou',
      email: 'sophie.tchatchou@example.com',
      phone: '+237 999888777',
      joinDate: new Date('2022-08-15'),
      status: 'active',
      quartier: 'Yaoundé',
      totalContribution: 920000,
      totalLoans: 450000
    },
    {
      id: '7',
      firstName: 'Pierre',
      lastName: 'Djoumessi',
      email: 'pierre.djoumessi@example.com',
      phone: '+237 111222333',
      joinDate: new Date('2023-01-05'),
      status: 'active',
      quartier: 'Bamenda',
      totalContribution: 550000,
      totalLoans: 220000
    },
    {
      id: '8',
      firstName: 'Victor',
      lastName: 'Wambo',
      email: 'victor.wambo@example.com',
      phone: '+237 666777888',
      joinDate: new Date('2022-11-20'),
      status: 'active',
      quartier: 'Yaoundé',
      totalContribution: 650000,
      totalLoans: 320000
    }
  ]);

  private selectedMemberSignal = signal<Member | null>(null);

  // Computed signals
  public members: Signal<Member[]> = this.membersSignal.asReadonly();
  public totalMembers = computed(() => this.membersSignal().length);
  public activeMembers = computed(() =>
    this.membersSignal().filter(m => m.status === 'active').length
  );
  public selectedMember = this.selectedMemberSignal.asReadonly();

  constructor() {
    this.initializeDemoData();
  }

  private initializeDemoData() {
    // Generate more demo data to reach a realistic number
    const generatedMembers: Member[] = [];
    const firstNames = ['Jean', 'Marie', 'Pierre', 'Sophie', 'Lucas', 'Anne', 'Marc', 'Claire', 'Thomas', 'Isabelle'];
    const lastNames = ['Kamga', 'Fotso', 'Tagne', 'Maffo', 'Tchatchou', 'Djoumessi', 'Wambo', 'Ngueko', 'Njouncho', 'Tsangue'];
    const quartiers = ['Yaoundé', 'Douala', 'Bamenda'];
    const statuses: ('active' | 'inactive' | 'suspended')[] = ['active', 'inactive', 'suspended'];

    for (let i = 0; i < 1240; i++) {
      const firstName = firstNames[i % firstNames.length];
      const lastName = lastNames[i % lastNames.length];
      const quartier = quartiers[i % quartiers.length];
      const status = statuses[i % statuses.length];

      generatedMembers.push({
        id: String(i + 1),
        firstName,
        lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`,
        phone: `+237 ${String(i).padStart(9, '0')}`,
        joinDate: new Date(2020 + Math.floor(i / 400), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        status,
        quartier,
        totalContribution: Math.floor(Math.random() * 1000000) + 100000,
        totalLoans: Math.floor(Math.random() * 500000)
      });
    }

    this.membersSignal.set(generatedMembers);
  }

  getMemberById(id: string): Signal<MemberProfile | null> {
    return computed(() => {
      const member = this.membersSignal().find(m => m.id === id);
      if (!member) return null;

      return {
        ...member,
        totalEpargne: 1500000,
        capaciteEmprunt: 2250000,
        pretsCours: 400000,
        dettesAmende: 15000,
        historiqueFinancier: [
          {
            date: new Date('2024-05-12'),
            description: 'Cotisation mensuelle',
            montant: 50000,
            type: 'cotisation'
          },
          {
            date: new Date('2024-04-12'),
            description: 'Prêt accordé',
            montant: 400000,
            type: 'pret'
          }
        ]
      } as MemberProfile;
    });
  }

  selectMember(member: Member) {
    this.selectedMemberSignal.set(member);
  }

  addMember(member: Omit<Member, 'id'>) {
    const newMember: Member = {
      ...member,
      id: String(Math.max(...this.membersSignal().map(m => parseInt(m.id)), 0) + 1)
    };
    this.membersSignal.update(members => [...members, newMember]);
  }

  updateMember(id: string, updates: Partial<Member>) {
    this.membersSignal.update(members =>
      members.map(m => m.id === id ? { ...m, ...updates } : m)
    );
  }

  deleteMember(id: string) {
    this.membersSignal.update(members =>
      members.filter(m => m.id !== id)
    );
  }
}


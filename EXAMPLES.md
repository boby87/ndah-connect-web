# Exemples Pratiques - Ndah Connect

## 1. Ajouter un Nouveau Membre

### Service
```typescript
// Dans member.service.ts
addMember(member: Omit<Member, 'id'>) {
  const newMember: Member = {
    ...member,
    id: String(Math.max(...this.membersSignal().map(m => parseInt(m.id)), 0) + 1)
  };
  this.membersSignal.update(members => [...members, newMember]);
}
```

### Composant
```typescript
// Dans un composant (dialog, formulaire)
constructor(private memberService: MemberService) {}

addMember(formData: any) {
  this.memberService.addMember({
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    phone: formData.phone,
    quartier: formData.quartier,
    joinDate: new Date(),
    status: 'active',
    totalContribution: 0,
    totalLoans: 0
  });
}
```

---

## 2. Créer un Nouveau Composant Réutilisable

### Exemple: Badge avec Icône
```typescript
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-icon-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center gap-2 px-3 py-2 bg-{{ bgColor }}-100 rounded-lg">
      <span class="text-xl">{{ icon }}</span>
      <span class="text-sm font-medium text-{{ textColor }}-800">{{ label }}</span>
    </div>
  `
})
export class IconBadgeComponent {
  @Input() icon: string = '';
  @Input() label: string = '';
  @Input() bgColor: string = 'blue';
  @Input() textColor: string = 'blue';
}
```

### Usage
```html
<app-icon-badge 
  icon="✅"
  label="Payé"
  bgColor="green"
  textColor="green">
</app-icon-badge>
```

---

## 3. Implémenter un Filtre de Liste

### Service avec Signal pour le filtre
```typescript
export class MemberService {
  private membersSignal = signal<Member[]>([...]);
  private searchSignal = signal<string>('');

  public members = this.membersSignal.asReadonly();
  public searchTerm = this.searchSignal.asReadonly();

  public filteredMembers = computed(() => {
    const search = this.searchSignal().toLowerCase();
    return this.membersSignal().filter(m =>
      m.firstName.toLowerCase().includes(search) ||
      m.lastName.toLowerCase().includes(search) ||
      m.email.toLowerCase().includes(search)
    );
  });

  setSearchTerm(term: string) {
    this.searchSignal.set(term);
  }
}
```

### Composant
```typescript
export class MembersComponent {
  memberService = inject(MemberService);

  onSearch(event: Event) {
    const term = (event.target as HTMLInputElement).value;
    this.memberService.setSearchTerm(term);
  }
}
```

### Template
```html
<input 
  type="text" 
  placeholder="Rechercher un membre..."
  (input)="onSearch($event)"
  class="w-full px-4 py-2 border rounded-lg">

<app-data-table 
  [data]="memberService.filteredMembers()"
  [columns]="columns">
</app-data-table>
```

---

## 4. Formulaire Dynamique avec app-form-field

```typescript
export class AddMemberDialogComponent {
  formData = signal({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    quartier: ''
  });

  onFieldChange(field: string, value: any) {
    this.formData.update(data => ({
      ...data,
      [field]: value
    }));
  }

  submit() {
    this.memberService.addMember(this.formData());
  }
}
```

```html
<form>
  <app-form-field
    id="firstName"
    label="Prénom"
    type="text"
    [value]="formData().firstName"
    (valueChange)="onFieldChange('firstName', $event)"
    required>
  </app-form-field>

  <app-form-field
    id="email"
    label="Email"
    type="email"
    [value]="formData().email"
    (valueChange)="onFieldChange('email', $event)"
    required>
  </app-form-field>

  <app-form-field
    id="quartier"
    label="Quartier"
    type="select"
    [value]="formData().quartier"
    [options]="[
      { label: 'Yaoundé', value: 'Yaoundé' },
      { label: 'Douala', value: 'Douala' }
    ]"
    (valueChange)="onFieldChange('quartier', $event)">
  </app-form-field>

  <app-button 
    label="Ajouter" 
    variant="primary" 
    (click)="submit()">
  </app-button>
</form>
```

---

## 5. Créer une Page avec Statistiques

```typescript
export class FundDetailComponent {
  fundService = inject(FundService);
  fundId = input.required<string>();

  fund = this.fundService.getFundById(this.fundId());
  
  progress = computed(() => {
    const f = this.fund();
    return f ? (f.currentAmount / f.totalAmount) * 100 : 0;
  });

  memberCount = computed(() => {
    return this.fund()?.members.length || 0;
  });

  contributionAverage = computed(() => {
    const f = this.fund();
    if (!f) return 0;
    return f.currentAmount / this.memberCount();
  });
}
```

```html
<div class="space-y-6">
  @if (fund(); as fund) {
    <app-card [title]="fund.name">
      <div class="space-y-4">
        <div class="grid grid-cols-3 gap-4">
          <div>
            <p class="text-gray-600">Solde Total</p>
            <p class="text-2xl font-bold">{{ formatCurrency(fund.currentAmount) }}</p>
          </div>
          <div>
            <p class="text-gray-600">Membres</p>
            <p class="text-2xl font-bold">{{ memberCount() }}</p>
          </div>
          <div>
            <p class="text-gray-600">Moyenne</p>
            <p class="text-2xl font-bold">{{ formatCurrency(contributionAverage()) }}</p>
          </div>
        </div>

        <div>
          <div class="flex justify-between mb-2">
            <span>Progression</span>
            <span>{{ progress().toFixed(0) }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-3">
            <div 
              class="bg-green-500 h-3 rounded-full transition-all"
              [style.width.%]="progress()">
            </div>
          </div>
        </div>
      </div>
    </app-card>
  }
</div>
```

---

## 6. Service avec Calculs Computés Avancés

```typescript
@Injectable({ providedIn: 'root' })
export class StatisticsService {
  private transactionsSignal = signal<Transaction[]>([...]);

  transactions = this.transactionsSignal.asReadonly();

  totalIncome = computed(() =>
    this.transactionsSignal()
      .filter(t => ['deposit', 'repayment'].includes(t.type))
      .reduce((sum, t) => sum + t.amount, 0)
  );

  totalExpense = computed(() =>
    this.transactionsSignal()
      .filter(t => ['withdrawal', 'loan'].includes(t.type))
      .reduce((sum, t) => sum + t.amount, 0)
  );

  balance = computed(() =>
    this.totalIncome() - this.totalExpense()
  );

  monthlyTotals = computed(() => {
    const byMonth = new Map<string, number>();
    this.transactionsSignal().forEach(t => {
      const month = new Date(t.date).toISOString().slice(0, 7);
      byMonth.set(month, (byMonth.get(month) || 0) + t.amount);
    });
    return Array.from(byMonth.entries()).map(([month, amount]) => ({
      month,
      amount
    }));
  });

  transactionsByType = computed(() => {
    const byType = new Map<string, Transaction[]>();
    this.transactionsSignal().forEach(t => {
      const arr = byType.get(t.type) || [];
      arr.push(t);
      byType.set(t.type, arr);
    });
    return Object.fromEntries(byType);
  });
}
```

---

## 7. Routage avec Lazy Loading (Prêt à Implémenter)

```typescript
// src/app/app.routes.ts
export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component')
          .then(m => m.DashboardComponent)
      },
      {
        path: 'members',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/members/members.component')
              .then(m => m.MembersComponent)
          },
          {
            path: ':id',
            loadComponent: () => import('./features/members/member-profile.component')
              .then(m => m.MemberProfileComponent)
          }
        ]
      },
      {
        path: 'funds',
        loadComponent: () => import('./features/funds/funds.component')
          .then(m => m.FundsComponent)
      },
      {
        path: 'events',
        loadComponent: () => import('./features/events/events.component')
          .then(m => m.EventsComponent)
      }
    ]
  }
];
```

---

## 8. Intercepteur HTTP (Pour Backend Futur)

```typescript
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Ajouter le token d'authentification
    const token = localStorage.getItem('token');
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    return next.handle(req);
  }
}
```

---

## 9. Directives Personnalisées (Futur)

```typescript
@Directive({
  selector: '[appHighlight]',
  standalone: true
})
export class HighlightDirective {
  constructor(private el: ElementRef) {
    this.el.nativeElement.style.backgroundColor = 'yellow';
  }
}

// Usage: <p appHighlight>Texte surlighté</p>
```

---

## 10. Configuration des Tests

```typescript
// dashboard.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { DashboardService } from '../../shared/services';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display metrics', () => {
    const metrics = component.dashboardService.primaryMetrics();
    expect(metrics.length).toBeGreaterThan(0);
  });
});
```

---

**Tous ces exemples sont prêts à être intégrés dans l'application Ndah Connect!**


# 🤖 GitHub Copilot Instructions - Ndah Connect

> Application de gestion de tontine multi-tenant pour le Cameroun

## 📋 Contexte du Projet

**Ndah Connect** est une application web Angular 21 de gestion de tontines (épargne collective camerounaise).

### Stack Technique

| Élément | Technologie |
|---------|-------------|
| Framework | Angular 21 (Standalone Components) |
| State Management | Angular Signals + Services |
| CSS | Tailwind CSS v4 |
| i18n | Transloco |
| Auth | Keycloak |
| Tests | Vitest |
| API | REST |

### Architecture Multi-Tenant

- **Stratégie** : Header/Token (X-Tenant-ID)
- Un utilisateur peut appartenir à **plusieurs tontines**
- Les permissions sont **dynamiques** (chargées depuis le backend)

---

## 🏗️ Structure du Projet

```
src/app/
├── core/                    # Services singleton, guards, interceptors
│   ├── auth/               # Authentification Keycloak
│   ├── tenant/             # Gestion multi-tenant
│   ├── permissions/        # Permissions dynamiques
│   ├── interceptors/       # HTTP interceptors
│   ├── guards/             # Route guards
│   └── services/           # Services globaux (API, storage, etc.)
│
├── shared/                  # Composants/pipes/directives réutilisables
│   ├── components/
│   │   ├── ui/             # Composants UI de base (button, card, modal...)
│   │   └── layout/         # Composants de mise en page
│   ├── directives/
│   └── pipes/
│
├── features/                # Modules métier (lazy loaded)
│   ├── auth/               # Login, register, forgot-password
│   ├── dashboard/          # Tableau de bord
│   ├── tontine/            # Gestion des tontines
│   ├── members/            # Gestion des membres et bureau
│   ├── sessions/           # Séances et présences
│   ├── payments/           # Cotisations et paiements
│   ├── loans/              # Prêts
│   ├── sanctions/          # Sanctions
│   ├── extraordinary/      # Cotisations extraordinaires
│   ├── reports/            # Rapports et bilans
│   └── settings/           # Paramètres utilisateur
│
├── layouts/                 # Layouts de l'application
│   ├── admin-layout/       # Layout principal (avec sidebar)
│   ├── auth-layout/        # Layout authentification
│   └── public-layout/      # Layout pages publiques
│
├── app.ts                   # Composant racine
├── app.config.ts            # Configuration standalone
└── app.routes.ts            # Routes principales
```

---

## 📏 Conventions de Code

### Nommage des Fichiers

| Type | Convention | Exemple |
|------|------------|---------|
| Component | `kebab-case.component.ts` | `member-card.component.ts` |
| Service | `kebab-case.service.ts` | `payment.service.ts` |
| Guard | `kebab-case.guard.ts` | `auth.guard.ts` |
| Interceptor | `kebab-case.interceptor.ts` | `tenant.interceptor.ts` |
| Pipe | `kebab-case.pipe.ts` | `currency-xaf.pipe.ts` |
| Directive | `kebab-case.directive.ts` | `has-permission.directive.ts` |
| Interface/Model | `kebab-case.model.ts` | `tontine.model.ts` |
| Enum | `kebab-case.enum.ts` | `payment-type.enum.ts` |
| Store | `kebab-case.store.ts` | `payment.store.ts` |
| Routes | `kebab-case.routes.ts` | `members.routes.ts` |

### Structure d'un Feature Module

```
features/members/
├── pages/                   # Pages/Composants routés
│   ├── member-list/
│   │   ├── member-list.component.ts
│   │   ├── member-list.component.html
│   │   └── member-list.component.spec.ts
│   └── member-detail/
├── components/              # Composants internes au feature
│   ├── member-card/
│   └── role-badge/
├── services/
│   └── member.service.ts
├── state/                   # State management (Signals)
│   └── member.store.ts
└── members.routes.ts
```

---

## 🎯 Patterns à Suivre

### 1. Standalone Components (Obligatoire)

```typescript
// ✅ BON
@Component({
  selector: 'app-member-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './member-card.component.html'
})
export class MemberCardComponent {}

// ❌ MAUVAIS - Ne pas utiliser de NgModules
@NgModule({...})
export class MembersModule {}
```

### 2. State Management avec Signals

```typescript
// ✅ BON - Utiliser Signals pour le state
@Injectable({ providedIn: 'root' })
export class MemberStore {
  private _members = signal<Member[]>([]);
  private _isLoading = signal(false);
  
  readonly members = this._members.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly memberCount = computed(() => this._members().length);
  
  async loadMembers(): Promise<void> {
    this._isLoading.set(true);
    try {
      const members = await this.memberService.getAll();
      this._members.set(members);
    } finally {
      this._isLoading.set(false);
    }
  }
}

// ❌ MAUVAIS - Ne pas utiliser BehaviorSubject pour le state
private members$ = new BehaviorSubject<Member[]>([]);
```

### 3. Injection de Dépendances

```typescript
// ✅ BON - Utiliser inject()
export class MemberListComponent {
  private memberStore = inject(MemberStore);
  private tenantService = inject(TenantService);
}

// ❌ MAUVAIS - Ne pas utiliser constructor injection
constructor(private memberStore: MemberStore) {}
```

### 4. Routes avec Lazy Loading

```typescript
// ✅ BON
export const routes: Routes = [
  {
    path: 'members',
    loadChildren: () => import('./features/members/members.routes')
      .then(m => m.MEMBER_ROUTES)
  }
];

// ❌ MAUVAIS - Import direct
import { MemberListComponent } from './features/members/...';
```

### 5. HTTP avec l'intercepteur Tenant

```typescript
// L'intercepteur ajoute automatiquement X-Tenant-ID
// Ne jamais ajouter manuellement le tenant dans les services
@Injectable({ providedIn: 'root' })
export class MemberService {
  private http = inject(HttpClient);
  private apiUrl = inject(API_URL);
  
  // ✅ BON - URL relative, le tenant est dans le header
  getAll(): Observable<Member[]> {
    return this.http.get<Member[]>(`${this.apiUrl}/members`);
  }
}
```

### 6. Permissions Dynamiques

```typescript
// Dans les templates
<button *hasPermission="'PAYMENT_RECORD'">
  Enregistrer paiement
</button>

// Dans les composants
export class PaymentComponent {
  private permissionService = inject(PermissionService);
  
  readonly canRecordPayment = computed(() => 
    this.permissionService.can().recordPayment
  );
}

// Dans les routes
{
  path: 'payments',
  canActivate: [permissionGuard],
  data: { permissions: ['PAYMENT_VIEW'] }
}
```

---

## 🎨 Design System (Tailwind CSS)

### Composants UI

Les composants UI partagés doivent être dans `shared/components/ui/` :

```typescript
// shared/components/ui/button/button.component.ts
@Component({
  selector: 'ui-button',
  standalone: true,
  template: `
    <button 
      [class]="buttonClasses()"
      [disabled]="disabled()"
      (click)="onClick.emit($event)">
      <ng-content />
    </button>
  `
})
export class ButtonComponent {
  variant = input<'primary' | 'secondary' | 'danger'>('primary');
  size = input<'sm' | 'md' | 'lg'>('md');
  disabled = input(false);
  onClick = output<MouseEvent>();
  
  buttonClasses = computed(() => {
    const base = 'rounded-lg font-medium transition-colors';
    const variants = {
      primary: 'bg-primary-600 text-white hover:bg-primary-700',
      secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
      danger: 'bg-red-600 text-white hover:bg-red-700'
    };
    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg'
    };
    return `${base} ${variants[this.variant()]} ${sizes[this.size()]}`;
  });
}
```

### Classes Tailwind Personnalisées

```css
/* Couleurs du projet */
@theme {
  --color-primary-50: #f0fdf4;
  --color-primary-500: #22c55e;
  --color-primary-600: #16a34a;
  --color-primary-700: #15803d;
}
```

---

## 🌐 Multi-Langue (Transloco)

### Structure des Fichiers

```
assets/i18n/
├── fr.json          # Français (par défaut)
└── en.json          # Anglais
```

### Utilisation

```typescript
// Dans les templates
<h1>{{ 'dashboard.title' | transloco }}</h1>

// Dans les composants
export class DashboardComponent {
  private translocoService = inject(TranslocoService);
  
  title = this.translocoService.translate('dashboard.title');
}
```

### Convention de Clés

```json
{
  "common": {
    "save": "Enregistrer",
    "cancel": "Annuler",
    "delete": "Supprimer"
  },
  "members": {
    "title": "Membres",
    "addMember": "Ajouter un membre"
  },
  "payments": {
    "title": "Paiements",
    "recordPayment": "Enregistrer un paiement"
  }
}
```

---

## 🔐 Rôles et Permissions

### Rôles Disponibles

| Rôle | Code | Description |
|------|------|-------------|
| Président | `PRESIDENT` | Superviseur de la tontine |
| Vice-Président | `VICE_PRESIDENT` | Suppléant du président |
| Secrétaire | `SECRETARY` | Gestion des réunions |
| Trésorier | `TREASURER` | Gestion financière |
| Commissaire aux comptes | `AUDITOR` | Audit des comptes |
| Censeur | `CENSOR` | Application des sanctions |
| Membre | `MEMBER` | Membre standard |

### Permissions Clés

```typescript
// Permissions à vérifier côté frontend
export const PERMISSIONS = {
  // Tontine
  TONTINE_CREATE: 'tontine:create',
  TONTINE_CONFIG: 'tontine:config',
  
  // Membres
  MEMBER_VIEW: 'member:view',
  MEMBER_MANAGE: 'member:manage',
  MEMBER_INVITE: 'member:invite',
  
  // Sessions
  SESSION_CREATE: 'session:create',
  SESSION_MANAGE: 'session:manage',
  ATTENDANCE_MARK: 'attendance:mark',
  
  // Paiements
  PAYMENT_VIEW: 'payment:view',
  PAYMENT_RECORD: 'payment:record',
  DISTRIBUTION_MANAGE: 'distribution:manage',
  
  // Prêts
  LOAN_REQUEST: 'loan:request',
  LOAN_APPROVE: 'loan:approve',
  
  // Sanctions
  SANCTION_VIEW: 'sanction:view',
  SANCTION_APPLY: 'sanction:apply',
  
  // Rapports
  REPORT_VIEW: 'report:view',
  REPORT_EXPORT: 'report:export'
} as const;
```

---

## 💰 Données Métier

### Devise

- **Devise** : XAF (Franc CFA)
- **Format** : `1 000 000 FCFA`

```typescript
// Utiliser le pipe currency-xaf
{{ amount | currencyXaf }}
// Output: 50 000 FCFA
```

### Régions du Cameroun

```typescript
export const CAMEROON_REGIONS = [
  'Adamaoua',
  'Centre',
  'Est',
  'Extrême-Nord',
  'Littoral',
  'Nord',
  'Nord-Ouest',
  'Ouest',
  'Sud',
  'Sud-Ouest'
] as const;
```

### Numéros de Téléphone

```typescript
// Format : +237 6XX XXX XXX
// Validation
export const CAMEROON_PHONE_REGEX = /^\+237[26][0-9]{8}$/;
```

---

## 📁 Imports et Exports

### Index Files

Chaque dossier doit avoir un `index.ts` pour faciliter les imports :

```typescript
// shared/components/ui/index.ts
export * from './button/button.component';
export * from './card/card.component';
export * from './modal/modal.component';

// Usage
import { ButtonComponent, CardComponent } from '@shared/components/ui';
```

### Path Aliases (tsconfig.json)

```json
{
  "compilerOptions": {
    "paths": {
      "@core/*": ["src/app/core/*"],
      "@shared/*": ["src/app/shared/*"],
      "@features/*": ["src/app/features/*"],
      "@layouts/*": ["src/app/layouts/*"],
      "@env": ["src/environments/environment"]
    }
  }
}
```

---

## 🧪 Tests

### Convention de Nommage

```typescript
// member.service.spec.ts
describe('MemberService', () => {
  describe('getAll', () => {
    it('should return all members for current tenant', () => {});
    it('should handle empty response', () => {});
    it('should throw error when not authenticated', () => {});
  });
});
```

### Test avec Signals

```typescript
import { TestBed } from '@angular/core/testing';

describe('MemberStore', () => {
  it('should update members signal', () => {
    const store = TestBed.inject(MemberStore);
    
    store.setMembers([mockMember]);
    
    expect(store.members()).toEqual([mockMember]);
    expect(store.memberCount()).toBe(1);
  });
});
```

---

## 🚫 À Ne Pas Faire

1. **Ne pas** utiliser NgModules (toujours Standalone)
2. **Ne pas** utiliser BehaviorSubject pour le state (utiliser Signals)
3. **Ne pas** injecter le tenant manuellement (utiliser l'interceptor)
4. **Ne pas** hardcoder les permissions (les charger du backend)
5. **Ne pas** utiliser des imports relatifs profonds (`../../../`)
6. **Ne pas** mettre de logique métier dans les composants
7. **Ne pas** créer de composants non-standalone
8. **Ne pas** utiliser `constructor` pour l'injection (utiliser `inject()`)

---

## ✅ Checklist Nouveau Composant

- [ ] Composant `standalone: true`
- [ ] Utilise `inject()` pour les dépendances
- [ ] Signals pour les inputs (`input()`, `input.required()`)
- [ ] Signals pour les outputs (`output()`)
- [ ] Computed pour les dérivations (`computed()`)
- [ ] Classes Tailwind (pas de CSS custom sauf exception)
- [ ] Traductions avec Transloco (pas de texte en dur)
- [ ] Tests unitaires créés
- [ ] Exporté dans le `index.ts` du dossier

---

## 📚 Ressources

- [Angular 21 Documentation](https://angular.dev)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Transloco](https://ngneat.github.io/transloco/)
- [Keycloak Angular](https://github.com/mauriciovigolo/keycloak-angular)
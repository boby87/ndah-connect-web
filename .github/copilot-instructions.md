# Copilot Instructions — Ndah Connect

## 1. Contexte du Projet

**Ndah Connect** est une application Angular 21 de gestion de tontines multi-tenant destinée au marché camerounais.

### Stack Technique

| Élément         | Technologie                              |
|-----------------|------------------------------------------|
| Framework       | Angular 21.1.0 (Standalone Components)   |
| State Management| Angular Signals + Services               |
| Forms           | Signal Forms (Preview Angular 21)        |
| CSS             | Tailwind CSS v4.1.12                     |
| i18n            | Transloco                                |
| Auth            | Keycloak                                 |
| Tests           | Vitest                                   |
| API             | REST                                     |

### Architecture Multi-Tenant

- **Stratégie** : Header/Token (`X-Tenant-ID`)
- Un utilisateur peut appartenir à **plusieurs tontines**
- Les permissions sont **dynamiques** (chargées depuis le backend)

---

## 2. Structure du Projet

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

## 3. Conventions de Code

### Nommage des Fichiers

| Type            | Convention                  | Exemple                        |
|-----------------|-----------------------------|--------------------------------|
| Component       | `kebab-case.component.ts`   | `member-card.component.ts`     |
| Service         | `kebab-case.service.ts`     | `payment.service.ts`           |
| Guard           | `kebab-case.guard.ts`       | `auth.guard.ts`                |
| Interceptor     | `kebab-case.interceptor.ts` | `tenant.interceptor.ts`        |
| Pipe            | `kebab-case.pipe.ts`        | `currency-xaf.pipe.ts`         |
| Directive       | `kebab-case.directive.ts`   | `has-permission.directive.ts`  |
| Interface/Model | `kebab-case.model.ts`       | `tontine.model.ts`             |
| Enum            | `kebab-case.enum.ts`        | `payment-type.enum.ts`         |
| Store           | `kebab-case.store.ts`       | `payment.store.ts`             |
| Routes          | `kebab-case.routes.ts`      | `members.routes.ts`            |

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

## 4. Patterns Obligatoires

### A. Standalone Components (Obligatoire)

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

### B. State Management avec Signals

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
```

### C. Signal Forms (Angular 21 Preview)

```typescript
// ✅ BON - Utiliser Signal Forms pour les formulaires
// Note: Signal Forms est en preview dans Angular 21. Vérifier le chemin d'import exact
// dans la documentation officielle Angular avant utilisation.
import { SignalFormGroup, SignalFormControl } from '@angular/forms';

export class MemberFormComponent {
  readonly form = new SignalFormGroup({
    firstName: new SignalFormControl('', {
      validators: [Validators.required, Validators.minLength(2)]
    }),
    lastName: new SignalFormControl('', {
      validators: [Validators.required]
    }),
    email: new SignalFormControl('', {
      validators: [Validators.required, Validators.email]
    }),
    phone: new SignalFormControl('', {
      validators: [Validators.required, Validators.pattern(/^\+237[26][0-9]{8}$/)]
    }),
    region: new SignalFormControl<CameroonRegion | null>(null, {
      validators: [Validators.required]
    })
  });

  readonly isValid = computed(() => this.form.valid());
  readonly firstNameErrors = computed(() => this.form.controls.firstName.errors());

  onSubmit(): void {
    if (this.form.valid()) {
      const values = this.form.value();
      // ...
    }
  }
}
```

```html
<!-- Dans le template -->
<form (ngSubmit)="onSubmit()">
  <input [formControl]="form.controls.firstName" />
  @if (form.controls.firstName.touched() && firstNameErrors()) {
    <span class="text-red-500">Prénom requis</span>
  }
</form>
```

```typescript
// ❌ MAUVAIS - Ne pas utiliser Reactive Forms classiques pour les nouveaux formulaires
this.form = this.fb.group({...});
```

### D. Injection de Dépendances

```typescript
// ✅ BON - Utiliser inject()
export class MemberListComponent {
  private memberStore = inject(MemberStore);
  private tenantService = inject(TenantService);
}

// ❌ MAUVAIS - Ne pas utiliser constructor injection
constructor(private memberStore: MemberStore) {}
```

### E. Routes avec Lazy Loading

```typescript
// ✅ BON
export const routes: Routes = [
  {
    path: 'members',
    loadChildren: () => import('./features/members/members.routes')
      .then(m => m.MEMBER_ROUTES)
  }
];
```

### F. HTTP avec l'intercepteur Tenant

```typescript
// L'intercepteur ajoute automatiquement X-Tenant-ID
@Injectable({ providedIn: 'root' })
export class MemberService {
  private http = inject(HttpClient);
  private apiUrl = inject(API_URL);

  getAll(): Observable<Member[]> {
    return this.http.get<Member[]>(`${this.apiUrl}/members`);
  }
}
```

### G. Permissions Dynamiques

```typescript
// Dans les templates avec la nouvelle syntaxe @if
@if (permissionService.can().recordPayment) {
  <button>Enregistrer paiement</button>
}

// Ou avec une directive structurelle custom (syntaxe * toujours valide pour les directives custom)
<button *hasPermission="'PAYMENT_RECORD'">
  Enregistrer paiement
</button>
```

---

## 5. Design System (Tailwind CSS v4)

### Composants UI avec Signals

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
    const base = 'rounded-lg font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';
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

---

## 6. Multi-Langue (Transloco)

### Structure

```
src/assets/i18n/
├── fr.json          # Français (par défaut)
└── en.json          # Anglais
```

### Convention de Clés

```json
{
  "common": {
    "save": "Enregistrer",
    "cancel": "Annuler",
    "delete": "Supprimer",
    "loading": "Chargement...",
    "error": "Une erreur est survenue"
  },
  "members": {
    "title": "Membres",
    "addMember": "Ajouter un membre",
    "editMember": "Modifier le membre"
  },
  "payments": {
    "title": "Paiements",
    "recordPayment": "Enregistrer un paiement",
    "amount": "Montant"
  },
  "validation": {
    "required": "Ce champ est requis",
    "email": "Email invalide",
    "phone": "Numéro de téléphone invalide"
  }
}
```

---

## 7. Rôles et Permissions

### Rôles Disponibles

| Rôle                    | Code              | Description                   |
|-------------------------|-------------------|-------------------------------|
| Président               | `PRESIDENT`       | Superviseur de la tontine     |
| Vice-Président          | `VICE_PRESIDENT`  | Suppléant du président        |
| Secrétaire              | `SECRETARY`       | Gestion des réunions          |
| Trésorier               | `TREASURER`       | Gestion financière            |
| Commissaire aux comptes | `AUDITOR`         | Audit des comptes             |
| Censeur                 | `CENSOR`          | Application des sanctions     |
| Membre                  | `MEMBER`          | Membre standard               |

### Permissions

```typescript
export const PERMISSIONS = {
  TONTINE_CREATE:       'tontine:create',
  TONTINE_CONFIG:       'tontine:config',
  MEMBER_VIEW:          'member:view',
  MEMBER_MANAGE:        'member:manage',
  MEMBER_INVITE:        'member:invite',
  SESSION_CREATE:       'session:create',
  SESSION_MANAGE:       'session:manage',
  ATTENDANCE_MARK:      'attendance:mark',
  PAYMENT_VIEW:         'payment:view',
  PAYMENT_RECORD:       'payment:record',
  DISTRIBUTION_MANAGE:  'distribution:manage',
  LOAN_REQUEST:         'loan:request',
  LOAN_APPROVE:         'loan:approve',
  SANCTION_VIEW:        'sanction:view',
  SANCTION_APPLY:       'sanction:apply',
  REPORT_VIEW:          'report:view',
  REPORT_EXPORT:        'report:export'
} as const;
```

---

## 8. Données Métier Cameroun

### Devise

- **Devise** : XAF (Franc CFA)
- **Format** : `1 000 000 FCFA`

### Régions

```typescript
export const CAMEROON_REGIONS = [
  'Adamaoua', 'Centre', 'Est', 'Extrême-Nord', 'Littoral',
  'Nord', 'Nord-Ouest', 'Ouest', 'Sud', 'Sud-Ouest'
] as const;
```

### Téléphone

```typescript
export const CAMEROON_PHONE_REGEX = /^\+237[26][0-9]{8}$/;
```

---

## 9. Path Aliases

```json
{
  "compilerOptions": {
    "paths": {
      "@core/*":     ["src/app/core/*"],
      "@shared/*":   ["src/app/shared/*"],
      "@features/*": ["src/app/features/*"],
      "@layouts/*":  ["src/app/layouts/*"],
      "@env":        ["src/environments/environment"]
    }
  }
}
```

---

## 10. À Ne Pas Faire

1. ❌ Ne pas utiliser NgModules (toujours Standalone)
2. ❌ Ne pas utiliser BehaviorSubject pour le state (utiliser Signals)
3. ❌ Ne pas utiliser Reactive Forms classiques (utiliser Signal Forms)
4. ❌ Ne pas injecter le tenant manuellement (utiliser l'interceptor)
5. ❌ Ne pas hardcoder les permissions (les charger du backend)
6. ❌ Ne pas utiliser des imports relatifs profonds (`../../../`)
7. ❌ Ne pas mettre de logique métier dans les composants
8. ❌ Ne pas utiliser `constructor` pour l'injection (utiliser `inject()`)
9. ❌ Ne pas utiliser `@Input()` / `@Output()` decorators (utiliser `input()` / `output()`)

---

## 11. Checklist Nouveau Composant

- [ ] Composant `standalone: true`
- [ ] Utilise `inject()` pour les dépendances
- [ ] Signals pour les inputs (`input()`, `input.required()`)
- [ ] Signals pour les outputs (`output()`)
- [ ] Computed pour les dérivations (`computed()`)
- [ ] Signal Forms pour les formulaires (si applicable)
- [ ] Classes Tailwind (pas de CSS custom sauf exception)
- [ ] Traductions avec Transloco (pas de texte en dur)
- [ ] Tests unitaires créés
- [ ] Exporté dans le `index.ts` du dossier

---

## 12. Checklist Nouveau Feature Module

- [ ] Dossier créé dans `src/app/features/`
- [ ] Structure respectée (pages/, components/, services/, state/)
- [ ] Fichier routes `feature-name.routes.ts`
- [ ] Lazy loading configuré dans `app.routes.ts`
- [ ] Store créé si state nécessaire
- [ ] Guard de permission si accès restreint
- [ ] Traductions ajoutées dans les fichiers i18n

---

## Notes

- **Signal Forms** est en preview dans Angular 21. Si l'API change, adapter le code.
- Pour les formulaires complexes existants, la migration vers Signal Forms peut être progressive.
- Toujours vérifier la compatibilité des nouvelles features Angular avant utilisation en production.

# 🚀 Guide de Démarrage Rapide - Ndah Connect

## Installation et Lancement (5 minutes)

### 1️⃣ Prérequis
```bash
# Vérifiez Node.js (version 20+)
node --version     # v22.x.x ou plus récent
npm --version      # 11.x.x ou plus récent
```

### 2️⃣ Installation des Dépendances
```bash
cd ndah-connect
npm install
```

### 3️⃣ Lancer l'Application
```bash
npm start
```

L'application sera disponible à: **http://localhost:4200**

---

## 📖 Navigation dans l'App

### Barre Latérale (Sidebar)
- **📊 Tableau de Bord** → Statistiques et aperçu
- **👥 Membres** → Gestion de l'annuaire
- **💰 Prêts & Épargne** → Tontines et fonds
- **🤝 Solidarité** → Événements et entraide

### Barre d'En-tête (Header)
- 🔔 Notifications (placeholder)
- 👤 Profil utilisateur (placeholder)

---

## 📁 Où Modifier Quoi ?

### Ajouter une Nouvelle Page

1. **Créez le composant** dans `src/app/features/new-feature/`
```bash
mkdir src/app/features/my-feature
touch src/app/features/my-feature/my-feature.component.ts
```

2. **Créez le composant** :
```typescript
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent, ButtonComponent } from '../../shared/components';

@Component({
  selector: 'app-my-feature',
  standalone: true,
  imports: [CommonModule, CardComponent, ButtonComponent],
  template: `
    <div class="space-y-6">
      <h1 class="text-3xl font-bold">Ma Page</h1>
      <app-card title="Contenu">
        <p>Bienvenue!</p>
      </app-card>
    </div>
  `
})
export class MyFeatureComponent {}
```

3. **Ajoutez la route** dans `src/app/app.routes.ts`:
```typescript
export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      // ... autres routes ...
      { path: 'my-feature', component: MyFeatureComponent }
    ]
  }
];
```

4. **Ajoutez à la navigation** dans `src/app/shared/layout/layout.component.ts`:
```typescript
navItems: NavItem[] = [
  // ... autres items ...
  { label: 'Ma Fonctionnalité', route: '/my-feature', icon: '✨' }
];
```

---

### Créer un Nouveau Service

```typescript
// src/app/shared/services/my-service.ts
import { Injectable } from '@angular/core';
import { signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MyService {
  // Créez un signal
  private dataSignal = signal<any[]>([]);
  
  // Exposez en lecture seule
  public data = this.dataSignal.asReadonly();
  
  // Créez un computed signal
  public count = computed(() => this.dataSignal().length);
  
  // Méthodes pour mettre à jour
  addItem(item: any) {
    this.dataSignal.update(items => [...items, item]);
  }
  
  removeItem(id: string) {
    this.dataSignal.update(items =>
      items.filter(i => i.id !== id)
    );
  }
}
```

Puis utilisez dans un composant:
```typescript
export class MyComponent {
  myService = inject(MyService);
  
  data = this.myService.data;        // Signal
  count = this.myService.count;      // Computed Signal
}
```

---

### Créer un Composant Réutilisable

```typescript
// src/app/shared/components/my-component.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white p-4 rounded-lg border">
      <h3>{{ title }}</h3>
      <ng-content></ng-content>
      <button (click)="onAction()">{{ actionLabel }}</button>
    </div>
  `
})
export class MyComponentComponent {
  @Input() title: string = '';
  @Input() actionLabel: string = 'Action';
  @Output() action = new EventEmitter<void>();
  
  onAction() {
    this.action.emit();
  }
}
```

Puis exportez dans `src/app/shared/components/index.ts`:
```typescript
export * from './my-component.component';
```

Et utilisez:
```html
<app-my-component 
  title="Mon Composant"
  actionLabel="Cliquez-moi"
  (action)="myMethod()">
  Contenu intérieur
</app-my-component>
```

---

## 🎨 Personnaliser les Styles

### Tailwind Classes (Recommandé)
```html
<!-- Couleurs -->
<div class="bg-blue-500 text-white">Bleu</div>
<div class="bg-green-100 text-green-800">Vert clair</div>

<!-- Spacing -->
<div class="p-4 m-2 gap-3">Padding et margin</div>

<!-- Responsive -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  Responsive grid
</div>

<!-- Flexbox -->
<div class="flex items-center justify-between gap-4">
  Flexbox
</div>
```

### Ajouter des Styles Globaux
```css
/* src/styles.css */
@import "tailwindcss";

@layer components {
  .my-custom-class {
    @apply px-4 py-2 bg-blue-600 text-white rounded-lg;
  }
}
```

---

## 📊 Travailler avec les Données

### Utiliser les Services

```typescript
export class MembersComponent {
  memberService = inject(MemberService);
  
  // Accéder aux données (Signal)
  members = this.memberService.members;
  totalMembers = this.memberService.totalMembers;
  
  // Ajouter un membre
  addMember(data: any) {
    this.memberService.addMember(data);
  }
  
  // Template
  template = `
    <p>Total: {{ totalMembers() }}</p>
    @for (member of members(); track member.id) {
      {{ member.firstName }} {{ member.lastName }}
    }
  `;
}
```

### Computed Signals Avancés

```typescript
// Service
export class MyService {
  private itemsSignal = signal<Item[]>([...]);
  
  // Computed simple
  itemCount = computed(() => this.itemsSignal().length);
  
  // Computed avec logique
  activeItems = computed(() =>
    this.itemsSignal().filter(i => i.status === 'active')
  );
  
  // Computed combinant d'autres signals
  activeCount = computed(() =>
    this.activeItems().length
  );
  
  // Computed avec map
  itemNames = computed(() =>
    this.itemsSignal().map(i => i.name)
  );
}
```

---

## 🔍 Dépannage

### Le serveur ne démarre pas
```bash
# Supprimez node_modules et réinstallez
rm -r node_modules
npm install
npm start
```

### Erreurs TypeScript
```bash
# Vérifiez la syntaxe
npm run build

# Corrigez les erreurs affichées
```

### Port 4200 déjà utilisé
```bash
# Utilisez un autre port
ng serve --port 4201
```

### Styles Tailwind ne s'appliquent pas
```bash
# Vérifiez que styles.css est importé dans main.ts
# Vérifiez le postcss.config.json
# Récompillez: npm start
```

---

## 💡 Bonnes Pratiques

### ✅ Faire
```typescript
// Utiliser l'injection
constructor(private service: MyService) {}
// OU (recommandé)
service = inject(MyService);

// Utiliser Signals pour l'état simple
data = signal<string>('');

// Utiliser computed() pour les dérivations
count = computed(() => this.data().length);

// Utiliser @if et @for
@if (condition) { ... }
@for (item of items(); track item.id) { ... }
```

### ❌ Éviter
```typescript
// Ne pas créer trop de Subjects RxJS
subject$ = new Subject();

// Ne pas utiliser ngIf/ngFor
*ngIf="condition"
*ngFor="let item of items"

// Ne pas oublier track dans @for
@for (item of items()) { ... }  // ❌ Pas de track

// Ne pas modifier directement les signals
this.dataSignal().push(item);  // ❌ Mutation
this.dataSignal.update(d => [...d, item]);  // ✅ Immutable
```

---

## 📚 Resources Utiles

### Documentation Officielle
- [Angular 21 Docs](https://angular.io)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

### Fichiers Documentation du Projet
- `DOCUMENTATION.md` - Guide complet
- `PROJECT_SUMMARY.md` - Vue d'ensemble architecture
- `EXAMPLES.md` - Exemples de code
- `FILE_STRUCTURE.md` - Structure des fichiers

---

## 🔄 Workflow Développement

### 1. Créer une Feature
```bash
mkdir src/app/features/my-feature
touch src/app/features/my-feature/my-feature.component.ts
```

### 2. Créer les Services Nécessaires
```bash
touch src/app/shared/services/my-service.ts
```

### 3. Créer les Composants Réutilisables
```bash
touch src/app/shared/components/my-shared.component.ts
```

### 4. Ajouter les Routes
```typescript
// app.routes.ts
{ path: 'my-feature', component: MyFeatureComponent }
```

### 5. Tester dans le Navigateur
```bash
npm start
# http://localhost:4200/my-feature
```

### 6. Commiter les Changements
```bash
git add .
git commit -m "feat: add my-feature"
git push
```

---

## 🚀 Build pour Production

```bash
# Créer un build optimisé
npm run build

# Les fichiers seront dans dist/ndah-connect/
# Les servir statiquement ou déployer sur:
# - Vercel
# - Netlify
# - Firebase Hosting
# - AWS S3
# - etc.
```

---

## 📞 Aide et Support

Si vous avez des questions:
1. Consultez les fichiers de documentation
2. Vérifiez les exemples dans `EXAMPLES.md`
3. Cherchez dans la structure du projet
4. Lisez les commentaires du code

---

**Bon développement! 🎉**

*Ndah Connect - Application moderne avec Angular 21*


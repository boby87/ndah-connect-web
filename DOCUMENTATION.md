# Ndah Connect - Application de Gestion Communautaire

Une application Angular 21 moderne pour la gestion des fonds de tontine, des prêts, des épargnes et de la solidarité communautaire.

## 🎯 Fonctionnalités Principales

### 📊 Tableau de Bord
- Aperçu des statistiques financières
- Métriques clés (membres, fonds, prêts, intérêts)
- Suivi des prêts actifs
- Événements de solidarité récents

### 👥 Gestion des Membres
- Annuaire complet des membres
- Profils détaillés avec historique financier
- Discipline et présence
- Capacité d'emprunt calculée

### 💰 Prêts & Épargne
- Gestion des tontines et fonds
- Suivi des contributions
- Calcul des intérêts
- Progression des fonds en graphiques

### 🤝 Solidarité & Entraide
- Déclaration d'événements (naissances, mariages, décès)
- Gestion des contributions de solidarité
- Validation des demandes d'assistance
- Suivi des bénéficiaires

## 🏗️ Architecture

### Structure du Projet

```
src/
├── app/
│   ├── shared/
│   │   ├── components/         # Composants réutilisables
│   │   │   ├── metric-card.component.ts
│   │   │   ├── data-table.component.ts
│   │   │   ├── button.component.ts
│   │   │   ├── card.component.ts
│   │   │   ├── form-field.component.ts
│   │   │   ├── status-badge.component.ts
│   │   │   └── index.ts
│   │   ├── services/           # Services de gestion d'état avec Signals
│   │   │   ├── member.service.ts
│   │   │   ├── fund.service.ts
│   │   │   ├── event.service.ts
│   │   │   ├── dashboard.service.ts
│   │   │   └── index.ts
│   │   ├── models/             # Interfaces TypeScript
│   │   │   ├── member.model.ts
│   │   │   ├── fund.model.ts
│   │   │   ├── event.model.ts
│   │   │   ├── dashboard.model.ts
│   │   │   ├── transaction.model.ts
│   │   │   └── index.ts
│   │   ├── layout/             # Layout principal
│   │   │   ├── layout.component.ts
│   │   │   └── index.ts
│   │   └── utils/              # Utilitaires
│   │       ├── formatters.ts
│   │       └── index.ts
│   ├── features/               # Fonctionnalités principales
│   │   ├── dashboard/
│   │   │   └── dashboard.component.ts
│   │   ├── members/
│   │   │   ├── members.component.ts
│   │   │   └── member-profile.component.ts
│   │   ├── funds/
│   │   │   └── funds.component.ts
│   │   └── events/
│   │       └── events.component.ts
│   ├── app.ts
│   ├── app.html
│   ├── app.css
│   ├── app.routes.ts
│   └── app.config.ts
├── styles.css                  # Styles globaux Tailwind
└── main.ts
```

## 🚀 Technologies Utilisées

- **Angular 21** - Framework frontend
- **TypeScript 5.9** - Langage de programmation
- **Tailwind CSS 4.1** - Framework CSS utilitaire
- **RxJS 7.8** - Programmation réactive
- **Angular Router** - Routage

## ✨ Caractéristiques Modernes

### Signals (Angular 21)
- Gestion d'état réactive avec `signal()`
- Signaux calculés avec `computed()`
- Signaux en lecture seule avec `asReadonly()`

### Control Flow (@if, @for)
- Syntaxe `@if` pour rendu conditionnel
- Syntaxe `@for` pour listes avec suivi (`track`)
- Gestion du `@empty` pour états vides

### Composants Réutilisables
- **MetricCardComponent** - Affichage de métriques
- **DataTableComponent** - Tableau générique avec actions
- **ButtonComponent** - Boutons stylisés
- **CardComponent** - Conteneurs de contenu
- **FormFieldComponent** - Champs de formulaire
- **StatusBadgeComponent** - Badges de statut

### CSS Centralisé avec Tailwind
- Styles utilitaires pour tous les composants
- Configuration personnalisée (couleurs, espacement)
- Responsive design (mobile-first)
- Dark mode prêt

## 📦 Installation

### Prérequis
- Node.js 20+
- npm 11+

### Étapes d'installation

1. **Cloner le projet**
```bash
cd ndah-connect
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Lancer le serveur de développement**
```bash
npm start
```

L'application sera disponible à `http://localhost:4200`

## 🎨 Tailwind CSS Configuration

Le projet utilise Tailwind CSS v4 avec la configuration suivante :

### Colors principales
- **Primary**: Bleu 500-600 pour les actions
- **Success**: Vert pour les statuts positifs
- **Warning**: Orange pour les alertes
- **Danger**: Rouge pour les actions destructives
- **Gray**: Pour le texte et les bordures

### Spacing
- Utilisation de la grille Tailwind (4px base)
- Gap et padding cohérents
- Marges standardisées

## 💡 Patterns Utilisés

### Gestion d'État avec Signals

```typescript
// Service
private membersSignal = signal<Member[]>([...]);
public members = this.membersSignal.asReadonly();

// Composant
members = inject(MemberService).members;

// Template
@for (member of members(); track member.id) {
  {{ member.firstName }}
}
```

### Composants Réutilisables

```typescript
// Utilisation
<app-metric-card [metric]="metric"></app-metric-card>
<app-data-table [data]="members()" [columns]="columns"></app-data-table>
<app-button label="Ajouter" variant="primary" (click)="add()"></app-button>
```

### Routage

```typescript
const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'members/:id', component: MemberProfileComponent }
    ]
  }
];
```

## 📱 Interfaces Principales

### Membres
- Profil détaillé avec historique
- Discipline et présence
- Capacité d'emprunt
- Historique des transactions

### Fonds
- Tontines et épargne
- Contributions et versements
- Intérêts calculés
- Statut des fonds

### Événements
- Déclaration de naissances, mariages, deuils
- Validation et approbation
- Suivi des contributions de solidarité
- Assistance aux bénéficiaires

## 🔧 Commandes Disponibles

```bash
# Démarrer le serveur de développement
npm start

# Build pour production
npm run build

# Lancer les tests
npm test

# Watch mode (rebuild à chaque changement)
npm run watch
```

## 📋 Prochaines Améliorations

- [ ] Authentification et autorisation
- [ ] Formulaires réactifs avancés
- [ ] Filtrage et recherche avancée
- [ ] Export PDF/Excel
- [ ] Notifications en temps réel
- [ ] Mode hors ligne
- [ ] Statistiques avancées
- [ ] Graphiques interactifs

## 🛠️ Support et Contribution

Pour toute question ou contribution, veuillez contacter l'équipe de développement.

## 📄 Licence

Ce projet est propriétaire et confidentiel.

---

**Créé avec ❤️ pour la communauté**


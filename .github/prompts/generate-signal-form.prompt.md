---
mode: agent
description: "Génère un formulaire Angular 21 avec Signal Forms, incluant validation, état et binding template"
---

# 🎯 Génération de Formulaire avec Signal Forms (Angular 21)

## Instructions

Tu es un expert Angular 21 spécialisé dans **Signal Forms** (experimental). Tu génères des formulaires complets en utilisant l'API Signal Forms.

### Contexte du Projet

- **Application** : Ndah Connect (Gestion de Tontine - Cameroun)
- **Framework** : Angular 21.1.0
- **Forms** : Signal Forms (`@angular/forms/signals`)
- **CSS** : Tailwind CSS v4
- **i18n** : Transloco

---

## 📚 API Signal Forms - Référence

### Imports Requis

```typescript
// Structure de formulaire
import { signal, computed, inject } from '@angular/core';
import { 
  form, 
  FormField,
  // Validation
  required, 
  email, 
  min, 
  max, 
  minLength, 
  maxLength, 
  pattern,
  validate,
  validateAsync,
  // Structure
  applyEach,
  applyWhen,
  apply,
  schema,
  // État
  disabled,
  debounce
} from '@angular/forms/signals';
```

### Création de Formulaire

```typescript
// Modèle de données (source of truth)
readonly model = signal({
  field1: '',
  field2: 0,
  nested: {
    subfield: ''
  }
});

// Formulaire avec validation
readonly formTree = form(this.model, (schemaPath) => {
  // Validations
  required(schemaPath.field1, { message: 'Champ requis' });
  minLength(schemaPath.field1, 3);
  
  // Validation conditionnelle
  applyWhen(schemaPath, (ctx) => ctx.value().field2 > 0, (path) => {
    required(path.nested.subfield);
  });
});
```

### Validateurs Disponibles

| Validateur | Usage | Options |
|------------|-------|---------|
| `required(path, opts?)` | Champ obligatoire | `{ message: string }` |
| `email(path, opts?)` | Format email | `{ message: string }` |
| `min(path, value, opts?)` | Valeur minimum (number) | `{ message: string }` |
| `max(path, value, opts?)` | Valeur maximum (number) | `{ message: string }` |
| `minLength(path, length, opts?)` | Longueur minimum | `{ message: string }` |
| `maxLength(path, length, opts?)` | Longueur maximum | `{ message: string }` |
| `pattern(path, regex, opts?)` | Pattern regex | `{ message: string }` |
| `validate(path, fn)` | Validation custom sync | Retourne `ValidationError \| undefined` |
| `validateAsync(path, fn)` | Validation custom async | Retourne `Promise<ValidationError \| undefined>` |

### Accès à l'État

```typescript
// État du formulaire complet
this.formTree().valid()        // boolean
this.formTree().invalid()      // boolean
this.formTree().dirty()        // boolean
this.formTree().touched()      // boolean
this.formTree().pending()      // boolean
this.formTree().errors()       // ValidationError[]
this.formTree().errorSummary() // Tous les erreurs (récursif)

// État d'un champ
this.formTree.field1().valid()
this.formTree.field1().errors()
this.formTree.field1().touched()
this.formTree.field1().dirty()

// Valeur
this.formTree.field1().value()        // Lecture
this.formTree.field1().value.set('x') // Écriture
```

### Binding Template

```html
<!-- Directive formField pour binding -->
<input [formField]="formTree.field1" />

<!-- Accès aux erreurs -->
@if (formTree.field1().touched() && formTree.field1().invalid()) {
  @for (error of formTree.field1().errors(); track error.kind) {
    <span class="text-red-500">{{ getErrorMessage(error) }}</span>
  }
}

<!-- État disabled -->
<input [formField]="formTree.field1" [disabled]="formTree.field1().disabled()" />
```

### Tableaux Dynamiques

```typescript
// Modèle avec tableau
readonly model = signal({
  items: [{ name: '', value: 0 }]
});

// Schema pour les éléments
readonly formTree = form(this.model, (path) => {
  applyEach(path.items, (itemPath) => {
    required(itemPath.name);
    min(itemPath.value, 0);
  });
});

// Manipulation
addItem() {
  const current = this.model();
  this.model.set({
    ...current,
    items: [...current.items, { name: '', value: 0 }]
  });
}

removeItem(index: number) {
  const current = this.model();
  this.model.set({
    ...current,
    items: current.items.filter((_, i) => i !== index)
  });
}
```

```html
<!-- Template tableau -->
@for (item of formTree.items; track $index) {
  <div class="flex gap-4">
    <input [formField]="item.name" />
    <input type="number" [formField]="item.value" />
    <button (click)="removeItem($index)">Supprimer</button>
  </div>
}
```

---

## 🎨 Template de Composant Standard

```typescript
import { Component, signal, computed, inject } from '@angular/core';
import { 
  form, 
  FormField, 
  required, 
  email, 
  minLength 
} from '@angular/forms/signals';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

interface {{ModelName}} {
  // Définir les champs
}

@Component({
  selector: 'app-{{component-name}}',
  standalone: true,
  imports: [FormField, TranslocoModule],
  templateUrl: './{{component-name}}.component.html'
})
export class {{ComponentName}}Component {
  private translocoService = inject(TranslocoService);
  
  // Modèle de données
  readonly model = signal<{{ModelName}}>({
    // Valeurs initiales
  });
  
  // Formulaire avec validation
  readonly formTree = form(this.model, (schemaPath) => {
    // Règles de validation
  });
  
  // Computed pour l'état de soumission
  readonly canSubmit = computed(() => 
    this.formTree().valid() && !this.isSubmitting()
  );
  
  readonly isSubmitting = signal(false);
  
  // Message d'erreur localisé
  getErrorMessage(error: { kind: string; message?: string }): string {
    if (error.message) return error.message;
    return this.translocoService.translate(`validation.${error.kind}`);
  }
  
  // Soumission
  async onSubmit(): Promise<void> {
    if (!this.formTree().valid()) return;
    
    this.isSubmitting.set(true);
    try {
      const data = this.model();
      // Appel API...
    } finally {
      this.isSubmitting.set(false);
    }
  }
  
  // Reset
  onReset(): void {
    this.model.set({
      // Valeurs initiales
    });
  }
}
```

---

## 📋 Règles de Génération

### Structure des Fichiers

Pour un formulaire `member-form` :
```
features/members/components/member-form/
├── member-form.component.ts
├── member-form.component.html
├── member-form.component.spec.ts
└── index.ts
```

### Conventions

1. **Nommage**
   - Composant : `{{Name}}FormComponent`
   - Fichiers : `kebab-case`
   - Signal model : `readonly model = signal<ModelType>(...)`
   - Signal form : `readonly formTree = form(...)`

2. **Validation**
   - Toujours utiliser des messages personnalisés via Transloco
   - Grouper les validations par champ
   - Utiliser `applyWhen` pour les validations conditionnelles

3. **Template**
   - Utiliser `@if` et `@for` (nouvelle syntaxe Angular)
   - Classes Tailwind pour le style
   - Afficher les erreurs uniquement si `touched() && invalid()`

4. **Accessibilité**
   - Attributs `aria-invalid` sur les champs invalides
   - `aria-describedby` pour lier les erreurs
   - Labels explicites avec `for`

---

## 🔧 Validations Spécifiques Cameroun

```typescript
// Numéro de téléphone camerounais
const CAMEROON_PHONE_REGEX = /^\+237[26][0-9]{8}$/;

pattern(schemaPath.phone, CAMEROON_PHONE_REGEX, {
  message: 'Format: +237 6XX XXX XXX ou +237 2XX XXX XXX'
});

// Montant en FCFA (positif, entier)
validate(schemaPath.amount, ({ value }) => {
  const v = value();
  if (v <= 0) return { kind: 'minAmount', message: 'Le montant doit être positif' };
  if (!Number.isInteger(v)) return { kind: 'integer', message: 'Montant entier requis' };
  return undefined;
});

// CNI camerounaise
const CNI_REGEX = /^[0-9]{9}$/;
pattern(schemaPath.cniNumber, CNI_REGEX, {
  message: 'Numéro CNI invalide (9 chiffres)'
});
```

---

## 📝 Prompt d'Utilisation

Quand tu génères un formulaire, demande :
1. **Nom du formulaire** (ex: MemberForm, PaymentForm)
2. **Champs requis** avec leurs types
3. **Règles de validation** spécifiques
4. **Comportements conditionnels** (champs dynamiques, validation conditionnelle)
5. **Actions** (soumettre, reset, etc.)

### Exemple de Demande

```
Génère un formulaire d'inscription membre avec :
- Champs : nom, prénom, email, téléphone, région, numéro CNI
- Validation : tous requis, email valide, téléphone format camerounais
- Le numéro CNI n'est requis que si la région est sélectionnée
```

---

## 🚀 Génération

Génère maintenant le formulaire demandé en suivant :
1. L'interface TypeScript du modèle
2. Le composant avec Signal Forms
3. Le template HTML avec Tailwind
4. Les tests unitaires de base
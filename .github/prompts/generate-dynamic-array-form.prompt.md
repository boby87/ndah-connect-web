---
mode: agent
description: "Génère un formulaire Angular 21 avec Signal Forms contenant des tableaux dynamiques (add/remove items)"
---

# 🔄 Génération de Formulaire avec Tableaux Dynamiques

## Contexte

Ce prompt génère des formulaires avec des collections dynamiques (ajouter/supprimer des éléments).

## Pattern de Base

```typescript
import { Component, signal, computed } from '@angular/core';
import { form, FormField, required, applyEach } from '@angular/forms/signals';

interface ItemModel {
  id: string;
  name: string;
  amount: number;
}

interface FormModel {
  title: string;
  items: ItemModel[];
}

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [FormField],
  template: `
    <form (ngSubmit)="onSubmit()">
      <input [formField]="formTree.title" placeholder="Titre" />
      
      <div class="space-y-4">
        @for (item of formTree.items; track $index; let i = $index) {
          <div class="flex gap-4 items-start p-4 border rounded-lg">
            <div class="flex-1">
              <input [formField]="item.name" placeholder="Nom" class="w-full" />
              @if (item.name().touched() && item.name().invalid()) {
                <span class="text-red-500 text-sm">Nom requis</span>
              }
            </div>
            
            <div class="w-32">
              <input 
                type="number" 
                [formField]="item.amount" 
                placeholder="Montant"
                class="w-full" 
              />
            </div>
            
            <button 
              type="button" 
              (click)="removeItem(i)"
              class="text-red-600 hover:text-red-800"
              [disabled]="formTree.items.length <= 1">
              Supprimer
            </button>
          </div>
        }
      </div>
      
      <button type="button" (click)="addItem()" class="mt-4">
        + Ajouter un élément
      </button>
      
      <div class="mt-6 flex gap-4">
        <button type="submit" [disabled]="!canSubmit()">
          Enregistrer
        </button>
        <button type="button" (click)="onReset()">
          Réinitialiser
        </button>
      </div>
    </form>
  `
})
export class DynamicFormComponent {
  private readonly initialItems: ItemModel[] = [
    { id: crypto.randomUUID(), name: '', amount: 0 }
  ];
  
  readonly model = signal<FormModel>({
    title: '',
    items: [...this.initialItems]
  });
  
  readonly formTree = form(this.model, (schemaPath) => {
    required(schemaPath.title, { message: 'Titre requis' });
    
    applyEach(schemaPath.items, (itemPath) => {
      required(itemPath.name, { message: 'Nom requis' });
      min(itemPath.amount, 0, { message: 'Montant positif requis' });
    });
  });
  
  readonly canSubmit = computed(() => this.formTree().valid());
  
  addItem(): void {
    const current = this.model();
    this.model.set({
      ...current,
      items: [
        ...current.items,
        { id: crypto.randomUUID(), name: '', amount: 0 }
      ]
    });
  }
  
  removeItem(index: number): void {
    const current = this.model();
    if (current.items.length <= 1) return;
    
    this.model.set({
      ...current,
      items: current.items.filter((_, i) => i !== index)
    });
  }
  
  onSubmit(): void {
    if (!this.formTree().valid()) return;
    console.log('Submit:', this.model());
  }
  
  onReset(): void {
    this.model.set({
      title: '',
      items: [...this.initialItems]
    });
  }
}
```

## Cas d'Usage Tontine

### Formulaire de Distribution avec Bénéficiaires Multiples

```typescript
interface Beneficiary {
  memberId: string;
  memberName: string;
  amount: number;
  percentage: number;
}

interface DistributionModel {
  sessionId: string;
  totalAmount: number;
  beneficiaries: Beneficiary[];
  notes: string;
}
```

### Formulaire de Cotisation Extraordinaire avec Contributeurs

```typescript
interface Contributor {
  memberId: string;
  amount: number;
  paid: boolean;
  paidAt?: Date;
}

interface ExtraordinaryContributionModel {
  eventType: 'DEATH' | 'MARRIAGE' | 'BIRTH' | 'ILLNESS';
  description: string;
  beneficiaryId: string;
  amountPerMember: number;
  contributors: Contributor[];
  deadline: Date;
}
```

## Règles

1. **Toujours** utiliser `track $index` ou un ID unique dans `@for`
2. **Minimum 1 élément** dans le tableau (désactiver suppression si 1 seul)
3. **Valider chaque élément** avec `applyEach`
4. **Générer des IDs uniques** avec `crypto.randomUUID()`
5. **Cloner les tableaux** lors des modifications (immutabilité)
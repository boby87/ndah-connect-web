import { ChangeDetectionStrategy, Component, computed, inject, resource, signal } from '@angular/core';
import { AlertComponent } from '../../../../shared/components/ui/alert/alert.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { EmptyStateComponent } from '../../../../shared/components/ui/empty-state/empty-state.component';
import { InputComponent } from '../../../../shared/components/ui/input/input.component';
import { TextareaComponent } from '../../../../shared/components/ui/textarea/textarea.component';
import { CurrencyXafPipe } from '../../../../shared/pipes/currency-xaf.pipe';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { NotificationService } from '../../../../core/services/notification.service';
import {
  EXPENSE_CATEGORY_LABELS,
  type ExpenseCategory,
  type ExpenseStatus,
} from '../../../../shared/models/entities/treasury.model';
import { TreasurerService } from '../../services/treasurer.service';

const CATEGORIES: ExpenseCategory[] = ['VENUE', 'SUPPLIES', 'TRANSPORT', 'COMMUNICATION', 'ADMIN_FEES', 'EVENT', 'OTHER'];

const STATUS_LABELS: Record<ExpenseStatus, string> = {
  DRAFT: 'Brouillon',
  PENDING_VALIDATION: 'En attente validation',
  APPROVED: 'Approuvée',
  PAID: 'Payée',
  REJECTED: 'Rejetée',
};

@Component({
  selector: 'tc-expenses-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AlertComponent,
    BadgeComponent,
    ButtonComponent,
    CardComponent,
    EmptyStateComponent,
    InputComponent,
    TextareaComponent,
    CurrencyXafPipe,
    DateFormatPipe,
  ],
  template: `
    <div class="space-y-6">
      <header>
        <h1 class="text-2xl font-bold text-gray-900">Dépenses</h1>
        <p class="text-sm text-gray-500">
          Le justificatif est obligatoire (RM-DE01). Les dépenses supérieures à 100 000 XAF nécessitent validation Président + Commissaire (RM-DE02).
        </p>
      </header>

      @if (errorMessage(); as err) {
        <tc-alert kind="error">{{ err }}</tc-alert>
      }

      <div class="grid gap-6 lg:grid-cols-3">
        <div class="lg:col-span-2 space-y-3">
          @if (resource.isLoading()) {
            <p class="text-sm text-gray-500">Chargement…</p>
          } @else if (expenses().length === 0) {
            <tc-card>
              <tc-empty-state title="Aucune dépense" icon="💸" />
            </tc-card>
          } @else {
            @for (e of expenses(); track e.id) {
              <tc-card>
                <div class="flex flex-wrap items-start justify-between gap-3">
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-2 flex-wrap">
                      <p class="font-semibold text-gray-900">{{ e.description }}</p>
                      <tc-badge kind="info">{{ EXPENSE_CATEGORY_LABELS[e.category] }}</tc-badge>
                      <tc-badge [kind]="statusKind(e.status)">{{ STATUS_LABELS[e.status] }}</tc-badge>
                    </div>
                    <p class="text-2xl font-bold text-gray-900 mt-1">{{ e.amount | xaf }}</p>
                    @if (e.vendor) {
                      <p class="text-sm text-gray-600 mt-1">Fournisseur : {{ e.vendor }}</p>
                    }
                    @if (e.receiptFileName) {
                      <p class="text-xs text-gray-500 mt-1">📎 {{ e.receiptFileName }}</p>
                    }
                    <p class="text-xs text-gray-500 mt-1">
                      Créée par {{ e.createdByFullName }} le {{ e.createdAt | tcDate: true }}
                      @if (e.paidAt) { · payée le {{ e.paidAt | tcDate }} }
                    </p>
                  </div>
                </div>
              </tc-card>
            }
          }
        </div>

        <aside>
          <tc-card title="Nouvelle dépense">
            <form class="space-y-4" (submit)="onSubmit($event)">
              <div>
                <label class="text-sm font-medium text-gray-700">Catégorie</label>
                <select class="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm" [value]="category()" (change)="onCategoryChange($event)">
                  @for (c of categories; track c) {
                    <option [value]="c">{{ EXPENSE_CATEGORY_LABELS[c] }}</option>
                  }
                </select>
              </div>
              <tc-input
                label="Montant (XAF)"
                type="number"
                [(value)]="amount"
                [(touched)]="amountTouched"
                [error]="amountError()"
                [required]="true"
              />
              <tc-textarea
                label="Description"
                [(value)]="description"
                [(touched)]="descTouched"
                [error]="descError()"
                [rows]="3"
                [required]="true"
              />
              <tc-input label="Fournisseur" [(value)]="vendor" />
              <tc-input
                label="Justificatif (nom fichier)"
                [(value)]="receipt"
                [(touched)]="receiptTouched"
                [error]="receiptError()"
                hint="ex: facture-loyer.pdf — obligatoire (RM-DE01)"
                [required]="true"
              />
              @if (Number(amount()) > 100000) {
                <tc-alert kind="warning">
                  Dépense &gt; 100 000 XAF : validation Président + Commissaire requise.
                </tc-alert>
              }
              <tc-button type="submit" variant="primary" [fullWidth]="true" [loading]="submitting()">
                Enregistrer la dépense
              </tc-button>
            </form>
          </tc-card>
        </aside>
      </div>
    </div>
  `,
})
export class ExpensesPageComponent {
  private readonly service = inject(TreasurerService);
  private readonly notifications = inject(NotificationService);

  protected readonly categories = CATEGORIES;
  protected readonly EXPENSE_CATEGORY_LABELS = EXPENSE_CATEGORY_LABELS;
  protected readonly STATUS_LABELS = STATUS_LABELS;
  protected readonly Number = Number;

  readonly resource = resource({
    loader: () => this.service.getExpenses(),
  });

  readonly expenses = computed(() =>
    [...(this.resource.value() ?? [])].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    ),
  );

  readonly category = signal<ExpenseCategory>('VENUE');
  readonly amount = signal('');
  readonly amountTouched = signal(false);
  readonly description = signal('');
  readonly descTouched = signal(false);
  readonly vendor = signal('');
  readonly receipt = signal('');
  readonly receiptTouched = signal(false);

  readonly submitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly amountError = computed(() => {
    const n = Number(this.amount());
    return Number.isFinite(n) && n > 0 ? '' : 'Montant invalide.';
  });
  readonly descError = computed(() => (this.description().trim() ? '' : 'Description requise.'));
  readonly receiptError = computed(() => (this.receipt().trim() ? '' : 'Justificatif requis.'));

  statusKind(s: ExpenseStatus): 'success' | 'warning' | 'danger' | 'neutral' {
    if (s === 'PAID' || s === 'APPROVED') return 'success';
    if (s === 'PENDING_VALIDATION' || s === 'DRAFT') return 'warning';
    if (s === 'REJECTED') return 'danger';
    return 'neutral';
  }

  onCategoryChange(event: Event): void {
    this.category.set((event.target as HTMLSelectElement).value as ExpenseCategory);
  }

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.amountTouched.set(true);
    this.descTouched.set(true);
    this.receiptTouched.set(true);
    this.errorMessage.set(null);

    if (this.amountError() || this.descError() || this.receiptError()) return;

    this.submitting.set(true);
    try {
      await this.service.createExpense({
        category: this.category(),
        amount: Number(this.amount()),
        description: this.description().trim(),
        vendor: this.vendor().trim() || undefined,
        receiptFileName: this.receipt().trim(),
        cashBoxId: 'cb-1',
      });
      this.notifications.success('Dépense enregistrée.');
      this.amount.set('');
      this.description.set('');
      this.vendor.set('');
      this.receipt.set('');
      this.amountTouched.set(false);
      this.descTouched.set(false);
      this.receiptTouched.set(false);
      this.resource.reload();
    } catch (err: unknown) {
      this.errorMessage.set((err as { error?: { message?: string } })?.error?.message ?? 'Erreur.');
    } finally {
      this.submitting.set(false);
    }
  }
}

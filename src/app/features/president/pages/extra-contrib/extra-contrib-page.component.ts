import { DecimalPipe } from '@angular/common';
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
import { PresidentService } from '../../services/president.service';
import type { ExtraordinaryContribution } from '../../../../shared/models/entities/extraordinary-contribution.model';

@Component({
  selector: 'tc-extra-contrib',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DecimalPipe,
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
        <h1 class="text-2xl font-bold text-gray-900">Cotisations extraordinaires</h1>
        <p class="text-sm text-gray-500">
          Après vote de l'Assemblée, lancez la collecte puis ordonnez la distribution.
        </p>
      </header>

      <div class="grid gap-6 lg:grid-cols-3">
        <div class="lg:col-span-2 space-y-4">
          @if (resource.isLoading()) {
            <p class="text-sm text-gray-500">Chargement…</p>
          } @else if (items().length === 0) {
            <tc-card>
              <tc-empty-state title="Aucune collecte" icon="💰" />
            </tc-card>
          } @else {
            @for (ec of items(); track ec.id) {
              <tc-card>
                <div class="flex flex-wrap items-start justify-between gap-3">
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-2 flex-wrap">
                      <p class="font-semibold text-gray-900">{{ ec.motive }}</p>
                      <tc-badge [kind]="statusKind(ec.status)">{{ statusLabel(ec.status) }}</tc-badge>
                    </div>
                    @if (ec.beneficiaryFullName) {
                      <p class="text-sm text-gray-600 mt-1">
                        Bénéficiaire : <span class="font-semibold">{{ ec.beneficiaryFullName }}</span>
                      </p>
                    }
                    <p class="text-xs text-gray-500 mt-1">
                      Échéance : {{ ec.dueDate | tcDate }} · Voté en AG le {{ ec.votedByAssemblyAt | tcDate }}
                    </p>
                  </div>
                  <div class="text-right text-sm">
                    <p class="text-gray-500">Collecté / Attendu</p>
                    <p class="font-semibold text-gray-900">
                      {{ ec.totalCollected | xaf }} / {{ ec.totalExpected | xaf }}
                    </p>
                    <p class="text-xs text-gray-500 mt-0.5">
                      {{ progress(ec) | number: '1.0-0' }}%
                    </p>
                  </div>
                </div>

                <div class="mt-3 h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                  <div class="h-full bg-blue-500" [style.width.%]="progress(ec)"></div>
                </div>

                <details class="mt-4">
                  <summary class="text-sm text-blue-600 cursor-pointer">Voir le détail des membres</summary>
                  <ul class="mt-3 divide-y divide-gray-100 text-sm">
                    @for (m of ec.members; track m.memberId) {
                      <li class="py-2 flex items-center justify-between">
                        <span [class.italic]="m.exempted" [class.text-gray-400]="m.exempted">
                          {{ m.fullName }} {{ m.exempted ? '(exempté)' : '' }}
                        </span>
                        <span>
                          @if (m.exempted) {
                            <span class="text-gray-400">—</span>
                          } @else if (m.paid >= m.expected) {
                            <span class="text-green-600 font-medium">✓ {{ m.paid | xaf }}</span>
                          } @else if (m.paid > 0) {
                            <span class="text-amber-600 font-medium">{{ m.paid | xaf }} / {{ m.expected | xaf }}</span>
                          } @else {
                            <span class="text-red-600 font-medium">À payer : {{ m.expected | xaf }}</span>
                          }
                        </span>
                      </li>
                    }
                  </ul>
                </details>

                <div class="mt-4 flex flex-wrap gap-2">
                  @if (ec.status === 'COLLECTING') {
                    <tc-button variant="primary" [loading]="acting() === ec.id + ':close'" (clicked)="close(ec.id)">
                      Clôturer la collecte
                    </tc-button>
                  }
                  @if (ec.status === 'CLOSED') {
                    <tc-button variant="success" [loading]="acting() === ec.id + ':dist'" (clicked)="distribute(ec.id)">
                      Ordonner la distribution
                    </tc-button>
                  }
                </div>
              </tc-card>
            }
          }
        </div>

        <aside>
          <tc-card title="Lancer une cotisation">
            @if (errorMessage(); as err) {
              <tc-alert kind="error">{{ err }}</tc-alert>
            }
            <form class="space-y-4 mt-2" (submit)="onSubmit($event)">
              <tc-textarea
                label="Motif"
                [(value)]="motive"
                [(touched)]="motiveTouched"
                [error]="motiveError()"
                [rows]="3"
                hint="Évènement (décès, mariage, urgence…)"
                [required]="true"
              />
              <tc-input
                label="Bénéficiaire (ID membre)"
                [(value)]="beneficiaryId"
                hint="Optionnel — ex: member-1"
              />
              <label class="flex items-center gap-2 text-sm">
                <input type="checkbox" [checked]="exempt()" (change)="exempt.set(checked($event))" />
                Exempter le bénéficiaire
              </label>
              <tc-input
                label="Montant par membre (XAF)"
                type="number"
                [(value)]="amount"
                [(touched)]="amountTouched"
                [error]="amountError()"
                [required]="true"
              />
              <tc-input
                label="Date d'échéance (YYYY-MM-DD)"
                [(value)]="dueDate"
                [(touched)]="dueDateTouched"
                [error]="dueDateError()"
                [required]="true"
              />
              <tc-button type="submit" variant="primary" [fullWidth]="true" [loading]="submitting()">
                Lancer la collecte
              </tc-button>
            </form>
          </tc-card>
        </aside>
      </div>
    </div>
  `,
})
export class ExtraContribComponent {
  private readonly service = inject(PresidentService);
  private readonly notifications = inject(NotificationService);

  readonly resource = resource({
    loader: () => this.service.getExtraordinaryContributions(),
  });

  readonly items = computed(() => this.resource.value() ?? []);

  readonly motive = signal('');
  readonly motiveTouched = signal(false);
  readonly beneficiaryId = signal('');
  readonly exempt = signal(true);
  readonly amount = signal('10000');
  readonly amountTouched = signal(false);
  readonly dueDate = signal('');
  readonly dueDateTouched = signal(false);

  readonly submitting = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly acting = signal<string | null>(null);

  readonly motiveError = computed(() => (this.motive().trim() ? '' : 'Motif requis.'));
  readonly amountError = computed(() => {
    const n = Number(this.amount());
    return Number.isFinite(n) && n > 0 ? '' : 'Montant invalide.';
  });
  readonly dueDateError = computed(() =>
    /^\d{4}-\d{2}-\d{2}$/.test(this.dueDate()) ? '' : 'Format YYYY-MM-DD requis.',
  );

  checked(event: Event): boolean {
    return (event.target as HTMLInputElement).checked;
  }

  progress(ec: ExtraordinaryContribution): number {
    if (ec.totalExpected === 0) return 0;
    return Math.min(100, (ec.totalCollected / ec.totalExpected) * 100);
  }

  statusLabel(status: ExtraordinaryContribution['status']): string {
    return {
      DRAFT: 'Brouillon',
      COLLECTING: 'En collecte',
      CLOSED: 'Clôturée',
      DISTRIBUTED: 'Distribuée',
      CANCELLED: 'Annulée',
    }[status];
  }

  statusKind(status: ExtraordinaryContribution['status']): 'info' | 'warning' | 'success' | 'neutral' | 'danger' {
    return ({
      DRAFT: 'neutral',
      COLLECTING: 'info',
      CLOSED: 'warning',
      DISTRIBUTED: 'success',
      CANCELLED: 'danger',
    } as const)[status];
  }

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.motiveTouched.set(true);
    this.amountTouched.set(true);
    this.dueDateTouched.set(true);
    this.errorMessage.set(null);

    if (this.motiveError() || this.amountError() || this.dueDateError()) return;

    this.submitting.set(true);
    try {
      await this.service.createExtraordinaryContribution({
        motive: this.motive().trim(),
        beneficiaryMemberId: this.beneficiaryId().trim() || undefined,
        amountPerMember: Number(this.amount()),
        dueDate: new Date(this.dueDate()).toISOString(),
        exemptBeneficiary: this.exempt(),
      });
      this.notifications.success('Cotisation extraordinaire lancée.');
      this.motive.set('');
      this.beneficiaryId.set('');
      this.motiveTouched.set(false);
      this.dueDate.set('');
      this.dueDateTouched.set(false);
      this.resource.reload();
    } catch (e: unknown) {
      this.errorMessage.set((e as { error?: { message?: string } })?.error?.message ?? 'Erreur.');
    } finally {
      this.submitting.set(false);
    }
  }

  async close(id: string): Promise<void> {
    this.acting.set(`${id}:close`);
    try {
      await this.service.closeExtraordinaryContribution(id);
      this.notifications.success('Collecte clôturée.');
      this.resource.reload();
    } catch (e: unknown) {
      this.errorMessage.set((e as { error?: { message?: string } })?.error?.message ?? 'Erreur.');
    } finally {
      this.acting.set(null);
    }
  }

  async distribute(id: string): Promise<void> {
    this.acting.set(`${id}:dist`);
    try {
      await this.service.distributeExtraordinaryContribution(id);
      this.notifications.success('Distribution ordonnée.');
      this.resource.reload();
    } catch (e: unknown) {
      this.errorMessage.set((e as { error?: { message?: string } })?.error?.message ?? 'Erreur.');
    } finally {
      this.acting.set(null);
    }
  }
}

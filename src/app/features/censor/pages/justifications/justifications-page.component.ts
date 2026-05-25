import { ChangeDetectionStrategy, Component, computed, inject, resource, signal } from '@angular/core';
import { AlertComponent } from '../../../../shared/components/ui/alert/alert.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { EmptyStateComponent } from '../../../../shared/components/ui/empty-state/empty-state.component';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { NotificationService } from '../../../../core/services/notification.service';
import type { AbsenceJustification } from '../../../../shared/models/entities/sanction.model';
import { CensorService } from '../../services/censor.service';

type Decision = 'VALIDATE' | 'REJECT' | 'REQUEST_INFO';

@Component({
  selector: 'tc-censor-justifications',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AlertComponent,
    BadgeComponent,
    ButtonComponent,
    CardComponent,
    EmptyStateComponent,
    DateFormatPipe,
  ],
  template: `
    <div class="space-y-6">
      <header>
        <h1 class="text-2xl font-bold text-gray-900">Justificatifs d'absence</h1>
        <p class="text-sm text-gray-500">
          Le censeur valide en premier, avant le Président (RM-VJ01). Les deux validations sont
          nécessaires (RM-VJ02). La validation finale annule automatiquement la sanction (RM-VJ06).
        </p>
      </header>

      @if (errorMessage(); as err) {
        <tc-alert kind="error">{{ err }}</tc-alert>
      }

      @if (resource.isLoading()) {
        <p class="text-sm text-gray-500">Chargement…</p>
      } @else if (justifications().length === 0) {
        <tc-card>
          <tc-empty-state title="Aucun justificatif" icon="📄" />
        </tc-card>
      } @else {
        <ul class="space-y-3">
          @for (j of justifications(); track j.id) {
            <li>
              <tc-card>
                <div class="space-y-3">
                  <div class="flex flex-wrap items-start justify-between gap-3">
                    <div class="min-w-0 flex-1">
                      <div class="flex items-center gap-2 flex-wrap">
                        <p class="font-semibold text-gray-900">
                          {{ j.memberFullName }} — Séance #{{ j.sessionNumber }}
                        </p>
                        <tc-badge [kind]="statusKind(j.status)">{{ statusLabel(j.status) }}</tc-badge>
                      </div>
                      <p class="text-xs text-gray-500 mt-1">
                        Soumis le {{ j.submittedAt | tcDate: true }} · {{ j.documentType }}
                      </p>
                    </div>
                  </div>

                  <div class="rounded-lg border border-gray-100 bg-gray-50 p-3">
                    <p class="text-xs font-medium text-gray-700">Motif d'absence déclaré</p>
                    <p class="text-sm text-gray-700">{{ j.reason }}</p>
                  </div>

                  <div class="rounded-lg border border-blue-100 bg-blue-50 p-3">
                    <div class="flex items-center justify-between">
                      <div>
                        <p class="text-xs font-medium text-blue-900">📎 Justificatif</p>
                        <p class="text-sm text-blue-900">
                          {{ j.documentName }}
                          @if (j.documentSizeKb) {
                            <span class="text-xs">({{ j.documentSizeKb }} Ko)</span>
                          }
                        </p>
                      </div>
                      <button class="text-xs text-blue-700 hover:underline">
                        👁 Visualiser
                      </button>
                    </div>
                  </div>

                  @if (j.status === 'PENDING_CENSOR' || j.status === 'INFO_REQUESTED') {
                    @if (openId() === j.id) {
                      <div class="space-y-2 rounded-lg border border-blue-200 bg-blue-50 p-3">
                        <p class="text-sm font-medium text-blue-900">Votre décision</p>
                        <div class="space-y-1 text-sm">
                          <label class="flex items-center gap-2">
                            <input type="radio" name="d-{{ j.id }}" [checked]="decision() === 'VALIDATE'" (change)="decision.set('VALIDATE')" />
                            ✅ Valider et transmettre au Président
                          </label>
                          <label class="flex items-center gap-2">
                            <input type="radio" name="d-{{ j.id }}" [checked]="decision() === 'REJECT'" (change)="decision.set('REJECT')" />
                            ❌ Rejeter
                          </label>
                          <label class="flex items-center gap-2">
                            <input type="radio" name="d-{{ j.id }}" [checked]="decision() === 'REQUEST_INFO'" (change)="decision.set('REQUEST_INFO')" />
                            📝 Demander un complément au membre
                          </label>
                        </div>
                        <textarea
                          class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                          rows="2"
                          placeholder="Commentaire (obligatoire si rejet)"
                          [value]="comment()"
                          (input)="comment.set($any($event.target).value)"
                        ></textarea>
                        <div class="flex gap-2">
                          <tc-button variant="primary" size="sm" [loading]="acting() === j.id" (clicked)="submit(j)">
                            ✓ Valider
                          </tc-button>
                          <tc-button variant="ghost" size="sm" (clicked)="close()">Annuler</tc-button>
                        </div>
                      </div>
                    } @else {
                      <tc-button variant="primary" size="sm" (clicked)="open(j)">
                        Examiner
                      </tc-button>
                    }
                  } @else if (j.status === 'PENDING_PRESIDENT') {
                    <tc-alert kind="info">
                      📤 Transféré au Président pour validation finale (RM-VJ02).
                    </tc-alert>
                    <tc-button
                      variant="outline"
                      size="sm"
                      [loading]="acting() === j.id + ':simulate'"
                      (clicked)="simulatePresident(j)"
                    >
                      🧪 Simuler approbation Président (démo)
                    </tc-button>
                  } @else if (j.status === 'APPROVED') {
                    <tc-alert kind="success">
                      ✅ Justificatif validé — la sanction associée a été annulée (RM-VJ06).
                    </tc-alert>
                  } @else if (j.status === 'REJECTED_CENSOR' || j.status === 'REJECTED_PRESIDENT') {
                    <tc-alert kind="error">
                      ❌ Rejeté
                      @if (j.censorComment) {
                        — {{ j.censorComment }}
                      }
                    </tc-alert>
                  }
                </div>
              </tc-card>
            </li>
          }
        </ul>
      }
    </div>
  `,
})
export class CensorJustificationsPageComponent {
  private readonly service = inject(CensorService);
  private readonly notifications = inject(NotificationService);

  readonly resource = resource({
    loader: () => this.service.getJustifications(),
  });
  readonly justifications = computed(() => this.resource.value() ?? []);

  readonly openId = signal<string | null>(null);
  readonly decision = signal<Decision>('VALIDATE');
  readonly comment = signal('');
  readonly acting = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);

  statusKind(s: AbsenceJustification['status']): 'success' | 'warning' | 'danger' | 'info' | 'neutral' {
    if (s === 'APPROVED') return 'success';
    if (s === 'REJECTED_CENSOR' || s === 'REJECTED_PRESIDENT') return 'danger';
    if (s === 'PENDING_CENSOR') return 'warning';
    if (s === 'PENDING_PRESIDENT' || s === 'INFO_REQUESTED') return 'info';
    return 'neutral';
  }

  statusLabel(s: AbsenceJustification['status']): string {
    const map: Record<string, string> = {
      PENDING_CENSOR: 'En attente Censeur',
      PENDING_PRESIDENT: 'En attente Président',
      APPROVED: 'Validé',
      REJECTED_CENSOR: 'Rejeté (Censeur)',
      REJECTED_PRESIDENT: 'Rejeté (Président)',
      INFO_REQUESTED: 'Complément demandé',
    };
    return map[s] ?? s;
  }

  open(j: AbsenceJustification): void {
    this.openId.set(j.id);
    this.decision.set('VALIDATE');
    this.comment.set('');
  }

  close(): void {
    this.openId.set(null);
  }

  async submit(j: AbsenceJustification): Promise<void> {
    if (this.decision() === 'REJECT' && !this.comment().trim()) {
      this.errorMessage.set('Le rejet nécessite un commentaire.');
      return;
    }
    this.acting.set(j.id);
    this.errorMessage.set(null);
    try {
      await this.service.decideJustification(j.id, this.decision(), this.comment().trim() || undefined);
      this.notifications.success('Décision enregistrée.');
      this.openId.set(null);
      this.resource.reload();
    } catch (e: unknown) {
      this.errorMessage.set((e as { error?: { message?: string } })?.error?.message ?? 'Erreur.');
    } finally {
      this.acting.set(null);
    }
  }

  async simulatePresident(j: AbsenceJustification): Promise<void> {
    this.acting.set(`${j.id}:simulate`);
    this.errorMessage.set(null);
    try {
      await this.service.simulatePresidentApproval(j.id);
      this.notifications.success('Approbation Président simulée.');
      this.resource.reload();
    } catch (e: unknown) {
      this.errorMessage.set((e as { error?: { message?: string } })?.error?.message ?? 'Erreur.');
    } finally {
      this.acting.set(null);
    }
  }
}

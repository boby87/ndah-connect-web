import { ChangeDetectionStrategy, Component, computed, inject, resource, signal } from '@angular/core';
import { Router } from '@angular/router';

import { AlertComponent } from '../../../../shared/components/ui/alert/alert.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { EmptyStateComponent } from '../../../../shared/components/ui/empty-state/empty-state.component';
import { SpinnerComponent } from '../../../../shared/components/ui/spinner/spinner.component';
import { TextareaComponent } from '../../../../shared/components/ui/textarea/textarea.component';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { MemberPresidencyService } from '../../services/presidency.service';
import { formatApiError } from '../../../../core/utils';

@Component({
  selector: 'tc-member-presidency-transfer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AlertComponent,
    BadgeComponent,
    ButtonComponent,
    CardComponent,
    EmptyStateComponent,
    SpinnerComponent,
    TextareaComponent,
    DateFormatPipe,
  ],
  template: `
    <div class="space-y-6 max-w-3xl">
      <header>
        <h1 class="text-2xl font-bold text-gray-900">Proposition de présidence</h1>
        <p class="text-sm text-gray-500">
          Le Président actuel vous propose de prendre sa succession.
        </p>
      </header>

      @if (errorMessage(); as err) {
        <tc-alert kind="error">{{ err }}</tc-alert>
      }

      @if (resource.isLoading()) {
        <div class="flex justify-center py-12"><tc-spinner size="lg" /></div>
      } @else if (transfer(); as t) {
        <tc-card tone="accent">
          <div class="space-y-4">
            <div class="flex items-center gap-2">
              <span class="text-2xl">👑</span>
              <p class="text-lg font-semibold text-gray-900">
                {{ t.initiatedByFullName }} vous propose de devenir Président
              </p>
              <tc-badge kind="warning">{{ statusLabel(t.status) }}</tc-badge>
            </div>

            <div class="rounded-lg bg-gray-50 p-4">
              <p class="text-xs uppercase tracking-wider text-gray-500 mb-1">Motif</p>
              <p class="text-sm text-gray-800 whitespace-pre-line">{{ t.reason }}</p>
            </div>

            <div class="text-xs text-gray-500 flex flex-wrap gap-3">
              <span>Proposé le {{ t.initiatedAt | tcDate: true }}</span>
              <span>·</span>
              <span class="font-medium" [class.text-red-600]="isUrgent()">
                Expire le {{ t.expiresAt | tcDate: true }}
                @if (isUrgent()) {
                  (moins de 12h)
                }
              </span>
            </div>

            <tc-alert kind="info">
              <strong>Ce que cela implique :</strong>
              <ul class="mt-2 ml-4 list-disc space-y-1">
                <li>Vous prenez le rôle <strong>Président</strong> dès acceptation</li>
                <li>{{ t.initiatedByFullName }} redevient membre simple</li>
                <li>Vous récupérez tous les accès : validations, séances, cycle de clôture…</li>
                <li>L'opération est tracée dans l'audit et notifiée à tous les membres</li>
              </ul>
            </tc-alert>

            @if (!showDeclineForm()) {
              <div class="flex gap-3 justify-end">
                <tc-button
                  variant="ghost"
                  (clicked)="showDeclineForm.set(true)"
                  [disabled]="submitting()"
                >
                  Refuser
                </tc-button>
                <tc-button
                  variant="primary"
                  [loading]="submitting() && action() === 'ACCEPT'"
                  [disabled]="submitting()"
                  (clicked)="accept(t.id)"
                >
                  Accepter la présidence
                </tc-button>
              </div>
            } @else {
              <div class="rounded-lg border border-red-200 bg-red-50 p-4 space-y-3">
                <p class="text-sm font-medium text-red-900">
                  Refuser la proposition — merci d'indiquer la raison.
                </p>
                <tc-textarea
                  label="Motif du refus"
                  [(value)]="declineReason"
                  [(touched)]="declineReasonTouched"
                  [error]="declineReasonError()"
                  [rows]="3"
                  [required]="true"
                />
                <div class="flex gap-2 justify-end">
                  <tc-button
                    variant="ghost"
                    (clicked)="showDeclineForm.set(false)"
                    [disabled]="submitting()"
                  >
                    Annuler
                  </tc-button>
                  <tc-button
                    variant="danger"
                    [loading]="submitting() && action() === 'DECLINE'"
                    (clicked)="decline(t.id)"
                  >
                    Confirmer le refus
                  </tc-button>
                </div>
              </div>
            }
          </div>
        </tc-card>
      } @else {
        <tc-card>
          <tc-empty-state
            title="Aucune proposition en attente"
            icon="✓"
            description="Vous n'avez aucune proposition de présidence à traiter actuellement."
          />
        </tc-card>
      }
    </div>
  `,
})
export class MemberPresidencyTransferPageComponent {
  private readonly service = inject(MemberPresidencyService);
  private readonly notifications = inject(NotificationService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly resource = resource({
    loader: () => this.service.getPending(),
  });

  readonly transfer = computed(() => this.resource.value() ?? null);

  readonly isUrgent = computed(() => {
    const t = this.transfer();
    if (!t) return false;
    const diff = new Date(t.expiresAt).getTime() - Date.now();
    return diff < 12 * 3600 * 1000;
  });

  readonly showDeclineForm = signal(false);
  readonly declineReason = signal('');
  readonly declineReasonTouched = signal(false);
  readonly submitting = signal(false);
  readonly action = signal<'ACCEPT' | 'DECLINE' | null>(null);
  readonly errorMessage = signal<string | null>(null);

  readonly declineReasonError = computed(() => {
    const v = this.declineReason().trim();
    if (!v) return 'Motif requis.';
    if (v.length < 10) return 'Au moins 10 caractères.';
    return '';
  });

  statusLabel(_s: string): string {
    return 'En attente de votre décision';
  }

  async accept(id: string): Promise<void> {
    const confirmed = window.confirm(
      'Confirmer l\'acceptation de la présidence ?\n\n' +
        'Vous deviendrez immédiatement Président de la tontine. ' +
        'L\'ancien Président perdra ce rôle.',
    );
    if (!confirmed) return;

    this.errorMessage.set(null);
    this.action.set('ACCEPT');
    this.submitting.set(true);
    try {
      await this.service.accept(id);
      this.notifications.success('Vous êtes désormais Président de la tontine.');
      // Recharger l'utilisateur courant pour que ses rôles soient à jour
      await this.auth.loadCurrentUser();
      await this.router.navigateByUrl('/president/dashboard');
    } catch (e: unknown) {
      this.errorMessage.set(
        formatApiError(e, 'Acceptation impossible.'),
      );
    } finally {
      this.submitting.set(false);
      this.action.set(null);
    }
  }

  async decline(id: string): Promise<void> {
    this.declineReasonTouched.set(true);
    if (this.declineReasonError()) return;

    this.errorMessage.set(null);
    this.action.set('DECLINE');
    this.submitting.set(true);
    try {
      await this.service.decline(id, this.declineReason().trim());
      this.notifications.info('Proposition refusée.');
      this.resource.reload();
      this.showDeclineForm.set(false);
      this.declineReason.set('');
      this.declineReasonTouched.set(false);
    } catch (e: unknown) {
      this.errorMessage.set(
        formatApiError(e, 'Refus impossible.'),
      );
    } finally {
      this.submitting.set(false);
      this.action.set(null);
    }
  }
}

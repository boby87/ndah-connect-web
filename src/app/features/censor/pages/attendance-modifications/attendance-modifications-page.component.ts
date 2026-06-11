import { ChangeDetectionStrategy, Component, computed, inject, resource, signal } from '@angular/core';
import { AlertComponent } from '../../../../shared/components/ui/alert/alert.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { EmptyStateComponent } from '../../../../shared/components/ui/empty-state/empty-state.component';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { NotificationService } from '../../../../core/services/notification.service';
import type { AttendanceModificationRequest } from '../../../../shared/models/entities/sanction.model';
import { CensorService } from '../../services/censor.service';
import { formatApiError } from '../../../../core/utils';

type Decision = 'APPROVE' | 'REJECT' | 'REQUEST_INFO';

@Component({
  selector: 'tc-censor-attendance-modifications',
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
        <h1 class="text-2xl font-bold text-gray-900">Modifications de présence</h1>
        <p class="text-sm text-gray-500">
          Demandes du Secrétaire à valider (RM-VP01). Vous pouvez approuver, refuser ou demander plus
          d'informations (RM-VP02). L'approbation annule automatiquement la sanction liée (RM-VP04).
        </p>
      </header>

      @if (errorMessage(); as err) {
        <tc-alert kind="error">{{ err }}</tc-alert>
      }

      @if (resource.isLoading()) {
        <p class="text-sm text-gray-500">Chargement…</p>
      } @else if (requests().length === 0) {
        <tc-card>
          <tc-empty-state title="Aucune demande" icon="📝" />
        </tc-card>
      } @else {
        <ul class="space-y-3">
          @for (r of requests(); track r.id) {
            <li>
              <tc-card>
                <div class="space-y-3">
                  <div class="flex flex-wrap items-start justify-between gap-3">
                    <div class="min-w-0 flex-1">
                      <div class="flex items-center gap-2 flex-wrap">
                        <p class="font-semibold text-gray-900">
                          {{ r.memberFullName }} — Séance #{{ r.sessionNumber }}
                        </p>
                        <tc-badge [kind]="statusKind(r.status)">{{ statusLabel(r.status) }}</tc-badge>
                      </div>
                      <p class="text-sm text-gray-700 mt-1">
                        Modification : <strong>{{ statusLabel2(r.fromStatus) }}</strong> →
                        <strong>{{ statusLabel2(r.toStatus) }}</strong>
                      </p>
                      <p class="text-xs text-gray-500 mt-1">
                        Demandé par {{ r.requestedByFullName }} le {{ r.requestedAt | tcDate: true }}
                      </p>
                    </div>
                  </div>

                  <div class="rounded-lg border border-gray-100 bg-gray-50 p-3">
                    <p class="text-xs font-medium text-gray-700">Motif</p>
                    <p class="text-sm text-gray-700">{{ r.reason }}</p>
                  </div>

                  @if (r.linkedSanctionId) {
                    <tc-alert kind="info">
                      ℹ️ Sanction liée : {{ r.linkedSanctionId }} — sera annulée automatiquement si approuvé.
                    </tc-alert>
                  }

                  @if (r.status === 'PENDING' || r.status === 'INFO_REQUESTED') {
                    @if (openId() === r.id) {
                      <div class="space-y-2 rounded-lg border border-blue-200 bg-blue-50 p-3">
                        <p class="text-sm font-medium text-blue-900">Votre décision</p>
                        <div class="space-y-1 text-sm">
                          <label class="flex items-center gap-2">
                            <input type="radio" name="d-{{ r.id }}" [checked]="decision() === 'APPROVE'" (change)="decision.set('APPROVE')" />
                            ✅ Approuver
                          </label>
                          <label class="flex items-center gap-2">
                            <input type="radio" name="d-{{ r.id }}" [checked]="decision() === 'REJECT'" (change)="decision.set('REJECT')" />
                            ❌ Refuser
                          </label>
                          <label class="flex items-center gap-2">
                            <input type="radio" name="d-{{ r.id }}" [checked]="decision() === 'REQUEST_INFO'" (change)="decision.set('REQUEST_INFO')" />
                            ❓ Demander plus d'infos
                          </label>
                        </div>
                        @if (decision() === 'REQUEST_INFO') {
                          <textarea
                            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                            rows="2"
                            placeholder="Question / demande au secrétaire"
                            [value]="infoRequest()"
                            (input)="infoRequest.set($any($event.target).value)"
                          ></textarea>
                        } @else {
                          <textarea
                            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                            rows="2"
                            placeholder="Commentaire (obligatoire si refus)"
                            [value]="comment()"
                            (input)="comment.set($any($event.target).value)"
                          ></textarea>
                        }
                        <div class="flex gap-2">
                          <tc-button variant="primary" size="sm" [loading]="acting() === r.id" (clicked)="submit(r)">
                            ✓ Valider
                          </tc-button>
                          <tc-button variant="ghost" size="sm" (clicked)="close()">Annuler</tc-button>
                        </div>
                      </div>
                    } @else {
                      <tc-button variant="primary" size="sm" (clicked)="open(r)">
                        Traiter
                      </tc-button>
                    }
                  } @else {
                    <p class="text-xs text-gray-500">
                      Décidée le {{ r.decidedAt | tcDate: true }}
                      @if (r.decisionComment) {
                        — {{ r.decisionComment }}
                      }
                    </p>
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
export class CensorAttendanceModificationsPageComponent {
  private readonly service = inject(CensorService);
  private readonly notifications = inject(NotificationService);

  readonly resource = resource({
    loader: () => this.service.getAttendanceModifications(),
  });
  readonly requests = computed(() => this.resource.value() ?? []);

  readonly openId = signal<string | null>(null);
  readonly decision = signal<Decision>('APPROVE');
  readonly comment = signal('');
  readonly infoRequest = signal('');
  readonly acting = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);

  statusKind(s: AttendanceModificationRequest['status']): 'success' | 'warning' | 'danger' | 'info' | 'neutral' {
    if (s === 'APPROVED') return 'success';
    if (s === 'REJECTED') return 'danger';
    if (s === 'PENDING') return 'warning';
    if (s === 'INFO_REQUESTED') return 'info';
    return 'neutral';
  }

  statusLabel(s: AttendanceModificationRequest['status']): string {
    const map: Record<string, string> = {
      PENDING: 'En attente',
      APPROVED: 'Approuvée',
      REJECTED: 'Refusée',
      INFO_REQUESTED: 'Infos demandées',
    };
    return map[s] ?? s;
  }

  statusLabel2(s: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED'): string {
    const map = { PRESENT: 'Présent', ABSENT: 'Absent', LATE: 'En retard', EXCUSED: 'Excusé' };
    return map[s];
  }

  open(r: AttendanceModificationRequest): void {
    this.openId.set(r.id);
    this.decision.set('APPROVE');
    this.comment.set('');
    this.infoRequest.set('');
  }

  close(): void {
    this.openId.set(null);
  }

  async submit(r: AttendanceModificationRequest): Promise<void> {
    if (this.decision() === 'REJECT' && !this.comment().trim()) {
      this.errorMessage.set('Le refus nécessite un commentaire (RM-VP03).');
      return;
    }
    this.acting.set(r.id);
    this.errorMessage.set(null);
    try {
      await this.service.decideAttendanceModification(
        r.id,
        this.decision(),
        this.comment().trim() || undefined,
        this.infoRequest().trim() || undefined,
      );
      this.notifications.success('Décision enregistrée.');
      this.openId.set(null);
      this.resource.reload();
    } catch (e: unknown) {
      this.errorMessage.set(formatApiError(e, 'Erreur.'));
    } finally {
      this.acting.set(null);
    }
  }
}

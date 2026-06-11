import { ChangeDetectionStrategy, Component, computed, inject, resource, signal } from '@angular/core';
import { AlertComponent } from '../../../../shared/components/ui/alert/alert.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { EmptyStateComponent } from '../../../../shared/components/ui/empty-state/empty-state.component';
import { InputComponent } from '../../../../shared/components/ui/input/input.component';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { NotificationService } from '../../../../core/services/notification.service';
import type {
  AuditorRecommendation,
  RecommendationOrigin,
  RecommendationPriority,
  RecommendationStatus,
} from '../../../../shared/models/entities/auditor.model';
import { AuditorService } from '../../services/auditor.service';
import { formatApiError } from '../../../../core/utils';

@Component({
  selector: 'tc-auditor-recommendations',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AlertComponent,
    BadgeComponent,
    ButtonComponent,
    CardComponent,
    EmptyStateComponent,
    InputComponent,
    DateFormatPipe,
  ],
  template: `
    <div class="space-y-6">
      <header>
        <h1 class="text-2xl font-bold text-gray-900">Recommandations</h1>
        <p class="text-sm text-gray-500">
          Émettez des recommandations au Bureau, Président ou Trésorier. Suivez leur mise en œuvre.
        </p>
      </header>

      @if (errorMessage(); as err) {
        <tc-alert kind="error">{{ err }}</tc-alert>
      }

      <div class="grid gap-6 lg:grid-cols-3">
        <aside>
          <tc-card title="Nouvelle recommandation">
            <form class="space-y-3" (submit)="onSubmit($event)">
              <div>
                <label class="text-xs font-medium text-gray-700">Origine</label>
                <select
                  class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  [value]="origin()"
                  (change)="origin.set($any($event.target).value)"
                >
                  <option value="AUDIT">Suite à un audit</option>
                  <option value="PERIODIC_CONTROL">Suite à un contrôle</option>
                  <option value="ANOMALY">Suite à un signalement</option>
                  <option value="GENERAL">Observation générale</option>
                </select>
              </div>

              <tc-input label="Titre" [(value)]="title" [required]="true" />

              <div>
                <label class="text-xs font-medium text-gray-700">Description</label>
                <textarea
                  class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  rows="4"
                  [value]="description()"
                  (input)="description.set($any($event.target).value)"
                ></textarea>
              </div>

              <div>
                <label class="text-xs font-medium text-gray-700">Priorité</label>
                <div class="mt-1 flex gap-3 text-sm">
                  <label class="flex items-center gap-1">
                    <input type="radio" [checked]="priority() === 'LOW'" (change)="priority.set('LOW')" />
                    Basse
                  </label>
                  <label class="flex items-center gap-1">
                    <input type="radio" [checked]="priority() === 'MEDIUM'" (change)="priority.set('MEDIUM')" />
                    Moyenne
                  </label>
                  <label class="flex items-center gap-1">
                    <input type="radio" [checked]="priority() === 'HIGH'" (change)="priority.set('HIGH')" />
                    Élevée
                  </label>
                </div>
              </div>

              <div>
                <label class="text-xs font-medium text-gray-700">Destinataire</label>
                <select
                  class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  [value]="recipient()"
                  (change)="recipient.set($any($event.target).value)"
                >
                  <option value="BUREAU">Bureau</option>
                  <option value="PRESIDENT">Président</option>
                  <option value="TREASURER">Trésorier</option>
                </select>
              </div>

              <div>
                <label class="text-xs font-medium text-gray-700">Échéance</label>
                <input
                  type="date"
                  class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  [value]="dueDate()"
                  (change)="dueDate.set($any($event.target).value)"
                />
              </div>

              <tc-button type="submit" variant="primary" [fullWidth]="true" [loading]="submitting()">
                ✈ Émettre
              </tc-button>
            </form>
          </tc-card>
        </aside>

        <div class="lg:col-span-2 space-y-3">
          @if (resource.isLoading()) {
            <p class="text-sm text-gray-500">Chargement…</p>
          } @else if (recommendations().length === 0) {
            <tc-card>
              <tc-empty-state title="Aucune recommandation" icon="💡" />
            </tc-card>
          } @else {
            @for (r of recommendations(); track r.id) {
              <tc-card>
                <div class="space-y-2">
                  <div class="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div class="flex items-center gap-2 flex-wrap">
                        <p class="font-semibold text-gray-900">{{ r.reference }} — {{ r.title }}</p>
                        <tc-badge [kind]="priorityBadge(r.priority)">{{ priorityLabel(r.priority) }}</tc-badge>
                        <tc-badge [kind]="statusBadge(r.status)">{{ statusLabel(r.status) }}</tc-badge>
                      </div>
                      <p class="text-xs text-gray-500 mt-1">
                        Émise le {{ r.emittedAt | tcDate }} · → {{ r.recipient }}
                        @if (r.dueDate) {
                          · échéance {{ r.dueDate | tcDate }}
                        }
                      </p>
                    </div>
                  </div>

                  <p class="text-sm text-gray-700">{{ r.description }}</p>

                  @if (r.implementationProgress != null) {
                    <div>
                      <div class="flex items-center justify-between text-xs">
                        <span class="text-gray-700">Mise en œuvre</span>
                        <span class="font-semibold text-gray-900">{{ r.implementationProgress }}%</span>
                      </div>
                      <div class="mt-1 h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                        <div class="h-full bg-blue-500" [style.width.%]="r.implementationProgress"></div>
                      </div>
                    </div>
                  }

                  <div class="flex flex-wrap gap-2">
                    @if (r.status === 'PENDING') {
                      <tc-button variant="outline" size="sm" [loading]="acting() === r.id + ':progress'" (clicked)="markInProgress(r)">
                        Marquer en cours
                      </tc-button>
                    }
                    @if (r.status === 'IN_PROGRESS' || r.status === 'PENDING') {
                      <tc-button variant="success" size="sm" [loading]="acting() === r.id + ':implemented'" (clicked)="markImplemented(r)">
                        ✓ Mise en œuvre
                      </tc-button>
                    }
                    @if (r.status !== 'CLOSED') {
                      <tc-button variant="ghost" size="sm" [loading]="acting() === r.id + ':closed'" (clicked)="closeReco(r)">
                        🗃 Clôturer
                      </tc-button>
                    }
                  </div>
                </div>
              </tc-card>
            }
          }
        </div>
      </div>
    </div>
  `,
})
export class AuditorRecommendationsPageComponent {
  private readonly service = inject(AuditorService);
  private readonly notifications = inject(NotificationService);

  readonly resource = resource({
    loader: () => this.service.getRecommendations(),
  });
  readonly recommendations = computed(() => this.resource.value() ?? []);

  readonly origin = signal<RecommendationOrigin>('AUDIT');
  readonly title = signal('');
  readonly description = signal('');
  readonly priority = signal<RecommendationPriority>('MEDIUM');
  readonly recipient = signal<'BUREAU' | 'PRESIDENT' | 'TREASURER'>('BUREAU');
  readonly dueDate = signal('');
  readonly submitting = signal(false);

  readonly acting = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);

  priorityBadge(p: RecommendationPriority): 'success' | 'warning' | 'danger' {
    if (p === 'LOW') return 'success';
    if (p === 'MEDIUM') return 'warning';
    return 'danger';
  }

  priorityLabel(p: RecommendationPriority): string {
    return p === 'LOW' ? 'Basse' : p === 'MEDIUM' ? 'Moyenne' : 'Élevée';
  }

  statusBadge(s: RecommendationStatus): 'info' | 'warning' | 'success' | 'danger' | 'neutral' {
    if (s === 'IMPLEMENTED') return 'success';
    if (s === 'IN_PROGRESS') return 'info';
    if (s === 'PENDING') return 'warning';
    if (s === 'OVERDUE') return 'danger';
    return 'neutral';
  }

  statusLabel(s: RecommendationStatus): string {
    const map = {
      PENDING: 'En attente',
      IN_PROGRESS: 'En cours',
      IMPLEMENTED: 'Mise en œuvre',
      CLOSED: 'Clôturée',
      OVERDUE: 'En retard',
    };
    return map[s];
  }

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.errorMessage.set(null);
    if (!this.title().trim() || !this.description().trim()) {
      this.errorMessage.set('Titre et description obligatoires.');
      return;
    }
    this.submitting.set(true);
    try {
      await this.service.createRecommendation({
        origin: this.origin(),
        title: this.title().trim(),
        description: this.description().trim(),
        priority: this.priority(),
        recipient: this.recipient(),
        dueDate: this.dueDate() ? new Date(this.dueDate()).toISOString() : undefined,
      });
      this.notifications.success('Recommandation émise.');
      this.title.set('');
      this.description.set('');
      this.dueDate.set('');
      this.resource.reload();
    } catch (e: unknown) {
      this.errorMessage.set(formatApiError(e, 'Erreur.'));
    } finally {
      this.submitting.set(false);
    }
  }

  async markInProgress(r: AuditorRecommendation): Promise<void> {
    this.acting.set(`${r.id}:progress`);
    try {
      await this.service.updateRecommendationStatus(r.id, 'IN_PROGRESS', 30);
      this.notifications.success('Mise à jour.');
      this.resource.reload();
    } catch (e: unknown) {
      this.errorMessage.set(formatApiError(e, 'Erreur.'));
    } finally {
      this.acting.set(null);
    }
  }

  async markImplemented(r: AuditorRecommendation): Promise<void> {
    this.acting.set(`${r.id}:implemented`);
    try {
      await this.service.updateRecommendationStatus(r.id, 'IMPLEMENTED', 100);
      this.notifications.success('Mise en œuvre.');
      this.resource.reload();
    } catch (e: unknown) {
      this.errorMessage.set(formatApiError(e, 'Erreur.'));
    } finally {
      this.acting.set(null);
    }
  }

  async closeReco(r: AuditorRecommendation): Promise<void> {
    this.acting.set(`${r.id}:closed`);
    try {
      await this.service.updateRecommendationStatus(r.id, 'CLOSED');
      this.notifications.success('Clôturée.');
      this.resource.reload();
    } catch (e: unknown) {
      this.errorMessage.set(formatApiError(e, 'Erreur.'));
    } finally {
      this.acting.set(null);
    }
  }
}

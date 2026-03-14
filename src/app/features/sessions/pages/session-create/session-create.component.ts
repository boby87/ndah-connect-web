import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PageHeaderComponent } from '../../../../shared/components/layout/page-header/page-header.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { MockDataService } from '../../../../core/services/mock-data.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-session-create',
  standalone: true,
  imports: [FormsModule, PageHeaderComponent, CardComponent, ButtonComponent, BadgeComponent],
  template: `
    <app-page-header title="Planifier une séance" backLink="/sessions" />

    <div class="create-container">
      <!-- Mode Tabs -->
      <div class="mode-tabs">
        <button [class]="'tab' + (mode() === 'single' ? ' active' : '')" (click)="mode.set('single')" type="button">📅 Séance unique</button>
        <button [class]="'tab' + (mode() === 'batch' ? ' active' : '')" (click)="mode.set('batch')" type="button">📋 Planification en série</button>
      </div>

      @if (mode() === 'single') {
        <!-- ═══════ SINGLE SESSION ═══════ -->
        <app-card>
          <div class="form">
            <h3 class="form-title">Nouvelle séance</h3>

            <div class="form-group">
              <label class="form-label">Type de séance *</label>
              <select class="form-input" [(ngModel)]="sessionType">
                <option value="ordinary">Ordinaire</option>
                <option value="extraordinary">Extraordinaire</option>
              </select>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Date *</label>
                <input class="form-input" type="date" [(ngModel)]="scheduledDate" />
              </div>
              <div class="form-group">
                <label class="form-label">Heure *</label>
                <input class="form-input" type="time" [(ngModel)]="scheduledTime" />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Lieu *</label>
              <input class="form-input" [(ngModel)]="location" placeholder="Ex: Hôtel Akwa Palace, Douala" />
            </div>

            <div class="form-group">
              <label class="form-label">Bénéficiaire du tour</label>
              <select class="form-input" [(ngModel)]="beneficiaryId">
                <option value="">-- Aucun (séance extraordinaire) --</option>
                @for (m of availableMembers(); track m.id) {
                  <option [value]="m.id">{{ m.user.firstName }} {{ m.user.lastName }} (Tour #{{ m.tourNumber ?? '?' }})</option>
                }
              </select>
            </div>

            <div class="form-actions">
              <app-button variant="outline" (clicked)="router.navigate(['/sessions'])">Annuler</app-button>
              <app-button variant="primary" (clicked)="createSingle()" [disabled]="!canCreateSingle()">📅 Planifier la séance</app-button>
            </div>
          </div>
        </app-card>
      } @else {
        <!-- ═══════ BATCH PLANNING ═══════ -->
        <app-card>
          <div class="form">
            <h3 class="form-title">Planification du cycle</h3>
            <p class="form-subtitle">Planifiez toutes les séances ordinaires du cycle en une seule fois.</p>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Date de la 1ère séance *</label>
                <input class="form-input" type="date" [(ngModel)]="batchStartDate" />
              </div>
              <div class="form-group">
                <label class="form-label">Heure *</label>
                <input class="form-input" type="time" [(ngModel)]="batchTime" />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Lieu (commun) *</label>
              <input class="form-input" [(ngModel)]="batchLocation" placeholder="Ex: Restaurant Le Foyer, Douala" />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Fréquence *</label>
                <select class="form-input" [(ngModel)]="batchFrequency">
                  <option value="weekly">Hebdomadaire</option>
                  <option value="biweekly">Bimensuel</option>
                  <option value="monthly">Mensuel</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Nombre de séances *</label>
                <input class="form-input" type="number" [(ngModel)]="batchCount" min="1" max="52" />
              </div>
            </div>

            <!-- Beneficiary Assignment -->
            <div class="form-group">
              <label class="form-label">Attribution des tours</label>
              <p class="form-hint">Attribuez un bénéficiaire à chaque séance. Glissez pour réorganiser l'ordre.</p>
              <div class="beneficiary-list">
                @for (i of batchIndexes(); track i) {
                  <div class="beneficiary-row">
                    <span class="row-number">Séance {{ i + 1 }}</span>
                    <span class="row-date">{{ getBatchDate(i) }}</span>
                    <select class="form-input row-select" [(ngModel)]="batchBeneficiaries[i]">
                      <option value="">-- Non attribué --</option>
                      @for (m of availableMembers(); track m.id) {
                        <option [value]="m.id">{{ m.user.firstName }} {{ m.user.lastName }}</option>
                      }
                    </select>
                  </div>
                }
              </div>
            </div>

            <div class="form-actions">
              <app-button variant="outline" (clicked)="router.navigate(['/sessions'])">Annuler</app-button>
              <app-button variant="secondary" (clicked)="autoAssign()">🔄 Auto-attribuer</app-button>
              <app-button variant="primary" (clicked)="createBatch()" [disabled]="!canCreateBatch()">📋 Planifier {{ batchCount }} séances</app-button>
            </div>
          </div>
        </app-card>

        <!-- Preview -->
        @if (batchCount > 0 && batchStartDate) {
          <app-card>
            <div class="preview-section">
              <h3 class="form-title">📅 Aperçu du planning</h3>
              <div class="preview-grid">
                @for (i of batchIndexes(); track i) {
                  <div class="preview-item">
                    <div class="preview-header">
                      <span class="preview-number">#{{ i + 1 }}</span>
                      <app-badge variant="info" size="sm">{{ getBatchDate(i) }}</app-badge>
                    </div>
                    <span class="preview-beneficiary">
                      {{ getBeneficiaryName(batchBeneficiaries[i]) || 'Non attribué' }}
                    </span>
                  </div>
                }
              </div>
            </div>
          </app-card>
        }
      }
    </div>
  `,
  styles: `
    @reference "tailwindcss";
    .create-container { @apply space-y-4; }
    .mode-tabs { @apply flex gap-2 mb-2; }
    .tab { @apply px-5 py-2.5 text-sm rounded-lg border border-slate-200 bg-white cursor-pointer hover:bg-slate-50 transition-colors; }
    .tab.active { @apply bg-blue-50 border-blue-300 text-blue-700 font-medium; }
    .form { @apply space-y-5 p-1; }
    .form-title { @apply text-lg font-semibold text-slate-900; }
    .form-subtitle { @apply text-sm text-slate-500 -mt-2; }
    .form-group { @apply flex flex-col gap-1.5 flex-1; }
    .form-label { @apply text-sm font-medium text-slate-700; }
    .form-hint { @apply text-xs text-slate-400; }
    .form-input { @apply w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500; }
    .form-row { @apply grid grid-cols-2 gap-4; }
    .form-actions { @apply flex items-center justify-end gap-3 pt-4 border-t border-slate-100; }
    .beneficiary-list { @apply space-y-2 mt-2 max-h-96 overflow-y-auto; }
    .beneficiary-row { @apply flex items-center gap-3 p-2 bg-slate-50 rounded-lg; }
    .row-number { @apply text-sm font-semibold text-slate-700 w-20 shrink-0; }
    .row-date { @apply text-xs text-slate-400 w-24 shrink-0; }
    .row-select { @apply flex-1 text-sm; }
    .preview-section { @apply space-y-3; }
    .preview-grid { @apply grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3; }
    .preview-item { @apply p-3 bg-slate-50 rounded-lg space-y-1.5; }
    .preview-header { @apply flex items-center gap-2; }
    .preview-number { @apply text-sm font-bold text-blue-700; }
    .preview-beneficiary { @apply text-xs text-slate-500 truncate block; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionCreateComponent {
  protected readonly router = inject(Router);
  protected readonly mock = inject(MockDataService);
  private readonly notification = inject(NotificationService);

  readonly mode = signal<'single' | 'batch'>('single');

  // Single mode
  sessionType: 'ordinary' | 'extraordinary' = 'ordinary';
  scheduledDate = '';
  scheduledTime = '15:00';
  location = '';
  beneficiaryId = '';

  // Batch mode
  batchStartDate = '';
  batchTime = '15:00';
  batchLocation = '';
  batchFrequency: 'weekly' | 'biweekly' | 'monthly' = 'monthly';
  batchCount = 12;
  batchBeneficiaries: string[] = Array(52).fill('');

  readonly availableMembers = computed(() =>
    this.mock.members().filter(m => m.status === 'active'),
  );

  readonly batchIndexes = computed(() =>
    Array.from({ length: this.batchCount }, (_, i) => i),
  );

  canCreateSingle(): boolean {
    return !!this.scheduledDate && !!this.scheduledTime && !!this.location;
  }

  canCreateBatch(): boolean {
    return !!this.batchStartDate && !!this.batchTime && !!this.batchLocation && this.batchCount > 0;
  }

  getBatchDate(index: number): string {
    if (!this.batchStartDate) return '';
    const d = new Date(this.batchStartDate);
    if (this.batchFrequency === 'weekly') d.setDate(d.getDate() + index * 7);
    else if (this.batchFrequency === 'biweekly') d.setDate(d.getDate() + index * 14);
    else d.setMonth(d.getMonth() + index);
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  getBeneficiaryName(id: string): string {
    if (!id) return '';
    const m = this.mock.members().find(mem => mem.id === id);
    return m ? `${m.user.firstName} ${m.user.lastName}` : '';
  }

  autoAssign(): void {
    const members = this.availableMembers();
    for (let i = 0; i < this.batchCount; i++) {
      this.batchBeneficiaries[i] = members[i % members.length]?.id ?? '';
    }
  }

  createSingle(): void {
    if (!this.canCreateSingle()) return;
    this.mock.createSession({
      sessionType: this.sessionType,
      scheduledDate: this.scheduledDate,
      scheduledTime: this.scheduledTime,
      location: this.location,
      beneficiaryId: this.beneficiaryId || undefined,
    });
    this.notification.success('Séance planifiée avec succès');
    this.router.navigate(['/sessions']);
  }

  createBatch(): void {
    if (!this.canCreateBatch()) return;
    const beneficiaryIds = this.batchBeneficiaries.slice(0, this.batchCount);
    this.mock.batchCreateSessions({
      startDate: this.batchStartDate,
      time: this.batchTime,
      location: this.batchLocation,
      frequency: this.batchFrequency,
      count: this.batchCount,
      beneficiaryIds,
    });
    this.notification.success(`${this.batchCount} séances planifiées avec succès`);
    this.router.navigate(['/sessions']);
  }
}

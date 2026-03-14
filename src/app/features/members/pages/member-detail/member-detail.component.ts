import { ChangeDetectionStrategy, Component, inject, computed, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageHeaderComponent } from '../../../../shared/components/layout/page-header/page-header.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { ModalComponent } from '../../../../shared/components/ui/modal/modal.component';
import { MockDataService } from '../../../../core/services/mock-data.service';
import { CurrencyXafPipe } from '../../../../shared/pipes/currency-xaf.pipe';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [PageHeaderComponent, CardComponent, BadgeComponent, ButtonComponent, ModalComponent, CurrencyXafPipe, FormsModule],
  template: `
    <app-page-header title="Détail du membre" backLink="/members" />

    @if (member(); as m) {
      <div class="detail-layout">
        <!-- Profile header -->
        <div class="profile-header">
          <div class="avatar-lg">{{ getInitials(m.user.firstName, m.user.lastName) }}</div>
          <div class="profile-info">
            <h2 class="profile-name">{{ m.user.firstName }} {{ m.user.lastName }}</h2>
            <div class="profile-badges">
              <app-badge [variant]="getRoleVariant(m.role)">{{ getRoleLabel(m.role) }}</app-badge>
              <app-badge [variant]="m.status === 'active' ? 'success' : 'danger'">
                {{ m.status === 'active' ? '✅ Actif' : '🚫 Suspendu' }}
              </app-badge>
            </div>
          </div>
          <div class="profile-actions">
            @if (m.status === 'active' && m.role === 'member') {
              <app-button variant="danger" size="sm" (clicked)="showSuspendModal.set(true)">Suspendre</app-button>
            }
            @if (m.status === 'suspended') {
              <app-button variant="primary" size="sm" (clicked)="activate(m.id)">Réactiver</app-button>
            }
          </div>
        </div>

        <div class="detail-grid">
          <!-- Personal info -->
          <app-card>
            <div class="section">
              <h3 class="section-title">👤 Informations personnelles</h3>
              <div class="info-grid">
                <div class="info-item"><span class="info-label">Téléphone</span><span class="info-value">{{ m.user.phoneNumber }}</span></div>
                <div class="info-item"><span class="info-label">Email</span><span class="info-value">{{ m.user.email }}</span></div>
                <div class="info-item"><span class="info-label">Profession</span><span class="info-value">{{ m.user.profession }}</span></div>
                <div class="info-item"><span class="info-label">Genre</span><span class="info-value">{{ m.user.gender === 'male' ? 'Homme' : 'Femme' }}</span></div>
                @if (m.tourNumber) {
                  <div class="info-item"><span class="info-label">Tour de cagnotte</span><span class="info-value">#{{ m.tourNumber }}</span></div>
                }
                <div class="info-item"><span class="info-label">Membre depuis</span><span class="info-value">{{ m.joinedAt }}</span></div>
              </div>
            </div>
          </app-card>

          <!-- Financial summary -->
          <app-card>
            <div class="section">
              <h3 class="section-title">💰 Résumé financier</h3>
              <div class="info-grid">
                <div class="info-item"><span class="info-label">Cotisations payées</span><span class="info-value">{{ memberContributions().length }}</span></div>
                <div class="info-item"><span class="info-label">Total cotisé</span><span class="info-value">{{ totalContributed() | currencyXaf }}</span></div>
                <div class="info-item"><span class="info-label">Prêts actifs</span><span class="info-value">{{ memberLoans().length }}</span></div>
                <div class="info-item"><span class="info-label">Sanctions</span><span class="info-value">{{ memberSanctions().length }}</span></div>
              </div>
            </div>
          </app-card>

          <!-- Contributions -->
          <app-card>
            <div class="section">
              <h3 class="section-title">📊 Cotisations récentes</h3>
              @for (c of memberContributions().slice(0, 5); track c.id) {
                <div class="contrib-item">
                  <span>Séance {{ c.sessionId }}</span>
                  <span class="contrib-amount">{{ c.amount | currencyXaf }}</span>
                  <app-badge [variant]="c.status === 'confirmed' ? 'success' : 'warning'" size="sm">
                    {{ c.status === 'confirmed' ? '✅' : '⏳' }}
                  </app-badge>
                </div>
              } @empty {
                <p class="empty-text">Aucune cotisation</p>
              }
            </div>
          </app-card>

          <!-- Sanctions  -->
          <app-card>
            <div class="section">
              <h3 class="section-title">⚠️ Sanctions</h3>
              @for (s of memberSanctions(); track s.id) {
                <div class="sanction-item">
                  <div>
                    <span class="sanction-type">{{ s.type }}</span>
                    <span class="sanction-reason">{{ s.reason }}</span>
                  </div>
                  <div class="sanction-right">
                    <span>{{ s.amount | currencyXaf }}</span>
                    <app-badge [variant]="s.status === 'paid' ? 'success' : s.contested ? 'warning' : 'danger'" size="sm">
                      {{ s.status === 'paid' ? 'Payée' : s.contested ? 'Contestée' : 'En attente' }}
                    </app-badge>
                  </div>
                </div>
              } @empty {
                <p class="empty-text">Aucune sanction</p>
              }
            </div>
          </app-card>
        </div>
      </div>

      <!-- Suspend Modal -->
      <app-modal [isOpen]="showSuspendModal()" title="Suspendre le membre" (closed)="showSuspendModal.set(false)">
        <div class="modal-form">
          <p>Suspendre {{ m.user.firstName }} {{ m.user.lastName }} ?</p>
          <label class="form-label">Motif</label>
          <textarea class="form-textarea" [(ngModel)]="suspendReason" rows="3"></textarea>
          <div class="modal-actions">
            <app-button variant="outline" (clicked)="showSuspendModal.set(false)">Annuler</app-button>
            <app-button variant="danger" (clicked)="suspend(m.id)">Confirmer la suspension</app-button>
          </div>
        </div>
      </app-modal>
    } @else {
      <div class="not-found">Membre non trouvé</div>
    }
  `,
  styles: `@reference "tailwindcss";
    .detail-layout { @apply flex flex-col gap-6; }
    .profile-header { @apply flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm border; }
    .avatar-lg { @apply w-16 h-16 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xl font-bold flex-shrink-0; }
    .profile-info { @apply flex-1; }
    .profile-name { @apply text-xl font-bold text-slate-900; }
    .profile-badges { @apply flex gap-2 mt-1; }
    .profile-actions { @apply flex gap-2; }
    .detail-grid { @apply grid grid-cols-1 lg:grid-cols-2 gap-6; }
    .section { @apply p-2 flex flex-col gap-3; }
    .section-title { @apply text-base font-semibold text-slate-900; }
    .info-grid { @apply grid grid-cols-2 gap-3; }
    .info-item { @apply flex flex-col; }
    .info-label { @apply text-xs text-slate-500; }
    .info-value { @apply text-sm font-semibold text-slate-900; }
    .contrib-item { @apply flex items-center justify-between py-2 border-b last:border-none text-sm; }
    .contrib-amount { @apply font-medium; }
    .sanction-item { @apply flex justify-between items-start py-2 border-b last:border-none; }
    .sanction-type { @apply text-sm font-medium text-slate-800 block; }
    .sanction-reason { @apply text-xs text-slate-500 block; }
    .sanction-right { @apply flex flex-col items-end gap-1 text-sm; }
    .empty-text { @apply text-sm text-slate-400 italic; }
    .modal-form { @apply flex flex-col gap-3 p-4; }
    .form-label { @apply text-sm font-medium text-slate-700; }
    .form-textarea { @apply border border-slate-300 rounded-lg px-3 py-2 text-sm resize-y; }
    .modal-actions { @apply flex justify-end gap-2 mt-2; }
    .not-found { @apply text-center py-12 text-slate-400; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MemberDetailComponent {
  private readonly route = inject(ActivatedRoute);
  protected readonly router = inject(Router);
  protected readonly mock = inject(MockDataService);

  showSuspendModal = signal(false);
  suspendReason = '';

  readonly member = computed(() => {
    const id = this.route.snapshot.paramMap.get('id');
    return this.mock.members().find(m => m.id === id) ?? null;
  });

  readonly memberContributions = computed(() => {
    const m = this.member();
    return m ? this.mock.contributions().filter(c => c.memberId === m.id) : [];
  });

  readonly totalContributed = computed(() =>
    this.memberContributions().filter(c => c.status === 'confirmed').reduce((s, c) => s + c.amount, 0)
  );

  readonly memberLoans = computed(() => {
    const m = this.member();
    return m ? this.mock.loans().filter(l => l.memberId === m.id) : [];
  });

  readonly memberSanctions = computed(() => {
    const m = this.member();
    return m ? this.mock.sanctions().filter(s => s.memberId === m.id) : [];
  });

  getInitials(first: string, last: string): string { return (first[0] + last[0]).toUpperCase(); }

  getRoleVariant(role: string): 'primary' | 'secondary' | 'warning' | 'info' | 'success' | 'danger' {
    const map: Record<string, 'primary' | 'secondary' | 'warning' | 'info'> = { president: 'primary', vice_president: 'primary', treasurer: 'warning', secretary: 'info' };
    return map[role] ?? 'secondary';
  }

  getRoleLabel(role: string): string {
    const map: Record<string, string> = { president: 'Président', vice_president: 'Vice-Président', treasurer: 'Trésorier', secretary: 'Secrétaire', censor: 'Censeur', auditor: 'CAC', member: 'Membre' };
    return map[role] ?? role;
  }

  suspend(memberId: string): void {
    this.mock.suspendMember(memberId, this.suspendReason || 'Suspendu par le Président');
    this.showSuspendModal.set(false);
  }

  activate(memberId: string): void {
    this.mock.activateMember(memberId);
  }
}

import { ChangeDetectionStrategy, Component, inject, computed, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageHeaderComponent } from '../../../../shared/components/layout/page-header/page-header.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { ModalComponent } from '../../../../shared/components/ui/modal/modal.component';
import { MockDataService } from '../../../../core/services/mock-data.service';
import { FormsModule } from '@angular/forms';
import { SessionStatus } from '../../../../core/enums/session-status.enum';

@Component({
  selector: 'app-session-live',
  standalone: true,
  imports: [PageHeaderComponent, CardComponent, BadgeComponent, ButtonComponent, ModalComponent, FormsModule],
  template: `
    <app-page-header title="Séance en direct" backLink="/sessions" />

    @if (session(); as s) {
      <div class="live-layout">
        <!-- Session status bar -->
        <div class="status-bar">
          <div class="status-info">
            <h2 class="session-title">Séance #{{ s.number }}</h2>
            <app-badge [variant]="s.status === 'opened' ? 'success' : s.status === 'scheduled' ? 'warning' : 'secondary'">
              @switch (s.status) {
                @case ('scheduled') { ⚪ Non démarrée }
                @case ('opened') { 🟢 En cours }
                @case ('closed') { ✅ Clôturée }
              }
            </app-badge>
          </div>
          <div class="status-meta">
            <span>📍 {{ s.location }}</span>
            <span>📅 {{ s.scheduledDate }} à {{ s.scheduledTime }}</span>
            @if (s.beneficiary) {
              <span>🎯 {{ s.beneficiary.user.firstName }} {{ s.beneficiary.user.lastName }}</span>
            }
          </div>
        </div>

        <div class="live-grid">
          <!-- Agenda -->
          <app-card>
            <div class="section">
              <h3 class="section-title">📋 Ordre du jour - Suivi</h3>
              @for (item of mock.agendaItems(); track item.id) {
                <div [class]="'agenda-item agenda-' + item.status">
                  <span class="agenda-icon">
                    @switch (item.status) {
                      @case ('completed') { ✅ }
                      @case ('in-progress') { 🔵 }
                      @case ('pending') { ⚪ }
                    }
                  </span>
                  <span class="agenda-order">{{ item.order }}.</span>
                  <span class="agenda-title">{{ item.title }}</span>
                  @if (item.status === 'in-progress') {
                    <app-badge variant="info" size="sm">EN COURS</app-badge>
                  }
                </div>
              }

              @if (s.status === 'opened') {
                <div class="agenda-actions">
                  <app-button variant="primary" size="sm" (clicked)="mock.advanceAgenda()">
                    ▶ Point suivant
                  </app-button>
                </div>
              }
            </div>
          </app-card>

          <!-- Actions -->
          <div class="actions-col">
            @if (s.status === 'scheduled') {
              <app-card>
                <div class="section">
                  <h3 class="section-title">🟢 Ouverture</h3>
                  <p class="info-text">Présences confirmées: <strong>{{ mock.activeMembers().length }}</strong>/{{ mock.members().length }}</p>
                  <p class="info-text">Quorum requis: {{ quorumRequired() }} (67%)</p>
                  <p class="info-text quorum-ok">✅ Quorum sera atteint</p>
                  <app-button variant="primary" (clicked)="openSession()" class="mt-4">
                    🟢 Ouvrir la séance
                  </app-button>
                </div>
              </app-card>
            }

            @if (s.status === 'opened') {
              <app-card>
                <div class="section">
                  <h3 class="section-title">⚡ Actions pendant la séance</h3>
                  <div class="live-actions">
                    <app-button variant="outline" (clicked)="showVoteModal.set(true)">🗳️ Lancer un vote</app-button>
                    <app-button variant="outline" (clicked)="showNoteModal.set(true)">📝 Ajouter une note au PV</app-button>
                    <app-button variant="danger" (clicked)="closeSession()">⏹️ Clôturer la séance</app-button>
                  </div>
                </div>
              </app-card>

              <!-- Attendance quick view -->
              <app-card>
                <div class="section">
                  <h3 class="section-title">👥 Présences ({{ mock.activeMembers().length }})</h3>
                  <div class="attendance-list">
                    @for (m of mock.members().slice(0, 10); track m.id) {
                      <div class="attendance-item">
                        <span class="att-name">{{ m.user.firstName }} {{ m.user.lastName }}</span>
                        <app-badge [variant]="m.status === 'active' ? 'success' : 'danger'" size="sm">
                          {{ m.status === 'active' ? '✅' : '❌' }}
                        </app-badge>
                      </div>
                    }
                    @if (mock.members().length > 10) {
                      <p class="more-text">... et {{ mock.members().length - 10 }} autres</p>
                    }
                  </div>
                </div>
              </app-card>
            }

            @if (s.status === 'closed') {
              <app-card>
                <div class="section">
                  <h3 class="section-title">✅ Séance clôturée</h3>
                  <p class="info-text">Ouverte à: {{ s.openedAt }}</p>
                  <p class="info-text">Clôturée à: {{ s.closedAt }}</p>
                  <app-button variant="outline" (clicked)="router.navigate(['/sessions'])">← Retour aux séances</app-button>
                </div>
              </app-card>
            }
          </div>
        </div>
      </div>

      <!-- Vote Modal -->
      <app-modal [isOpen]="showVoteModal()" title="Lancer un vote" (closed)="showVoteModal.set(false)">
        <div class="modal-form">
          <label class="form-label">Question du vote</label>
          <input class="form-input" [(ngModel)]="voteTitle" placeholder="Ex: Cotisation extraordinaire..." />
          <label class="form-label">Description</label>
          <textarea class="form-textarea" [(ngModel)]="voteDescription" rows="3"></textarea>
          <label class="form-label">Type de majorité</label>
          <select class="form-input" [(ngModel)]="voteType">
            <option value="majority">Majorité simple (50% + 1)</option>
            <option value="two_thirds">Deux tiers (67%)</option>
            <option value="unanimous">Unanimité</option>
          </select>
          <div class="modal-actions">
            <app-button variant="outline" (clicked)="showVoteModal.set(false)">Annuler</app-button>
            <app-button variant="primary" (clicked)="launchVote()">Lancer le vote</app-button>
          </div>
        </div>
      </app-modal>

      <!-- Note Modal -->
      <app-modal [isOpen]="showNoteModal()" title="Note pour le PV" (closed)="showNoteModal.set(false)">
        <div class="modal-form">
          <label class="form-label">Note</label>
          <textarea class="form-textarea" [(ngModel)]="noteText" rows="4" placeholder="Ajoutez une note..."></textarea>
          <div class="modal-actions">
            <app-button variant="outline" (clicked)="showNoteModal.set(false)">Annuler</app-button>
            <app-button variant="primary" (clicked)="addNote()">Ajouter</app-button>
          </div>
        </div>
      </app-modal>
    }
  `,
  styles: `@reference "tailwindcss";
    .live-layout { @apply flex flex-col gap-6; }
    .status-bar { @apply bg-white rounded-xl p-4 shadow-sm border border-slate-200 flex flex-col gap-2; }
    .status-info { @apply flex items-center gap-3; }
    .session-title { @apply text-xl font-bold text-slate-900; }
    .status-meta { @apply flex flex-wrap gap-4 text-sm text-slate-600; }
    .live-grid { @apply grid grid-cols-1 lg:grid-cols-2 gap-6; }
    .section { @apply p-2 flex flex-col gap-3; }
    .section-title { @apply text-base font-semibold text-slate-900; }
    .agenda-item { @apply flex items-center gap-2 py-2 border-b border-slate-100 last:border-none; }
    .agenda-completed { @apply opacity-60; }
    .agenda-in-progress { @apply bg-blue-50 rounded-lg px-2 -mx-2; }
    .agenda-icon { @apply text-base; }
    .agenda-order { @apply text-sm text-slate-500 w-6; }
    .agenda-title { @apply text-sm text-slate-800 flex-1; }
    .agenda-actions { @apply flex gap-2 mt-3 pt-3 border-t border-slate-200; }
    .live-actions { @apply flex flex-col gap-2; }
    .actions-col { @apply flex flex-col gap-6; }
    .info-text { @apply text-sm text-slate-600; }
    .quorum-ok { @apply text-green-600 font-medium; }
    .attendance-list { @apply flex flex-col gap-1; }
    .attendance-item { @apply flex justify-between items-center py-1; }
    .att-name { @apply text-sm text-slate-700; }
    .more-text { @apply text-xs text-slate-400 mt-1; }
    .modal-form { @apply flex flex-col gap-3 p-4; }
    .form-label { @apply text-sm font-medium text-slate-700; }
    .form-input { @apply border border-slate-300 rounded-lg px-3 py-2 text-sm; }
    .form-textarea { @apply border border-slate-300 rounded-lg px-3 py-2 text-sm resize-y; }
    .modal-actions { @apply flex justify-end gap-2 mt-2; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionLiveComponent {
  private readonly route = inject(ActivatedRoute);
  protected readonly router = inject(Router);
  protected readonly mock = inject(MockDataService);

  readonly session = computed(() => {
    const id = this.route.snapshot.paramMap.get('id');
    return this.mock.sessions().find(s => s.id === id) ?? null;
  });

  readonly quorumRequired = computed(() => Math.ceil(this.mock.members().length * 0.67));

  showVoteModal = signal(false);
  showNoteModal = signal(false);
  voteTitle = '';
  voteDescription = '';
  voteType: 'majority' | 'two_thirds' | 'unanimous' = 'majority';
  noteText = '';
  notes = signal<string[]>([]);

  openSession(): void {
    const s = this.session();
    if (s) this.mock.openSession(s.id);
  }

  closeSession(): void {
    const s = this.session();
    if (s) this.mock.closeSession(s.id);
  }

  launchVote(): void {
    if (this.voteTitle.trim()) {
      this.mock.launchVote(this.voteTitle, this.voteDescription, this.voteType, ['Pour', 'Contre', 'Abstention']);
      this.showVoteModal.set(false);
      this.voteTitle = '';
      this.voteDescription = '';
    }
  }

  addNote(): void {
    if (this.noteText.trim()) {
      this.notes.update(n => [...n, this.noteText]);
      this.showNoteModal.set(false);
      this.noteText = '';
    }
  }
}

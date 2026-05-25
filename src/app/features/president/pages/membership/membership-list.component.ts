import { ChangeDetectionStrategy, Component, computed, inject, resource, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { EmptyStateComponent } from '../../../../shared/components/ui/empty-state/empty-state.component';
import { SpinnerComponent } from '../../../../shared/components/ui/spinner/spinner.component';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { PresidentService } from '../../services/president.service';
import type {
  MembershipFile,
  MembershipFileKind,
  MembershipFileStatus,
} from '../../../../shared/models/entities/membership.model';

type Tab = 'ALL' | MembershipFileKind;

const KIND_LABELS: Record<MembershipFileKind, string> = {
  ADHESION: 'Adhésion',
  RESIGNATION: 'Démission',
  EXCLUSION: 'Radiation',
};

const STATUS_LABELS: Record<MembershipFileStatus, string> = {
  SUBMITTED: 'Soumis',
  BUREAU_REVIEW: 'Examen Bureau',
  ASSEMBLY_VOTE_PENDING: 'Vote Assemblée en attente',
  ASSEMBLY_APPROVED: 'Approuvé par Assemblée',
  ASSEMBLY_REJECTED: 'Rejeté par Assemblée',
  PRESIDENT_REVIEW: 'En attente du Président',
  APPROVED: 'Approuvé',
  REJECTED: 'Rejeté',
};

@Component({
  selector: 'tc-membership-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    BadgeComponent,
    CardComponent,
    EmptyStateComponent,
    SpinnerComponent,
    DateFormatPipe,
  ],
  template: `
    <div class="space-y-6">
      <header>
        <h1 class="text-2xl font-bold text-gray-900">Gestion des membres</h1>
        <p class="text-sm text-gray-500">Adhésions, démissions et radiations en cours.</p>
      </header>

      <div class="flex flex-wrap gap-2">
        @for (tab of tabs; track tab.value) {
          <button
            type="button"
            [class]="tabClass(tab.value)"
            (click)="active.set(tab.value)"
          >
            {{ tab.label }}
            <span class="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white/20 px-1.5 text-xs">
              {{ countFor(tab.value) }}
            </span>
          </button>
        }
      </div>

      @if (resource.isLoading()) {
        <div class="flex justify-center py-12"><tc-spinner size="lg" /></div>
      } @else if (visibleItems().length === 0) {
        <tc-card>
          <tc-empty-state title="Aucun dossier" icon="✓" description="Aucun dossier dans cette catégorie." />
        </tc-card>
      } @else {
        <ul class="space-y-3">
          @for (file of visibleItems(); track file.id) {
            <li>
              <a
                [routerLink]="['/president/membership', file.id]"
                class="block rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:border-blue-300"
              >
                <div class="flex flex-wrap items-start justify-between gap-3">
                  <div class="min-w-0">
                    <div class="flex items-center gap-2">
                      <p class="font-semibold text-gray-900">{{ file.candidateFullName }}</p>
                      <tc-badge [kind]="kindBadge(file.kind)">{{ kindLabel(file.kind) }}</tc-badge>
                      <tc-badge [kind]="statusBadge(file.status)">{{ statusLabel(file.status) }}</tc-badge>
                    </div>
                    <p class="mt-1 text-sm text-gray-600">{{ file.motivation }}</p>
                    <p class="mt-1 text-xs text-gray-500">Soumis le {{ file.submittedAt | tcDate: true }}</p>
                  </div>
                  <span class="text-blue-600 text-sm font-medium">Examiner →</span>
                </div>
              </a>
            </li>
          }
        </ul>
      }
    </div>
  `,
})
export class MembershipListComponent {
  private readonly service = inject(PresidentService);

  readonly active = signal<Tab>('ALL');

  readonly tabs: { label: string; value: Tab }[] = [
    { label: 'Tout', value: 'ALL' },
    { label: 'Adhésions', value: 'ADHESION' },
    { label: 'Démissions', value: 'RESIGNATION' },
    { label: 'Radiations', value: 'EXCLUSION' },
  ];

  readonly resource = resource({
    loader: () => this.service.getMembershipFiles(),
  });

  readonly items = computed<MembershipFile[]>(() => this.resource.value() ?? []);

  readonly visibleItems = computed(() => {
    const f = this.active();
    if (f === 'ALL') return this.items();
    return this.items().filter((i) => i.kind === f);
  });

  countFor(value: Tab): number {
    if (value === 'ALL') return this.items().length;
    return this.items().filter((i) => i.kind === value).length;
  }

  tabClass(value: Tab): string {
    const base = 'inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium border';
    const isActive = this.active() === value;
    return `${base} ${isActive ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`;
  }

  kindLabel(kind: MembershipFileKind): string {
    return KIND_LABELS[kind];
  }

  statusLabel(status: MembershipFileStatus): string {
    return STATUS_LABELS[status];
  }

  kindBadge(kind: MembershipFileKind): 'info' | 'warning' | 'danger' {
    return { ADHESION: 'info', RESIGNATION: 'warning', EXCLUSION: 'danger' }[kind] as 'info' | 'warning' | 'danger';
  }

  statusBadge(status: MembershipFileStatus): 'success' | 'warning' | 'info' | 'danger' | 'neutral' {
    if (status === 'APPROVED' || status === 'ASSEMBLY_APPROVED') return 'success';
    if (status === 'REJECTED' || status === 'ASSEMBLY_REJECTED') return 'danger';
    if (status === 'PRESIDENT_REVIEW') return 'warning';
    if (status === 'ASSEMBLY_VOTE_PENDING') return 'info';
    return 'neutral';
  }
}

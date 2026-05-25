import { ChangeDetectionStrategy, Component, computed, inject, input, resource, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AlertComponent } from '../../../../shared/components/ui/alert/alert.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { SpinnerComponent } from '../../../../shared/components/ui/spinner/spinner.component';
import { TextareaComponent } from '../../../../shared/components/ui/textarea/textarea.component';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { NotificationService } from '../../../../core/services/notification.service';
import { PresidentService } from '../../services/president.service';
import type { MembershipFileKind } from '../../../../shared/models/entities/membership.model';

const KIND_LABELS: Record<MembershipFileKind, string> = {
  ADHESION: 'Adhésion',
  RESIGNATION: 'Démission',
  EXCLUSION: 'Radiation',
};

@Component({
  selector: 'tc-membership-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    AlertComponent,
    BadgeComponent,
    ButtonComponent,
    CardComponent,
    SpinnerComponent,
    TextareaComponent,
    DateFormatPipe,
  ],
  template: `
    <div class="space-y-6">
      <a routerLink="/president/membership" class="inline-flex items-center text-sm text-blue-600 hover:underline">
        ← Retour
      </a>

      @if (resource.isLoading()) {
        <div class="flex justify-center py-12"><tc-spinner size="lg" /></div>
      } @else if (file(); as f) {
        <header class="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">{{ f.candidateFullName }}</h1>
            <p class="text-sm text-gray-500">{{ KIND_LABELS[f.kind] }} · soumis le {{ f.submittedAt | tcDate: true }}</p>
          </div>
          <tc-badge kind="warning">{{ f.status }}</tc-badge>
        </header>

        @if (errorMessage(); as err) {
          <tc-alert kind="error">{{ err }}</tc-alert>
        }

        <div class="grid gap-6 lg:grid-cols-3">
          <div class="lg:col-span-2 space-y-6">
            <tc-card title="Motivation">
              <p class="text-sm text-gray-700 whitespace-pre-wrap">{{ f.motivation }}</p>
            </tc-card>

            <tc-card title="Coordonnées">
              <dl class="grid gap-3 text-sm sm:grid-cols-2">
                @if (f.candidatePhone) {
                  <div><dt class="text-gray-500">Téléphone</dt><dd>{{ f.candidatePhone }}</dd></div>
                }
                @if (f.candidateEmail) {
                  <div><dt class="text-gray-500">Email</dt><dd>{{ f.candidateEmail }}</dd></div>
                }
                @if (f.sponsorFullName) {
                  <div><dt class="text-gray-500">Parrain</dt><dd>{{ f.sponsorFullName }}</dd></div>
                }
              </dl>
            </tc-card>

            @if (f.assemblyVotedAt) {
              <tc-card title="Vote de l'Assemblée">
                <div class="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p class="text-2xl font-bold text-green-600">{{ f.assemblyVoteYes ?? 0 }}</p>
                    <p class="text-xs text-gray-500">Pour</p>
                  </div>
                  <div>
                    <p class="text-2xl font-bold text-red-600">{{ f.assemblyVoteNo ?? 0 }}</p>
                    <p class="text-xs text-gray-500">Contre</p>
                  </div>
                  <div>
                    <p class="text-2xl font-bold text-gray-500">{{ f.assemblyVoteAbstain ?? 0 }}</p>
                    <p class="text-xs text-gray-500">Abstention</p>
                  </div>
                </div>
                <p class="mt-3 text-xs text-gray-500 text-center">
                  Vote tenu le {{ f.assemblyVotedAt | tcDate: true }}
                </p>
              </tc-card>
            }

            <tc-card title="Historique">
              <ul class="space-y-2 text-sm">
                @for (entry of f.history; track entry.at) {
                  <li class="flex items-start gap-3">
                    <span class="text-xs text-gray-500 shrink-0 w-32">{{ entry.at | tcDate: true }}</span>
                    <div>
                      <p class="text-gray-900"><span class="font-semibold">{{ entry.actor }}</span> — {{ entry.action }}</p>
                    </div>
                  </li>
                }
              </ul>
            </tc-card>

            @if (f.attachments?.length) {
              <tc-card title="Pièces jointes">
                <ul class="space-y-1 text-sm">
                  @for (att of f.attachments; track att.id) {
                    <li class="text-gray-700">📎 {{ att.name }}</li>
                  }
                </ul>
              </tc-card>
            }
          </div>

          <aside>
            <tc-card title="Votre décision">
              <p class="text-sm text-gray-600 mb-3">
                @switch (f.kind) {
                  @case ('ADHESION') { Validez ou refusez le dossier d'adhésion. }
                  @case ('RESIGNATION') { Acceptez ou refusez la démission. }
                  @case ('EXCLUSION') { Validez ou refusez la radiation après vote de l'Assemblée. }
                }
              </p>
              <tc-textarea
                label="Commentaire"
                [hint]="commentRequired() ? 'Obligatoire pour un refus.' : 'Optionnel.'"
                [(value)]="comment"
                [(touched)]="commentTouched"
                [error]="commentError()"
              />
              <div class="mt-4 flex flex-col gap-2">
                <tc-button variant="success" [fullWidth]="true" [loading]="acting() === 'APPROVE'" (clicked)="decide('APPROVE')">
                  ✓ Approuver
                </tc-button>
                <tc-button variant="danger" [fullWidth]="true" [loading]="acting() === 'REJECT'" (clicked)="decide('REJECT')">
                  ✗ Refuser
                </tc-button>
              </div>
            </tc-card>
          </aside>
        </div>
      } @else {
        <tc-card>Dossier introuvable.</tc-card>
      }
    </div>
  `,
})
export class MembershipDetailComponent {
  readonly id = input.required<string>();
  protected readonly KIND_LABELS = KIND_LABELS;

  private readonly service = inject(PresidentService);
  private readonly notifications = inject(NotificationService);
  private readonly router = inject(Router);

  readonly resource = resource({
    params: () => this.id(),
    loader: ({ params }) => this.service.getMembershipFile(params),
  });

  readonly file = computed(() => this.resource.value());

  readonly comment = signal('');
  readonly commentTouched = signal(false);
  readonly acting = signal<'APPROVE' | 'REJECT' | null>(null);
  readonly errorMessage = signal<string | null>(null);

  readonly commentRequired = computed(() => this.acting() === 'REJECT');
  readonly commentError = computed(() =>
    this.commentRequired() && this.comment().trim().length === 0 ? 'Commentaire requis.' : '',
  );

  async decide(decision: 'APPROVE' | 'REJECT'): Promise<void> {
    this.acting.set(decision);
    this.commentTouched.set(true);
    this.errorMessage.set(null);

    if (decision === 'REJECT' && this.comment().trim().length === 0) {
      this.acting.set(null);
      return;
    }

    try {
      await this.service.decideMembershipFile(this.id(), decision, this.comment().trim() || undefined);
      this.notifications.success(decision === 'APPROVE' ? 'Dossier approuvé.' : 'Dossier rejeté.');
      await this.router.navigateByUrl('/president/membership');
    } catch (e: unknown) {
      this.errorMessage.set((e as { error?: { message?: string } })?.error?.message ?? 'Erreur.');
      this.acting.set(null);
    }
  }
}

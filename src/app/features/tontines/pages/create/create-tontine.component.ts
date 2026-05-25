import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AlertComponent } from '../../../../shared/components/ui/alert/alert.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { IconComponent } from '../../../../shared/components/ui/icon/icon.component';
import { InputComponent } from '../../../../shared/components/ui/input/input.component';
import { CurrencyXafPipe } from '../../../../shared/pipes/currency-xaf.pipe';
import { NotificationService } from '../../../../core/services/notification.service';
import type {
  ContributionFrequency,
  FounderInvite,
  FounderRole,
  TontineRules,
} from '../../../../shared/models/entities/tontine.model';
import { TontineService } from '../../services/tontine.service';

const PHONE_RE = /^\+237\d{9}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FounderDraft {
  fullName: string;
  phone: string;
  email: string;
  role: FounderRole;
}

@Component({
  selector: 'tc-create-tontine',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AlertComponent,
    BadgeComponent,
    ButtonComponent,
    CardComponent,
    IconComponent,
    InputComponent,
    CurrencyXafPipe,
  ],
  templateUrl: './create-tontine.component.html',
  styleUrl: './create-tontine.component.scss',
})
export class CreateTontineComponent {
  private readonly service = inject(TontineService);
  private readonly router = inject(Router);
  private readonly notifications = inject(NotificationService);

  protected readonly stepLabels = ['Infos', 'Finances', 'Règlement', 'Fondateurs', 'Récap.'];

  readonly step = signal(1);
  readonly errorMessage = signal<string | null>(null);
  readonly submitting = signal(false);

  // Step 1
  readonly name = signal('');
  readonly nameTouched = signal(false);
  readonly description = signal('');
  readonly startDate = signal(new Date().toISOString().slice(0, 10));

  // Step 2
  readonly contributionAmountStr = signal('50000');
  readonly contributionAmountTouched = signal(false);
  readonly frequency = signal<ContributionFrequency>('MONTHLY');
  readonly maxMembersStr = signal('12');
  readonly maxMembersTouched = signal(false);

  // Step 3
  readonly latePenaltyStr = signal('500');
  readonly absencePenaltyStr = signal('1000');
  readonly contributionLatePenaltyStr = signal('1500');
  readonly loanMaxAmountStr = signal('500000');
  readonly loanInterestRateStr = signal('5');
  readonly loanMaxDurationStr = signal('6');
  readonly expenseCapStr = signal('100000');
  readonly emergencyDeductionStr = signal('5');
  readonly operationsDeductionStr = signal('3');

  // Step 4
  readonly founders = signal<FounderDraft[]>([]);
  readonly founderError = signal<string | null>(null);

  // Computed
  readonly contributionAmount = computed(() => Number(this.contributionAmountStr()) || 0);
  readonly maxMembers = computed(() => Number(this.maxMembersStr()) || 0);
  readonly latePenalty = computed(() => Number(this.latePenaltyStr()) || 0);
  readonly absencePenalty = computed(() => Number(this.absencePenaltyStr()) || 0);
  readonly contributionLatePenalty = computed(() => Number(this.contributionLatePenaltyStr()) || 0);
  readonly loanMaxAmount = computed(() => Number(this.loanMaxAmountStr()) || 0);
  readonly loanInterestRate = computed(() => Number(this.loanInterestRateStr()) || 0);
  readonly loanMaxDuration = computed(() => Number(this.loanMaxDurationStr()) || 0);
  readonly expenseCap = computed(() => Number(this.expenseCapStr()) || 0);
  readonly emergencyDeduction = computed(() => Number(this.emergencyDeductionStr()) || 0);
  readonly operationsDeduction = computed(() => Number(this.operationsDeductionStr()) || 0);

  readonly totalDeductions = computed(
    () => this.emergencyDeduction() + this.operationsDeduction(),
  );
  readonly deductionsTotalError = computed(() => this.totalDeductions() > 100);

  readonly nameError = computed(() => (this.name().trim() ? '' : 'Nom requis.'));
  readonly contributionAmountError = computed(() =>
    this.contributionAmount() > 0 ? '' : 'Montant requis.',
  );
  readonly maxMembersError = computed(() =>
    this.maxMembers() >= 3 ? '' : 'Au moins 3 membres.',
  );

  readonly cycleDurationLabel = computed(() => {
    const sessions = this.maxMembers();
    const freq = this.frequency();
    if (!sessions) return '—';
    const weeksPerSession = freq === 'WEEKLY' ? 1 : freq === 'BIWEEKLY' ? 2 : 4;
    const weeks = sessions * weeksPerSession;
    if (weeks < 4) return `${weeks} semaine(s)`;
    const months = Math.round(weeks / 4);
    return `${months} mois (${sessions} séances)`;
  });

  readonly cagnotteEstimate = computed(() => this.contributionAmount() * this.maxMembers());

  readonly freqLabel = computed(() => {
    const map = { WEEKLY: 'Hebdomadaire', BIWEEKLY: 'Bimensuelle', MONTHLY: 'Mensuelle' };
    return map[this.frequency()];
  });

  roleLabel(r: FounderRole): string {
    const map = {
      MEMBER: 'Membre',
      PRESIDENT: 'Président',
      SECRETARY: 'Secrétaire',
      TREASURER: 'Trésorier',
      CENSOR: 'Censeur',
      AUDITOR: 'Commissaire',
    };
    return map[r];
  }

  next(event: Event): void {
    event.preventDefault();
    this.errorMessage.set(null);

    if (this.step() === 1) {
      this.nameTouched.set(true);
      if (this.nameError()) return;
    }
    if (this.step() === 2) {
      this.contributionAmountTouched.set(true);
      this.maxMembersTouched.set(true);
      if (this.contributionAmountError() || this.maxMembersError()) return;
    }
    if (this.step() === 3) {
      if (this.deductionsTotalError()) return;
    }

    this.step.update((s) => s + 1);
  }

  prev(): void {
    this.step.update((s) => Math.max(1, s - 1));
  }

  addFounder(): void {
    this.founders.update((arr) => [
      ...arr,
      { fullName: '', phone: '+237', email: '', role: 'MEMBER' },
    ]);
  }

  removeFounder(i: number): void {
    this.founders.update((arr) => arr.filter((_, idx) => idx !== i));
  }

  updateFounder(i: number, field: keyof FounderDraft, value: string): void {
    this.founders.update((arr) =>
      arr.map((f, idx) => (idx === i ? { ...f, [field]: value } : f)),
    );
  }

  goToReview(): void {
    this.errorMessage.set(null);
    this.founderError.set(null);
    const list = this.founders();
    for (let i = 0; i < list.length; i++) {
      const f = list[i];
      if (!f.fullName.trim()) {
        this.founderError.set(`Fondateur ${i + 1} : nom requis.`);
        return;
      }
      if (!PHONE_RE.test(f.phone.trim())) {
        this.founderError.set(`Fondateur ${i + 1} : téléphone invalide (format +237699...).`);
        return;
      }
      if (f.email.trim() && !EMAIL_RE.test(f.email.trim())) {
        this.founderError.set(`Fondateur ${i + 1} : email invalide.`);
        return;
      }
    }
    const bureauRoles: FounderRole[] = ['SECRETARY', 'TREASURER', 'CENSOR', 'AUDITOR'];
    for (const role of bureauRoles) {
      const count = list.filter((f) => f.role === role).length;
      if (count > 1) {
        this.founderError.set(`Plusieurs fondateurs ont le rôle ${this.roleLabel(role)} (un seul autorisé).`);
        return;
      }
    }
    this.step.set(5);
  }

  async submit(): Promise<void> {
    this.errorMessage.set(null);
    this.submitting.set(true);
    try {
      const rules: TontineRules = {
        latePenaltyAmount: this.latePenalty(),
        absencePenaltyAmount: this.absencePenalty(),
        contributionLatePenaltyAmount: this.contributionLatePenalty(),
        loanMaxAmount: this.loanMaxAmount(),
        loanInterestRatePercent: this.loanInterestRate(),
        loanMaxDurationMonths: this.loanMaxDuration(),
        expenseCapWithoutValidation: this.expenseCap(),
        emergencyDeductionPercent: this.emergencyDeduction(),
        operationsDeductionPercent: this.operationsDeduction(),
      };
      const founders: FounderInvite[] = this.founders().map((f) => ({
        fullName: f.fullName.trim(),
        phone: f.phone.trim(),
        email: f.email.trim() || undefined,
        role: f.role,
      }));
      const tontine = await this.service.create({
        name: this.name().trim(),
        description: this.description().trim() || undefined,
        startDate: new Date(this.startDate()).toISOString(),
        contributionAmount: this.contributionAmount(),
        frequency: this.frequency(),
        maxMembers: this.maxMembers(),
        rules,
        founders,
      });
      this.notifications.success(`Tontine "${tontine.name}" créée.`);
      await this.router.navigateByUrl('/dashboard');
    } catch (e: unknown) {
      this.errorMessage.set((e as { error?: { message?: string } })?.error?.message ?? 'Erreur.');
    } finally {
      this.submitting.set(false);
    }
  }
}

import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AlertComponent } from '../../../../shared/components/ui/alert/alert.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { IconComponent } from '../../../../shared/components/ui/icon/icon.component';
import { InputComponent } from '../../../../shared/components/ui/input/input.component';
import { CurrencyXafPipe } from '../../../../shared/pipes/currency-xaf.pipe';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { formatApiError } from '../../../../core/utils';
import type {
  ContributionFrequency,
  FounderInvite,
  InvitableFounderRole,
  TontineRules,
} from '../../../../shared/models/entities/tontine.model';
import { TontineService } from '../../services/tontine.service';

const LOCAL_PHONE_RE = /^\d{5,15}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface Country {
  code: string;
  name: string;
  dial_code: string;
}

const COUNTRIES: Country[] = [
  { code: 'CM', name: 'Cameroun', dial_code: '+237' },
  { code: 'NG', name: 'Nigeria', dial_code: '+234' },
  { code: 'SN', name: 'Sénégal', dial_code: '+221' },
  { code: 'CI', name: "Côte d'Ivoire", dial_code: '+225' },
  { code: 'GH', name: 'Ghana', dial_code: '+233' },
  { code: 'CD', name: 'Congo RDC', dial_code: '+243' },
  { code: 'CG', name: 'Congo', dial_code: '+242' },
  { code: 'GA', name: 'Gabon', dial_code: '+241' },
  { code: 'TD', name: 'Tchad', dial_code: '+235' },
  { code: 'CF', name: 'Centrafrique', dial_code: '+236' },
  { code: 'GQ', name: 'Guinée Équatoriale', dial_code: '+240' },
  { code: 'ML', name: 'Mali', dial_code: '+223' },
  { code: 'BF', name: 'Burkina Faso', dial_code: '+226' },
  { code: 'BJ', name: 'Bénin', dial_code: '+229' },
  { code: 'TG', name: 'Togo', dial_code: '+228' },
  { code: 'GN', name: 'Guinée', dial_code: '+224' },
  { code: 'MA', name: 'Maroc', dial_code: '+212' },
  { code: 'TN', name: 'Tunisie', dial_code: '+216' },
  { code: 'DZ', name: 'Algérie', dial_code: '+213' },
  { code: 'MU', name: 'Île Maurice', dial_code: '+230' },
  { code: 'FR', name: 'France', dial_code: '+33' },
  { code: 'BE', name: 'Belgique', dial_code: '+32' },
  { code: 'CH', name: 'Suisse', dial_code: '+41' },
  { code: 'CA', name: 'Canada', dial_code: '+1' },
  { code: 'US', name: 'États-Unis', dial_code: '+1' },
  { code: 'GB', name: 'Royaume-Uni', dial_code: '+44' },
  { code: 'DE', name: 'Allemagne', dial_code: '+49' },
  { code: 'ES', name: 'Espagne', dial_code: '+34' },
  { code: 'IT', name: 'Italie', dial_code: '+39' },
  { code: 'PT', name: 'Portugal', dial_code: '+351' },
];

interface FounderDraft {
  fullName: string;
  countryCode: string;
  localPhone: string;
  email: string;
  role: InvitableFounderRole;
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
  private readonly auth = inject(AuthService);

  protected readonly stepLabels = ['Infos', 'Finances', 'Règlement', 'Fondateurs', 'Récap.'];

  /** Nom complet du créateur (utilisé dans les bannières "Vous serez Président"). */
  readonly creatorFullName = computed(() => {
    const u = this.auth.user();
    if (!u) return 'Vous';
    return `${u.firstName} ${u.lastName}`.trim() || u.email;
  });

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
  readonly countries = COUNTRIES;
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

  roleLabel(r: InvitableFounderRole): string {
    const map: Record<InvitableFounderRole, string> = {
      MEMBER: 'Membre',
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

  countryFor(code: string): Country {
    return this.countries.find(c => c.code === code) ?? this.countries[0];
  }

  founderPhone(f: FounderDraft): string {
    return `${this.countryFor(f.countryCode).dial_code}${f.localPhone.trim()}`;
  }

  addFounder(): void {
    this.founders.update((arr) => [
      ...arr,
      { fullName: '', countryCode: 'CM', localPhone: '', email: '', role: 'MEMBER' },
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
      if (!LOCAL_PHONE_RE.test(f.localPhone.replace(/[\s\-]/g, ''))) {
        this.founderError.set(`Fondateur ${i + 1} : numéro de téléphone invalide.`);
        return;
      }
      if (f.email.trim() && !EMAIL_RE.test(f.email.trim())) {
        this.founderError.set(`Fondateur ${i + 1} : email invalide.`);
        return;
      }
    }
    const bureauRoles: InvitableFounderRole[] = ['SECRETARY', 'TREASURER', 'CENSOR', 'AUDITOR'];
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
        phone: this.founderPhone(f),
        email: f.email.trim() || undefined,
        role: f.role,
      }));
      const tontine = await this.service.create({
        name: this.name().trim(),
        description: this.description().trim() || undefined,
        // Backend attend une LocalDate au format YYYY-MM-DD ; <input type="date"> le fournit déjà.
        startDate: this.startDate(),
        contributionAmount: this.contributionAmount(),
        frequency: this.frequency(),
        maxMembers: this.maxMembers(),
        rules,
        founders,
      });
      this.notifications.success(`Tontine "${tontine.name}" créée.`);
      await this.router.navigateByUrl('/dashboard');
    } catch (e: unknown) {
      this.errorMessage.set(formatApiError(e, 'Erreur.'));
    } finally {
      this.submitting.set(false);
    }
  }
}

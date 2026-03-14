import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PageHeaderComponent } from '../../../../shared/components/layout/page-header/page-header.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { InputComponent } from '../../../../shared/components/ui/input/input.component';
import { SelectComponent } from '../../../../shared/components/ui/select/select.component';
import { AmountInputComponent } from '../../../../shared/components/forms/amount-input/amount-input.component';
import { TontineStore } from '../../../../store';
import { NotificationService } from '../../../../core/services/notification.service';
import { TontineApiService } from '../../../../core/api/services/tontine-api.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-tontine-settings',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    PageHeaderComponent,
    CardComponent,
    ButtonComponent,
    InputComponent,
    SelectComponent,
    AmountInputComponent,
  ],
  templateUrl: './tontine-settings.component.html',
  styleUrl: './tontine-settings.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TontineSettingsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly tontineStore = inject(TontineStore);
  private readonly tontineApi = inject(TontineApiService);
  private readonly notification = inject(NotificationService);

  readonly currentTontine = this.tontineStore.currentTontine;
  readonly isSubmitting = signal(false);

  readonly frequencyOptions = [
    { value: 'weekly', label: 'Hebdomadaire' },
    { value: 'biweekly', label: 'Bimensuelle' },
    { value: 'monthly', label: 'Mensuelle' },
  ];

  readonly form = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    contributionAmount: [0, [Validators.required, Validators.min(100)]],
    frequency: ['monthly', Validators.required],
    cycleDurationSessions: [12, [Validators.required, Validators.min(1)]],
    lateToleranceMinutes: [15, [Validators.required, Validators.min(0)]],
    absencePenaltyAmount: [0, [Validators.required, Validators.min(0)]],
    latePenaltyAmount: [0, [Validators.required, Validators.min(0)]],
    loanInterestRate: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
    potDeductionRate: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
    minMembers: [2, [Validators.required, Validators.min(2)]],
    maxMembers: [null as number | null],
  });

  ngOnInit(): void {
    const tontine = this.currentTontine();
    if (tontine) {
      this.form.patchValue({
        name: tontine.name,
        description: tontine.description ?? '',
        contributionAmount: tontine.contributionAmount,
        frequency: tontine.frequency,
        cycleDurationSessions: tontine.cycleDurationSessions,
        lateToleranceMinutes: tontine.lateToleranceMinutes,
        absencePenaltyAmount: tontine.absencePenaltyAmount,
        latePenaltyAmount: tontine.latePenaltyAmount,
        loanInterestRate: tontine.loanInterestRate,
        potDeductionRate: tontine.potDeductionRate,
        minMembers: tontine.minMembers,
        maxMembers: tontine.maxMembers ?? null,
      });
    }
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) return;
    const tontine = this.currentTontine();
    if (!tontine) {
      this.notification.warning('Aucune tontine sélectionnée.');
      return;
    }

    this.isSubmitting.set(true);
    try {
      const value = this.form.getRawValue();
      const response = await firstValueFrom(this.tontineApi.update(tontine.id, {
        name: value.name!,
        description: value.description || undefined,
        contributionAmount: value.contributionAmount!,
        frequency: value.frequency as 'weekly' | 'biweekly' | 'monthly',
        cycleDurationSessions: value.cycleDurationSessions!,
        lateToleranceMinutes: value.lateToleranceMinutes!,
        absencePenaltyAmount: value.absencePenaltyAmount!,
        latePenaltyAmount: value.latePenaltyAmount!,
        loanInterestRate: value.loanInterestRate!,
        potDeductionRate: value.potDeductionRate!,
        minMembers: value.minMembers!,
        maxMembers: value.maxMembers ?? undefined,
      }));
      this.tontineStore.setCurrentTontine(response.data);
      this.notification.success('Paramètres de la tontine mis à jour.');
    } catch {
      this.notification.error('Erreur lors de la mise à jour.');
    } finally {
      this.isSubmitting.set(false);
    }
  }
}

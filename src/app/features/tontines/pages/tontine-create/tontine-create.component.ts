import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { PageHeaderComponent } from '../../../../shared/components/layout/page-header/page-header.component';
import { TontineFormComponent, TontineFormValue } from '../../components/tontine-form/tontine-form.component';
import { TontineStore } from '../../../../store';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-tontine-create',
  standalone: true,
  imports: [PageHeaderComponent, TontineFormComponent],
  template: `
    <app-page-header title="Créer une tontine" subtitle="Configurez les paramètres de votre nouvelle tontine" backLink="/tontines" />
    <div class="page-content">
      <app-tontine-form
        submitLabel="Créer la tontine"
        [isLoading]="isSubmitting()"
        (formSubmit)="onSubmit($event)"
        (cancelled)="onCancel()"
      />
    </div>
  `,
  styles: `@reference "tailwindcss"; .page-content { @apply p-6 max-w-4xl; }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TontineCreateComponent {
  private readonly router = inject(Router);
  private readonly tontineStore = inject(TontineStore);
  private readonly notification = inject(NotificationService);

  readonly isSubmitting = signal(false);

  async onSubmit(formValue: TontineFormValue): Promise<void> {
    this.isSubmitting.set(true);
    try {
      await this.tontineStore.createTontine({
        ...formValue,
        maxMembers: formValue.maxMembers ?? undefined,
        currency: 'XAF',
      });
      this.notification.success('Tontine créée avec succès !');
      this.router.navigate(['/tontines']);
    } catch {
      this.notification.error('Erreur lors de la création de la tontine.');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  onCancel(): void {
    this.router.navigate(['/tontines']);
  }
}

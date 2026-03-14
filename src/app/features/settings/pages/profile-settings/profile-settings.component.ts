import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { PageHeaderComponent } from '../../../../shared/components/layout/page-header/page-header.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { AvatarUploadComponent } from '../../components/avatar-upload/avatar-upload.component';
import { ProfileFormComponent, ProfileFormValue } from '../../components/profile-form/profile-form.component';
import { AuthStore } from '../../../../store';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-profile-settings',
  standalone: true,
  imports: [
    PageHeaderComponent,
    CardComponent,
    BadgeComponent,
    AvatarUploadComponent,
    ProfileFormComponent,
  ],
  templateUrl: './profile-settings.component.html',
  styleUrl: './profile-settings.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileSettingsComponent {
  private readonly router = inject(Router);
  private readonly authStore = inject(AuthStore);
  private readonly notification = inject(NotificationService);

  readonly user = this.authStore.user;
  readonly userFullName = this.authStore.userFullName;
  readonly isSubmitting = signal(false);

  get kycVariant(): 'success' | 'warning' | 'danger' {
    const status = this.user()?.kycStatus;
    if (status === 'verified') return 'success';
    if (status === 'pending') return 'warning';
    return 'danger';
  }

  get kycLabel(): string {
    const status = this.user()?.kycStatus;
    if (status === 'verified') return 'Vérifié';
    if (status === 'pending') return 'En attente';
    return 'Rejeté';
  }

  onAvatarSelected(file: File): void {
    // Future: upload file via API
    this.notification.info('Upload d\'avatar sera disponible prochainement.');
  }

  async onProfileSubmit(formValue: ProfileFormValue): Promise<void> {
    this.isSubmitting.set(true);
    try {
      this.authStore.updateProfile({
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        email: formValue.email || undefined,
        phoneNumber: formValue.phoneNumber,
        dateOfBirth: formValue.dateOfBirth || undefined,
        gender: (formValue.gender as 'male' | 'female') || undefined,
        address: formValue.address || undefined,
        profession: formValue.profession || undefined,
      });
      this.notification.success('Profil mis à jour avec succès !');
    } catch {
      this.notification.error('Erreur lors de la mise à jour du profil.');
    } finally {
      this.isSubmitting.set(false);
    }
  }
}

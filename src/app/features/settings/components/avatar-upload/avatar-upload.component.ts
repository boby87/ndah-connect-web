import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { AvatarComponent } from '../../../../shared/components/ui/avatar/avatar.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';

@Component({
  selector: 'app-avatar-upload',
  standalone: true,
  imports: [AvatarComponent, ButtonComponent],
  template: `
    <div class="avatar-upload">
      <div class="avatar-preview">
        <app-avatar [src]="previewUrl() || currentUrl()" [name]="name()" size="xl" />
      </div>
      <div class="avatar-actions">
        <app-button variant="outline" size="sm" (clicked)="fileInput.click()">
          📷 Changer la photo
        </app-button>
        @if (previewUrl()) {
          <app-button variant="ghost" size="sm" (clicked)="removePreview()">
            Annuler
          </app-button>
        }
        <input
          #fileInput
          type="file"
          accept="image/png,image/jpeg,image/webp"
          class="hidden"
          (change)="onFileSelected($event)"
        />
      </div>
      @if (errorMsg()) {
        <p class="upload-error">{{ errorMsg() }}</p>
      }
      <p class="upload-hint">JPG, PNG ou WebP. 2 Mo maximum.</p>
    </div>
  `,
  styles: `
    @reference "tailwindcss";
    .avatar-upload { @apply flex flex-col items-center gap-3; }
    .avatar-preview { @apply relative; }
    .avatar-actions { @apply flex items-center gap-2; }
    .upload-error { @apply text-sm text-red-600; }
    .upload-hint { @apply text-xs text-slate-400; }
    .hidden { @apply hidden; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarUploadComponent {
  readonly currentUrl = input('');
  readonly name = input('');

  readonly fileSelected = output<File>();

  readonly previewUrl = signal<string>('');
  readonly errorMsg = signal('');

  private readonly maxSizeBytes = 2 * 1024 * 1024;
  private readonly allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    if (!this.allowedTypes.includes(file.type)) {
      this.errorMsg.set('Format non supporté. Utilisez JPG, PNG ou WebP.');
      return;
    }
    if (file.size > this.maxSizeBytes) {
      this.errorMsg.set('Le fichier est trop volumineux (2 Mo maximum).');
      return;
    }

    this.errorMsg.set('');
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl.set(reader.result as string);
    };
    reader.readAsDataURL(file);
    this.fileSelected.emit(file);
  }

  removePreview(): void {
    this.previewUrl.set('');
    this.errorMsg.set('');
  }
}

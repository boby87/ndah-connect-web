import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PageHeaderComponent } from '../../../../shared/components/layout/page-header/page-header.component';
import { CardComponent } from '../../../../shared/components/ui/card/card.component';

@Component({
  selector: 'app-profile-settings',
  standalone: true,
  imports: [PageHeaderComponent, CardComponent],
  templateUrl: './profile-settings.component.html',
  styleUrl: './profile-settings.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileSettingsComponent {
  private readonly router = inject(Router);
}

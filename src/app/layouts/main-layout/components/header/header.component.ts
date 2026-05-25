import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { LoadingService } from '../../../../core/services/loading.service';
import { ThemeService } from '../../../../core/services/theme.service';
import { UiStore } from '../../../../store/ui/ui.store';
import { InitialsPipe } from '../../../../shared/pipes/initials.pipe';
import { IconComponent } from '../../../../shared/components/ui/icon/icon.component';

@Component({
  selector: 'tc-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [InitialsPipe, IconComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  protected readonly ui = inject(UiStore);
  protected readonly auth = inject(AuthService);
  protected readonly theme = inject(ThemeService);
  protected readonly loading = inject(LoadingService);
}

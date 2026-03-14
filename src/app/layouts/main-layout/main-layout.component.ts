import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UiStore } from '../../store/ui/ui.store';
import { TontineStore } from '../../store/tontine/tontine.store';
import { AuthService } from '../../core/auth/services/auth.service';
import { MockDataService } from '../../core/services/mock-data.service';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { FooterComponent } from './components/footer/footer.component';
import { MobileNavComponent } from './components/mobile-nav/mobile-nav.component';
import { ToastComponent } from '../../shared/components/ui/toast/toast.component';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SidebarComponent, FooterComponent, MobileNavComponent, ToastComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayoutComponent implements OnInit {
  protected readonly uiStore = inject(UiStore);
  private readonly tontineStore = inject(TontineStore);
  private readonly authService = inject(AuthService);
  private readonly mock = inject(MockDataService);

  ngOnInit(): void {
    if (environment.useMock && !this.tontineStore.currentTontine()) {
      const role = this.authService.getMockRole();
      this.tontineStore.setTontines([this.mock.tontine]);
      this.tontineStore.setCurrentTontine(this.mock.tontine);
      const member = this.mock.members().find(m => m.role === role);
      if (member) this.tontineStore.setCurrentMember(member);
    }
  }
}

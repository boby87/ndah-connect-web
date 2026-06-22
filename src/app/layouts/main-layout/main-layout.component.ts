import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ToastContainerComponent } from '../../shared/components/ui/toast-container/toast-container.component';
import { WebSocketService } from '../../core/services/websocket.service';

@Component({
  selector: 'tc-main-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, HeaderComponent, SidebarComponent, ToastContainerComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent implements OnDestroy {
  private readonly ws = inject(WebSocketService);

  constructor() {
    this.ws.connect();
  }

  ngOnDestroy(): void {
    this.ws.disconnect();
  }
}

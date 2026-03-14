import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-tabs',
  standalone: true,
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsComponent {
  readonly tabs = input<{ key: string; label: string; icon?: string }[]>([]);
  readonly activeTab = input('');
  readonly tabChange = output<string>();

  selectTab(key: string): void {
    this.tabChange.emit(key);
  }
}

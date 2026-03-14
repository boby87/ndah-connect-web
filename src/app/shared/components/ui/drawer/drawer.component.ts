import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-drawer',
  standalone: true,
  templateUrl: './drawer.component.html',
  styleUrl: './drawer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawerComponent {
  readonly isOpen = input(false);
  readonly title = input('');
  readonly position = input<'left' | 'right'>('right');
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly closed = output<void>();

  close(): void {
    this.closed.emit();
  }

  onBackdropClick(): void {
    this.close();
  }
}

import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent {
  readonly isOpen = input(false);
  readonly title = input<string>();
  readonly size = input<'sm' | 'md' | 'lg' | 'xl'>('md');
  readonly closeOnBackdrop = input(true);
  readonly showClose = input(true);

  readonly closed = output<void>();

  onBackdropClick(): void {
    if (this.closeOnBackdrop()) {
      this.closed.emit();
    }
  }

  onClose(): void {
    this.closed.emit();
  }
}

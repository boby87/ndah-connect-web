import { ChangeDetectionStrategy, Component, input, output, ElementRef, inject, HostListener } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownComponent {
  readonly items = input<{ key: string; label: string; icon?: string; danger?: boolean }[]>([]);
  readonly position = input<'left' | 'right'>('left');
  readonly itemClick = output<string>();

  protected isOpen = false;
  private readonly el = inject(ElementRef);

  toggle(): void { this.isOpen = !this.isOpen; }
  close(): void { this.isOpen = false; }

  select(key: string): void {
    this.itemClick.emit(key);
    this.close();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.el.nativeElement.contains(event.target)) {
      this.close();
    }
  }
}

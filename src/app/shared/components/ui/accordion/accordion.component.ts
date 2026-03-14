import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-accordion',
  standalone: true,
  templateUrl: './accordion.component.html',
  styleUrl: './accordion.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionComponent {
  readonly title = input('');
  readonly expanded = input(false);
  readonly isOpen = signal(false);

  ngOnInit(): void {
    this.isOpen.set(this.expanded());
  }

  toggle(): void {
    this.isOpen.set(!this.isOpen());
  }
}

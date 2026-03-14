import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-spinner',
  standalone: true,
  template: `
    <div [class]="'spinner spinner-' + size()" [class.spinner-overlay]="overlay()">
      <div class="spinner-circle"></div>
    </div>
  `,
  styleUrl: './spinner.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerComponent {
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly overlay = input(false);
}

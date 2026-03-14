import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { InitialsPipe } from '../../../pipes/initials.pipe';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [InitialsPipe],
  template: `
    @if (src(); as imgSrc) {
      <img [src]="imgSrc" [alt]="name()" [class]="'avatar avatar-' + size()" />
    } @else {
      <div [class]="'avatar avatar-' + size() + ' avatar-placeholder'">
        {{ name() | initials }}
      </div>
    }
  `,
  styleUrl: './avatar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarComponent {
  readonly src = input<string>();
  readonly name = input('');
  readonly size = input<'sm' | 'md' | 'lg' | 'xl'>('md');
}

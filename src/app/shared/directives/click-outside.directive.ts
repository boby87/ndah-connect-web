import { Directive, ElementRef, inject, output } from '@angular/core';
import { fromEvent, filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Directive({ selector: '[appClickOutside]', standalone: true })
export class ClickOutsideDirective {
  private readonly el = inject(ElementRef);
  readonly clickOutside = output<void>();

  constructor() {
    fromEvent<MouseEvent>(document, 'click')
      .pipe(
        filter(event => !this.el.nativeElement.contains(event.target)),
        takeUntilDestroyed()
      )
      .subscribe(() => this.clickOutside.emit());
  }
}

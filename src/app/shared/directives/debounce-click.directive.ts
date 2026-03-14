import { Directive, ElementRef, inject, output } from '@angular/core';
import { fromEvent, throttleTime } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Directive({ selector: '[appDebounceClick]', standalone: true })
export class DebounceClickDirective {
  private readonly el = inject(ElementRef);
  readonly debounceClick = output<MouseEvent>();

  constructor() {
    fromEvent<MouseEvent>(this.el.nativeElement, 'click')
      .pipe(throttleTime(500), takeUntilDestroyed())
      .subscribe(event => this.debounceClick.emit(event));
  }
}

import { Directive, ElementRef, inject, output } from '@angular/core';
import { fromEvent, filter, debounceTime } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Directive({ selector: '[appInfiniteScroll]', standalone: true })
export class InfiniteScrollDirective {
  private readonly el = inject(ElementRef);
  readonly scrolled = output<void>();

  constructor() {
    fromEvent(this.el.nativeElement, 'scroll')
      .pipe(
        debounceTime(200),
        filter(() => {
          const element = this.el.nativeElement as HTMLElement;
          const threshold = 100;
          return element.scrollHeight - element.scrollTop - element.clientHeight < threshold;
        }),
        takeUntilDestroyed()
      )
      .subscribe(() => this.scrolled.emit());
  }
}

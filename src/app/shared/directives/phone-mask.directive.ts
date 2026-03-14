import { Directive, ElementRef, HostListener, inject } from '@angular/core';

@Directive({ selector: '[appPhoneMask]', standalone: true })
export class PhoneMaskDirective {
  private readonly el = inject(ElementRef);

  @HostListener('input')
  onInput(): void {
    const input = this.el.nativeElement as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    if (value.length > 9) value = value.substring(0, 9);

    let formatted = '';
    if (value.length > 0) formatted = value.substring(0, 3);
    if (value.length > 3) formatted += ' ' + value.substring(3, 5);
    if (value.length > 5) formatted += ' ' + value.substring(5, 7);
    if (value.length > 7) formatted += ' ' + value.substring(7, 9);

    input.value = formatted;
  }
}

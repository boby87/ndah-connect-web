import { Directive, ElementRef, HostListener, inject } from '@angular/core';

@Directive({ selector: '[appCurrencyMask]', standalone: true })
export class CurrencyMaskDirective {
  private readonly el = inject(ElementRef);

  @HostListener('input')
  onInput(): void {
    const input = this.el.nativeElement as HTMLInputElement;
    const value = input.value.replace(/\D/g, '');
    const number = parseInt(value, 10);
    if (isNaN(number)) {
      input.value = '';
      return;
    }
    input.value = new Intl.NumberFormat('fr-FR').format(number);
  }
}

import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  template: `
    <button
      [class]="getClasses()"
      [disabled]="disabled"
      (click)="onClickHandler()">
      {{ label }}
    </button>
  `,
  styles: []
})
export class ButtonComponent {
  @Input() label: string = 'Button';
  @Input() variant: 'primary' | 'secondary' | 'danger' | 'success' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() disabled: boolean = false;
  @Input() fullWidth: boolean = false;
  @Output() clickEvent = new EventEmitter<void>();

  getClasses(): string {
    const variants: Record<string, string> = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-300 active:bg-blue-800',
      secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-300 active:bg-gray-400',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-300 active:bg-red-800',
      success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-300 active:bg-green-800'
    };

    const sizes: Record<string, string> = {
      sm: 'text-sm px-3 py-1.5',
      md: 'text-base px-4 py-2',
      lg: 'text-lg px-6 py-3'
    };

    const baseClasses = 'rounded-lg font-semibold focus:outline-none focus:ring-4 transition-all duration-200 active:scale-95 cursor-pointer';
    const disabledClass = this.disabled ? 'opacity-50 cursor-not-allowed' : '';
    const fullWidthClass = this.fullWidth ? 'w-full' : '';

    return `${baseClasses} ${variants[this.variant]} ${sizes[this.size]} ${disabledClass} ${fullWidthClass}`.trim();
  }

  onClickHandler() {
    if (!this.disabled) {
      this.clickEvent.emit();
    }
  }
}


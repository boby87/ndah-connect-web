import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="mb-6">
      <label [for]="id" class="block text-sm font-semibold text-gray-900 mb-2">
        {{ label }}
        @if (required) {
          <span class="text-red-500 ml-1">*</span>
        }
      </label>
      @switch (type) {
        @case ('text') {
          <input [id]="id" type="text" [(ngModel)]="value" (change)="onChange()" [placeholder]="placeholder" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400" />
        }
        @case ('email') {
          <input [id]="id" type="email" [(ngModel)]="value" (change)="onChange()" [placeholder]="placeholder" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400" />
        }
        @case ('number') {
          <input [id]="id" type="number" [(ngModel)]="value" (change)="onChange()" [placeholder]="placeholder" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400" />
        }
        @case ('date') {
          <input [id]="id" type="date" [(ngModel)]="value" (change)="onChange()" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" />
        }
        @case ('textarea') {
          <textarea [id]="id" [(ngModel)]="value" (change)="onChange()" [placeholder]="placeholder" rows="4" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 resize-vertical"></textarea>
        }
        @case ('select') {
          <select [id]="id" [(ngModel)]="value" (change)="onChange()" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white">
            <option value="" disabled>{{ placeholder }}</option>
            @for (option of options; track option.value) {
              <option [value]="option.value">{{ option.label }}</option>
            }
          </select>
        }
      }
      @if (helperText) {
        <p class="text-xs text-gray-500 mt-2">{{ helperText }}</p>
      }
    </div>
  `,
  styles: []
})
export class FormFieldComponent {
  @Input() id: string = '';
  @Input() label: string = '';
  @Input() type: 'text' | 'email' | 'number' | 'date' | 'textarea' | 'select' = 'text';
  @Input() placeholder: string = '';
  @Input() value: any;
  @Input() required: boolean = false;
  @Input() helperText: string = '';
  @Input() options: Array<{ label: string; value: any }> = [];
  @Output() valueChange = new EventEmitter<any>();

  onChange() {
    this.valueChange.emit(this.value);
  }
}


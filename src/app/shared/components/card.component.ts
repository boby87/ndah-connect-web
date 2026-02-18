import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
      @if (title) {
        <div class="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
        </div>
      }
      <div class="px-6 py-4">
        <ng-content></ng-content>
      </div>
      @if (footer) {
        <div class="px-6 py-4 border-t border-gray-100 bg-gray-50">
          <ng-content select="[card-footer]"></ng-content>
        </div>
      }
    </div>
  `,
  styles: []
})
export class CardComponent {
  @Input() title?: string;
  @Input() footer?: boolean = false;
}


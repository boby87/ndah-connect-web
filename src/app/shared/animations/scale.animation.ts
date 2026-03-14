import { trigger, transition, style, animate } from '@angular/animations';

export const scaleAnimation = trigger('scale', [
  transition(':enter', [
    style({ transform: 'scale(0.95)', opacity: 0 }),
    animate('200ms ease-out', style({ transform: 'scale(1)', opacity: 1 })),
  ]),
  transition(':leave', [
    animate('150ms ease-in', style({ transform: 'scale(0.95)', opacity: 0 })),
  ]),
]);

import { trigger, transition, style, animate } from '@angular/animations';

export const scaleUpDownAnimation = trigger('scaleUpDownAnimation', [
  transition(':enter', [style({ transform: 'scale(0)' }), animate('300ms', style({ transform: 'scale(1)' }))]),
  transition(':leave', [animate('300ms', style({ transform: 'scale(0)' }))]),
]);

export const scaleYAnimation = trigger('scaleYAnimation', [
  transition(':enter', [style({ transform: 'scaleY(0)', 'transform-origin': 'top' }), animate('300ms', style({ transform: 'scaleY(1)', 'transform-origin': 'top' }))]),
  transition(':leave', [animate('300ms', style({ transform: 'scaleY(0)', 'transform-origin': 'top' }))]),
]);

export const translateYAnimation = trigger('translateY', [
  transition(':enter', [style({ transform: 'translateY(-5%)' }), animate('100ms', style({ transform: 'translateY(0)' }))]),
]);

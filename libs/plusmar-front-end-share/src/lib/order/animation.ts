import { trigger, state, style, transition, animate, group, query, stagger, keyframes } from '@angular/animations';

export const slideInOutAnimation = [
  trigger('slideInOut', [
    state('in', style({ height: '*', opacity: 0 })),
    transition(':enter', [style({ height: '0', opacity: 0 }), group([animate(100, style({ height: '*' })), animate('100ms ease-in-out', style({ opacity: '1' }))])]),
    transition(':leave', [style({ height: '*', opacity: 1 }), group([animate(100, style({ height: 0 })), animate('100ms ease-in-out', style({ opacity: '0' }))])]),
  ]),
];

import { trigger, transition, style, animate, state } from '@angular/animations';

export const fadeInOutXAnimation = trigger('fadeInOutXAnimation', [
  transition(':enter', [style({ transform: 'translateX(-100%)', opacity: '0' }), animate('300ms', style({ transform: 'translateX(0)', opacity: '*' }))]),
  transition(':leave', [animate('300ms', style({ transform: 'translateX(-100%)', opacity: '0' }))]),
]);
export const fadeRightAnimation = trigger('fadeRightAnimation', [
  transition(':enter', [style({ transform: 'translateX(200%)', opacity: '0' }), animate('300ms', style({ transform: 'translateX(0)', opacity: '*' }))]),
  transition(':leave', [animate('300ms', style({ transform: 'translateX(200%)', opacity: '0' }))]),
]);
export const fadeLeftAnimation = trigger('fadeLeftAnimation', [
  transition(':enter', [style({ transform: 'translateX(-100%)', opacity: '0' }), animate('300ms', style({ transform: 'translateX(0)', opacity: '*' }))]),
  transition(':leave', [animate('300ms', style({ transform: 'translateX(-100%)', opacity: '0' }))]),
]);

export const fadeInOutYAnimation = trigger('fadeInOutYAnimation', [
  transition(':enter', [style({ transform: 'translateY(-100%)', opacity: '0' }), animate('300ms', style({ transform: 'translateY(0)', opacity: '*' }))]),
  transition(':leave', [animate('300ms', style({ transform: 'translateY(-100%)', opacity: '0' }))]),
]);

export const fadeInOutYDownAnimation = trigger('fadeInOutYDownAnimation', [
  transition(':enter', [style({ transform: 'translateY(200%)', opacity: '0' }), animate('300ms', style({ transform: 'translateY(0)', opacity: '*' }))]),
  transition(':leave', [animate('300ms', style({ transform: 'translateY(200%)', opacity: '0' }))]),
]);

export const fadeBoxAnimation = trigger('fadeBoxAnimation', [
  transition(':enter', [style({ opacity: '0' }), animate('300ms', style({ opacity: '1' }))]),
  transition(':leave', [animate('300ms', style({ opacity: '0' }))]),
]);

export const iconFade = trigger('iconFade', [state('true', style({ opacity: '1' })), state('false', style({ opacity: '1' })), transition('false <=> true', animate(500))]);

export const fadeInAnimation = trigger('fade', [transition(':enter', [style({ opacity: '0' }), animate('300ms', style({ opacity: '1' }))])]);

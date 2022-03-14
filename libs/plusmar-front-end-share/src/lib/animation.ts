import { trigger, state, style, transition, animate, group, query, stagger, keyframes } from '@angular/animations';

export const slideInOutAnimation = [
  trigger('slideInOut', [
    state('in', style({ height: '*', opacity: 0 })),
    transition(':leave', [style({ height: '*', opacity: 1 }), group([animate(300, style({ height: 0 })), animate('200ms ease-in-out', style({ opacity: '0' }))])]),
    transition(':enter', [style({ height: '0', opacity: 0 }), group([animate(300, style({ height: '*' })), animate('400ms ease-in-out', style({ opacity: '1' }))])]),
  ]),
];
export const slideInOutFastAnimation = [
  trigger('slideInOutFast', [
    state('in', style({ height: '*', opacity: 0 })),
    transition(':leave', [style({ height: '*', opacity: 1 }), group([animate(200, style({ height: 0 })), animate('200ms ease-in-out', style({ opacity: '0' }))])]),
    transition(':enter', [style({ height: '0', opacity: 0 }), group([animate(200, style({ height: '*' })), animate('200ms ease-in-out', style({ opacity: '1' }))])]),
  ]),
];
export const slideInOutFasterAnimation = [
  trigger('slideInOutFaster', [
    state('in', style({ height: '*', opacity: 0 })),
    transition(':leave', [style({ height: '*', opacity: 1 }), group([animate(100, style({ height: 0 })), animate('100ms ease-in-out', style({ opacity: '0' }))])]),
    transition(':enter', [style({ height: '0', opacity: 0 }), group([animate(100, style({ height: '*' })), animate('100ms ease-in-out', style({ opacity: '1' }))])]),
  ]),
];
export const slideInOutFastestAnimation = [
  trigger('slideInOutFastest', [
    state('in', style({ height: '*', opacity: 0 })),
    transition(':leave', [style({ height: '*', opacity: 1 }), group([animate(50, style({ height: 0 })), animate('50ms ease-in-out', style({ opacity: '0' }))])]),
    transition(':enter', [style({ height: '0', opacity: 0 }), group([animate(50, style({ height: '*' })), animate('50ms ease-in-out', style({ opacity: '1' }))])]),
  ]),
];

export const slideInOut2Animation = [
  trigger('slideInOut', [
    state(
      'in',
      style({
        'max-height': '500px',
        opacity: '1',
        visibility: 'visible',
      }),
    ),
    state(
      'out',
      style({
        'max-height': '0px',
        opacity: '0',
        visibility: 'hidden',
      }),
    ),
    transition('in => out', [
      group([
        animate(
          '400ms ease-in-out',
          style({
            opacity: '0',
          }),
        ),
        animate(
          '600ms ease-in-out',
          style({
            'max-height': '0px',
          }),
        ),
        animate(
          '700ms ease-in-out',
          style({
            visibility: 'hidden',
          }),
        ),
      ]),
    ]),
    transition('out => in', [
      group([
        animate(
          '1ms ease-in-out',
          style({
            visibility: 'visible',
          }),
        ),
        animate(
          '600ms ease-in-out',
          style({
            'max-height': '500px',
          }),
        ),
        animate(
          '800ms ease-in-out',
          style({
            opacity: '1',
          }),
        ),
      ]),
    ]),
  ]),
];

export const fadeInOutAnimation = [
  trigger('fadeInOut', [
    state('in', style({ opacity: 1 })),
    transition(':enter', [style({ opacity: 0 }), animate(600)]),
    transition(':leave', animate(600, style({ opacity: 0 }))),
  ]),
];
export const fadeInOutFastAnimation = [
  trigger('fadeInOutFast', [
    state('in', style({ opacity: 1 })),
    transition(':enter', [style({ opacity: 0 }), animate(400)]),
    transition(':leave', animate(400, style({ opacity: 0 }))),
  ]),
];

/** Angular Animation : Fading in-out 200msec */
export const fadeInOutFasterAnimation = [
  trigger('fadeInOutFaster', [
    state('in', style({ opacity: 1 })),
    transition(':enter', [style({ opacity: 0 }), animate(200)]),
    transition(':leave', animate(200, style({ opacity: 0 }))),
  ]),
];
export const fadeInOutFastestAnimation = [
  trigger('fadeInOutFastest', [
    state('in', style({ opacity: 1 })),
    transition(':enter', [style({ opacity: 0 }), animate(50)]),
    transition(':leave', animate(50, style({ opacity: 0 }))),
  ]),
];
export const slideBoxAnimation = [
  trigger('slideBox', [
    state(
      'active',
      style({
        bottom: '*',
      }),
    ),
    state(
      'inactive',
      style({
        bottom: '-100%',
      }),
    ),
    transition('inactive => active', [animate('0.3s')]),
    transition('active => inactive', [animate('0.1s')]),
  ]),
];

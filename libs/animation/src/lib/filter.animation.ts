import { trigger, transition, query, style, stagger, animate } from '@angular/animations';

export const filterAnimation = trigger('filterAnimation', [
  transition(':enter, * => 0, * => -1', []),
  transition(':increment', [
    query(
      ':enter',
      [
        style({
          opacity: 0,
          transform: 'translate(-100%,0px)',
        }),
        stagger(10, [
          animate(
            '300ms ease-out',
            style({
              opacity: 1,
              transform: 'translate(*)',
            }),
          ),
        ]),
      ],
      { optional: true },
    ),
  ]),
  transition(':decrement', [
    query(':leave', [
      style({
        opacity: 1,
        transform: 'translate(*)',
      }),
      stagger(10, [
        animate(
          '300ms ease-out',
          style({
            opacity: 0,
            transform: 'translate(-100%,0px)',
          }),
        ),
      ]),
    ]),
  ]),
]);

import { Injectable } from '@angular/core';

import { Observable, Subscription, Subject, timer, of } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

// ? Noted : This service must be used inside component
// ? have to declare providers for this service
@Injectable()
export class IntervalService {
  startTimer$ = new Subject<void>();
  stopTimer$ = new Subject<void>();
  interval$: Subscription;
  INTERVAL_THRESHOLD = 45000;

  fetchFromChild = new Subject<boolean>();

  constructor() {}

  stopInterval(): void {
    this.stopTimer$.next(null);
  }

  startInterval(threshold: number): Observable<number> {
    this.INTERVAL_THRESHOLD = threshold;

    return timer(this.INTERVAL_THRESHOLD, this.INTERVAL_THRESHOLD).pipe(
      takeUntil(this.stopTimer$),
      switchMap((time) => {
        return of(time);
      }),
    );
  }
}

import { Injectable, OnDestroy } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, combineLatest, from, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AudienceService implements OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(private apollo: Apollo) {}
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}

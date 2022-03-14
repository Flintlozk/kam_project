import { Injectable, OnDestroy } from '@angular/core';

import { Apollo } from 'apollo-angular';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService implements OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private apollo: Apollo) {}

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}

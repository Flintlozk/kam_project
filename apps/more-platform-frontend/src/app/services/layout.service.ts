import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  private fullLayout = new BehaviorSubject(false);
  sharedFullLayout = this.fullLayout.asObservable();

  constructor() {}

  updateFullLayout(status: boolean): void {
    this.fullLayout.next(status);
  }
}

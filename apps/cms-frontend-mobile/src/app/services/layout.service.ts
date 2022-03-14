import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  private fullLayout = new BehaviorSubject(false);
  sharedFullLayout = this.fullLayout.asObservable();

  private noHeaderLayout = new BehaviorSubject(false);
  sharedNoHeaderLayout = this.noHeaderLayout.asObservable();

  constructor() {}

  updatePlainLayout(status: boolean): void {
    this.fullLayout.next(status);
  }

  updateNoHeaderLayout(status: boolean): void {
    this.noHeaderLayout.next(status);
  }
}

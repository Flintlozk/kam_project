import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotifyParentService {
  constructor() {}
  private data = new BehaviorSubject('default data');
  data$ = this.data.asObservable();

  private summaryCollapsed = false; // notes + summary interaction
  public summaryCollapsedState = new BehaviorSubject<boolean>(this.summaryCollapsed);

  changeData(data: string): void {
    this.data.next(data);
  }
}

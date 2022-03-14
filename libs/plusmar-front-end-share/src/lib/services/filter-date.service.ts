import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class FilterDateService {
  date = new BehaviorSubject({});
  sharedDate = this.date.asObservable();

  constructor() {}

  setRange(range: { start: string; end: string }) {
    this.date.next(range);
  }
}

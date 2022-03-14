import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  actionDateFilter: ReplaySubject<{ startDate: string; endDate: string; dateRange: string }> = new ReplaySubject();

  constructor() {}
}

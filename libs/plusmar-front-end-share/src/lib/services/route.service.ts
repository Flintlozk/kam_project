import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RouteService {
  routeHistory: BehaviorSubject<string> = new BehaviorSubject<string>('/');
  constructor() {}

  setRouteRef(routePath: string): void {
    this.routeHistory.next(routePath);
  }
}

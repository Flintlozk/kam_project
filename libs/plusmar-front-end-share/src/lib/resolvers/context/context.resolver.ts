import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { setCookie } from '@reactor-room/itopplus-front-end-helpers';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ContextResolver implements Resolve<{ pidx: number; sidx: number }> {
  constructor() {}

  resolve(route: ActivatedRouteSnapshot): Observable<{ pidx: number; sidx: number }> {
    const { sidx, pidx } = <{ pidx: number; sidx: number }>route.queryParams;
    const contextObject = {} as { pidx: number; sidx: number };

    if (pidx) {
      setCookie('page_index', pidx, 30);
      contextObject.pidx = pidx;
    }

    if (sidx) {
      setCookie('subscription_index', sidx, 30);
      contextObject.sidx = sidx;
    }

    if (pidx || sidx) {
      const urlTarget = window.location.protocol + '//' + window.location.host + window.location.pathname;
      window.location.href = urlTarget;
    }

    return of(contextObject);
  }
}

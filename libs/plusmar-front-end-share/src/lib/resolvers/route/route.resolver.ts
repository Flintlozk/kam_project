import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AudienceViewType } from '@reactor-room/itopplus-model-lib';

@Injectable({ providedIn: 'root' })
export class FollowRouteResolver implements Resolve<AudienceViewType> {
  constructor() {}

  resolve(): Observable<AudienceViewType> {
    return of(AudienceViewType.FOLLOW);
  }
}
@Injectable({ providedIn: 'root' })
export class MessageRouteResolver implements Resolve<AudienceViewType> {
  constructor() {}

  resolve(): Observable<AudienceViewType> {
    return of(AudienceViewType.MESSAGE);
  }
}
@Injectable({ providedIn: 'root' })
export class LeadRouteResolver implements Resolve<AudienceViewType> {
  constructor() {}

  resolve(): Observable<AudienceViewType> {
    return of(AudienceViewType.LEAD);
  }
}
@Injectable({ providedIn: 'root' })
export class OrderRouteResolver implements Resolve<AudienceViewType> {
  constructor() {}

  resolve(): Observable<AudienceViewType> {
    return of(AudienceViewType.ORDER);
  }
}
@Injectable({ providedIn: 'root' })
export class OrderCloseRouteResolver implements Resolve<AudienceViewType> {
  constructor() {}

  resolve(): Observable<AudienceViewType> {
    return of(AudienceViewType.CLOSE);
  }
}
@Injectable({ providedIn: 'root' })
export class QuotationRouteResolver implements Resolve<AudienceViewType> {
  constructor() {}

  resolve(): Observable<AudienceViewType> {
    return of(AudienceViewType.QUOTATION);
  }
}

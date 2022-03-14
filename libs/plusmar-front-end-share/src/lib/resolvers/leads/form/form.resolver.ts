import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { LeadsService } from '@reactor-room/plusmar-front-end-share/services/leads/leads.service';
import { ILeadsFormWithComponents } from '@reactor-room/itopplus-model-lib';
import { Observable, of } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class FormResolver implements Resolve<ILeadsFormWithComponents> {
  // WILL NO LONGER BE USED IMPLEMENT AT COMPONENT LEVEL
  constructor(private leadService: LeadsService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ILeadsFormWithComponents> {
    const formID = +route.paramMap.get('formID');
    if (!formID) {
      return of(null);
    }
    return this.leadService.getFormByID(formID).pipe(take(1));
  }
}

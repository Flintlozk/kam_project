import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { LeadsService } from '@reactor-room/plusmar-front-end-share/services/leads/leads.service';
import { ILeadsFormSubmission } from '@reactor-room/itopplus-model-lib';
import { Observable, of } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class FormSubmissionResolver implements Resolve<ILeadsFormSubmission> {
  // WILL NO LONGER BE USED IMPLEMENT AT COMPONENT LEVEL
  constructor(private leadService: LeadsService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ILeadsFormSubmission> {
    const formSubmissionID = +route.paramMap.get('formSubmission');

    if (!formSubmissionID) {
      return of(null);
    }

    return this.leadService.getFormSubmissionByID(formSubmissionID).pipe(take(1));
  }
}

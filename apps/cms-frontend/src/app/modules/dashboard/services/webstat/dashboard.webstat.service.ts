import { Injectable } from '@angular/core';
import { DashboardDomain, DashboardSummary, DashboardWebstat, webstatsInput } from '@reactor-room/autodigi-models-lib';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GET_DOMAINS, GET_SUMMARY, GET_WEBSTATS } from './dashboard.webstat.query';

@Injectable()
export class DashboardWebstatService {
  constructor(private apollo: Apollo) {}

  getWebstats(param: webstatsInput): Observable<DashboardWebstat> {
    return this.apollo
      .query({
        query: GET_WEBSTATS,
        variables: {
          webStats: param,
        },
      })
      .pipe<DashboardWebstat>(map((x) => x.data['getWebstats']));
  }
  getDomain(param: webstatsInput): Observable<DashboardDomain> {
    return this.apollo
      .query({
        query: GET_DOMAINS,
        variables: {
          webStats: param,
        },
      })
      .pipe<DashboardDomain>(map((x) => x.data['getDomain']));
  }
  getSummary(): Observable<DashboardSummary[]> {
    return this.apollo
      .query({
        query: GET_SUMMARY,
      })
      .pipe<DashboardSummary[]>(map((x) => x.data['getSummary']));
  }
}

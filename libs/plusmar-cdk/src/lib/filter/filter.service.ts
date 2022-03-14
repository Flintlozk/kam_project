import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface IFilterDate {
  endDate: string;
  interval: string;
  startDate: string;
  initial?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  filterDate: BehaviorSubject<IFilterDate> = new BehaviorSubject<IFilterDate>({} as IFilterDate);
  filterDateData = this.filterDate.asObservable();
  constructor(private apollo: Apollo) {}

  setFilterDate(value: IFilterDate) {
    this.filterDate.next(value);
  }

  getDateOfPageCreation(): Observable<{ created_at: string }> {
    const mutation = gql`
      query getDateOfPageCreation {
        getDateOfPageCreation {
          created_at
        }
      }
    `;
    return this.apollo
      .mutate({
        mutation,
      })
      .pipe<{ created_at: string }>(map((x) => x.data['getDateOfPageCreation']));
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class CustomerFilterService {
  customerSearchField: BehaviorSubject<string> = new BehaviorSubject<string>('');
  setCustomerSearchField = (value: string) => this.customerSearchField.next(value);
  constructor() {}
}

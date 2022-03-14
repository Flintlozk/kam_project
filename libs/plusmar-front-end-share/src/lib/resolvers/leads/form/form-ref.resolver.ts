import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class FormRefResolver implements Resolve<string> {
  // WILL NO LONGER BE USED IMPLEMENT AT COMPONENT LEVEL
  constructor() {}

  resolve(route: ActivatedRouteSnapshot): string {
    const formRef = route.paramMap.get('ref');
    return formRef;
  }
}

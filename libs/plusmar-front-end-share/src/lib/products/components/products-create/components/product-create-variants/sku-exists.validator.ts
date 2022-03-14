import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ProductsService } from '@reactor-room/plusmar-front-end-share/services/products.service';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SKUExistsValidator implements AsyncValidator {
  constructor(private service: ProductsService) {}
  validate(control: AbstractControl): Observable<ValidationErrors> | null {
    return this.service
      .searchProductSKU(control.value)
      .pipe(
        map((res) => {
          if (Number(res.value) !== 0) {
            return { skuExists: true };
          } else {
            return null;
          }
        }),
      )
      .pipe(first());
  }
}

export function skuSpecialCharValidation(): ValidatorFn {
  return (c: AbstractControl): { [key: string]: boolean } | null => {
    const regex = /^[a-zA-Z0-9-_/]+$/;
    const strValue = c.value;
    if (strValue.search(regex) === -1) {
      return { skuSpecialChar: true };
    } else {
      return null;
    }
  };
}

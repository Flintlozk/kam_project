import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { ProductsService } from '@reactor-room/plusmar-front-end-share/services/products.service';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProductCodeExistsValidator implements AsyncValidator {
  constructor(private service: ProductsService) {}
  validate(control: AbstractControl): Observable<ValidationErrors> | null {
    return this.service
      .searchProductCodeExists(control.value)
      .pipe(
        map((res) => {
          if (Number(res.value) !== 0) {
            return { codeExists: true };
          } else {
            return null;
          }
        }),
      )
      .pipe(first());
  }
}

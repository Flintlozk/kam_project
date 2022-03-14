import { AbstractControl, ValidatorFn } from '@angular/forms';

export function decimalValidator(): ValidatorFn {
  return (c: AbstractControl): { [key: string]: boolean } | null => {
    if (c.value !== null && new RegExp(/^\d+(\.\d{1,2})?$/).test(String(c.value))) {
      return { isNotDecimal: true };
    } else {
      return null;
    }
  };
}

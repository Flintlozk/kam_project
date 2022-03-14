import { AbstractControl, ValidatorFn } from '@angular/forms';

export function numberValidator(): ValidatorFn {
  return (c: AbstractControl): { [key: string]: boolean } | null => {
    if (c.value !== null && new RegExp('^\\d+$').test(String(c.value))) {
      return { isNotNumber: true };
    } else {
      return null;
    }
  };
}

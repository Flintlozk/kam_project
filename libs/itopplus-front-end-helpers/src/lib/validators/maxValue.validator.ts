import { AbstractControl, ValidatorFn } from '@angular/forms';

export function maxValueValidator(maxValue: number): ValidatorFn {
  return (c: AbstractControl): { [key: string]: boolean } | null => {
    if (c.value !== null && (isNaN(c.value) || c.value > maxValue)) {
      return { maxvaluereached: true };
    } else {
      return null;
    }
  };
}

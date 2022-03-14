import { ValidatorFn, AbstractControl, FormArray } from '@angular/forms';

export class FormArrayValidators {
  public static minLengthArray(min: number): ValidatorFn {
    return (c: AbstractControl): { [key: string]: boolean } | null => {
      if (!(c instanceof FormArray)) return;
      return c.length < min ? { minLengthArray: true } : null;
    };
  }

  public static maxLengthArray(max: number): ValidatorFn {
    return (c: AbstractControl): { [key: string]: boolean } | null => {
      if (!(c instanceof FormArray)) return;
      return c.length > max ? { maxArrayLength: true } : null;
    };
  }
}

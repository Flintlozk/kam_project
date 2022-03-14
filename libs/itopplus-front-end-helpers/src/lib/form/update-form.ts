import { FormArray, FormControl, FormGroup } from '@angular/forms';

export const getUpdates = (formItem: FormGroup | FormArray | FormControl, updatedValues: any, name?: string): void => {
  if (formItem instanceof FormControl) {
    if (name && formItem.dirty) {
      updatedValues[name] = formItem.value;
    }
  } else {
    for (const formControlName in formItem.controls) {
      if (formItem.controls.hasOwnProperty(formControlName)) {
        const formControl = formItem.controls[formControlName];
        if (formControl instanceof FormControl) {
          getUpdates(formControl, updatedValues, formControlName);
        } else if (formControl instanceof FormArray && formControl.dirty && formControl.controls.length > 0) {
          updatedValues[formControlName] = [];
          getUpdates(formControl, updatedValues[formControlName]);
        } else if (formControl instanceof FormGroup && formControl.dirty) {
          updatedValues[formControlName] = {};
          getUpdates(formControl, updatedValues[formControlName]);
        }
      }
    }
  }
};

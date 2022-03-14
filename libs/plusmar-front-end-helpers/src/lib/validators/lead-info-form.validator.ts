import { Validators } from '@angular/forms';
import { ILeadFormControlValidation } from '@reactor-room/itopplus-model-lib';
import { PhoneNumberValidators } from '@reactor-room/itopplus-front-end-helpers';

export const getLeadInfoFormValidators = (validations: ILeadFormControlValidation[]): Validators[] => {
  return validations.map((validation) => {
    switch (validation.rules) {
      case 'required':
        return Validators.required;
      case 'phoneinit':
        return PhoneNumberValidators.phoneInitial();
      case 'email':
        return Validators.email;
      default:
        break;
    }
  });
};

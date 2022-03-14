import { AbstractControl, FormGroup } from '@angular/forms';
import { IValidationMessage } from '@reactor-room/model-lib';
import { forOwn, isEmpty } from 'lodash';
export const getFormErrorMessages = <T>(form: FormGroup, validationMessages: IValidationMessage[]): T => {
  const errObj = {} as T;
  const formControls = form.controls;
  forOwn(formControls, (control: AbstractControl, key: string) => {
    setErrorMessageOnSubmit(control, key, validationMessages, errObj);
  });
  return errObj as T;
};

const setErrorMessageOnSubmit = <T>(c: AbstractControl, controlName: string, validationMessages: IValidationMessage[], errObj: T) => {
  if (c.errors) {
    const validationData = validationMessages.find((validation) => validation.control === controlName);
    if (!isEmpty(validationData)) {
      const validationRules = validationData.rules;
      const errorMessage = Object.keys(c.errors)
        .map((key) => validationRules[key])
        .join('<br>');
      showErrorMessage(controlName, errorMessage, errObj);
    }
  }
};

const showErrorMessage = <T>(controlName: string, errorMessage: string, errObj: T) => {
  const errorProperty = `${controlName}ErrorMessage`;
  errObj[errorProperty] = errorMessage;
};

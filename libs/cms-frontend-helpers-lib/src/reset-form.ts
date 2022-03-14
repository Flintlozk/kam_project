import { FormGroup } from '@angular/forms';

export const resetForm = (form: FormGroup): void => {
  form.reset();
  form.markAsPristine();
  form.markAsUntouched();
};

import { IValidationMessage } from '@reactor-room/cms-models-lib';

export const validationMessages: IValidationMessage[] = [
  {
    control: 'trackingNumber',
    rules: {
      required: 'Tracking number is required',
      minlength: 'Tracking number has at least 8 characters',
      maxlength: 'Tracking number has not more than 40 characters',
    },
  },
];

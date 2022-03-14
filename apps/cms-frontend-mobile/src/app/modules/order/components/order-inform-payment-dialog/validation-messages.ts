import { IValidationMessage } from '@reactor-room/cms-models-lib';

export const validationMessages: IValidationMessage[] = [
  {
    control: 'bankAccount',
    rules: {
      required: 'Bank Account is required',
    },
  },
  {
    control: 'date',
    rules: {
      required: 'Date is required',
    },
  },
  {
    control: 'time',
    rules: {
      required: 'Time is required',
    },
  },
];

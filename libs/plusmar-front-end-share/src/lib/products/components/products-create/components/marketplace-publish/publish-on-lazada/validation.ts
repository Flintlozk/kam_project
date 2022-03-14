import { IValidationMessage } from '@reactor-room/model-lib';

export const validationMessages: IValidationMessage[] = [
  {
    control: 'category',
    rules: {
      required: 'Category is required',
    },
  },
];

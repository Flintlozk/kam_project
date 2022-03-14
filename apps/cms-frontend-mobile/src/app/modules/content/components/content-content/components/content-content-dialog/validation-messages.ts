import { IValidationMessage } from '@reactor-room/cms-models-lib';

export const validationMessages: IValidationMessage[] = [
  {
    control: 'contentContentData',
    rules: {
      required: 'Content is required',
    },
  },
];

import { IValidationMessage } from '@reactor-room/model-lib';
export const validationMessages: IValidationMessage[] = [
  {
    control: 'email',
    rules: {
      required: 'Email is required',
      email: 'Not a valid email',
    },
  },
];

export interface IErrorMessageType {
  emailErrorMessage: string;
}

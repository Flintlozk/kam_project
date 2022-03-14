import { IValidationMessage } from '@reactor-room/model-lib';
export const validationMessages: IValidationMessage[] = [
  {
    control: 'email',
    rules: {
      required: 'Email is required',
      email: 'Not a valid email',
    },
  },
  {
    control: 'password',
    rules: {
      required: 'Password is required',
    },
  },
];

export interface IErrorMessageType {
  emailErrorMessage: string;
  passwordErrorMessage: string;
}

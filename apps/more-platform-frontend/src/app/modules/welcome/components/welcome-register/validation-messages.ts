import { IValidationMessage } from '@reactor-room/model-lib';
export const validationMessages: IValidationMessage[] = [
  {
    control: 'name',
    rules: {
      required: 'Name is required',
      minlength: 'Name should have at least 2 characters',
    },
  },
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
      pattern: 'Password is not valid. Follow the instruction!',
    },
  },
  {
    control: 'rePassword',
    rules: {
      required: 'Confirm Password is required',
      mismatch: 'Confirm Password is not matched',
    },
  },
];

export interface IErrorMessageType {
  nameErrorMessage: string;
  emailErrorMessage: string;
  passwordErrorMessage: string;
  rePasswordErrorMessage: string;
  misMatchErrorMessage: string;
}

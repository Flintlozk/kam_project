import { IValidationMessage } from '@reactor-room/cms-models-lib';
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
      minlength: 'Password should have at least four character',
    },
  },
];

export const loginErrorMessages = {
  emailValidationMessage: null,
  passwordValidationMessage: null,
};

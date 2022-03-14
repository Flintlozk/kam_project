import gql from 'graphql-tag';
import * as Joi from 'joi';

export interface IRegisterArgs {
  phoneNumber: string;
  pin: string;
}

export interface IUserRegistrationModel {
  ID: string;
  name: string;
  email: string;
  phoneNumber: string;
  accessToken: string;
  profileImg: string;
  pdpa: boolean;
}

export interface IInviteUserRegistrationForm {
  form: IUserRegistrationModel;
  token: string;
}

export const UserRegistrationTypeDefs = gql`
  input UserRegistrationInput {
    ID: String
    name: String
    email: String
    phoneNumber: String
    accessToken: String
    profileImg: String
    pdpa: Boolean
  }

  extend type Mutation {
    sendOTP(userID: Int, phoneNumber: String): HTTPResult
    validateOTP(phoneNumber: String, pin: String, userID: Int): HTTPResult
  }
`;

export const phoneNumberObject = {
  phoneNumber: Joi.string().required(),
};

export const validateOtpObjectValidate = {
  pin: Joi.string().required(),
  phoneNumber: Joi.string().required(),
};

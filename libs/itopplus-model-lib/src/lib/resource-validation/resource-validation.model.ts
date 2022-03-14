import gql from 'graphql-tag';
import * as Joi from 'joi';
import { EnumResourceValidation } from './resource-validate.enum.model';

export interface IResourceLimitArgs {
  requestValidations: EnumResourceValidation[];
}

export interface IResourcesValidationResponse {
  isCreatable: boolean;
}

export const ResourceLimitValidationTypeDefs = gql`
  "Resource limit validation Schema"
  enum EnumResourceValidation {
    VALIDATE_MAX_PRODUCTS
    VALIDATE_MAX_PAGE_MEMBERS
    VALIDATE_MAX_ORDERS
    VALIDATE_MAX_AUDIENCES
    VALIDATE_MAX_PAGES
  }

  type ResourcesValidateionResponse {
    isCreatable: Boolean
  }

  extend type Query {
    validateResources(requestValidations: [EnumResourceValidation]): ResourcesValidateionResponse
  }
`;

export const requestResourceValidate = {
  requestValidations: Joi.array().items(Joi.string()),
};

export const resourcesValidationResponseValidate = {
  isCreatable: Joi.boolean(),
};

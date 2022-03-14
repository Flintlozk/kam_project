import * as Joi from 'joi';
import gql from 'graphql-tag';
import { IPageCustomerSlaTimeOptions } from '../page-settings';

export interface ICustomerSLATime {
  time: IPageCustomerSlaTimeOptions;
}

export interface ICustomerSLAExport {
  date: string;
  time: string;
  tagname: string;
  total: number;
  almost: number;
  over: number;
}

export const CustomerSLATimeTypeDefs = gql`
  type CustomerSLATime {
    alertHour: Int
    alertMinute: Int
    hour: Int
    minute: Int
  }

  type CustomerSLATimeParams {
    time: CustomerSLATime
  }
  input InputCustomerSLATime {
    alertHour: Int
    alertMinute: Int
    hour: Int
    minute: Int
  }

  extend type Query {
    getCustomerSLATime: CustomerSLATimeParams
  }
  extend type Mutation {
    setCustomerSLATime(time: InputCustomerSLATime): Boolean
  }
`;

export const requestSetCustomerSLATime = {
  time: Joi.object().keys({
    alertHour: Joi.number().required(),
    alertMinute: Joi.number().required(),
    hour: Joi.number().required(),
    minute: Joi.number().required(),
  }),
};
export const responseSetCustomerSLATime = {
  time: Joi.object().keys({
    alertHour: Joi.number().required(),
    alertMinute: Joi.number().required(),
    hour: Joi.number().required(),
    minute: Joi.number().required(),
  }),
};

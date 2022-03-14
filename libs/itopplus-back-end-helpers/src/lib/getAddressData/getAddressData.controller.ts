/* eslint-disable @typescript-eslint/no-explicit-any */
import { customValidator } from './getAddressData.schema';
import { graphQLHandler } from './graphqlHandler';
import { getAddressData } from './getAddressData.data';
import { AddressData } from './getAddressData.types';
import * as Joi from 'joi';

/**
 * This is init function.
 *
 * @param {AddressData} JSON db file with address data - make sure your formbuilder names match JSON keys
 * @param {validator} object with JOI validators
 * @return {GRAPHQL resolver}
 *
 */

export const addressDataResolverInit = (
  dbFile: AddressData[],
  validator = {
    province: Joi.string(),
    amphoe: Joi.string(),
    district: Joi.string(),
    post_code: Joi.number(),
  },
): any => {
  class AddressDataClass {
    async getAddressDataHandler(_, args): Promise<AddressData[]> {
      const { field, search } = args;

      const result = await getAddressData(field, search, dbFile);
      return result;
    }
  }

  const addressDataObj: AddressDataClass = new AddressDataClass();

  return {
    Query: {
      getAddressData: graphQLHandler({
        handler: addressDataObj.getAddressDataHandler,
        validator: customValidator(validator),
      }),
    },
  };
};
